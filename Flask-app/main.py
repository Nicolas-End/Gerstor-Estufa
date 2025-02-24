from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.worker_controller import Worker_controller

app = Flask(__name__)
CORS(app, origins="*")

@app.route('/')
def home():
    return "BEM-VINDO A MINHA API"

@app.route('/worker-validate', methods=["POST"])
# Valida o usuario para o login
def user_validade():
    try:
        response = request.get_json() 
        worker_id = response['id']
        worker_email = response['email']
        worker_password = response['password']

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
        return jsonify({'status': responseApi}), 400  # Erro (status 400)

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500  # Retorna 500 para erro interno

if __name__ == '__main__':
    app.run(debug=True)
