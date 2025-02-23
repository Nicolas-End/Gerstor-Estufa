
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import acess_acount from './acess_acount';



export function acess_data_user(email: string, id: string, password: string,router:AppRouterInstance): void {    



    acess_acount(email, id, password)
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
