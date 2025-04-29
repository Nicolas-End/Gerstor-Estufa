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


    def add_new_Company(self,id,email,password,company_name):
        try:
            # filtro para verificar se o usuario ja existe
            company_exist = {"id":id,"company_email":email}

            if self.worker_coll.find_one(company_exist):
                return 'Adm Already Exist',False
        
            # se n exister criptografa a senha do usuario
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            company_datas = {
                'id':id,
                'role':'ADM',
                'company_name':company_name,
                'company_email':email,
                'password':hashed_password
            }

            self.worker_coll.insert_one(company_datas)
            return 'ok',True
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
    def get_company_name(self, company_email):
        try:
            company = self.worker_coll.find_one( {"company_email": company_email} ) 

            if company:
                return company['company_name'],True
            
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
        
