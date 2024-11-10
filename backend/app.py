from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import motor.motor_asyncio
import httpx
from dotenv import load_dotenv
import os
from model.anamoly import process
from ScoreCalculation.TxnGraphScore import txnGraphScore
from ScoreCalculation.accountAge import ageTxnScore
import asyncio
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Adjust methods as needed
    allow_headers=["*"],
)

class EthereumRequest(BaseModel):
    address: str

mongo_uri = os.getenv('MONGO')

client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
db = client["blacklistDB"]
blacklist_collection = db["blacklists"]
kyc_collection = db["kycs"]

async def Scammer(eth_address: str) -> int:
    try:
        existing_entry = await blacklist_collection.find_one({"address": eth_address})
        if existing_entry:
            return 1
        return 0
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking blacklist: {str(e)}")

async def getTransactions(eth_address: str) -> list:
    try:
        url = f'https://api.etherscan.io/api?module=account&action=txlist&address={eth_address}&apikey={os.getenv("ETHERSCAN_API_KEY")}'
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
        
        if response.status_code == 200:
            response_data = response.json()
            if 'result' in response_data:
                return response_data['result']
            else:
                raise HTTPException(status_code=400, detail="Missing 'result' field in response from Etherscan.")
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Etherscan API error: {response.text}")

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error fetching transactions: {str(e)}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error making request to Etherscan: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def KYCverified(eth_address: str) -> int:
    try:
        transactions = await getTransactions(eth_address)

        if not transactions:
            return 0
        
        for tx in transactions:
            from_address = tx['from']
            to_address = tx['to']
            
            from_in_kyc = await kyc_collection.find_one({"address": from_address})
            to_in_kyc = await kyc_collection.find_one({"address": to_address})

            if from_in_kyc or to_in_kyc:
                return 1
        return 0

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking KYC: {str(e)}")

@app.post("/process_eth_address")

async def process_eth_address(data: EthereumRequest):
    try:
        eth_address = data.address
        score = 0
        
        # Check for scammer status first
        score += await Scammer(eth_address)  
        if score == 1:
            return {'score': 0}

        # Run graph score, KYC verification, process, and age transaction score in parallel
        tasks = [
            asyncio.to_thread(txnGraphScore, eth_address),  # Wrap synchronous function if it's not async
            KYCverified(eth_address),    # Make sure KYCverified is async
            process(eth_address),        # Make sure process is async
            asyncio.to_thread(ageTxnScore, eth_address)     # Wrap synchronous function if it's not async
        ]

        # Await all tasks in parallel
        graph_score, kyc_score, val_store, age_txn_score = await asyncio.gather(*tasks)
        
        # Process the results
        graph_score *= 100
        kyc_score = 1 - kyc_score
        kyc_score *= 100
        
        ml_score = val_store['prediction'][0]
        ml_score = 1 - ml_score
        print(ml_score)
        ml_score *= 100
        
        age_txn_score = 1 - age_txn_score
        age_txn_score *= 100

        # Calculate the final score
        final_score = (graph_score + kyc_score + ml_score + age_txn_score) / 4
        
        return {'score': 100 - final_score}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in processing: {str(e)}")
