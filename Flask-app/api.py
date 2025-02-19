from flask import Flaks,request,jsonify
from flask_cors import CORS
from dotenv import load_dotenv

app = Flaks(__name__)
CORS(app,origins="*")

app.route('/user-validate', methods=["POST"])
def user_validade():
    return False