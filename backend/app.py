from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import motor.motor_asyncio
import httpx
from dotenv import load_dotenv
import os


load_dotenv()


app = FastAPI()

class EthereumRequest(BaseModel):
    address: str

# Setup MongoDB client using Motor (async MongoDB driver)
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGO_URI'))
db = client['blacklistDB']
blacklist_collection = db['blacklists']
kyc_collection = db['kycs'] 

# Function to check if the address is in the blacklist collection
async def Scammer(eth_address: str) -> int:
    try:
        existing_entry = await blacklist_collection.find_one({"address": eth_address})
        if existing_entry:
            return 1  # Address found in blacklist
        return 0  # Address not found
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
            print(f"response_data: {response_data}")
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
            print("No transactions found.")
            return 0
        
        print(f"transactions: {transactions}")
        
        for tx in transactions:
            print(f"entered in tx")
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
        score = await Scammer(eth_address)  # Check if the address is blacklisted
        score += await KYCverified(eth_address)  # Check if the address is verified in KYC
        return {'score': score}
    except HTTPException as e:
        raise e  # Reraise HTTPException if it is caught in the route handler
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in processing: {str(e)}")
