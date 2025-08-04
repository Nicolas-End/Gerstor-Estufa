
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

const baseUrl = "http://127.0.0.1:5000";

export const getAllTrucks = async (): Promise<TruckData[] | string> => {
  try {
    const api = await createApiWithAuth()
    const response = await api.post<ApiResponse>('/get-trucks');
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
    const response = await api.post<ApiResponse>('/add-new-truck',datas)

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
export function GetSpecificTruck(id: string): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
    const token = localStorage.getItem("token_from_user");

    axios
      .post<ApiResponse>(
        `${baseUrl}/get-truck`,
        { id },
        {
          headers: {
            Authorization: token || "",
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        resolve({ status: "error" });
      });
  });
}

export function DeleteTruck(id: string): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
    const token = localStorage.getItem("token_from_user");

    axios
      .post<ApiResponse>(
        `${baseUrl}/delete-truck`,
        { id },
        {
          headers: {
            Authorization: token || "",
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        resolve({ status: "error" });
      });
  });
}
