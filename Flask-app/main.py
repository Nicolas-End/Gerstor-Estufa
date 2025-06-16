from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os
from controllers.cripto_controller import CriptographyController
from controllers.user_controller import UserController
from controllers.company_controller import CompanyController
from controllers.delivery_controller import DeliveryContoller
from controllers.email_controller import EmailController
from controllers.token_controller import ControllerToken
load_dotenv()
app = Flask(__name__)
CORS(app, origins="*")
#Cria as chaves para criptgrafar os dados
secret_key = os.getenv('SUPER_KEY')
fernet = Fernet(os.getenv('FERNET_KEY'))

@app.route('/')
def home():
    return "BEM-VINDO A MINHA API"

# Valida se o usuario pode acessar o home
@app.route('/home-acess', methods=['POST'])
def home_acess():
    try:
        #pega o header da requisição para consegruir pegar o token
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status':'invalid'}),400
        
        #processo para descriptografar os dados do usuario 
        data_user_is_correct = CriptographyController().decripto_datas(token)

          
       #verificando se o acesso do usuario é valido
        if data_user_is_correct['acess'] == True:
                return jsonify({'status':'ok'}),200
                
        return jsonify({'status':'invalid'}),400

    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 
    
@app.route('/count-deliverys', methods=['POST'])
def count_deliverys():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        

        count, ok = DeliveryContoller().quantidy_deliverys(datas['email'])
        if not ok:
            return jsonify({'status': 'error'}), 400
        
        return jsonify({'status': 'ok', 'count': count}), 200
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 
    
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
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 
    
#retorna os produtos de entregas da empresa
@app.route('/get-deliverys-products', methods=['POST'])
def get_deliverys_products():
    try:
        
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400

        deliverys, ok = DeliveryContoller().get_deliverys_products(datas['email'])
        if not ok:
            return jsonify({'status': 'error'}), 400
        
        return jsonify({'status':'ok','deliverys':deliverys})
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 
    
    
@app.route('/get-especific-delivery', methods=['POST'])
def get_especific_delivery():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
            
        request_id = request.get_json()['id']
        print(request_id)
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        
        delivery ,ok = DeliveryContoller().get_especific_delivery(datas['email'],request_id)
        
        if ok:
            return jsonify({'status':'ok','deliveryDatas':delivery}),200
        
        return jsonify({'status':'error'}),400
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 

@app.route('/add-new-delivery',methods=['POST'])
def add_new_delivery():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400 #dados do usuario sendo descriptografado
        
        formsData = request.get_json()['FormsData']
        itens = formsData['items']
        address = formsData['address']
        date = formsData['deliveryDate']
        name = formsData['name'] #Pegando os dados do ususario
        
        ok = DeliveryContoller().add_new_delivery(datas['email'],itens,address,date,name)
        if ok:
            return jsonify({'status':'ok'}),200
        return jsonify({'status':'error'}),400
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 
    
        
# Valida o usuario para o login e retorna que o usuario pode acessar o home se ele tiver os dados
@app.route('/worker-login', methods=["POST"])
def user_login():
    try:
        response = request.get_json() 
        worker_email = response['email']
        worker_password = response['password']

        responseApi, returnApi = UserController().validate_user( worker_email, worker_password)

        if returnApi:  
            data_user ={
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
        return jsonify({'status': 'error', 'message': str(e)}), 200 


@app.route('/send-email-recuperation' ,methods=['POST'])
def forget_password() :
    
    try:
        
        user_json = request.get_json()
        user_email = user_json['email']
        new_user_pass = user_json['newPassword']
        
        user_exist = UserController().find_user(user_email)
        if not user_exist:
            return jsonify({'status':'noexist'}),200
        
        sent_email = EmailController().send_recuperation_email(user_email,new_user_pass)
        
        if sent_email:
            return jsonify({'status':'ok'}),200
        else:
            return jsonify({'status':'error'}),200
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 
    
#sistema para alterar a senha a senha do usuario
@app.route('/change-password' ,methods=['POST'])
def change_password() :
    try:
        user_json = request.get_json()
        token = user_json['token']
        
        token_data,email = token.split("&")
        # verifica se o token do usuario é valido
        token_valid, new_password = ControllerToken().token_verify(token_data,email)
        if not token_valid:
            return jsonify({'status':'token_invalid'}),200
        
        # se o token do email for valido ele muda a senha do usuario                                                                                                        
        changed_password = UserController().change_user_password(email,new_password)
        
        if changed_password:
            
            return jsonify({'status':'ok'}),200
        
        return jsonify({'status':'error'}),200 
    
    except Exception as e: 
        print('Error:', e)
        return jsonify({'status':'error'})
    
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
        responseApi, returnApi = UserController().add_new_user(worker_name, worker_id, worker_role, worker_email, worker_password)
        
        if returnApi:  # Sucesso
            return jsonify({'status': 'ok'}), 201  # Retorna status 201 para sucesso
        return jsonify({'status': responseApi}), 201  # Erro (status 400)

    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200  # Retorna 200 para erro interno

if __name__ == '__main__':
    app.run(debug=True)
