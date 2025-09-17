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
            return jsonify({'products':products_dict}),200

    except Exception as e:
        print('Error: ',e)
        return "Erro Interno",500

@stock_products_bp.route('/add-new',methods=['POST'])
def AddNewProduct():
    try:
        
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas",401
        
        product = request.get_json()['productDatas']

        product_created = ProductController().AddNewStockProduct(datas['company_email'],product)
        if product_created:
            return "Produto Criado",204
        return "Produto ja Cadastrado",409 
    except Exception as e:
        print('Error: ',e)
        return "Erro Interno",500
    
@stock_products_bp.route('/delete',methods=['POST'])
def DeleteProduct():
    try:
        token = request.headers.get('Authorization')
        datas = DescriptoToken(token)
        if not datas:
            return "Credenciais Invalidas",401

        product_id = request.get_json()['id']
    except Exception as e:
        print('Error: ',e)
        return "Error Interno",500