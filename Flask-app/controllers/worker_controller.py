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
            worker_filter = {"id":id,"company_email":email}

            if self.coll.find_one(worker_filter):
                return 'Id already exist',False
        
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            worker_datas = {
                'name':name,
                'id':id,
                'role':role,
                'company_email':email,
                'password':hashed_password
            }

            self.coll.insert_one(worker_datas)
            return 'ok',True
        except Exception as e:
            print('Error: ',e)
            return 'Error',False,
    
    def validate_worker(self,id,email,password):
        try: 
            
            worker_datas = {
                'id':id,
                'company_email':email,
            }

            worker = self.coll.find_one(worker_datas)
        
            if worker:
                if bcrypt.checkpw(password.encode('utf-8'), worker["password"]):
                    return 'ok',True
                else:
                    return 'Wrong Password',False
            
            return 'Worker dont exist',False
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
            
