from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room,emit,rooms, disconnect
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
    ],
    async_mode='eventlet'   
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

@app.route('/')
def index():
    return "O socket ta funcionando",200

def token_desc(token):
    if token:
        desc_token = CriptographyController().DecriptoDatas(token)
        return desc_token
    return False

@socketio.on('connect')
def connection():
    token = request.args.get('Token')
    descripto = token_desc(token)

    if not descripto:
        print(' ')
        print('Token inválido, desconectando...')
        disconnect()
        return

    join_room(descripto['company_email'])
    print('')
    print(descripto['email'])
    print(rooms())
    print(' ')

@socketio.on('new_delivery')
def new_deli():
    try:
        print(rooms())
        emit('add_delivery', to=rooms(), include_self=False)
    except Exception as e:
        print('Error: ',e)

    
    



    
@socketio.on('certo')
def certo():
    print('Certinho')

    
    

    

@socketio.on_error()
def handle_error(error):
    print(f"Erro no Socket.IO: {error}") 
    return 'Error', 500
if __name__ == '__main__':
       socketio.run(app, debug=True, port=8080)  # Use socketio.run instead of app.run
   