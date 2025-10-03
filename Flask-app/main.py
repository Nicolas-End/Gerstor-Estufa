from flask import Flask
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from routes import Delivery,Clients,Functionaries,Trucks, StockProduts, User

load_dotenv()


def CreateApp():
    app = Flask(__name__)
    CORS(app)
    # Sistemas relacionados a Login, Cadastro e Recuperar login
    app.register_blueprint(User.user_bp, url_prefix='/user')
    
    app.register_blueprint(Delivery.delivery_bp,url_prefix="/deliverys")
    
    app.register_blueprint(Functionaries.functionary_bp,url_prefix="/functionary")
    
    app.register_blueprint(Clients.clients_bp,url_prefix="/clients")
    
    app.register_blueprint(Trucks.truck_bp,url_prefix='/trucks')
    
    app.register_blueprint(StockProduts.stock_products_bp, url_prefix='/products')
    
    
    return app
app = CreateApp()
if __name__ == '__main__':
<<<<<<< HEAD

    app.run()
=======
    CreateApp().run(host='0.0.0.0', port=5000)
>>>>>>> feat
