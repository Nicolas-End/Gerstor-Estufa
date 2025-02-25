
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import validateAcount from './Worker_Controller/validate_worker';



export function validateWorkerLogin(email: string, id: string, password: string,router:AppRouterInstance): void {    


    // se a requisição no validate_worker der certo ele retorna 
    // cria alguns localStorage caso contratio da um 
    // fedback ao usuario
    validateAcount(email, id, password)
        .then(data => {
        
        if (data.status === 'ok') {
            console.log('Login bem-sucedido');
        // Armazenando os dados no localStorage
            localStorage.setItem('email', email);
            localStorage.setItem('id', id);
            localStorage.setItem('userRemember', 'true');

            router.push('/home')

        } else if (data.status === 'Wrongpassword'){
            console.log('Senha Errada');
            alert('A senha está incorreta')
        }
        else{
            alert('Usuario não encontrado')
        }
    })
    .catch(error => {
        console.log('Erro ao acessar a conta:', error);
    });
}
