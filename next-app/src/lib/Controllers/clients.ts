import axios from "axios";

interface ApiResponse {
    'status': string,
    'message'?: string,
    'clients'?:any[]
}

export function GetClients (): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) =>{
    const token = localStorage.getItem('token_from_user')
    axios.post<ApiResponse>('http://127.0.0.1:5000/get-clients', 
        {},
        {
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