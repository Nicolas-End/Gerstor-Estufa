import axios from 'axios'
import { headers } from 'next/headers';

interface ApiResponse{
    'status':string,
    'message'?:string,

}

export default function validateHome(): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      const token = localStorage.getItem('token_from_user')
      axios.post<ApiResponse>(
        'http://127.0.0.1:5000/home-acess',
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
          resolve({ status: 'error', message: 'Erro na requisição' });
        });
    });
  }