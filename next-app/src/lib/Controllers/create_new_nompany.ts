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

        axios.post<ApiResponse>('http://127.0.0.1:5000/add-new-company', {

            email,
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