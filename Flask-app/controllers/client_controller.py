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
                    clients= {
                            'name': i['name'],
                            'address': i['address'],
                        }
                    if 'cnpj' in i:
                        clients['cnpj'] = i['cnpj']
                    else:
                        clients['cpf'] = i['cpf']
                    dict_clients.append(clients.copy())

                return True, dict_clients
            return True, []
        except Exception as e:
            print('Error:',e)
            return False , 0
        
    def add_new_client(self,company_email,name,address,document):
        try:
            client_adress = "Rua {}, Bairro {}, {}".format(address['street'],address['neighborhood'],address['number'])
            clients_datas = {"company_email":company_email,
                             "name":name,
                             "address":client_adress}
            
            # Verifica se tem alguma referencia
            if address['reference']:
                clients_datas['referencia'] = address['reference']

            #verifica se o identificador esta correto
            if document['type'] != "cnpj" and document['type'] != "cpf":
                return False
            clients_datas[document['type']] = document['value']
            


            client_exist = self.coll.find_one({'company_email':company_email,document['type']:document['value']})
            if client_exist:
                return False
            
            self.coll.insert_one(clients_datas)
            return True
        except Exception as e:
            print ('Error: ',e)
            return False
    def get_especific_data_from_client(self,company_email,id,tipo):
        try:
            
            client_exist = self.coll.find_one({'company_email':company_email,tipo:id})
            if client_exist:
                datas_clients = {
                    'name':client_exist['name'],
                    'address':client_exist['address'],
                    'refe':client_exist['referencia'],
                    tipo:client_exist[tipo]
                }
                return datas_clients
            
            return None
        except Exception as e:
            print('Error: ',e)
            return False