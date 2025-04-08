from config.config import DataBase
from dotenv import load_dotenv
import json
import os
import bcrypt

load_dotenv()

class CompanyController:
    def __init__(self):
        self.worker_collection = os.getenv('WORKER_COLLECTION')
        self.delivery_collection = os.getenv('DELIVERY_COLLECTION')
        self.db = DataBase().database
        self.worker_coll = self.db[self.worker_collection]


    def add_new_Adm(self,id,email,password,company_name):
        try:
            # filtro para verificar se o usuario ja existe
            adm_exist = {"id":id,"company_email":email}

            if self.worker_coll.find_one(adm_exist):
                return 'Adm Already Exist',False
        
            # se n exister criptografa a senha do usuario
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            adm_datas = {
                'id':id,
                'role':'ADM',
                'company_name':company_name,
                'company_email':email,
                'password':hashed_password
            }

            self.worker_coll.insert_one(adm_datas)
            return 'ok',True
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
    
    def quantidy_deliverys(self, company_email):
        try:
            deliverys_coll = self.db[self.delivery_collection]

            delivery_filter = {"EmailEntrega": company_email}
            delivery_cursor = deliverys_coll.find(delivery_filter)
            delivery_list = list(delivery_cursor)

            if delivery_list:
                return len(delivery_list), True
            else:
                return 0, True
        except Exception as e:
            print('Error:', e)
            return 'Error', False