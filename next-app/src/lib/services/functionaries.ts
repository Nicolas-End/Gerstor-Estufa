import axios from 'axios'
import { createApiWithAuth } from '@/lib/config/axiosConfig'
interface ApiResponse{
    'status':string,
    'message'?:string,
    functionaries?:string,
    functionaries_quantity?:number

}


export const getFunctionaries = async() =>{
  try{
    const api = await createApiWithAuth();
    const response = await api.post<apiResponse>('/get-functionaries')

    switch (response.status){
      case 200:
        return response.data.functionaries
      case 400:
        return "Credencial Invalida"
      default:
        return "Erro Interno"
        
    }
  }catch(error){
    throw error
  }
}
  export const functionariesQuantity = async() =>{
    try{
      const api = await createApiWithAuth()
      const response = await api.post<ApiResponse>('/get-functionaries-quantity')

      if (response.status > 300){
        switch (response.status){
          case 400:
            return "Acesso negado"
          case 500:
            return "Erro interno"
        }
      }
      else{
        return response.data
      }
    }catch(error){
      throw error
    }
  }

export const addNewFunctionary = async(name:string,email:string,password:string,role:string) =>{
  try{
    const api = await createApiWithAuth()
    const data = {"name":name,"email":email,"password":password,"role":role}

    const response = await api.post<ApiResponse>('/add-new-functionary')

    switch(response.status){
      case 200:
        return true
      case 409:
        return 'Já Existe'
      case 401:
        return "Credencial Invalida"
      default:
        return "Erro Interno"
    }
  }catch(error){
    throw (error)
  }
}