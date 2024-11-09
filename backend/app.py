from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

class EthereumRequest(BaseModel):
    eth_address: str

def calculateScore(eth_address):
    return 0


@app.post("/process_eth_address")
async def process_eth_address(data: EthereumRequest):
    eth_address = data.eth_address

    score = calculateScore(eth_address)

    return {'score':score}    
