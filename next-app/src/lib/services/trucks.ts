
import axios from "axios";
import {createApiWithAuth} from '@/lib/config/axiosConfig'

interface TruckData {
  'modelo': string;
  'placa': string;
  'chassi': string;
  'cor'?: string;
  'eixos'?: number;
  'mercosul'?: boolean;
}

interface ApiResponse {
  'status': string;
  'message'?: string;
  'trucks'?: TruckData[];
  'truck'?: TruckData;
}


export const getAllTrucks = async (): Promise<TruckData[] | string> => {
  try {
    const api = await createApiWithAuth()
    const response = await api.post('/get-trucks');
    if (response.status === 200 && response.data.trucks) {
      return response.data.trucks;
    } else {
      return response.data.message || 'Erro Desconhecido.';
    }

  } catch (error) {
    console.error('Erro ao buscar caminhões:', error);
    throw error;
  }
};


export const addNewTruck = async (formsDatas:any) =>{
  try{
    const api = await createApiWithAuth()
    const datas = {'FormsData':formsDatas}
    const response = await api.post('/add-new-truck',datas)

    switch(response.status){
      case 200:
        return true
      case 400:
        return "Credenciais Invalidas"
      case 409:
        return "Ja Cadastrado"
      default:
        return "Erro Interno"
    }
  }catch(error){
    throw error;
  }
}

export const getEspecificTruck = async (placa:string) =>{
  try{
    const api = await createApiWithAuth()
    const datas = {'placa':placa}
    const response = await api.post('/get-especific-truck',datas)
    
    switch(response.status){
      case 200:
        
        return response.data
      case 400:
        return "Credenciais invalidas"
      case 404:
        return "Caminhão não encontrado"
      default:
        return "Erro Interno"

    }
  }catch(error){
    throw error;
  }
}

export const deleteTruck = async (placa:string) => {
  try{
    const api = await createApiWithAuth()
    const datas = {'placa':placa}
    const response = await api.post('/delete_truck',datas)
    switch(response.status){
      case 200:
        return 'Caminhão Deletado'
      case 401:
        return "Credenciais invalidas"
      case 404:
        return "Caminhão não encontrado"
      default:
        return "Erro Interno"

    }
  }catch(error){
    throw error;
  }
}

