import axios from 'axios'
import { createApiWithAuth } from '@/lib/config/axiosConfig'
import { AwardIcon } from 'lucide-react';
interface ApiResponse{
    'status':string,
    'message'?:string,
    functionaries?:string,
    functionaries_quantity?:number

}


export const getFunctionaries = async() =>{
  try{
    const api = await createApiWithAuth();
    const response = await api.post('/get-functionaries')

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
      const response = await api.post('/get-functionaries-quantity')

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

    const response = await api.post('/add-new-functionary',data)

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
export const getEspecificFunctionary = async(id:string) => {
  try{
    const api = await createApiWithAuth()
    const data = {'email':id}

    const response = await api.post('/get-especific-functionary',data)  
  

    switch(response.status){
      case 200:
        return response.data.functionary
      case 409:
        return "Funcionario Não Cadastrado"
      case 400:
        return "Credenciais Invalidas"
      default:
        return "Erro Interno"
    }
  }catch(error){
    throw (error)
  }
}