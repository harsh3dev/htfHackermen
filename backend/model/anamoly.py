from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import os
from dotenv import load_dotenv
import httpx
import numpy as np

load_dotenv()

app = FastAPI()

model_path = 'model/xgb_4_model.pickle'

# Load the pre-trained model directly
if os.path.exists(model_path):
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
else:
    raise HTTPException(status_code=500, detail="Model file not found")

class EthereumRequest(BaseModel):
    address: str

class PredictionResponse(BaseModel):
    prediction: float

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

    stats["totalEtherBalance"] = await get_wallet_balance(address)
    transactions = await get_transactions(address)
    received_txns = [tx for tx in transactions if tx["to"].lower() == address.lower()]
    sent_txns = [tx for tx in transactions if tx["from"].lower() == address.lower()]

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
        stats["avgMinBetweenReceivedTnx"] = sum(received_time_diffs) / len(received_time_diffs)

    if stats["sentTnx"] > 1:
        sent_times = [int(tx["timeStamp"]) for tx in sent_txns]
        sent_time_diffs = [(sent_times[i] - sent_times[i - 1]) / 60 for i in range(1, len(sent_times))]
        stats["avgMinBetweenSentTnx"] = sum(sent_time_diffs) / len(sent_time_diffs)

    return stats

async def predict(address: str) -> dict:
    # Fetch stats and engineer features
    features = await fetch_transaction_stats(address)
    print(f"features ",features)
    features['totalTransactions'] = features['sentTnx'] + features['receivedTnx']
    features['ratioRecSent'] = features['receivedTnx'] / (features['sentTnx'] if features['sentTnx'] != 0 else 1)
    features['ratioSentTotal'] = features['sentTnx'] / (features['totalTransactions'] if features['totalTransactions'] != 0 else 1)
    features['ratioRecTotal'] = features['receivedTnx'] / (features['totalTransactions'] if features['totalTransactions'] != 0 else 1)

 
    feature_order = [
        'avgMinBetweenSentTnx', 'avgMinBetweenReceivedTnx', 'timeDiffFirstLastMins', 'sentTnx',
        'receivedTnx', 'avgValSent', 'avgValReceived', 'totalTransactions', 'totalEtherSent',
        'totalEtherReceived', 'totalEtherBalance', 'ratioRecSent', 'ratioSentTotal', 'ratioRecTotal'
    ]

    # Arrange features in the required order
    for feature in feature_order:
        if feature not in features:
            raise HTTPException(status_code=400, detail=f"Missing feature: {feature}")
    
    feature_values = np.array([float(features[col]) for col in feature_order]).reshape(1, -1)
    
    # Perform prediction
    prediction = model.predict(feature_values)
    prediction_result = prediction[0] 
    return {"prediction": prediction_result}

async def process(eth_address):
    try:
        result = await predict(eth_address)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in processing: {str(e)}")




