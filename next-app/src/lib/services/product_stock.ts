import { createApiWithAuth } from '@/lib/config/axiosConfig'

export const getStockProducts = async ()=>{
    try{
        const api = await createApiWithAuth()
        const response = await api.post('/products/get-stocks-products')

        switch (response.status){
            case 200:
              return response.data.products_dict
            case 401:
              return "Credencial Invalida"
            case 204:
                return "Nenhum Pedido"
            default:
              return "Erro Interno"
              
          }
    }catch(error){
        throw error
    }
}