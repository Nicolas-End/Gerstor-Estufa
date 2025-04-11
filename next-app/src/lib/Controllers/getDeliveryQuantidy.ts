import axios from 'axios'
import { headers } from 'next/headers';
import { resolve } from 'path'

interface ApiResponse{
    status:string,
    count?:number
}

export default function CountDeliverys( 

): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) =>{
        const token = localStorage.getItem('token_from_user')
        axios.post<ApiResponse>('http://127.0.0.1:5000/count-deliverys', {
            
          },{
            headers:{
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
    })

}