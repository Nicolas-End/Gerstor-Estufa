from config.config import DataBase
from dotenv import load_dotenv
import uuid
import os

class CostumerService:
    def __init__(self):
        self.client_collection = os.getenv('CLIENT_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.client_collection]

    def VerifyIfHasCostumer(self,company_email,document):
        try:
            costumer_exist = self.coll.find_one({'company_email':company_email,document['type']:document['value']})
            if costumer_exist:
                return True
            return False
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to verify costumer')
        
    def GetAllCompanyCostumer(self,company_email):
        try:
            has_costumer = list(self.coll.find({'company_email': company_email}))
            if has_costumer:
                dict_costumer = []
                for i in has_costumer:
                    costumer= {
                            'name': i['name'],
                            'address': i['address'],
                        }
                    if 'cnpj' in i:
                        costumer['cnpj'] = i['cnpj']
                    else:
                        costumer['cpf'] = i['cpf']
                    dict_costumer.append(costumer.copy())

                return dict_costumer
            return []
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to get costumer')

    def SetCostumerDatas(self,company_email,name,address):
        try:
            costumer_adress = "Rua {}, Bairro {}, {}".format(address['street'],address['neighborhood'],address['number'])
            costumer_datas = {"company_email":company_email,
                             "name":name,
                             "address":costumer_adress}
        
            return costumer_datas
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to set costumer datas') 
        
    def VerifyIfCostumerExist(self,company_email,costumer_datas):
        try:
            costumer_exist = self.coll.find_one({'company_email':company_email,costumer_datas['type']:costumer_datas['value']})
            return costumer_exist
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to verify if costumer exist')
        