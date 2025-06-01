import axios from 'axios'
import { headers } from 'next/headers';

interface ApiResponse{
    'status':string,
    'message'?:string,

}

export default function changePassword(token:string): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      axios.post<ApiResponse>(
        'https://gerenciador-empresarial-1cfr.vercel.app/change-password',
        { 
            token
        }, // corpo da requisição POST (vazio nesse caso)

      )
        .then(response => {
        
          resolve(response.data);
        })
        .catch(error => {
          resolve({ status: 'error', message: 'Erro na requisição' });
        });
    });
  }