from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import httpx
import os
from dotenv import load_dotenv
import numpy as np

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Load the pre-trained model
model_path = 'address.pickle'
with open(model_path, 'rb') as file:
    model = pickle.load(file)


# Define the request body for Ethereum address
class EthereumRequest(BaseModel):
    address: str


# Helper function to fetch wallet balance from Etherscan
async def get_wallet_balance(address: str) -> float:
    url = f'https://api.etherscan.io/api?module=account&action=balance&address={address}&tag=latest&apikey={os.getenv("ETHERSCAN_API_KEY")}'
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            balance_in_wei = response.json().get("result")
            return float(balance_in_wei) / 1e18  # Convert to Ether
        else:
            raise HTTPException(status_code=response.status_code, detail="Error fetching wallet balance")


# Helper function to fetch all transactions for a given address
async def get_transactions(address: str) -> list:
    url = f'https://api.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&sort=asc&apikey={os.getenv("ETHERSCAN_API_KEY")}'
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json().get("result", [])
        else:
            raise HTTPException(status_code=response.status_code, detail="Error fetching transactions")


# Function to fetch transaction stats
async def fetch_transaction_stats(address: str) -> dict:
    stats = {
        "timeDiffFirstLastMins": 0,
        "avgValReceived": 0,
        "avgMinBetweenReceivedTnx": 0,
        "totalEtherSent": 0,
        "totalEtherReceived": 0,
        "receivedTnx": 0,
        "sentTnx": 0,
        "avgMinBetweenSentTnx": 0,
        "totalEtherBalance": 0,
        "avgValSent": 0,
    }

    # Get wallet balance
    stats["totalEtherBalance"] = await get_wallet_balance(address)

    # Get transactions
    transactions = await get_transactions(address)
    received_txns = [tx for tx in transactions if tx["to"].lower() == address.lower()]
    sent_txns = [tx for tx in transactions if tx["from"].lower() == address.lower()]

    stats["receivedTnx"] = len(received_txns)
    stats["sentTnx"] = len(sent_txns)

    # Calculate total Ether sent and received
    stats["totalEtherSent"] = sum(float(tx["value"]) / 1e18 for tx in sent_txns)
    stats["totalEtherReceived"] = sum(float(tx["value"]) / 1e18 for tx in received_txns)

    # Calculate time difference between first and last transaction
    if len(transactions) > 1:
        first_tx_time = int(transactions[0]["timeStamp"])
        last_tx_time = int(transactions[-1]["timeStamp"])
        stats["timeDiffFirstLastMins"] = (last_tx_time - first_tx_time) / 60

    # Calculate average values
    if stats["receivedTnx"] > 0:
        stats["avgValReceived"] = stats["totalEtherReceived"] / stats["receivedTnx"]

    if stats["sentTnx"] > 0:
        stats["avgValSent"] = stats["totalEtherSent"] / stats["sentTnx"]

    # Average time between received transactions
    if stats["receivedTnx"] > 1:
        received_times = [int(tx["timeStamp"]) for tx in received_txns]
        received_time_diffs = [(received_times[i] - received_times[i - 1]) / 60 for i in range(1, len(received_times))]
        stats["avgMinBetweenReceivedTnx"] = sum(received_time_diffs) / len(received_time_diffs)

    # Average time between sent transactions
    if stats["sentTnx"] > 1:
        sent_times = [int(tx["timeStamp"]) for tx in sent_txns]
        sent_time_diffs = [(sent_times[i] - sent_times[i - 1]) / 60 for i in range(1, len(sent_times))]
        stats["avgMinBetweenSentTnx"] = sum(sent_time_diffs) / len(sent_time_diffs)

    return stats



async def predict(address: str) -> dict:
    features = await fetch_transaction_stats(address)
    prediction = model.predict([features])  
    return {"prediction": prediction[0]}



async def process(eth_address):
    try:
        result = await predict(eth_address)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in processing: {str(e)}")



