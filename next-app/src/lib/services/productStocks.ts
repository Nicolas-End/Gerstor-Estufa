import { createApiWithAuth } from '@/lib/config/axiosConfig'

export const getStockProducts = async ()=>{
    try{
        const api = await createApiWithAuth()
        const response = await api.post('/products/get-all')

        switch (response.status){
            case 200:
              return response.data.products
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

export const addNewProduct = async( formsDatas:{ name: string; quantity: number; items: any } )=>{
  try{
    const api = await createApiWithAuth()
    const datas = {'productDatas':formsDatas}
    const response = await api.post('/products/add-new',datas)

    switch (response.status){
            case 200:
              return 'Criado com Sucesso'
            case 401:
              return "Credencial Invalida"
            case 409:
                return "Produto Ja Cadastrado"
            default:
              return "Erro Interno"
              
          }
  }catch(error){
    throw error
  }
}