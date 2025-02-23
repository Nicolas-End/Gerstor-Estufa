import axios from 'axios';

<<<<<<< HEAD
interface ApiResponse {
  status: string;
  message?: string;
}

export default function acess_acount(
  email: string,
  id: string,
  password: string
): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
    axios.post<ApiResponse>('http://127.0.0.1:5000/worker-validate', {
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
=======

interface ApiResponse {
  status: string;
  message?: string; 
}

export default function acess_acount(email: string, id: string, password: string): Promise<ApiResponse> {

  return axios.post('http://127.0.0.1:5000/worker-validate', {
    email: email,
    id: id,
    password: password
  })
  .then(response => {
    return response.data as ApiResponse;
  })
  .catch(error => {

    return { status: 'error', message: 'Erro na requisição' };
>>>>>>> 3e2f08f6d248d2807f033a8ad77fdbf711812335
  });
}
