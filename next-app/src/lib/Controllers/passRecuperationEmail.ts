import axios from 'axios'
import { headers } from 'next/headers';

interface ApiResponse{
    'status':string,
    'message'?:string,

}

export default function sendEmailRecupeation(email:string,newPassword:string): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       

      axios.post<ApiResponse>(
        'https://gerenciador-empresarial-1cfr.vercel.app/forget-password',
        {
            email,
            newPassword
        }, 
       
      )
        .then(response => {
        
          resolve(response.data);
        })
        .catch(error => {
          resolve({ status: 'error', message: 'Erro na requisição' });
        });
    });
  }