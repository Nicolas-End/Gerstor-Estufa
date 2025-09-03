from config.config import DataBase
from dotenv import load_dotenv
import uuid
import os

load_dotenv()

"""
    Sistema para gestionar e contolar os estoques de entregas
    da empresa em questão
"""
class DeliveryController:
    def __init__(self):
        self.delivery_collection = os.getenv('DELIVERY_COLLECTION')
        self.product_collection = os.getenv('PRODUCTS_COLLECTION')
        self.db = DataBase().database
        self.delivery_coll = self.db[self.delivery_collection]
        self.product_coll = self.db[self.product_collection]
        
        
        
    def QuantidyDelivery(self, company_email):
        try:
            deliverys = self.delivery_coll.count_documents({"EmailEntrega": company_email})

            if deliverys:
                
                return deliverys, True
            else:
                return 0, True
        except Exception as e:
            print('Error:', e)
            return 'Error', False
        
    def GetDeliverys(self,company_email):
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
                        'DataEntrega': i['dataParaEntrega'],
                        'status':i['status']
                     }
                    dict_deliverys.append(deliverys_to_do.copy())

                return dict_deliverys, True
            else:
                return 0, True
        except Exception as e:
            print('Error: ', e)
            return 'Error', False
    
    def GetProductsFromDelivery(self,company_email,delivery_id):
        try:
            has_products = list(self.product_coll.find({"companyEmail": company_email,"delivery_id": delivery_id}))
            
            if has_products:
                dict_products = []
                for i in has_products:
                    product_to_do = {
                        'id': i['id'],
                        'name': i['productName'],
                        'unit': i['productUnit'],
                        'quantity': i['productQuantidy']
                     }
                    dict_products.append(product_to_do.copy())

                return dict_products
            else:
                return 0
        except Exception as e:
            print('Error: ', e)
            return 'Error', False
    def GetEspecificDelivery(self,company_email,product_id):
        try:
            
            has_deliverys = self.delivery_coll.find_one({"EmailEntrega": company_email, "idEntrega": product_id})

            if has_deliverys:
                if 'cpf' in has_deliverys:
                    tipoId = 'cpf'
                    clienteId = has_deliverys['cpf']
                elif 'cnpj' in has_deliverys:
                    tipoId = 'cnpj'
                    clienteId = has_deliverys['cnpj']
                else: 
                    tipoId = 'id'
                    clienteId = 'none'
                delivery_datas = {
                    'id' : has_deliverys['idEntrega'],
                    'produto': has_deliverys['TipoProduto'],
                    'quantidade': has_deliverys['Quantidade'],
                    'endereco': has_deliverys['LocalEntrega'],
                    'data': has_deliverys['dataParaEntrega'],
                    tipoId:clienteId
                }

                return delivery_datas, True
            else:
                return [],False 
          
        except Exception as e:
            print('Error: ', e)
            return 'Error', False
    def DeleteDelivery(self,company_email,delivery_id):
        try:
            was_deleted = self.delivery_coll.delete_one({"EmailEntrega": company_email, "idEntrega": delivery_id})    
            if was_deleted:
                return True
            else:
                return False
        except Exception as e:
            print('Error: ', e)
            return False
        
    def DeleteProduct(self,company_email,delivery_id):
        try:
            was_deleted = self.product_coll.delete_many({"companyEmail": company_email,"delivery_id": delivery_id})    
            if was_deleted:
                return True
            else:
                return False
        except Exception as e:
            print('Error: ', e)
            return False
    
    def EditDelivery(self,company_email,delivery_id,itens,address,date,name,clientId,typeId):
        try:   
            self.DeleteDelivery(company_email,delivery_id)
            self.DeleteProduct(company_email,delivery_id)
            
            id_unico = delivery_id
            
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
            if typeId and clientId:
                idType = typeId
                idClient = clientId
            else:
                idType = 'id'
                idClient = 'idCliente'
            delivery_data = {
                'idEntrega':id_unico,
                'TipoProduto': name,
                'Quantidade': itens_quantidy,
                'LocalEntrega':address,
                'dataParaEntrega':date,
                'EmailEntrega':company_email,
                'status':'pendente',
                idType:idClient
                
            }
            self.delivery_coll.insert_one(delivery_data)
            self.product_coll.insert_many(products)
           
            return True
        except Exception as e:
            print('Error: ', e)
            return False
    def AddNewDelivery(self,company_email,itens,address,date,name,clientId,typeId):
        try:
            id_unico = str(uuid.uuid4())
            
            itens_quantidy = 0
            # aqui ficara os produtos relacionados a entrega
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
                'EmailEntrega':company_email,
                'status':'pendente',
                typeId:clientId
            }
            self.delivery_coll.insert_one(delivery_data)
            self.product_coll.insert_many(products)
           
            return True
        except Exception as e:
            print('Error: ',e)
            return False
    