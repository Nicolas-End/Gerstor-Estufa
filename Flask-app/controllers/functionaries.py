from config.config import DataBase
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

"""
    Sistema para controlar os dados da quantida de funcionarios, adicionar ou demitir
"""

class FunctionariesController():
    def __init__(self):
        self.collection_name = os.getenv('WORKER_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.collection_name]
    
    def GetFunctionaries(self,company_email):
        try:
            has_functionaries = list(self.coll.find({"company_email": company_email}))
            if has_functionaries:
                dict_functionaries = []
                for i in has_functionaries:
                    functionaries_to_do = {
                        'name': i['name'],
                        'role': i['role'],
                        'email': i['email']
                    }
                    dict_functionaries.append(functionaries_to_do.copy())
                return dict_functionaries, True
            else:
                return [], True
        except Exception as e:
            
            return 'Error',False
    
    def GetFunctionaryQuantidy(self,company_email):
        try:
            has_functionaries = list(self.coll.find({"company_email": company_email}))
            if has_functionaries:
                return len(has_functionaries), True
            else:
                return 0, True
        except Exception as e:
            
            return 'Error',False
    
    def AddNewFunctionary(self,company_email,company_name,name,password,email,role):
        try:
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            functionary_datas = {'company_email':company_email,
                                 'company_name':company_name,
                                 'name':name,
                                 'password':hashed_password,
                                 'email':email,
                                 'role':role
                                }
            
            # Verifica se o funcionario ja esta cadastrado no sistema
            functionary_exist = self.coll.find_one({'email':email})
            if functionary_exist:
                return 'AlreadyExist',False
            
            self.coll.insert_one(functionary_datas)
            return 'ok',True
        
        except Exception as e:
          
            return 'Error',False
    def GetEspecificFunctionary(self,company_email,email):
        try:
            
            find_funcitonary = self.coll.find_one({'company_email':company_email,"email":email})
            
            if find_funcitonary :
                functionary_data = {
                
                    "email":find_funcitonary['email'],
                    "role":find_funcitonary['role'],
                    "name":find_funcitonary['name']
                }
                
                return functionary_data
            return None
        except Exception as e:
          
            return e
    def DeleteFunctionary(self,functionary_data):
        try:

            deleted_functionary = self.coll.delete_one({"email":functionary_data['email']})
            
            if deleted_functionary:
                return True
            else:
                return False
            
        except Exception as e:

            return e
    
    def GetAllTruckersDrivers(self,company_email):
        try:
            trucker_drivers_filters = {'company_email':company_email,"role":"Caminhoneiro"}

            got_all_truckers = list(self.coll.find(trucker_drivers_filters))

            if got_all_truckers:

                truckers_list = self.SplitTruckersDatas(got_all_truckers)
                return truckers_list
            
            else:

                return False
        except Exception as e:
            return e
        
    def SplitTruckersDatas(self,truckers):
        try:
            truckers_list = []
            for i in truckers:
                truckers_datas = {
                    'name':i['name'],
                    'email':i['email']
                }
                truckers_list.append(truckers_datas)
            return truckers_list
        except Exception as e:
            return e