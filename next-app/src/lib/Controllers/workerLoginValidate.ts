import axios from 'axios';
/* Interface Serve para o formato de reposta da api*/
interface ApiResponse {
  status: string;
  message?: string;
  token?:string;
}

export default function validateAcount(
  /* pede as info do trabalhador 
  e retorna uma promisse pois pode demorar */
  email: string,
  id: string,
  password: string
): Promise<ApiResponse> {
  /* Na resposta da api ele "return" uma resposta chamada data */
  return new Promise<ApiResponse>((resolve) => {
    //faz um posta para a receber as informações da api

    axios.post<ApiResponse>('https://gerenciador-empresarial-1cfr.vercel.app/worker-login', {

      email,
      id,
      password,
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      resolve({ status: 'error', message: 'Erro na requisição' });
    });
  });
}
