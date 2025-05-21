import os
from datetime import datetime
from dotenv import load_dotenv
import bcrypt
from config.config import DataBase 
class ControlerToken:
    #Abre conexão com o banco de dados
    def __init__(self):
        self.db = DataBase().database
        self.collection_name = os.getenv("TOKEN_COLLECTION")
    def add_new_password_recuperation_token(self,token,user_email,newpassword):
        try:

            
            if not self.collection_name:
                raise ValueError("TOKEN_COLLECTION não está configurado no arquivo .env.")

            #configura a collection que recebera o insert
            collection = self.db[self.collection_name]
        

            if collection.find_one({"company_email":user_email}):
                #invalida o link anterior se o usuario ja tiver realizado uma outra requesição
                collection.delete_one({"company_email":user_email})

            #limita o tempo que o token ficar valido apenas para 3 minutos dps sera apgado
            collection.create_index(
                [("date",1)],expireAfterSeconds=180
            )
            hashed_password = bcrypt.hashpw(newpassword.encode('utf-8'), bcrypt.gensalt())
            hashed_token = bcrypt.hashpw(token.encode('utf-8'), bcrypt.gensalt())

            token_data = {
                "company_email":user_email,
                'new_password':hashed_password,
                "token":hashed_token,
                "date":datetime.utcnow()
            }

            collection.insert_one(token_data)
            return True
        
        except Exception as e:
            print("Error: ",e)
            return False


    def token_verify(self,token,user_email):
        try:
            
            if not self.collection_name:
                raise ValueError("UNIKE_TOKEN_COLECTION não está configurado no arquivo .env.")

        
            collection = self.db[self.collection_name]
        
            user = collection.find_one({'user_email':user_email})

            if user:

                if bcrypt.checkpw(token.encode('utf-8'), user["token"]):
                    return True
                else:
                    return False
                
            return False
        
        except Exception as e:
            print("Error",e)
            return False