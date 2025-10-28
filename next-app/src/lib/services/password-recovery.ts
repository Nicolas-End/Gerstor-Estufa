import axios from 'axios'
import {createApiWithAuth, createApiWithoutAuth} from "@/lib/config/axios-config"
interface ApiResponse {
  'status': string,
  'message'?: string,

}


export const sendEmailRecovery = async (email: string, newPassword: string) => {
  try {
    const api = await createApiWithoutAuth()
    const data = { 'email': email, 'newPassword': newPassword }
    const response = await api.post('/user/send-email-recuperation', data,{

      validateStatus: () => true
    })

    switch (response.status) {
      case 200:
        return "Enviado"
      case 401:
        return "Não cadastrado"
      default:
        return "Erro Interno"
    }
  } catch (error) {
    throw (error)
  }
}

export const changePassword= async (token:string) =>{
  try{
    const api = await createApiWithoutAuth()
    const data = {'token':token}

    const response = await api.post('/user/change-password',data,{

      validateStatus: () => true
    }
    )

    switch (response.status){
      case 200:
        return "Senha modificada"
      case 401:
        return "Token Invalido"
      default:
        return "Erro Interno"
    }
  }catch(error){
    throw(error)
  }
}