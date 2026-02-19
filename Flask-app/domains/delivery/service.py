from config.config import DataBase
from dotenv import load_dotenv
import uuid
import os

class DeliveryService:
    def __init__(self):
        self.delivery_collection = os.getenv('DELIVERY_COLLECTION')
        self.product_collection = os.getenv('PRODUCTS_COLLECTION')
        self.db = DataBase().database
        self.delivery_coll = self.db[self.delivery_collection]
        self.product_coll = self.db[self.product_collection]

    def GetAllCompanyDelivery(self,company_email):
        try:
            deliverys = list(self.coll.find({
                "EmailEntrega": company_email,
                "status": {"$in": ["pendente", "andamento"]}
            }))
    
            return deliverys
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to get deliverys')
    
    def GetJustCompletedDeliverys(self, company_email):
        try:
            deliverys = list(self.delivery_coll.find({
                "EmailEntrega": company_email,
                "status": "concluido"
            }))
            return deliverys
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to get just completed deliverys')

    def SetDeliveryList(self, deliverys):
        try:
            delivery_list = []
            for i in deliverys:
                delivery = {
                    'idEntrega': i['idEntrega'],
                    'TipoProduto': i['TipoProduto'],
                    'Quantidade': i['Quantidade'],
                    'LocalEntrega': i['LocalEntrega'],
                    'dataParaEntrega': i['dataParaEntrega'],
                    'status': i['status']
                }
                delivery_list.append(delivery.copy())
            
            return delivery_list    
        except Exception as e:
            print('Error:',e)
            raise Exception('Error to set delivery list')
        
    def CountNotConfirmedDeliverys(self,company_email):
        try: 
            deliverys = self.delivery_coll.count_documents({"EmailEntrega": company_email,"status": {"$in": ["pendente", "andamento"]}})

            return deliverys
        except Exception as e:
            raise ('Error to count deliverys')