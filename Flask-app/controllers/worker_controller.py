from config.config import DataBase
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

class Worker_controller:
    def __init__(self):
        self.collection_name = os.getenv('WORKER_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.collection_name]

    def add_new_Worker(self,name,id,role,email,password):

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        worker_datas = {
            'Nome':name,
            'Id':id,
            'Role':role,
            'Company_Email':email,
            'Password':hashed_password
        }

        self.coll.insert_one(worker_datas)