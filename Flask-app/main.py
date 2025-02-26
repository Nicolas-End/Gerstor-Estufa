from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.worker_controller import Worker_controller
from controllers.adm_controller import Adm_controller

app = Flask(__name__)
CORS(app, origins="*")

@app.route('/')
def home():
    return "BEM-VINDO A MINHA API"


@app.rout('/add-new-Adm', methods=['POST'])
def add_new_Adm():
    request = request.get_json()
    adm_id = request['id']
    adm_email = request['email']
    adm_password = request['password']

    responseApi, returnApi = Adm_controller().add_new_Adm(adm_id,adm_email,adm_password)

    if returnApi:
        
        return jsonify({'status':'ok'}),201

    return jsonify({'status': responseApi}), 201  

@app.route('/worker-validate', methods=["POST"])
# Valida o usuario para o login
def user_validade():
    try:
        request = request.get_json() 
        worker_id = request['id']
        worker_email = request['email']
        worker_password = request['password']

        responseApi, returnApi = Worker_controller().validate_worker(worker_id, worker_email, worker_password)

        if returnApi:  

            return jsonify({'status': 'ok'}), 201 
        
        
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
        request = request.get_json()  
        worker_name = request['name']
        worker_id = request['id']
        worker_role = request['role']
        worker_email = request['email']
        worker_password = request['password']
        
        # Chama a função para adicionar um novo worker
        responseApi, returnApi = Worker_controller().add_new_Worker(worker_name, worker_id, worker_role, worker_email, worker_password)
        
        if returnApi:  # Sucesso
            return jsonify({'status': 'ok'}), 201  # Retorna status 201 para sucesso
        return jsonify({'status': responseApi}), 201  # Erro (status 400)

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500  # Retorna 500 para erro interno

if __name__ == '__main__':
    app.run(debug=True)
