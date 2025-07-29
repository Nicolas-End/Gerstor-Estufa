{/*Fiz com base no seu delivery ai dps voce arruma certinho negão, falta negócio de URL e tals(eu acho), ia mandar no gpt soq vou deixar com vc msm*/}
import axios from "axios";

interface TruckData {
  modelo: string;
  placa: string;
  chassi?: string;
  cor?: string;
  eixos?: number;
  mercosul?: boolean;
}

interface ApiResponse {
  status: string;
  message?: string;
  trucks?: TruckData[];
  truck?: TruckData;
}

const baseUrl = "http://127.0.0.1:5000";

export function AddNewTruck(data: TruckData): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
    const token = localStorage.getItem("token_from_user");

    axios
      .post<ApiResponse>(
        `${baseUrl}/add-new-truck`,
        data,
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
