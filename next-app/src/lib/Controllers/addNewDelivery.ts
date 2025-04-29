import axios from 'axios'


interface ApiResponse{
    status:string,
    message?:string
}

export default function AddNewDelivery( 
    FormsData:any
): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) =>{
        const token = localStorage.getItem('token_from_user')
        axios.post<ApiResponse>('http://127.0.0.1:5000/add-new-delivery', {
            FormsData
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