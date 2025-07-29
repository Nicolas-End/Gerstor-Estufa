
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// Faz o controle das entregas da empresa
import { DeliveryQuantidy, AddNewDelivery, GetEspecificDeliveryDatas, GetDeliverysToDo, EditDelivery, DeleteEspecificDelivery } from "@/lib/services/delivery";

import { AddNewFunctionary, GetFunctionaries, GetFunctionariesQuantity } from "@/lib/services/functionaries";
// Faz o processo e controle de senha do usuario
import { SendEmailRecovery, ChangePassword } from "@/lib/services/passwordRecovery";

// processos relacioandos ao cliente
import { AddClient, GetClients } from "@/lib/services/clients";

// Faz os preocessos de login, cadastro , acesso do usuario
import { ValidadeUserAcess, AddNewCompany, UserLoginAcess } from "@/lib/services/user";
import { StringDecoder } from "string_decoder";
export async function validateWorkerLogin(
  email: string,
  password: string,
) {
  // se a requisição no validate_worker der certo ele retorna
  // cria alguns localStorage caso contratio da um
  // fedback ao usuario
  try {
    const data = await UserLoginAcess(email, password);
    if (data.status === "ok") {
      // Armazenando um token que tem os dados do usuario  no localStorage
      const user_token: any = data.token;
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

export async function validateTokenUser(token: string) {
  try {
    // envia para o back end para mudar a senha do usuario se for valido o token
    const change_pass = await ChangePassword(token);
    return change_pass.status
  }
  catch (error) {
    console.log("Erro ao iniciar dashboard:", error);
  }

}

export async function RecuperationEmail(email: string, newPassword: string) {
  try {
    // espera a resposta da Api e retorna como data
    const data = await SendEmailRecovery(email, newPassword);

    return data.status
  } catch (error) {

    return "Erro na requisição";
  }
}
export async function registerNewCompany(email: string, password: string, companyName: string) {
  const company_id = "1";
  try {
    // espera a resposta da Api e retorna como data
    const data = await AddNewCompany(email, company_id, password, companyName);

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
export async function validateHomeAcess(router: AppRouterInstance) {
  try {
    let token: string | null = localStorage.getItem('token_from_user')
    if (token == null) {
      router.push('/login')
      return false
    }

    const data = await ValidadeUserAcess()

    if (data.status === "error") {
      router.push('/login')
      return Promise.all([false])
    }
    else {

      return Promise.all([true])
    }
  }
  catch (error) {
    console.log('Error: ', error)
  }
}
// Usado no Home
export async function countDeliveryQuantidy() {
  try {
    const data = await DeliveryQuantidy()
    if (data.status === 'ok') {
      return data.count
    }
    else {
      return 0
    }
  }
  catch (error) {
    console.log('Error', error)
    return 'Error'
  }
}

//======= FUNCIONARIOS ========
export async function getFunctionaries() {
  try {
    const data = await GetFunctionaries();

    if (data.status === "ok") {
      return data.functionaries;
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
export async function funtionariesQuantity() {
  try {
    const data = await GetFunctionariesQuantity()
    if (data.status === 'ok') {
      return data.functionaries_quantity
    }
    else {
      return 0
    }
  }
  catch (error) {
    console.log('Error', error)
    return 'Error'
  }
}

export async function addNewFunctionary(name: string, email: string, password: string, role: string) {
  try {
    const data = await AddNewFunctionary(name, email, password, role)
    return data.status

  }
  catch (error) {
    console.log('Error', error)
    return 'Error'
  }

}

//========= ENTREGAS =========
export async function getEscificDelivery(id: string) {
  try {
    const data = await GetEspecificDeliveryDatas(id);

    if (data.status === "ok") {

      return data;
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

export async function addNewItemDelivery(FormsData: any) {
  try {

    const data = await AddNewDelivery(FormsData)

    if (data.status === "ok") {

      return 'ok'
    }
    else {
      return 'error'
    }
  } catch (error) {
    console.log("Error ao acessar a conta: ", error);
    return "Erro na requisição";
  }
}

export async function editDelivery(FormsData: any) {
  try {

    const data = await EditDelivery(FormsData)

    if (data.status === "ok") {

      return 'ok'
    }
    else {
      return 'error'
    }
  } catch (error) {
    console.log("Error ao acessar a conta: ", error);
    return "Erro na requisição";
  }
}
export async function getDeliverys() {
  try {
    const data = await GetDeliverysToDo();

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

export async function deleteEspecificDelivery(delivery_id: string) {
  try {

    const data = await DeleteEspecificDelivery(delivery_id)

    if (data.status === "ok") {

      return true
    }
    else {
      return false
    }
  } catch (error) {
    console.log("Error ao acessar a conta: ", error);
    return "Erro na requisição";
  }
}

// ======= CAMINHÕES ===========
export async function getTrucks() {
  try {
    const res = await fetch("/api/trucks");
    return await res.json();
  } catch {
    return [];
  }
}

export async function addNewTruck(data: {
  modelo: string;
  placa: string;
  chassi?: string;
  cor?: string;
  eixos?: string;
  mercosul?: boolean;
}) {
  try {
    const res = await fetch("/api/trucks", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}

//======= CLIENTES ==========

export async function GetAllClients() {
  try {

    const data = await GetClients()
    console.log(data)
    if (data.status === "ok") {
      
      return data.clients
    }
    else {
      return 'nothing'
    }
  } catch (error) {
    console.log("Error ao acessar a conta: ", error);
    return "Erro na requisição";
  }
}

export async function AddNewClient(name:string, address: {[key:string]:string|number}, document: {[key:string]:string}) {
  try {

    const data = await AddClient(name,address,document)
    console.log(data)
    if (data.status === "ok") {
      
      return "Cliente Cadastrado com sucesso"
    }
    else if(data.status === "Exist"){
      return "Cliente já Cadastrado no sistema"
    }
    else {
      return 'Houve um erro no sistema'
    }
  } catch (error) {
    console.log("Error ao acessar a conta: ", error);
    return "Erro na requisição";
  }
}