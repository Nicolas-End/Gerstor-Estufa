from config.config import DataBase
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

class Adm_controller:
    def __init__(self):
        self.collection_name = os.getenv('WORKER_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.collection_name]

    def add_new_Adm(self,id,email,password):
        try:
            # filtro para verificar se o usuario ja existe
            adm_filter = {"id":id,"company_email":email}

            if self.coll.find_one(adm_filter):
                return 'Id already exist',False
        
            # se n exister criptografa a senha do usuario
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            adm_datas = {
                'id':id,
                'role':'ADM',
                'company_email':email,
                'password':hashed_password
            }

            self.coll.insert_one(adm_datas)
            return 'ok',True
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False,
    
