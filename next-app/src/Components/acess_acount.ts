import axios from 'axios';

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
  });
}
