from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from controllers.products_controller import ProductController
from controllers.cripto_controller import CriptographyController
load_dotenv()

stock_products_bp = Blueprint('products',__name__)
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

@stock_products_bp.route('/get-all',methods=['POST'])
def GetProducts():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas",401
        
        products_dict = ProductController().GetProducts(datas['company_email'])

        if products_dict:
            return products_dict,200
        else:
            return "Pedido não encontrado",204
    except Exception as e:
        print('Error: ',e)
        return "Erro Interno",500