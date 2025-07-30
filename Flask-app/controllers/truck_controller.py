from config.config import DataBase
from dotenv import load_dotenv
import uuid
import os


load_dotenv()

class TruckController:
    def __init__(self):
        self.client_collection = os.getenv('TRUCK_COLLECTION')
        self.db = DataBase().database
        self.coll = self.db[self.client_collection]

    def get_trucks(self,company_email):
        try:
            has_truck = list(self.coll.find({'company_email': company_email}))
            if has_truck:
                dict_truck = []
                for i in has_truck:
                    clients= {
                            'chassi': i['chassi'],
                            'placa': i['placa'],
                            'porte': i['porte'],
                            'modelo': i['modelo'],
                            'eixos': i['eixos']
                        }
                    dict_truck.append(clients.copy())

                return True, dict_truck
            return True, []
        except Exception as e:
            print('Error:',e)
            return False , e