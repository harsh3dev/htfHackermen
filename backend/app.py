from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import motor.motor_asyncio
import httpx
from dotenv import load_dotenv
import os
from model.anamoly import process 

load_dotenv()

app = FastAPI()

class EthereumRequest(BaseModel):
    address: str

# MongoDB URI
mongo_uri = os.getenv('MONGO_URI')

# Initialize MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
db = client["blacklistDB"]
blacklist_collection = db["blacklists"]
kyc_collection = db["kycs"]

# Function to check if the address is in the blacklist collection
async def Scammer(eth_address: str) -> int:
    try:
        existing_entry = await blacklist_collection.find_one({"address": eth_address})
        if existing_entry:
            return 1  # Address is in the blacklist
        return 0  # Address is not in the blacklist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking blacklist: {str(e)}")

# Function to fetch transactions using Etherscan API
async def getTransactions(eth_address: str) -> list:
    try:
        url = f'https://api.etherscan.io/api?module=account&action=txlist&address={eth_address}&apikey={os.getenv("ETHERSCAN_API_KEY")}'
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
        
        if response.status_code == 200:
            response_data = await response.json()
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

# Function to check if the address exists in the KYC collection
async def KYCverified(eth_address: str) -> int:
    try:
        transactions = await getTransactions(eth_address)

        if not transactions:
            return 0  # No transactions found, return 0
        
        for tx in transactions:
            from_address = tx['from']
            to_address = tx['to']
            
            # Query the KYC collection to check if the addresses are found
            from_in_kyc = await kyc_collection.find_one({"address": from_address})
            to_in_kyc = await kyc_collection.find_one({"address": to_address})

            if from_in_kyc or to_in_kyc:
                return 1  # Return 1 if any address is found in KYC
        return 0  # Return 0 if neither address is found in KYC

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking KYC: {str(e)}")

# Endpoint to process Ethereum address and calculate score
@app.post("/process_eth_address")
async def process_eth_address(data: EthereumRequest):
    try:
        eth_address = data.address
        score = 0
        
        # Calculate the score based on different checks
        score += await Scammer(eth_address)  # Check if the address is a scammer
        score += await process(eth_address)
       
        
        return {'score': score}
    except HTTPException as e:
        raise e  # Reraise HTTPException if it is caught in the route handler
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in processing: {str(e)}")
