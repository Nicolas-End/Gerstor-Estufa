import axios from 'axios'
import { headers } from 'next/headers';

interface ApiResponse{
    'status':string,
    'deliveryDatas'?:string,

}

export default function getDelivery(id:string): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      const token = localStorage.getItem('token_from_user')
      axios.post<ApiResponse>(
        'http://127.0.0.1:5000/get-especific-delivery',
        {   
            'id':id
        }, // corpo da requisição POST 
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