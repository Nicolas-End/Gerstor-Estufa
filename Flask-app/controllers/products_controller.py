from config.config import DataBase
from dotenv import load_dotenv
import uuid
import os

load_dotenv()

"""
    Sistema para gestionar e contolar os estoques de entregas
    da empresa em questão
"""
class ProductController:
    def __init__(self):
        self.product_collection = os.getenv('PRODUCTS_STOCK_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.product_collection]

    def GetProducts(self,company_email):
        try:
            has_products = list(self.coll.find({"company_email": company_email}))
    
            if has_products:
                dict_products = []
                for i in has_products:
                    products_stocked = {
                        'name': i['name'],
                        'company_email':i['company_email'],
                        'quantidy': i['quantidy'],
                        'id': i['id']
                     }
                    dict_products.append(products_stocked.copy())

                return dict_products, True
            else:
                return 0, True
        except Exception as e:
            print('Error: ', e)
            return 'Error', False

    def AddNewStockProduct(self,company_email,products_data):
        try:    
            product_exist = self.coll.find({"company_email":company_email, "id":products_data['id']})
            if product_exist :
                return False
            product_infos = {'company_email':company_email,'id':products_data['id'],'quantidade':products_data['quantidy'],'tipos_embalo':products_data['lumping_type']}

            self.coll.insert_one(product_infos)
            return True
        except Exception as e:
            print('Error: ',e)
            return e
    