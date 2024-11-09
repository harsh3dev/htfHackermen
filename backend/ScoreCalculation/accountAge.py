import os
from dotenv import load_dotenv
import requests
from datetime import datetime

def get_ethereum_address_age(address, api_key):
    # Etherscan API endpoint
    url = f"https://api.etherscan.io/api"
    params = {
        "module": "account",
        "action": "txlist",
        "address": address,
        "startblock": 0,
        "endblock": 99999999,
        "sort": "asc",  # Sort by oldest first
        "apikey": api_key
    }

    # Make a request to the Etherscan API
    response = requests.get(url, params=params)
    data = response.json()

    age_score=0
    txn_score=0
    # Check if the request was successful and if there are transactions
    if data["status"] == "1" and data["result"]:
        # Get the timestamp of the first transaction
        first_tx_timestamp = int(data["result"][0]["timeStamp"])
        first_tx_datetime = datetime.fromtimestamp(first_tx_timestamp)

        # Calculate the age
        current_datetime = datetime.now()
        age = current_datetime - first_tx_datetime

        if age.days>=1000:
            age_score =  1
        elif age.days>=500:
            age_score = 0.5
        elif age.days>=250:
            age_score = 0.25
        elif age.days>=100:
            age_score = 0.1
        elif age.days>=30:
            age_score = 0.05
        elif age.days>=1:
            age_score = 0.001
        
        txn_score = len(data["result"]) / 10000

        return (age_score+txn_score)/2
    else:
        print("No transactions found or error in API call.")
        return 0

def age_txn_score(address):
    load_dotenv() 
    api_key = os.getenv('API_KEY')
    return get_ethereum_address_age(address, api_key)