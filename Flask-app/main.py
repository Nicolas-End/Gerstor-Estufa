from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os
from controllers.cripto_controller import CriptographyController
from controllers.user_controller import UserController
from controllers.delivery_controller import DeliveryContoller
from controllers.email_controller import EmailController
from controllers.token_controller import ControllerToken
from controllers.functionaries import FunctionariesController
from controllers.client_controller import ClientController
from controllers.truck_controller import TruckController
load_dotenv()
app = Flask(__name__)
CORS(app, origins="*")
#Cria as chaves para criptgrafar os dados
secret_key = os.getenv('SUPER_KEY')
fernet = Fernet(os.getenv('FERNET_KEY'))

@app.route('/')
def home():
    return "BEM-VINDO A MINHA API"

#========= USUARIO ========
# Valida se o usuario pode acessar o home
@app.route('/home-acess', methods=['POST'])
def home_acess():
    try:
        #pega o header da requisição para consegruir pegar o token
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status':'invalid'}),401
        
        #processo para descriptografar os dados do usuario 
        data_user_is_correct = CriptographyController().decripto_datas(token)

        
       #verificando se o acesso do usuario é valido
        if data_user_is_correct['acess'] == True:
                return jsonify({'status':'ok'}),200
                
        return jsonify({'status':'invalid'}),401

    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 

#Sistema pra registrar uma nova estufa
@app.route('/add-new-company', methods=['POST'])
def add_new_Adm():
    try: 
        response = request.get_json()
        company_id = response['id']
        company_email = response['email']
        company_password = response['password']
        company_name = response['companyName']

        responseApi, returnApi = UserController().add_new_Company(company_id,company_email,company_password,company_name)

        if returnApi:
            return jsonify({'status':'ok'}),200
        elif  returnApi == "Already Exist":
            return jsonify({'status': responseApi}), 409
        else:
            return jsonify({'status':responseApi}),500
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Valida o usuario para o login e retorna que o usuario pode acessar o home se ele tiver os dados
@app.route('/user-login', methods=["POST"])
def user_login():
    try:
        response = request.get_json() 
        worker_email = response['email']
        worker_password = response['password']

        responseApi, returnApi = UserController().validate_user( worker_email, worker_password)

        if returnApi:

            compnay_email, company_name,role = UserController().get_company_email(worker_email)
            data_user ={
                'email':worker_email,
                'company_email':compnay_email,
                'company_name':company_name,
                'acess':True
            }
            token = CriptographyController().cripto_datas(data_user) #criptografa os dados do usuario 
            
            
            return jsonify({'status': 'ok','token':token,'role':role}), 201 
        
        return jsonify({'status':'noexist'}),401
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': 'Server Error'}), 500 
    
@app.route('/send-email-recuperation' ,methods=['POST'])
def forget_password() :
    
    try:
        
        user_json = request.get_json()
        user_email = user_json['email']
        new_user_pass = user_json['newPassword']
        
        user_exist = UserController().find_user(user_email)
        if not user_exist:
            return jsonify({'status':'noexist'}),401
        
        sent_email = EmailController().send_recuperation_email(user_email,new_user_pass)
        
        if sent_email:
            return jsonify({'status':'ok'}),200
        else:
            return jsonify({'status':'error'}),500
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
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
            return jsonify({'status':'token_invalid'}),401
        
        # se o token do email for valido ele muda a senha do usuario                                                                                                        
        changed_password = UserController().change_user_password(email,new_password)
        
        if changed_password:
            
            return jsonify({'status':'ok'}),200
        
        return jsonify({'status':'error'}),500
    
    except Exception as e: 
        print('Error:', e)
        return jsonify({'status':'error'}),500

    
#======== ENTREGAS =======
@app.route('/count-deliverys', methods=['POST'])
def count_deliverys():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        

        count, ok = DeliveryContoller().quantidy_deliverys(datas['company_email'])
        if not ok:
            return jsonify({'status': 'error'}), 400
        
        return jsonify({'status': 'ok', 'count': count}), 200
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200 
    

#retorna os produtos de entregas da empresa
@app.route('/get-deliverys', methods=['POST'])
def get_deliverys_products():
    try:
        
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400

        deliverys, ok = DeliveryContoller().get_deliverys(datas['company_email'])
        if not ok:
            
            return jsonify({'status':'error',}),500
        
        return jsonify({'status':'ok','deliverys':deliverys}),200
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 
       
@app.route('/get-especific-delivery', methods=['POST'])
def get_especific_delivery():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
            
        request_id = request.get_json()['id']
    
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        
        delivery ,ok = DeliveryContoller().get_especific_delivery(datas['company_email'],request_id)
        
        if ok:
            products = DeliveryContoller().get_products_from_a_delivery(datas['company_email'],request_id)
            return jsonify({'status':'ok','deliveryDatas':delivery,"products":products}),200
        
        return jsonify({'status':'sem entrga'}),200
    
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
        name = formsData['name']
        clientId = formsData['clientId']
        idType = formsData['typeClientId'] #Pegando os dados do ususario
        
        ok = DeliveryContoller().add_new_delivery(datas['company_email'],itens,address,date,name,clientId,idType)
        if ok:
            return jsonify({'status':'ok'}),200
        return jsonify({'status':'error'}),500
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 
    
@app.route('/edit-delivery',methods=['POST'])
def edit_delivery():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        
        formsData = request.get_json()['FormsData']
        delivery_id = formsData['id']
        itens = formsData['items']
        address = formsData['address']
        date = formsData['deliveryDate']
        name = formsData['name']
        clientId = formsData['clientId']
        idType = formsData['typeClientId']
        
        ok = DeliveryContoller().edit_delivery(datas['company_email'],delivery_id,itens,address,date,name,clientId,idType)
        if ok:
            return jsonify({'status':'ok'}),200
        return jsonify({'status':'error'}),400
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200

@app.route('/delete-delivery',methods=['POST'])
def delete_delivery():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        
        delivery_id= request.get_json()['delivery_id']
        delivery_was_deleted = DeliveryContoller().delete_delivery(datas['company_email'],delivery_id)
        if delivery_was_deleted:
            products_deleted = DeliveryContoller().delete_product(datas['company_email'],delivery_id)
            if products_deleted:
                return jsonify({'status':'ok'}),200

        return jsonify({'status':'error'}),500   
    
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status': 'error', 'message': str(e)}), 500


#========= FUNCIONARIOS ===========

@app.route('/get-functionaries', methods=['POST'])
def get_functionarys():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        
        functionaries, ok = FunctionariesController().get_functionaries(datas['company_email'])
        if ok:
            
            return jsonify({'status':'ok','functionaries':functionaries}),200
        
        return jsonify({'status':'error'}),500
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/add-new-functionary', methods=['POST'])
def add_new_functionary():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 401
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),401
        

        functionary_datas = request.get_json() 
        functionary_name = functionary_datas['name']
        functionary_pass = functionary_datas['password']
        functionary_email = functionary_datas['email']
        functionary_role = functionary_datas['role']

        result, status = FunctionariesController().add_new_functionary(datas['company_email'],datas['company_name'],
                                                                       functionary_name,functionary_pass,functionary_email,functionary_role)
        if (result == "AlreadyExist"):

            return jsonify({'status':'AlreadyExist'}),409
        else:
            return jsonify({'status':'ok'}),200
    
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status': 'error', 'message': str(e)}),500
    
@app.route('/get-functionaries-quantity',methods=['POST'])
def get_functionaries_quantity():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
    
        functionaries_quantity, ok = FunctionariesController().get_functionaries_quantity(datas['company_email'])
        if ok:
            return jsonify({'status':'ok','functionaries_quantity':functionaries_quantity}),200
        
        return jsonify({'status':'error'}),500
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500  # Retorna 200 para erro interno
    

    

#========== CLIENTES =========    
@app.route('/get-clients', methods=['POST'])
def get_clients():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        
        status, clients = ClientController().get_clients(datas['company_email'])
        if status:
            
            return jsonify({'status':'ok','clients':clients}),200
        return jsonify({'status':'error'}),500
    
    except Exception as e: 
        print('Error: ', e)
        return jsonify({'status':'error'}),500
    
@app.route('/add-new-client', methods=['POST'])
def add_client():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        

        clients_datas = request.get_json()  
        created_client  = ClientController().add_new_client(datas['company_email'],clients_datas['name'],clients_datas['address'],
                                                                clients_datas['document'])
        
        if created_client:
            return jsonify({'status':'ok'}),200
        else:
            return jsonify({'status':'ok'}),409
    
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'error'}),500

@app.route('/get-especific-client',methods=['POST'])
def get_especific_client():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'invalid'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error'}),400
        
        clients_datas = request.get_json()['id']
        tipo, client_id = clients_datas.split('%')
        status, clients_infos = ClientController().get_especific_data_from_client() 
        return jsonify({'status':clients_datas}),200
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'error'}),500
#====CAMINHÕES=====
@app.route('/get-trucks', methods=['POST'])
def get_trucks():   
    try:

        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'error','message':'Authorization?'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error','message':'Authorization?'}),400
        status, trucks= TruckController().get_trucks(datas['company_email'])
        if status:
            
            return jsonify({'status':'ok','trucks':trucks}),200
        
        return jsonify({'status':'error','message':'internalError'}),400
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status': 'error', 'message': 'internalError'}), 500

@app.route('/add-new-truck',methods=['POST','GET'])
def AddNewTruck():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status': 'error','message':'Authorization?'}), 400
        
        datas = CriptographyController().decripto_datas(token)
        if not datas:
            return jsonify({'status':'error','message':'Authorization?'}),400

        forms_data = request.get_json()['FormsData']

        created_truck = TruckController().add_new_truck(datas['company_email'],forms_data['chassi'],forms_data['placa'],
                                                        forms_data['cor'],forms_data['modelo'],forms_data['eixos'],forms_data['mercosul'])
    
        if created_truck:
            return jsonify({'status':'ok'}),200
        else:
            return jsonify({'status':'alreadyExist'}),409
    except Exception as e:
        print("Error: ",e)
        return jsonify ({'status': 'error', 'message': 'internalError'}),500

if __name__ == '__main__':
    app.run(debug=True)
