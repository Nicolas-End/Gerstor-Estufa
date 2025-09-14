from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from controllers.functionaries import FunctionariesController
from controllers.cripto_controller import CriptographyController
load_dotenv()

functionary_bp = Blueprint('functionary',__name__)


def DescriptoToken(token):
    try:
        if not token:
            return False
        
        datas = CriptographyController().DecriptoDatas(token)
        if not datas:
            return False
    
        return datas
    except Exception as e:
        return False

#TODOS OS FUNCIONARIOS NO SISTEMA DA EMPRESA
@functionary_bp.route('/get-all',methods=['POST'])
def GetFunctionaries():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        
        functionaries, ok = FunctionariesController().GetFunctionaries(datas['company_email'])
        if ok:
            
            return jsonify({'status':'ok','functionaries':functionaries}),200
        
        return jsonify({'status':'error'}),500
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500
    

@functionary_bp.route('/add-new',methods=["POST"])
def AddFunctionary():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas",401
        

        functionary_datas = request.get_json() 
        functionary_name = functionary_datas['name']
        functionary_pass = functionary_datas['password']
        functionary_email = functionary_datas['email']
        functionary_role = functionary_datas['role']

        result, status = FunctionariesController().AddNewFunctionary(datas['company_email'],datas['company_name'],
                                                                       functionary_name,functionary_pass,functionary_email,functionary_role)
        if (result == "AlreadyExist"):

            return jsonify({'status':'AlreadyExist'}),409
        else:
            return jsonify({'status':'ok'}),200
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status': 'error', 'message': str(e)}),500

#QUANTIDADE DE FUNCIONARIOS CADASTRADOS NO SISTEMA  
@functionary_bp.route('/quantity', methods=["POST"])
def GetQuantity():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
    
        functionaries_quantity, ok = FunctionariesController().GetFunctionaryQuantidy(datas['company_email'])
        if ok:
            return jsonify({'status':'ok','functionaries_quantity':functionaries_quantity}),200
        
        return jsonify({'status':'error'}),500
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

# DADOS DE UM FUNCIONARIO EM ESPECIFICO
@functionary_bp.route('/get-especific', methods=['POST'])
def GetEspecificDatas():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401

        email = request.get_json()['email']
        find_functionary = FunctionariesController().GetEspecificFunctionary(datas['company_email'],email)

        if find_functionary:
            
            return jsonify({'functionary':find_functionary}),200
        return "Funcionario não Encontrado",409

        
    except InvalidSignatureError as i:
        return "Credencial Invalida", 400
        
    except Exception as e:
        print('Error:', e)
        return "Erro Interno", 500  

@functionary_bp.route('/delete', methods=['POST'])
def DeleteFunctionary():
    try:
        token = request.headers.get('Authorization')
 
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        email = request.get_json()
        deleted_functionary = FunctionariesController().DeleteFunctionary(email)

        if deleted_functionary:
            return jsonify({}), 204
        else:
            return jsonify({}), 400 
        
    except InvalidSignatureError as i:
        return "Credencial Invalida", 400    
    except Exception as e:
        print('Error: ',e)
        return "Error Interno",500