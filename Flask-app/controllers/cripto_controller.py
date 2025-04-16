import jwt
from cryptography.fernet import Fernet
import json
from dotenv import load_dotenv
import os

load_dotenv()
class CriptographyController:
    def __init__(self):
        self.jwt_password = os.getenv("SUPER_KEY")
        self.fernet_password = os.getenv("FERNET_KEY")
        self.fernet = Fernet(self.fernet_password)   
        
    def cripto_datas(self,datas_user):
        #Encripta os dados do usuario para caso for intercepitado
        #serve para fazer verificações dos usuarios
        data_encrypt = self.fernet.encrypt(json.dumps(datas_user).encode()).decode()
        
        token = jwt.encode(
            payload={'data':data_encrypt},
            key=self.jwt_password
        )
        
        return token
    
    def decripto_datas(self,token):
        
        array_token = jwt.decode(token,self.jwt_password,algorithms=['HS256'])
        decoded_json_token = self.fernet.decrypt(token=array_token['data'].encode()).decode()
        datas_from_user = json.loads(decoded_json_token)
        
        return datas_from_user