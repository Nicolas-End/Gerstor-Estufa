import axios from 'axios';


interface ApiResponse {
  status: string;
  message?: string; 
}

export default function acess_acount(email: string, id: string, password: string): Promise<ApiResponse> {

  return axios.post('https://gerenciador-empresarial-1cfr.vercel.app/worker-validate', {
    email: email,
    id: id,
    password: password
  })
  .then(response => {
    return response.data as ApiResponse;
  })
  .catch(error => {

    return { status: 'error', message: 'Erro na requisição' };
  });
}
