from flask import Flask
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from routes.delivery_routes import delivery_bp

load_dotenv()


def CreateApp():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(delivery_bp,url_prefix="/deliverys")

    return app

if __name__ == '__main__':
    CreateApp().run(debug=True)
