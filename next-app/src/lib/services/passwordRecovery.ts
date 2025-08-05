import axios from 'axios'

interface ApiResponse {
  'status': string,
  'message'?: string,

}


export const sendEmailRecovery = async (email: string, newPassword: string) => {
  try {
    const data = { 'email': email, 'newPassword': newPassword }
    const response = await axios.post('http://127.0.0.1:5000/send-email-recuperation', data,{
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
    const data = {'token':token}
    const response = await axios.post('http://127.0.0.1:5000/change-password',data,{
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