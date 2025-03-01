
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import validateAcount from './User_controller/validate_worker';
import addNewAdmToDataBase from './User_controller/create_New_Adm';


export async function validateWorkerLogin(email: string, id: string, password: string,router:AppRouterInstance) {    


    // se a requisição no validate_worker der certo ele retorna 
    // cria alguns localStorage caso contratio da um 
    // fedback ao usuario
    try{
        const data = await validateAcount(email, id, password)
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
            console.log('ta vindo Aqui')
            alert('Usuario não encontrado')
        }
    }
    catch (error){
        return 'Erro'
    }

}


export async function registerNewAdm(email: string, password: string) {
    const adm_id = '1';
    try {
        // espera a resposta da Api e retorna como data
        const data = await addNewAdmToDataBase(email, adm_id, password);

        if (data.status === 'ok') {
            return 'ok';
        } else if (data.status === 'Adm Already Exist') {
            return "Adm Already Exist";
        } else {
            return "Algum Erro";
        }
    } catch (error) {
        console.log('Erro ao acessar a conta:', error);
        return "Erro na requisição";
    }
}
