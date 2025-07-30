import axios from "axios";
import api from '@/lib/config/axiosConfig'

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

export function GetAllTrucks(): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
    const token = localStorage.getItem("token_from_user");

    axios
      .post<ApiResponse>(
        `${baseUrl}/get-trucks`,
        {},
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
