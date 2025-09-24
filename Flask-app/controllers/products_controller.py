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
            
            return e

    def AddNewStockProduct(self, company_email, products_data):
        try:
            name = products_data.get('name')
            if not name or not isinstance(name, str):
                
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
            
            return e

    def DeleteProduct(self,company_email,product_id):
        try:
            product_filter = {'company_email':company_email,'id':product_id}

            product_deleted = self.coll.delete_one(product_filter)
            if product_deleted:
                return True
            return False
        except Exception as e:
            
            return e
    
    def GetProductById(self,company_email,product_id):
        try:
            product_filter = {'company_email':company_email,'id':product_id}
            
            found_product = self.coll.find_one(product_filter)
            
            if found_product:
                products_datas_split = self.SplitProductDatas(found_product)
                
                return products_datas_split 
            
            else :
                return False
        except Exception as e :
            return e
    
    def EditProductById(self,company_email, products_data):
        try:
            name = products_data.get('name')
            if not name or not isinstance(name, str):
                return False
            
            product_id = products_data.get('id')
            
            product_filter = {'company_email':company_email,'id':product_id}
            
            lumping_infos = {l['unit']: l['capacity'] for l in products_data.get('items', [])}

            product_infos = {
                'name': name,
                'quantidade': products_data.get('quantity', 0),
                'tipos_embalo': lumping_infos
            }
            
            status = self.coll.update_one(product_filter,{"$set":product_infos})
            
            if status:
                return True
            
            return False 

        except Exception as e:
            return e
    def SplitProductDatas (self,product_datas):
        try:
            product = {"name":product_datas['name'],"quantity":product_datas["quantidade"]}
            lumpings = {}
            for key,value in product_datas['tipos_embalo'].items():
                lumpings[key] = value
            
            return {'ProductsDatas':product,'LumpingsInfos':lumpings}   
        except Exception as e:
            return e