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
        
            raise Exception('Error to get deliverys')
    
    def GetCostumerIdFromEspecificDelivery(self, delivery) :
        try:
            if 'cpf' in delivery:
                    type_id = 'cpf'
                    costumer_id = delivery['cpf']
            elif 'cnpj' in delivery:
                    type_id = 'cnpj'
                    costumer_id = delivery['cnpj']
            else: 
                    type_id = 'id'
                    costumer_id = 'none'

            return {"Type": type_id,"Value": costumer_id}
        except Exception as e:
            raise ('Error to get costumer id')

    def GetEspecificCompanyDelivery(self,company_email,delivery_id):
        
        try:
            delivery = self.delivery_coll.find_one({"EmailEntrega": company_email, "idEntrega": delivery_id})
            return delivery
        except Exception as e:
            raise ('Erro to get Especific Delivery')

    def GetJustCompletedDeliverys(self, company_email):
        try:
            deliverys = list(self.delivery_coll.find({
                "EmailEntrega": company_email,
                "status": "concluido"
            }))
            return deliverys
        except Exception as e:
            
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
        
            raise Exception('Error to set delivery list')
        
    def CountNotConfirmedDeliverys(self,company_email):
        try: 
            deliverys = self.delivery_coll.count_documents({"EmailEntrega": company_email,"status": {"$in": ["pendente", "andamento"]}})

            return deliverys
        except Exception as e:
            raise ('Error to count deliverys')
        
    def GetProductsDeliverys(self, company_email, delivery_id):
        try:
            products = list(self.product_coll.find({"companyEmail": company_email,"delivery_id": delivery_id}))

            return products
        except Exception as e:
            raise ('Error to get Products in Delivery')
    
    def SetProductsProductList(self,products):
        try:
            products_list = []

            for i in products:
                    product_to_do = {
                        'id': i['product_id'],
                        'name': i['productName'],
                        'unit': i['productUnit'],
                        'quantity': i['productQuantidy'],
                        'total-product':i['totalProducts']
                     }
                    products_list.append(product_to_do.copy())

            return products_list

        except Exception as e:
            raise ('Error to set Products in Delivery')
        