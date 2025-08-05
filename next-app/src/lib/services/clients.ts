import axios from "axios";
import {createApiWithAuth} from '@/lib/config/axiosConfig'

interface ApiResponse {
    'status': string,
    'message'?: string,
    'clients'?:any[]
}


export const getClients = async() =>{
  try{
    const api = await createApiWithAuth()
    const response = await api.post('/get-clients')

    switch(response.status){
      case 200:
        return response.data.clients
      case 400:
        return "Credencial Invalida"
      default:

        return "Erro Interno"

    }
  }catch(error){
    throw(error)
  }
}


export const addClient = async (name:string,address:{[key:string]:string|number}, document: {[key:string]:string}) =>{
  try{
    const api = await createApiWithAuth()
    const data = {"name":name,"address":address,"document":document}
    const response = await api.post('/add-new-client',data)
    
    switch (response.status){
      case 200:
        return true
      case 400:
        return "Credencial Invalida"
      case 409:
        return "Cliente ja Existe"
      default:
        return "Erro Interno"
    }
  }catch(error){
    throw error
  }
}