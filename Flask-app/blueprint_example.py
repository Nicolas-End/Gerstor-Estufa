from flask import Flask
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from routes import Delivery,Clients,Functionaries,Trucks, StockProduts

load_dotenv()


def CreateApp():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(Delivery.delivery_bp,url_prefix="/deliverys")
    app.register_blueprint(Functionaries.functionary_bp,url_prefix="/functionary")
    app.register_blueprint(Clients.clients_bp,url_prefix="/clients")
    app.register_blueprint(Trucks.truck_bp,url_prefix='/trucks')
    app.register_blueprint(StockProduts.stock_products_bp, url_prefix='/products')
    return app

if __name__ == '__main__':
    CreateApp().run(debug=True)
