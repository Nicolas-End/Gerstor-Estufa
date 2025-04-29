import axios from 'axios'
import { headers } from 'next/headers';
import { resolve } from 'path'

interface ApiResponse{
    status:string,
    message?:string
}

export default function addNewCompanyToDataBase( 
    email: string,
    id:string,
    password: string,
    companyName:string
): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) =>{

        axios.post<ApiResponse>('https://gerenciador-empresarial-1cfr.vercel.app/add-new-company', {

            id,
            password,
            companyName
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            resolve({ status: 'error', message: 'Erro na requisição' });
          });
    })

}