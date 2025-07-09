import axios from "axios";

interface ApiResponse {
    'status': string,
    'message'?: string,

    // contar a quantidade de entregar para fazer
    'count'?: number,
    // utilizado para pegar dados de uma entrega especifica
    'deliveryDatas'?:string,
    // utilizado para pegar todas as entregas pendentes na pagina entrega
    'deliverys'?:string,
}

// Função para contar a quantidade de entregas que a empresa precisa fazer 
// ira aparecer na pagina do home
export function DeliveryQuantidy(): Promise<ApiResponse> {
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

// Adiciona uma nova entrega ao banco de dados
export function AddNewDelivery (FormsData:any): Promise<ApiResponse> {
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

export function EditDelivery (FormsData:any): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) =>{
    const token = localStorage.getItem('token_from_user')
    axios.post<ApiResponse>('http://127.0.0.1:5000/edit-delivery', {
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
// Essa Função serve para pegar os dados de uma entrega especifica
// Que o usuario selecionou
export function GetEspecificDeliveryDatas(id:string): Promise<ApiResponse> {
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

// Esta função ira pegar todas as entregas que a empresa precisa fazer
// na pargina de entregas
export function GetDeliverysToDo(): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
       
      const token = localStorage.getItem('token_from_user')
      axios.post<ApiResponse>(
        'http://127.0.0.1:5000/get-deliverys',
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