from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, join_room
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
import os
from functools import wraps
from controllers.cripto_controller import CriptographyController


load_dotenv()
app = Flask(__name__)

socketio = SocketIO(app) 
socketio = SocketIO(
    app,
    cors_allowed_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.11:3001",
        "*"# adicione seu IP da rede local
    ]
)

# Função decoradora que pega o token do usuario
def require_token(f):
    @wraps(f)
    def wrapper( *args, **kwargs):
        token = request.headers.get('Datas') 
        if not token:
            return False
        try:
            token_datas = CriptographyController().DecriptoDatas(token)
        except Exception as e:
            print("Erro ao decodificar token:", e)
            return False
        return f(token_datas, *args, **kwargs)
    return wrapper


@socketio.on('join')
#chamada da função decoradora
@require_token
def join_company_room (token_datas):
    try:
       
        company_email = token_datas['company_email']
        join_room(company_email)

        return
    except Exception as e:
        print('Error Join: ',e)


@socketio.on('new_delivery')
@require_token
def new_delivery(token_datas):
    
    socketio.emit('new_delivery', room=token_datas['company_email']) 


if __name__ == '__main__':
       socketio.run(app, debug=True, port=8080)  # Use socketio.run instead of app.run
   