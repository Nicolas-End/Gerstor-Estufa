import os
from datetime import datetime
from dotenv import load_dotenv
import bcrypt
from config.config import DataBase 

"""
    Sistema para cirar e controlar tokens para mudar a senha do usuario
    
"""
class ControllerToken:
    def __init__(self):
        
        self.db = DataBase().database
        self.collection_name = os.getenv("TOKEN_COLLECTION")
    
    """
        Cria um novo token para o usuario mudar a senha
    """
     def GeneratePasswordRecoveryToken(self,token,user_email,new_password):
        try:
            
            if not self.collection_name:
                raise ValueError("TOKEN_COLLECTION não está configurado no arquivo .env.")

            collection = self.SetColectionWitExpire(user_email)
            
            token_datas = self.SetTokenDatasWithHashedDatas(user_email,new_password,token)

            collection.insert_one(token_datas)
            return True
        
        except Exception as e:
            print("Error: ",e)
            return False

    def SetColectionWitExpire(self,user_email):

        collection= self.db[self.collection_name]

        if collection.find_one({"company_email":user_email}):
                collection.delete_one({"company_email":user_email})
        
        collection.create_index(
                [("date",1)],expireAfterSeconds=180
            )
        
        return collection
    
    def SetTokenDatasWithHashedDatas(self,user_email,new_password,token):
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        hashed_token = bcrypt.hashpw(token.encode('utf-8'), bcrypt.gensalt())

        token = {
                "company_email":user_email,
                'new_password':hashed_password,
                "token":hashed_token,
                "date":datetime.utcnow()
            }
        
        return token
        

    """
        Aqui verifica se o token enviado pelo usuario e valido,
        se for valido deleta o token e retorna a nova senha
    """
    def TokenVerify(self,token,user_email):
        try:
            if not self.collection_name:
                raise ValueError("TOKEN_COLLECTION não está configurado no arquivo .env.")

        
            collection = self.db[self.collection_name]
            # vai no mudar senha e verifica o email do usuario existe
            user = collection.find_one({'company_email':user_email})

            if user:
                # se o usuario existe ele verifica se o token é valido  e igual no banco de dados
                if bcrypt.checkpw(token.encode('utf-8'), user["token"]):
                    #se tiver tudo certo deleta o recuperar senha
                    collection.delete_one({'company_email':user_email})
                    return True, user["new_password"]
                else:
                    return False, False
                
            return False, False
        
        except Exception as e:
            print("Error",e)
            return False,False
