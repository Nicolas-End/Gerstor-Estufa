from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from controllers.delivery_controller import DeliveryController
from controllers.cripto_controller import CriptographyController
load_dotenv()

delivery_bp = Blueprint('deliverys',__name__)


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


@delivery_bp.route('/quantity',methods=['POST'])
def Quantity():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        print(datas)

        count, ok = DeliveryController().QuantidyDelivery(datas['company_email'])
        if not ok:
            return jsonify({'status': 'error'}), 400
        
        return jsonify({'status': 'ok', 'count': count}), 200
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 
    

# PEGA TODAS ENTREGAS  
@delivery_bp.route('/get-all',methods=["POST"])
def GetAll():
    try:
    
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401

        deliverys, ok = DeliveryController().GetDeliverys(datas['company_email'])
        if not ok:
            
            return jsonify({'status':'error',}),500
        
        return jsonify({'status':'ok','deliverys':deliverys}),200
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 401
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 
    
# PEGA OS DADOS DE UMA ENTREGA ESPECIFICA
@delivery_bp.route('/get-especific', methods=["POST"])
def GetEspecificDelivery():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas",401
        
        request_id = request.get_json()['id']
        
        delivery ,ok = DeliveryController().GetEspecificDelivery(datas['company_email'],request_id)
        
        if ok:
            products = DeliveryController().GetProductsFromDelivery(datas['company_email'],request_id)
            return jsonify({'status':'ok','deliveryDatas':delivery,"products":products}),200
        
        return jsonify({'status':'sem entrga'}),200
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 
    
# ADICIONA UMA NOVA ENTREGA AO SISTEMA ESPECIFICO DA EMPRESA
@delivery_bp.route('/add-new', methods=['POST'])
def AddNewDelivery():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401 #dados do usuario sendo descriptografado
        
        formsData = request.get_json()['FormsData']
        itens = formsData['items']
        address = formsData['address']
        date = formsData['deliveryDate']
        name = formsData['clientName']
        clientId = formsData['clientId']
        idType = formsData['typeClientId']
        truckDriverName = formsData['truckDriverName']
        truckDriverEmail = formsData['truckDriverEmail']

        return "ok",200
        ok = DeliveryController().AddNewDelivery(datas['company_email'],itens,address,date,name,clientId,idType,truckDriverName,truckDriverEmail)
        if ok:
            return jsonify({'status':'ok'}),200
        return jsonify({'status':'error'}),500
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500 
    

@delivery_bp.route('/edit',methods=["POST"])
def EditDeviveryDatas():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        
        formsData = request.get_json()['FormsData']
        delivery_id = formsData['id']
        itens = formsData['items']
        address = formsData['address']
        date = formsData['deliveryDate']
        name = formsData['name']
        clientId = formsData['clientId']
        idType = formsData['typeClientId']
        
        ok = DeliveryController().EditDelivery(datas['company_email'],delivery_id,itens,address,date,name,clientId,idType)
        if ok:
            return jsonify({'status':'ok'}),200
        return jsonify({'status':'error'}),400
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 200
    
@delivery_bp.route('/delete',methods=["POST"])
def DeleteDelivery():
    try:
        token = request.headers.get('Authorization')
        datas  = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas", 401
        
        delivery_id= request.get_json()['delivery_id']
        delivery_was_deleted = DeliveryController().DeleteDelivery(datas['company_email'],delivery_id)
        if delivery_was_deleted:
            products_deleted = DeliveryController().DeleteProduct(datas['company_email'],delivery_id)
            if products_deleted:
                return jsonify({'status':'ok'}),200

        return jsonify({'status':'error'}),500   
    
    except InvalidSignatureError as i:
        return jsonify({'status': 'invalid'}), 400
        
    except Exception as e:
        print('Error: ',e)
        return jsonify({'status': 'error', 'message': str(e)}), 500