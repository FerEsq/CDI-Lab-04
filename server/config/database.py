from pymongo import MongoClient
from flask import current_app

def get_db():
    print("here!!!", current_app.config['MONGODB_URI'])
    client = MongoClient(current_app.config['MONGODB_URI'])
    return client["file_system"]