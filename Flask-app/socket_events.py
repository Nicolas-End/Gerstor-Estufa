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




def token_description(token):
    """ Get the user Datas By the Unique Token for each user"""
    if token:
        datas_from_user = CriptographyController().DecriptoDatas(token)
        return datas_from_user
    return False

@socketio.on('connect')
def connection():

    token = request.args.get('Token')
    descripto = token_description(token)
    if not descripto:
        disconnect()
        return

    join_room(descripto['company_email'])
    print(descripto['email'])
    print(rooms())
    print(' ')

@socketio.on('new_delivery')
def new_deli(*args):
    try:

        print(rooms())
        emit('add_delivery', to=rooms(), include_self=False)
    except Exception as e:
        print('Error: ',e)




    
    

    

@socketio.on_error()
def handle_error(error):
    print(f"Erro no Socket.IO: {error}") 
    return 'Error', 500
if __name__ == '__main__':
       socketio.run(app, port=8080)  # Use socketio.run instead of app.run
   