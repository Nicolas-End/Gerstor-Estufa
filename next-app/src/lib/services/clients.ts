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
    const response = await api.post('/clients/get-all')

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
    const response = await api.post('/clients/add-new',data)
    
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


export const getEspecificClient = async(id:string) =>{
  try{

    const api = await createApiWithAuth()
    const data = {'id':id}
    
    const response = await api.post('/clients/get-especific-datas',data)

    switch(response.status){
      case 200:
        return response.data.clientInfos
      case 400:
        return "Credenciais Invalidas"
      case 404:
        return "Cliente Não Existe"
      default :
        return "Erro Interno"
    }
  }catch(error){
    throw error
  }
}

export const deleteClient = async(id:string,type:string) =>{
  try{
    const api = await createApiWithAuth()
    const data = {'id':id,'type':type}

    const response = await api.post('/clients/delete',data)

    switch(response.status){
      case 200:
        return "Cliente Excluido"
      case 401:
        return "Credenciais Invalidas"
      case 404:
        return "Erro Desconhecido"
      default:
        return "Erro Interno"
    }
  }catch(error){
    throw error
  }
}