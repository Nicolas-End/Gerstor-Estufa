import axios from 'axios'
import { headers } from 'next/headers';

interface ApiResponse{
    'status':string,
    'deliverys'?:string,

}

export default function getDeliverysToDo(): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      const token = localStorage.getItem('token_from_user')
      axios.post<ApiResponse>(
        'https://gerenciador-empresarial-1cfr.vercel.app/get-deliverys-products',
        {}, // corpo da requisição POST (vazio nesse caso)
        {
          headers: {
            'Authorization':  token || ''
          }
        }
      )
        .then(response => {
        
          resolve(response.data);
        })
        .catch(error => {
          resolve({ status: 'error'});
        });
    });
  }