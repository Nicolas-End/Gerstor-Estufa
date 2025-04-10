from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os
from controllers.cripto_controller import CriptographyController
from controllers.worker_controller import WorkerController
from controllers.company_controller import CompanyController

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
        
        #processo para descriptografar os dados do usuario 
        datas_from_user = CriptographyController().decripto_datas(token)
          
       #verificando se o acesso do usuario é valido
        if datas_from_user['acess'] == True:
            quantidy_response,return_quantidy = CompanyController().quantidy_deliverys(datas_from_user['email'])

            
            if return_quantidy:

                return jsonify({'status':'ok','deliveryQuantidy':quantidy_response}),200
                
        return jsonify({'status':'invalid'}),400

    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'invalid'}),400
    
    
    
#Sistema pra registrar uma nova estufa
@app.route('/add-new-company', methods=['POST'])
def add_new_Adm():
    try: 
        response = request.get_json()
        company_id = response['id']
        company_email = response['email']
        company_password = response['password']
        company_name = response['companyName']

        responseApi, returnApi = CompanyController().add_new_Company(company_id,company_email,company_password,company_name)

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

        responseApi, returnApi = WorkerController().validate_worker(worker_id, worker_email, worker_password)

        if returnApi:  
            data_user ={
                'id':worker_id,
                'email':worker_email,
                'acess':True
            }
            token = CriptographyController().cripto_datas(data_user) #criptografa os dados do usuario 
            
            
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
        responseApi, returnApi = WorkerController().add_new_Worker(worker_name, worker_id, worker_role, worker_email, worker_password)
        
        if returnApi:  # Sucesso
            return jsonify({'status': 'ok'}), 201  # Retorna status 201 para sucesso
        return jsonify({'status': responseApi}), 201  # Erro (status 400)

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500  # Retorna 500 para erro interno

if __name__ == '__main__':
    app.run(debug=True)
