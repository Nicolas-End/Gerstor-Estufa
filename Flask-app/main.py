from flask import Flask
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from routes import clients_routes,deliverys_routes,functionaries_routes,stocks_products_routes,trucks_routes,user_routes

load_dotenv()


def CreateApp():
    app = Flask(__name__)
    CORS(app)
    # Sistemas relacionados a Login, Cadastro e Recuperar login
    app.register_blueprint(user_routes.user_bp, url_prefix='/user')
    
    app.register_blueprint(deliverys_routes.delivery_bp,url_prefix="/deliverys")
    
    app.register_blueprint(functionaries_routes.functionary_bp,url_prefix="/functionary")
    
    app.register_blueprint(clients_routes.clients_bp,url_prefix="/clients")
    
    app.register_blueprint(trucks_routes.truck_bp,url_prefix='/trucks')
    
    app.register_blueprint(stocks_products_routes.stock_products_bp, url_prefix='/products')
    
    
    return app

if __name__ == '__main__':
    CreateApp().run(host='0.0.0.0', port=5000)