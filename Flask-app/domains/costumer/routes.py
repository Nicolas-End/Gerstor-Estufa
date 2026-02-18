from flask import Flask, request, jsonify, Blueprint, g
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from domains.costumer.controller import CostumerController 
from controllers.cripto_controller import CriptographyController
load_dotenv()

costumer_bp = Blueprint('costumer',__name__)



@costumer_bp.route('/get-all',methods=["POST"])
def GetCostumer():
    
    try:

        datas = CostumerController().GetCostumer(g.datas['company_email'])
    
        if type(datas) == list:
            return jsonify({'status':'ok','costumer':datas}),200
        
        return jsonify({'status':'error'}),500

    except Exception as e: 
        print('Error: ', e)
        return jsonify({'status':'error'}),500

@costumer_bp.route('/add-new',methods=['POST'])
def AddNewCostumer():
    try:

        costumer_datas = request.get_json()  
        created_costumer  = CostumerController().RegisterCostumer(g.datas['company_email'],costumer_datas['name'],costumer_datas['address'],
                                                                costumer_datas['document'])
        
        if created_costumer:
            return jsonify({'status':'ok'}),200

        return jsonify({'status':'ok'}),409
    

        
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'error'}),500

@costumer_bp.route('/get-especific-datas',methods=['POST'])
def GetEspecificDataCostumer():
    try:

        
        costumer_datas = request.get_json()['id']
        tipo, costumer_id = costumer_datas.split('&')
        costumer_infos = CostumerController().GetEspecicDataFromCostumer(g.datas['company_email'],costumer_id,tipo) 
        
        if costumer_infos:
            return({'status':'ok','costumerInfos':costumer_infos}),200
        return jsonify({'status':'none'}),404

    except Exception as e:
        print('Error: ',e)
        return jsonify({'status':'error'}),500

@costumer_bp.route('/delete',methods=['POST'])
def DeleteCostumer():
    try:
        
        costumer_id = request.get_json()['id']
        costumer_type = request.get_json()['type']    

        costumer_deleted = CostumerController().DeleteCostumer(g.datas['company_email'],costumer_id,costumer_type)

        if costumer_deleted:
            return 'costumere Excluido', 200
        else:
            return 'Erro Desconhecido',404
        
    except Exception as e:
        print('Error: ',e)
        return 'Erro Interno',500
    


#incia a verificação de token antes de cada endpoint
@costumer_bp.before_request
def ValidadeTokenUser():
    try: 
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
    
        g.datas = datas
        
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

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
