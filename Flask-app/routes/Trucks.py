from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from controllers.truck_controller import TruckController
from controllers.cripto_controller import CriptographyController
load_dotenv()

truck_bp = Blueprint('trucks',__name__)


def DescriptoToken(token):
    try:
        if not token:
            return False
        
        datas = CriptographyController().DecriptoDatas(token)
        if not datas:
            return False
    
        return datas
    except Exception as e:
        return 
    
@truck_bp.route('/get-all',methods=['POST'])
def GetTrucks():
    try:

        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        status, trucks= TruckController().GetTrucks(datas['company_email'])
        if status:
            
            return jsonify({'status':'ok','trucks':trucks}),200
        
        return jsonify({'status':'error','message':'internalError'}),400
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status': 'error', 'message': 'internalError'}), 500
    
@truck_bp.route('/add-new',methods=['POST'])
def AddNewTruck():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401

        forms_data = request.get_json()['FormsData']

        created_truck = TruckController().AddNewTruck(datas['company_email'],forms_data['chassi'],forms_data['placa'],
                                                        forms_data['cor'],forms_data['modelo'],forms_data['eixos'],forms_data['mercosul'])
    
        if created_truck:
            return jsonify({'status':'ok'}),200
        else:
            return jsonify({'status':'alreadyExist'}),409
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print("Error: ",e)
        return jsonify ({'status': 'error', 'message': 'internalError'}),500
    
@truck_bp.route('/get-especific-datas',methods=['POST'])
def EspecificTruck():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401

        placa = request.get_json()['placa']
        truck_datas = TruckController().GetEspecificTruck(datas['company_email'],placa)

        if truck_datas:
                
            return truck_datas , 200
        else:
            return "Não Encontrado",404
    except InvalidSignatureError as i:
        return "Credenciais Invalidas", 400
        
    except Exception as e:
        print("Error: ",e)
        return "Error Interno",500
    
@truck_bp.route('/delete',methods=['POST'])
def DeleteTruck():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas",401
        
        placa = request.get_json()['placa']
        truck_delete = TruckController().DeleteTruck(datas['company_email'],placa)

        if truck_delete:
            return 'Caminhão Deletado',200
        else:
            return "Houve algum erro", 404
        
    except Exception as e:
        print("Error: ",e)
        return "Error Interno",500