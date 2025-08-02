'use server'
import { cookies } from "next/headers"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// Faz o controle das entregas da empresa
import {deliveryQuantity, editDelivery, deleteEspecificDelivery, getDeliverysToDo, addNewDelivery, getEspecificDeliveryDatas } from "@/lib/services/delivery";

import { AddNewFunctionary, functionariesQuantity, GetFunctionaries } from "@/lib/services/functionaries";
// Faz o processo e controle de senha do usuario
import { SendEmailRecovery, ChangePassword } from "@/lib/services/passwordRecovery";

// processos relacioandos ao cliente
import { AddClient, GetClients } from "@/lib/services/clients";

// Faz os preocessos de login, cadastro , acesso do usuario
import {  addNewCompany, login, validateUserAcess } from "@/lib/services/user";

import { getAllTrucks } from "../services/trucks";



export async function ValidateLogin(email:string, password:string) {
  try{
    const response = await login(email,password)

    if (typeof response === "string"){
      return "Internal Error"
    }else{
      switch(response?.status){
        case "ok":
          const user_token: any = response.token;
          const user_role: any = response.role
          const cookiesStore = await cookies()
          cookiesStore.set('token_from_user',user_token)
          cookiesStore.set('role_from_user',user_role)
          return 'ok'
        default:
          return "User not found";
      }
    }
  }catch(error){
    throw error
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
export async function RegisterNewCompnay(email:string,password:string,companyName:string){
  try{
    const response = await addNewCompany(email,"1",password,companyName)

    switch (response){
      case "created":
        return "ok"
      case "Already Exist":
        return "Adm Already Exist"
      default:
        return "error"
    }
  }catch(error){
    throw (error)
  }
}

// Essa função vai servir para validar se o usuario pode acessar o Home

export async function ValidateHomeAcess(router: AppRouterInstance) {
  try{
    const cookiesStore = await cookies()
    let token: string | undefined = cookiesStore.get('token_from_user')?.value
    if (token == undefined) {
      router.push('/login')
      return false
    }
    const response = await validateUserAcess();
    switch(response){
      case("ok"):
        return Promise.all([true])
      default:
        router.push('/login')
        return Promise.all([false])
    }
  }catch(error){
    throw(error)
  }
  
}
// Usado no Home
export async function countDeliveryQuantidy() {
  try {
    const data = await deliveryQuantity()
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

export async function FunctionariesQuantity(router: AppRouterInstance) {
  try{
    const response = await functionariesQuantity()
    if (typeof response === "string"){
      switch(response){
        case "Acesso Negado":
          router.push('/login')
          return 0
        default:
          return 0
      }
    }else{
      return response.functionaries_quantity
    }
  }catch(error){
    throw error
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

export async function GetEspecificDelivery(id:string) {
  try{
    const response = await getEspecificDeliveryDatas(id)
    
    return response
  }catch(error){
    console.log('Erro Entrega Especifica: ',error)
    throw(error)
  }
}

export async function AddNewDelivery(FormsData:any) {
  try{
    const response = await addNewDelivery(FormsData)
    console.log(response)
    return response
  }catch(error){
    console.log("Erro adicionar nova entrega: ",error)
    throw(error)
  }
  
}


export async function EditDelivery(FormsData:any){
  try{
    const response = await editDelivery(FormsData)

    return response
  }catch(error){
    console.log("Erro no Edit Delivery: ",error)
    throw error
  }
}

export async function GetDeliverys() {
    try{
      const response = await getDeliverysToDo();

      return response
    }catch(error){
      console.log("Erro Pegar Entregas: ",error)
      throw(error)
    }
}


export async function DeleteEspecificDelivery(delivery_id:string) {
    try{
        const response = await deleteEspecificDelivery(delivery_id)
        return response
    }catch(error){
      console.log('Erro ao Deletar Entrega: ',error)
      throw error
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

//====== CAMINHÕES ======
export async function GetTrucks(){
  try {
    const data = await getAllTrucks();
    console.log(data)
    if (typeof data === 'string') {
      switch (data) {
        case 'Authorization?':
          return 'Login'; // Usuário não autenticado
        case 'internalError':
        case 'Erro Desconhecido':
          return 'Erro interno'; // Problemas no servidor
        default:
          return 'Erro desconhecido'; // Para qualquer outro tipo
      }
    }

    // Se chegou aqui, é uma lista de caminhões
    return data;

  } catch (error) {
    console.error("Erro ao acessar a conta:", error);
    return "Erro na requisição";
  }
}