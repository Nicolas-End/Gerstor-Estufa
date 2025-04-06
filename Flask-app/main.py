from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
import json
import jwt
from dotenv import load_dotenv
import os
from controllers.worker_controller import Worker_controller
from controllers.adm_controller import Adm_controller

load_dotenv()
app = Flask(__name__)
CORS(app, origins="*")
#Cria as chaves para criptgrafar os dados
secret_key = os.getenv('SUPER_KEY')
fernet = Fernet(os.getenv('FERNET_KEY'))

@app.route('/')
def home():
    return "BEM-VINDO A MINHA API"

@app.route('/home-acess', methods=['POST'])
def home_acess():
    try:
        #pega o header da requisição para consegruir pegar o token
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status':'invalid'}),400
        
        #processo para descriptografar os dados e tranformar o json n dicionario
        datas = jwt.decode(token,secret_key, algorithms=['HS256'])
        decoded_token = fernet.decrypt(datas['data'].encode()).decode()
        dict_token = json.loads(decoded_token)
       
        if dict_token['acess'] == True:
            return jsonify({'status':'ok'}),200
        return jsonify({'status':'invalid'}),400

    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'invalid'}),400
    
    
    
#Sistema pra registrar uma nova estufa
@app.route('/add-new-Adm', methods=['POST'])
def add_new_Adm():
    try: 
        response = request.get_json()
        adm_id = response['id']
        adm_email = response['email']
        adm_password = response['password']

        responseApi, returnApi = Adm_controller().add_new_Adm(adm_id,adm_email,adm_password)

        if returnApi:
            return jsonify({'status':'ok'}),201

        return jsonify({'status': responseApi}), 201
    except Exception as e:
        print('Error: ',e)



# Valida o usuario para o login e retorna que o usuario pode acessar o home se ele tiver os dados
@app.route('/worker-login', methods=["POST"])
def user_login():
    try:
        response = request.get_json() 
        worker_id = response['id']
        worker_email = response['email']
        worker_password = response['password']

        responseApi, returnApi = Worker_controller().validate_worker(worker_id, worker_email, worker_password)

        if returnApi:  
            data_user ={
                'id':worker_id,
                'email':worker_email,
                'acess':True
            }
            #criptografa os dados em fernet depois colocar dentro de uma jwt codificada
            data_encrypt = fernet.encrypt(json.dumps(data_user).encode()).decode()
            token = jwt.encode(
                payload={'data':data_encrypt},
                key=secret_key
            ) #um token que contem todos os dados do usuario encriptado
            
            
            return jsonify({'status': 'ok','token':token}), 201 
        
        
        if responseApi == "Wrong Password":
            return jsonify({'status': 'Wrongpassword'}), 201  
        
        return jsonify({'status':'noexist'}),201
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 

@app.route('/add-worker', methods=['POST'])
def create_new_worker():
    try:
        # adiciona um novo trabalhador ao banco de dados
        response = request.get_json()  
        worker_name = response['name']
        worker_id = response['id']
        worker_role = response['role']
        worker_email = response['email']
        worker_password = response['password']
        
        # Chama a função para adicionar um novo worker
        responseApi, returnApi = Worker_controller().add_new_Worker(worker_name, worker_id, worker_role, worker_email, worker_password)
        
        if returnApi:  # Sucesso
            return jsonify({'status': 'ok'}), 201  # Retorna status 201 para sucesso
        return jsonify({'status': responseApi}), 201  # Erro (status 400)

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500  # Retorna 500 para erro interno

if __name__ == '__main__':
    app.run(debug=True)
