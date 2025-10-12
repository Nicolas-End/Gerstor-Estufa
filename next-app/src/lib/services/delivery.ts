import axios from "axios";
import {createApiWithAuth} from '@/lib/config/axiosConfig'; 
interface ApiResponse {
    'status': string,
    'message'?: string,

    // contar a quantidade de entregar para fazer
    'count'?: number,
    // utilizado para pegar dados de uma entrega especifica
    'deliveryDatas'?:string,
    // utilizado para pegar todas as entregas pendentes na pagina entrega
    'deliverys'?:string,
}

// Função para contar a quantidade de entregas que a empresa precisa fazer 
// ira aparecer na pagina do home

export const deliveryQuantity = async () => {
  try {
    const api = await createApiWithAuth()
    const response = await api.post('/deliverys/quantity');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// Adiciona uma nova entrega ao banco de dado

export const addNewDelivery = async(FormData:any, productValidate:any) => {
  try{
    const api = await createApiWithAuth()
    const data  = {'FormsData':FormData, 'ProductsValidate':productValidate}
    const response:any = await api.post('/deliverys/add-new',data)
    switch(response.status){
      case 200:
        return true
      case 400:
        return "Credencial Invalida"
      case 500:
        return "Erro Interno"
    }
  }catch(error){
    throw(error)
  }
}


export const editDelivery = async(FormsData:any) => {
  try{
    const api = await createApiWithAuth()
    const data = {'FormsData':FormsData}
    const response = await api.post('/deliverys/edit',data)
    switch(response.status){
      case 200:
        return true
      case 400:
        return "Credencial Invalida"
      default: 
        return "Erro Interno"
    }
    
  }catch (error){
    throw error
  }
}
// Essa Função serve para pegar os dados de uma entrega especifica
// Que o usuario selecionou
export const getEspecificDeliveryDatas = async(id:string) =>{
  try{
    const api = await createApiWithAuth()
    const data = {'id':id }
    const response = await api.post('/deliverys/get-especific',data)
    switch (response.status){
      case 200 :
        if (response.data.status === "ok"){
          return response.data
        }
        else{
          return "Entrega inexistente"
        }
      case 400:
        return "Credencial Invalida"
      case 500:
        return "Erro Interno"
    
    }
  }catch(error){
    throw(error)
  }
}
// Esta função ira pegar todas as entregas que a empresa precisa fazer
// na pargina de entregas

export const getDeliverysToDo = async () =>{
  try{
    const api = await createApiWithAuth()
    const response = await api.post('/deliverys/get-all')
    switch (response.status){
      case 200:
        return response.data.deliverys
      case 401:
        return "Credencial Invalida"
      case 500:
        return "Erro Interno"
    }
  }catch(error){
    throw(error)
  }
}

export const getDeliverysToHistory = async () =>{
  try{
    const api = await createApiWithAuth()
    const response = await api.post('/deliverys/get-all-to-history')
    switch (response.status){
      case 200:
        return response.data.deliverys
      case 401:
        return "Credencial Invalida"
      case 500:
        return "Erro Interno"
    }
  }catch(error){
    throw(error)
  }
}

export const deleteEspecificDelivery = async(delivery_id:string) =>{
  try{
    const api = await createApiWithAuth()
    const data = {'delivery_id':delivery_id}

    const response = await api.post('/deliverys/delete',data)
    switch (response.status){
      case 200: 
        return true
      case 400:
        return "Credencial Invalida"
      default:
        return "Erro Interno"

    }
  }catch(error){
    throw(error)
  }
}

export const editDeliveryStatus = async(delivery_id:string, delivery_status:string) =>{
  try{
    const api = await createApiWithAuth()
    const data = {'id':delivery_id,'status':delivery_status}

    const response = await api.post('/deliverys/edit-status',data)
    switch (response.status){
      case 204: 
        return true
      case 401:
        return "Credencial Invalida"
      case 409:
        return "Não Foi Possivel Editar Status"
      default:
        return "Erro Interno"

    }
  }catch(error){
    throw(error)
  }
}