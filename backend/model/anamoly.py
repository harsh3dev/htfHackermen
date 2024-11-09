from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import os
import numpy as np
from dotenv import load_dotenv
import httpx
import pandas as pd

load_dotenv()

app = FastAPI()
model_path = 'model/xgb_5_model.pickle' 

# Load the model
if os.path.exists(model_path):
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
else:
    raise HTTPException(status_code=500, detail="Model file not found")

# Pydantic model for request data
class EthereumRequest(BaseModel):
    address: str

# Helper functions to get data from API
async def get_wallet_balance(address: str) -> float:
    url = f'https://api.etherscan.io/api?module=account&action=balance&address={address}&tag=latest&apikey={os.getenv("ETHERSCAN_API_KEY")}'
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            balance_in_wei = response.json().get("result")
            return float(balance_in_wei) / 1e18
        else:
            raise HTTPException(status_code=response.status_code, detail="Error fetching wallet balance")

async def get_transactions(address: str) -> list:
    url = f'https://api.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&sort=asc&apikey={os.getenv("ETHERSCAN_API_KEY")}'
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json().get("result", [])
        else:
            raise HTTPException(status_code=response.status_code, detail="Error fetching transactions")

# Fetch and engineer features
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

    # Populate stats with fetched transaction data
    stats["totalEtherBalance"] = await get_wallet_balance(address)
    transactions = await get_transactions(address)
    received_txns = [tx for tx in transactions if tx["to"].lower() == address.lower()]
    sent_txns = [tx for tx in transactions if tx["from"].lower() == address.lower()]

    # Feature engineering
    stats["receivedTnx"] = len(received_txns)
    stats["sentTnx"] = len(sent_txns)
    stats["totalEtherSent"] = sum(float(tx["value"]) / 1e18 for tx in sent_txns)
    stats["totalEtherReceived"] = sum(float(tx["value"]) / 1e18 for tx in received_txns)
    
    if len(transactions) > 1:
        first_tx_time = int(transactions[0]["timeStamp"])
        last_tx_time = int(transactions[-1]["timeStamp"])
        stats["timeDiffFirstLastMins"] = (last_tx_time - first_tx_time) / 60
    
    if stats["receivedTnx"] > 0:
        stats["avgValReceived"] = stats["totalEtherReceived"] / stats["receivedTnx"]
    
    if stats["sentTnx"] > 0:
        stats["avgValSent"] = stats["totalEtherSent"] / stats["sentTnx"]
    
    if stats["receivedTnx"] > 1:
        received_times = [int(tx["timeStamp"]) for tx in received_txns]
        received_time_diffs = [(received_times[i] - received_times[i - 1]) / 60 for i in range(1, len(received_times))]
        stats["avgMinBetweenReceivedTnx"] = float(sum(received_time_diffs) / len(received_time_diffs)) if len(received_time_diffs) > 0 else 0


    
    if stats["sentTnx"] > 1:
        sent_times = [int(tx["timeStamp"]) for tx in sent_txns]
        sent_time_diffs = [(sent_times[i] - sent_times[i - 1]) / 60 for i in range(1, len(sent_times))]
        stats["avgMinBetweenSentTnx"] = float(sum(sent_time_diffs) / len(sent_time_diffs)) if len(sent_time_diffs) > 0 else 0
 
    stats["totalTransactions"] = stats["sentTnx"] + stats["receivedTnx"]
    stats["ratioRecSent"] = stats["receivedTnx"] / stats["sentTnx"] if stats["sentTnx"] > 0 else 0
    stats["ratioSentTotal"] = stats["sentTnx"] / stats["totalTransactions"] if stats["totalTransactions"] > 0 else 0
    stats["ratioRecTotal"] = stats["receivedTnx"] / stats["totalTransactions"] if stats["totalTransactions"] > 0 else 0

    return stats


async def predict(eth_request: EthereumRequest):
    features = await fetch_transaction_stats(eth_request.address)
    
    # Arrange features in expected order for the model
    feature_order = [
        'avgMinBetweenSentTnx', 'avgMinBetweenReceivedTnx', 'timeDiffFirstLastMins',
        'sentTnx', 'receivedTnx', 'avgValSent', 'avgValReceived', 'totalTransactions',
        'totalEtherSent', 'totalEtherReceived', 'totalEtherBalance', 'ratioRecSent',
        'ratioSentTotal', 'ratioRecTotal'
    ]
    feature_values = np.array([features[key] for key in feature_order]).reshape(1, -1)
    
    # Perform prediction
    try:
        prediction = model.predict(feature_values)
        return {"prediction": prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in prediction: {str(e)}")

async def process(eth_address):
    features = await fetch_transaction_stats(eth_address)
    feature_values = list(features.values())
    feature_df = pd.DataFrame([feature_values], columns=features.keys())
    transformed_features = feature_df.values
    prediction = model.predict(transformed_features)
    return {"prediction": prediction.tolist()}