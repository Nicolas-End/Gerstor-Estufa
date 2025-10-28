from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from controllers.client_controller import ClientController
from controllers.cripto_controller import CriptographyController
load_dotenv()

clients_bp = Blueprint('clients',__name__)


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

@clients_bp.route('/get-all',methods=["POST"])
def GetClients():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        
        status, clients = ClientController().GetClients(datas['company_email'])
        if status:
            
            return jsonify({'status':'ok','clients':clients}),200
        return jsonify({'status':'error'}),500
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e: 
        print('Error: ', e)
        return jsonify({'status':'error'}),500

@clients_bp.route('/add-new',methods=['POST'])
def AddNewClient():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        

        clients_datas = request.get_json()  
        created_client  = ClientController().AddNewClient(datas['company_email'],clients_datas['name'],clients_datas['address'],
                                                                clients_datas['document'])
        
        if created_client:
            return jsonify({'status':'ok'}),200
        else:
            return jsonify({'status':'ok'}),409
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'error'}),500

@clients_bp.route('/get-especific-datas',methods=['POST'])
def GetEspecificDataClients():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        
        clients_datas = request.get_json()['id']
        tipo, client_id = clients_datas.split('&')
        clients_infos = ClientController().GetEspecicDataFromClient(datas['company_email'],client_id,tipo) 
        
        if clients_infos:
            return({'status':'ok','clientInfos':clients_infos}),200
        return jsonify({'status':'none'}),404
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'error'}),500

@clients_bp.route('/delete',methods=['POST'])
def DeleteClient():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas" , 401
        
        client_id = request.get_json()['id']
        client_type = request.get_json()['type']    

        client_deleted = ClientController().DeleteClient(datas['company_email'],client_id,client_type)

        if client_deleted:
            return 'Cliente Excluido', 200
        else:
            return 'Erro Desconhecido',404
        
    except Exception as e:
        print('Error: ',e)
        return 'Erro Interno',500