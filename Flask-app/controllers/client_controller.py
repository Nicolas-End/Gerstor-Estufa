from config.config import DataBase
from dotenv import load_dotenv
import uuid
import os


load_dotenv()

class ClientController:
    def __init__(self):
        self.client_collection = os.getenv('CLIENT_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.client_collection]
    def get_clients(self,company_email):
        try:
            has_clients = list(self.coll.find({'company_email': company_email}))
            if has_clients:
                dict_clients = []
                for i in has_clients:
                    if i['cnpj']:
                        clients= {
                            'name': i['name'],
                            'street': i['street'],
                            'email': i['email'],
                            'neighborhood': i['neighborhood'],
                        }
                        if 'cnpj' in i:
                            clients['cnpj'] = i['cnpj']
                        else:
                            clients['cpf'] = i['cpf']
                    dict_clients.append(clients.copy())
                return dict_clients, True 
            return [], True
        except Exception as e:
            print('Error:',e)
            return False , 0
        