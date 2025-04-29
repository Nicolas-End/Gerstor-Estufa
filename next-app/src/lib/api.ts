
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import validateAcount from "./Controllers/workerLoginValidate";
import addNewCompanyToDataBase from "./Controllers/createNewCompany";
import validateHome from "./Controllers/homeAcess";
import CountDeliverys from "./Controllers/getDeliveryQuantidy"
import getDeliverysToDo from "./Controllers/getDeliverysToDo";
import getDelivery from "./Controllers/getEspecificDelivery";
import AddNewDelivery from "./Controllers/addNewDelivery";
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
      const user_token:any = data.token;
      localStorage.setItem("token_from_user", user_token);  
      return 'ok';
    } else if (data.status === "Wrongpassword") {
      return "wrong Pass";
    } else {
      return "User not found";
    }
  } catch (error) {
    return "Erro";
  }
}

export async function registerNewCompany(email: string, password: string,companyName:string) {
  const company_id = "1";
  try {
    // espera a resposta da Api e retorna como data
    const data = await addNewCompanyToDataBase(email, company_id, password,companyName);

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
      return Promise.all([false,0])
    }
    else{
      return Promise.all([true])
    }
  }
  catch(error){
    console.log('Error: ',error)
  }
}
// Usado no Home
export async function countDeliveryQuantidy(){
  try{
    const data = await CountDeliverys()
    if (data.status === 'ok'){
      return data.count
    }
    else{
      return 0
    }
  }
  catch(error){
    console.log('Error',error)
    return 'Error'
  }
}

export async function getDeliverys(){
  try{
    const data = await getDeliverysToDo();

    if (data.status === "ok") {
      return data.deliverys;
    } else if (data.status === "invalid") {
      return "invalid";
    } else {
      return "error";
    }
  } catch (error) {
    console.log("Erro ao acessar a conta:", error);
    return "Erro na requisição";
  }
}

export async function getEscificDelivery (id:string){
  try{
    const data = await getDelivery(id);

    if (data.status === "ok") {
      return data.deliveryDatas;
    } else if (data.status === "invalid") {
      return "invalid";
    } else {
      return "error";
    }
  } catch (error) {
    console.log("Erro ao acessar a conta: ", error);
    return "Erro na requisição";
  }
}

export async function addNewItemDelivery (FormsData:any){
  try{

    const data = await AddNewDelivery(FormsData)

    if (data.status === "ok"){

      return 'ok'
    }
    else{
      return 'error'
    }
  } catch (error){
    console.log("Error ao acessar a conta: ",error);
    return "Erro na requisição";
  }
}