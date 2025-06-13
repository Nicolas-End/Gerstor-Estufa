import axios from 'axios'
import { headers } from 'next/headers';

interface ApiResponse{
    'status':string,
    'message'?:string,

}

export default function sendEmailRecupeation(email:string,newPassword:string): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       

      axios.post<ApiResponse>(
        'http://127.0.0.1:5000/send-email-recuperation',
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