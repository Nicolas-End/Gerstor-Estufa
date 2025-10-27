import axios from "axios";
import {createApiWithAuth, createApiWithoutAuth} from "@/lib/config/axios-config"
interface ApiResponse {
  status: string;
  message?: string;
  token?:string;
  role?:string
}

// Verifica se o usuario tem permissão para acessar o site
// utiliza em todas as paginas menos no login e etc
export const validateUserAcess = async() =>{
  try{
    let api = await createApiWithAuth()
    const response = await api.post('/user/home-acess')

    if(response.status === 200 && response.data){
      return "ok"
    }else if(response.status === 401){
      return "Negado"
    }else {
      return "Erro Interno"
    }

  }catch(error){
    throw error
  }
}
// server para adicionar uma nova empresa ao banco de dados
// utilizado no register page
export const addNewCompany = async (email:string,id:string,password:string,companyName:string) =>{
  try{
    const api = await createApiWithoutAuth()
    let datas = {email,id,password,companyName}
    const response = await api.post('/user/add-new-company',datas,{
      validateStatus: () => true
    })

    if (response.status === 200 && response.data){
      return "created"
    }else if(response.status === 409){
      return "Already Exist"
    }else{
      return "internal Error"
    }
  }catch(error){
    throw(error)
  }
}
// server para logar o usuario na pagina de login
// utilizado na pagina de login

export const login = async (email:string,password:string) =>{
  try{
      const api = await createApiWithoutAuth()
      let data = {email, password}
      const response = await api.post('/user/login',data)

      if (response.status !== 500 && response.data){
        return response.data
      }
      else{
        return response.data.message
      }
  }catch(error){
    console.error('Erro no Login:', error);
    throw error;
  }
}
  