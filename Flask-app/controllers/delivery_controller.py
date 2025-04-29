from config.config import DataBase
from dotenv import load_dotenv
import uuid
import os

load_dotenv()

class DeliveryContoller:
    def __init__(self):
        self.delivery_collection = os.getenv('DELIVERY_COLLECTION')
        self.product_collection = os.getenv('PRODUCTS_COLLECTION')
        self.db = DataBase().database
        self.delivery_coll = self.db[self.delivery_collection]
        self.product_coll = self.db[self.product_collection]
        
        
        
    def quantidy_deliverys(self, company_email):
        try:
            deliverys = self.delivery_coll.count_documents({"EmailEntrega": company_email})

            if deliverys:
                
                return deliverys, True
            else:
                return 0, True
        except Exception as e:
            print('Error:', e)
            return 'Error', False
        
    def get_deliverys_products(self,company_email):
        try:

            has_deliverys = list(self.delivery_coll.find({"EmailEntrega": company_email}))
    
            if has_deliverys:
                dict_deliverys = []
                for i in has_deliverys:
                    deliverys_to_do = {
                        'id': i['idEntrega'],
                        'Produto': i['TipoProduto'],
                        'Quantidade': i['Quantidade'],
                        'LocalEntrega': i['LocalEntrega'],
                        'DataEntrega': i['dataParaEntrega']
                     }
                    dict_deliverys.append(deliverys_to_do.copy())

                return dict_deliverys, True
            else:
                return 0, True
        except Exception as e:
            print('Error: ', e)
            return 'Error', False
        
    def get_especific_delivery(self,company_email,product_id):
        try:
 
            has_deliverys = self.delivery_coll.find_one({"EmailEntrega": company_email, "idEntrega": product_id})

            if has_deliverys:

                delivery_datas = {
                    'id' : has_deliverys['idEntrega'],
                    'Produto': has_deliverys['TipoProduto'],
                    'Quantidade': has_deliverys['Quantidade'],
                    'LocalEntrega': has_deliverys['LocalEntrega'],
                    'DataEntrega': has_deliverys['dataParaEntrega']
                }

                return delivery_datas,True
            else:
                return 'nothing',False
          
        except Exception as e:
            print('Error: ', e)
            return 'Error', False
        
    def add_new_delivery(self,company_email,itens,address,date,name):
        try:
            id_unico = str(uuid.uuid4())
            
            itens_quantidy = 0
            products = []
            for i in itens:
                product_data = {
                    'delivery_id': id_unico,
                    'id': i['id'],
                    'productName': i['name'],
                    'productUnit': i['unit'],
                    'productQuantidy': i['quantity'],
                    'companyEmail': company_email,
                }
                itens_quantidy += i['quantity']
                products.append(product_data)
            delivery_data = {
                'idEntrega':id_unico,
                'TipoProduto': name,
                'Quantidade': itens_quantidy,
                'LocalEntrega':address,
                'dataParaEntrega':date,
                'EmailEntrega':company_email
            }
            self.delivery_coll.insert_one(delivery_data)
            self.product_coll.insert_many(products)
           
            return True
        except Exception as e:
            print('Error: ',e)
            return False