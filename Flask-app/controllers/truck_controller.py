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
                            'cor': i['cor'],
                            'modelo': i['modelo'],
                            'eixos': i['eixos']
                        }
                    dict_truck.append(clients.copy())

                return True, dict_truck
            return True, []
        except Exception as e:
            print('Error:',e)
            return False , e
    
    def add_new_truck(self,company_email,chassi,placa,cor,modelo,eixos,mercosul=False):
        try:
            truck_exist = self.coll.find_one({'company_email':company_email,'placa':placa})
            print(truck_exist)
            if truck_exist:
                return False
            truck_datas = {'company_email':company_email,'chassi':chassi,'placa':placa,'cor':cor,'modelo':modelo,'eixos':eixos,'mercosul':mercosul}
            self.coll.insert_one(truck_datas)

            return True
        except Exception as e:
            print("Error: ",e)
            return e