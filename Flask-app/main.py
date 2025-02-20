from flask import Flask,request,jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.worker_controller import Worker_controller

app = Flask(__name__)
CORS(app,origins="*")

app.route('/user-validate', methods=["POST"])
def user_validade():
    return False


app.route('/add-worker',methods=['POST'])
def create_new_worker():
    try:
        reponse = request.get_json
    
        returnApi, responseApi = Worker_controller().add_new_Worker(reponse['name'],reponse['id'],reponse['role'],reponse['email'],reponse['password'])
    
        if returnApi:
            return jsonify({'status':'ok'}),201
        return jsonify({'status':responseApi}),500
    
    except Exception as e:
        return jsonify({'status':e}),500
    
    
if __name__ == '__main__':
    app.run()