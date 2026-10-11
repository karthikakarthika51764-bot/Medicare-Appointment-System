import os
from functools import lru_cache

from pymongo import ASCENDING, MongoClient


@lru_cache(maxsize=1)
def get_auth_collection(collection_name="users"):
    uri = os.getenv("MONGO_URI")
    if not uri:
        raise RuntimeError("MONGO_URI is not configured")

    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    database_name = os.getenv("MONGO_DB_NAME", "medicare")
    collection = client[database_name][collection_name]
    if collection_name == "users":
        collection.create_index([("email", ASCENDING)], unique=True)
    else:
        collection.create_index([("email", ASCENDING), ("purpose", ASCENDING)], unique=True)
    return collection