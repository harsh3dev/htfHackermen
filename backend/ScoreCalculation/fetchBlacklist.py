import pymongo
import os
import pandas as pd
from dotenv import load_dotenv

def fetchBlacklist():
    load_dotenv()
    mongo_uri = os.getenv('MONGO_URI')

    db_name = "blacklistDB"
    collection_name = "blacklists"

    client = pymongo.MongoClient(mongo_uri)

    db = client[db_name]
    collection = db[collection_name]

    documents = collection.find()

    document_list = list(documents)

    df = pd.DataFrame(document_list)
    df=df.drop(columns=['_id','__v'])

    return df