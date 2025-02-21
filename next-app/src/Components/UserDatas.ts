import { useRouter } from 'next/router';
import acess_acount from './acess_acount';

export function acess_data_user(email: string, id: string, password: string): void {    
  const router = useRouter();

  acess_acount(email, id, password)
    .then(data => {
      if (data.status === 'ok') {
        console.log('Login bem-sucedido');
        // Armazenando os dados no localStorage
        localStorage.setItem('email', email);
        localStorage.setItem('id', id);
        localStorage.setItem('userRemember', 'true');
        

        // Redirecionando para a página inicial após login
        
        router.push('/home');
      } else {
        console.log('Falha ao acessar a conta:', data.message);
      }
    })
    .catch(error => {
      console.log('Erro ao acessar a conta:', error);
    });
}
