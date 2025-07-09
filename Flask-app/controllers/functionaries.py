from config.config import DataBase
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

"""
    Sistema para controlar os dados da quantida de funcionarios, adicionar ou demitir
"""

class FunctionariesController():
    def __init__(self):
        self.collection_name = os.getenv('WORKER_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.collection_name]
    
    def get_functionaries(self,company_email):
        try:
            has_functionaries = list(self.coll.find({"company_email": company_email}))
            if has_functionaries:
                dict_functionaries = []
                for i in has_functionaries:
                    functionaries_to_do = {
                        'id': i['id'],
                        'name': i['name'],
                        'role': i['role'],
                        'email': i['email']
                    }
                    dict_functionaries.append(functionaries_to_do.copy())
                return dict_functionaries, True
            else:
                return [], True
        except Exception as e:
            print('Error : ',e)
            return 'Error',False