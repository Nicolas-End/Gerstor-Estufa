from dotenv import load_dotenv
from pymongo import MongoClient
import os
load_dotenv()

class DataBase:
    def __init__(self):
        self.uri_name = os.getenv('URI_MONGO')
        self.database_name = os.getenv('DATABASE_NAME')

        if not self.uri_name or not self.database_name :
                raise ValueError("O .env não esta configurado corretamente")
        
        self.client = MongoClient(self.uri_name,serverSelectionTimeoutMS=5000)
        self.database = self.client[self.database_name]
