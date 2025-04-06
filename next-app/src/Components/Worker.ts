
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import validateAcount from "./User_controller/worker-login-validate";
import addNewAdmToDataBase from "./User_controller/create_New_Adm";
import validateHome from "./User_controller/home_acess";
import Router from "next/router";


export async function validateWorkerLogin(
  email: string,
  id: string,
  password: string,
  router: AppRouterInstance
) {
  // se a requisição no validate_worker der certo ele retorna
  // cria alguns localStorage caso contratio da um
  // fedback ao usuario
  try {
    const data = await validateAcount(email, id, password);
    if (data.status === "ok") {
      // Armazenando um token que tem os dados do usuario  no localStorage
      const user_token:string = data.token;
      localStorage.setItem("token_from_user", user_token);

      router.push("/home");
    } else if (data.status === "Wrongpassword") {
      return "wrong Pass";
    } else {
      return "User not found";
    }
  } catch (error) {
    return "Erro";
  }
}

export async function registerNewAdm(email: string, password: string) {
  const adm_id = "1";
  try {
    // espera a resposta da Api e retorna como data
    const data = await addNewAdmToDataBase(email, adm_id, password);

    if (data.status === "ok") {
      return "ok";
    } else if (data.status === "Adm Already Exist") {
      return "Adm Already Exist";
    } else {
      return "error";
    }
  } catch (error) {
    console.log("Erro ao acessar a conta:", error);
    return "Erro na requisição";
  }
}

// Essa função vai servir para validar se o usuario pode acessar o Home
export async function validateHomeAcess(router: AppRouterInstance){
  try{
    let token:string|null = localStorage.getItem('token_from_user')
    if (token == null){
      router.push('/login')
      return false
    }
    
    const data = await validateHome()
    if (data.status === "error"){
      router.push('/login')
      return false
    }
    else{
      return true
    }
  }
  catch(error){
    console.log('Error: ',error)
  }
}