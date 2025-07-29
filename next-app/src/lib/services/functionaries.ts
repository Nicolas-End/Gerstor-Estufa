import axios from 'axios'

interface ApiResponse{
    'status':string,
    'message'?:string,
    functionaries?:string,
    functionaries_quantity?:number

}

export function GetFunctionaries(): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      const token = localStorage.getItem('token_from_user')
      axios.post<ApiResponse>(
        'http://127.0.0.1:5000/get-functionaries',
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

  export function GetFunctionariesQuantity(): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      const token = localStorage.getItem('token_from_user')
      axios.post<ApiResponse>(
        'http://127.0.0.1:5000/get-functionaries-quantity',
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

    export function AddNewFunctionary(name:string,email:string,password:string,role:string): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      const token = localStorage.getItem('token_from_user')
      axios.post<ApiResponse>(
        'http://127.0.0.1:5000/add-new-functionary',
        {"name":name,
          "email":email,
          "password":password,
          "role":role
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
