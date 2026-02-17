from config.config import DataBase
from dotenv import load_dotenv
from domains.costumer.service import CostumerService
import uuid
import os


load_dotenv()

class CostumerController:
    def __init__(self):
        self.client_collection = os.getenv('CLIENT_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.client_collection]
    def GetCostumer(self,company_email):
        try:
            has_costumer = CostumerService().GetAllCompanyCostumer(company_email)

            if has_costumer:
                dict_costumer = CostumerService().GetAllCompanyCostumer(company_email)
               
                return dict_costumer
            return False
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to get costumer ',e)
            
        
    def RegisterCostumer(self,company_email,name,address,document):
        try:
            costumer_datas = CostumerService().SetCostumerDatas(company_email,name,address)
            
            # Verifica se tem alguma referencia
            if address['reference']:
                costumer_datas['referencia'] = address['reference']

            #verifica se o identificador esta correto
            if document['type'] != "cnpj" and document['type'] != "cpf":
                return False
            costumer_datas[document['type']] = document['value']
            

            if not CostumerService().VerifyIfCostumerExist(company_email,costumer_datas):
                return False
            
            self.coll.insert_one(costumer_datas)
            return True
        except Exception as e:
            print ('Error: ',e)
            return False
            
    def GetEspecicDataFromCostumer(self,company_email,id,tipo):
        try:
            
            costumer_datas = CostumerService().VerifyIfCostumerExist(company_email,{ 'type':tipo, 'value':id})
            if costumer_datas:
                datas_costumer = {
                    'name':costumer_datas['name'],
                    'address':costumer_datas['address'],
                    'refe':costumer_datas['referencia'],
                    tipo:costumer_datas[tipo]
                }
                return datas_costumer
            
            return None
        except Exception as e:
            print('Error: ',e)
            return False
    
    def DeleteCostumer(self,company_email,id,tipo):
        try:
            costumer_delete = self.coll.delete_one({'company_email':company_email,tipo:id})
            if costumer_delete:
                return True
            else:
                return False    
        except Exception as e:
            print('Error: ',e)
            return False