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
        self.product_collection = os.getenv('STOCK_PRODUCTS_COLLECTION')
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
                        'quantity': i['quantidade'],
                        'id': i['id']
                     }
                    dict_products.append(products_stocked.copy())

                return dict_products
            else:
                return []
        except Exception as e:
            print('Error: ', e)
            return e

    def AddNewStockProduct(self, company_email, products_data):
        try:
            name = products_data.get('name')
            if not name or not isinstance(name, str):
                print("Erro: produto sem nome válido")
                return False

            id_unico = str(uuid.uuid4())

            # Verifica se já existe um produto com esse nome
            product_exist = self.coll.find_one({
                "company_email": company_email,
                "name": name
             })
            if product_exist:
                return False

            lumping_infos = {l['unit']: l['capacity'] for l in products_data.get('items', [])}

            product_infos = {
                'company_email': company_email,
                'name': name,
                'id': id_unico,
                'quantidade': products_data.get('quantity', 0),
                'tipos_embalo': lumping_infos
            }

            self.coll.insert_one(product_infos)
            return True

        except Exception as e:
            print("Erro em AddNewStockProduct:", e)
            return e
