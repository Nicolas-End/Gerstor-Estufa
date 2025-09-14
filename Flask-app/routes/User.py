from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from controllers.user_controller import UserController
from controllers.email_controller import EmailController
from controllers.token_controller import ControllerToken
from controllers.cripto_controller import CriptographyController
load_dotenv()

user_bp = Blueprint('user',__name__)


@user_bp.route('/')
def home():
    return "BEM-VINDO A MINHA API" 

@user_bp.route('/home-acess', methods=['POST'])
def HomeAcess():
    try:
        #pega o header da requisição para consegruir pegar o token
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'status':'invalid'}),401
        
        #processo para descriptografar os dados do usuario 
        data_user_is_correct = CriptographyController().DecriptoDatas(token)

       #verificando se o acesso do usuario é valido
        if data_user_is_correct['acess'] == True:
                return jsonify({'status':'ok'}),200
                
        return jsonify({'status':'invalid'}),401

    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 

@user_bp.route('/add-new-company', methods=['POST'])
def AddNewAdm():
    try: 
        response = request.get_json()
        company_id = response['id']
        company_email = response['email']
        company_password = response['password']
        company_name = response['companyName']

        responseApi, returnApi = UserController().AddNewCompany(company_id,company_email,company_password,company_name)

        if returnApi:
            return jsonify({'status':'ok'}),200
        elif  returnApi == "Already Exist":
            return jsonify({'status': responseApi}), 409
        else:
            return jsonify({'status':responseApi}),500
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

@user_bp.route('/login', methods=["POST"])
def UserLogin():
    try:
        response = request.get_json() 
        worker_email = response['email']
        worker_password = response['password']

        responseApi, returnApi = UserController().ValidateUser( worker_email, worker_password)
        if returnApi:

            compnay_email, company_name,role = UserController().GetCompanyEmail(worker_email)
            data_user ={
                'email':worker_email,
                'company_email':compnay_email,
                'company_name':company_name,
                'acess':True
            }
            token = CriptographyController().CriptoDatas(data_user) #criptografa os dados do usuario 
            
            
            return jsonify({'status': 'ok','token':token,'role':role}), 201 
        
        return jsonify({'status':'noexist'}),401
    
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': 'Server Error'}), 500 

@user_bp.route('/send-email-recuperation' ,methods=['POST'])
def ForgetPassword() :
    
    try:
        
        user_json = request.get_json()
        user_email = user_json['email']
        new_user_pass = user_json['newPassword']
        
        user_exist = UserController().FindUser(user_email)
        if not user_exist:
            return jsonify({'status':'noexist'}),401
        
        sent_email = EmailController().SendRecuperationEmail(user_email,new_user_pass)
        
        if sent_email:
            return jsonify({'status':'ok'}),200
        else:
            return jsonify({'status':'error'}),500
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@user_bp.route('/change-password' ,methods=['POST'])
def ChangePassword() :
    try:
        user_json = request.get_json()
        token = user_json['token']
        
        token_data,email = token.split("&")
        # verifica se o token do usuario é valido
        token_valid, new_password = ControllerToken().TokenVerify(token_data,email)
        if not token_valid:
            return jsonify({'status':'token_invalid'}),401
        
        # se o token do email for valido ele muda a senha do usuario                                                                                                        
        changed_password = UserController().ChangeUserPassword(email,new_password)
        
        if changed_password:
            
            return jsonify({'status':'ok'}),200
        
        return jsonify({'status':'error'}),500
    
    except Exception as e: 
        print('Error:', e)
        return jsonify({'status':'error'}),500