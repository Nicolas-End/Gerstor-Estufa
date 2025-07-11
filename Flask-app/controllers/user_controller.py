from config.config import DataBase
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

"""
    Sistema para controlar os dados dos usuarios
"""
class UserController:
    def __init__(self):
        self.collection_name = os.getenv('WORKER_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.collection_name]

    def add_new_user(self,name,id,role,email,password):
        try:
            # filtro para verificar se o usuario ja existe
            worker_filter = {"id":id,"company_email":email}

            if self.coll.find_one(worker_filter):
                return 'Id already exist',False
        
            # Criptgrafa a senha
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            worker_datas = {
                'name':name,
                'id':id,
                'role':role,
                'company_email':email,
                'password':hashed_password
            }

            self.coll.insert_one(worker_datas)
            return 'ok',True
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False,
    
    def get_company_email(self,email):
        try:
            has_email = self.coll.find_one( {"email": email} ) 

            if has_email:
                company_email = has_email['company_email']
                company_name = has_email['company_name']
                return company_email,company_name,True
            
            return "noexist",False
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
    def add_new_Company(self,id,email,password,company_name):
        try:
            # filtro para verificar se o usuario ja existe
            company_exist = {"id":id,"company_email":email}

            if self.coll.find_one(company_exist):
                return 'Adm Already Exist',False
        
            # se n exister criptografa a senha do usuario
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            company_datas = {
                'id':id,
                'role':'ADM',
                'company_name':company_name,
                'name':company_name,
                'company_email':email,
                'email':email,
                'password':hashed_password
            }

            self.coll.insert_one(company_datas)
            return 'ok',True
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
    def validate_user(self,email,password):
        try: 
            
            # pega o dados do usuario e verifica se ele existe no banco de dados
            worker_datas = {
                'email':email,
            }
            worker = self.coll.find_one(worker_datas)
        
            # se ele exister verifica se a senha dele esta correta caso sim 
            # retorna um feedback de ok para o sistema
            if worker:
                if bcrypt.checkpw(password.encode('utf-8'), worker["password"]):
                    return 'ok',True
                else:
                    return 'Wrong Password',False
            
            return 'Worker dont exist',False
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
    def find_user(self, company_email):
        try:
            company = self.coll.find_one( {"company_email": company_email} ) 

            if company:
                return True
            
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
            
    def change_user_password(self,company_email,new_password):
        try:
            # pega o dados do usuario e verifica se ele existe no banco de dados
            worker_datas = {
                'company_email':company_email,
            }
            worker = self.coll.find_one(worker_datas)
        
            # se ele exister verifica se o usuario existe, caso sim 
            # retorna um feedback de ok para o sistema
            if worker:
                # muda a senha do usuario se for valido
                self.coll.update_one(worker_datas,{'$set':{'password':new_password}})
                return True
            
            return False
        
        except Exception as e:
            print('Error: ',e)
            return 'Error',False
