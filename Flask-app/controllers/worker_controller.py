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
        try:
            worker_filter = {"Id":id,"Company_Email":email}

            if self.coll.find_one(worker_filter):
                return 'Id already exist',False
        
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            worker_datas = {
                'Name':name,
                'Id':id,
                'Role':role,
                'Company_Email':email,
                'Password':hashed_password
            }

            self.coll.insert_one(worker_datas)
            return 'Right',True
        except Exception as e:
            print('Error: ',e)
            return 'Error',False,
        
