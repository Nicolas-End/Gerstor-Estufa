"use client"; // Adicione isso se estiver usando hooks do React (useState, useEffect, etc.)

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import Link from "next/link";
import { registerNewCompany } from "@/lib/api";


const RegisterPage = () => {

  // Estados para os campos do formulário
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Estado para visibilidade da senha
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const router = useRouter();

  // Função para alternar a visibilidade da senha
  const PasswordVisible = () => {
    setIsVisible(!isVisible);
  };
  function MostrarAlerta(text: string) {
    toast(text, {
      style: {
        backgroundColor: "#2b192e",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      },
    });
  }
  // Função para lidar com o registro
  const  handleRegister = async () => {
    setIsLoading(true)
    if (password == "" || email == "" || nomeEmpresa == ""){
      MostrarAlerta('Preencha Todos os Campos')
      setIsLoading(false)
      return  
    }
    if (password !== confirmPassword) {
      MostrarAlerta("As senhas não coincidem!");
      setIsLoading(false)
      return;
    }

    const response = await registerNewCompany(email,password,nomeEmpresa)

    if (response == 'ok'){
      MostrarAlerta('Registrando o Novo Usuario')
      router.push("/login");
  }
    else if (response == 'Adm Already Exist'){
      MostrarAlerta('Esta Conta Já Existe')
      setIsLoading(false)
    }
    else {
      MostrarAlerta('Opss!! houve um pequeno erro')
      MostrarAlerta('não se preucupe, não é você sou eu !!')
      setIsLoading(false)

    }
    // Lógica de registro (pode ser uma chamada à API, por exemplo)
     // Redireciona para a página de login após o registro
  };

  return (
    <>
      <head>
        <title>Registro - Controle Verde</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
      
      </head>
      
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-200 px-4 space-y-4">

  {/* Logo + Título */}
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg">
      <img src="/Logo.png" alt="Logo" className="w-8 h-8 object-contain" />
    </div>
    <h1 className="text-3xl font-bold text-emerald-800 mb-1">Controle Verde</h1>
    <p className="text-emerald-600/80 text-sm">Sistema de gestão sustentável</p>
  </div>

  {/* Formulário de Registro */}
  <form onSubmit={handleRegister} className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-4">
  
      <label htmlFor="name" className="block text-sm font-medium text-emerald-700 mb-1">Nome da Empresa</label>
      <input
            value={nomeEmpresa}
            type="nome"
            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setNomeEmpresa(e.target.value)}
            
          />

          {/* Campo de Email */}
          <label className="text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input
            value={email}
            type="email"
            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          
          {/* Campo de Senha */}
          <label className="text-sm font-medium text-gray-700 mb-1">Senha:</label>
          <div className="relative mb-4">
            <input
              value={password}
              type={isVisible ? "text" : "password"}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#fff] hover:text-white"
              onClick={PasswordVisible}
            >
               {isVisible ? (
                  <i className="fa-regular fa-eye-slash"></i> // ícone de olho cortado
                ) : (
                  <i className="fa-regular fa-eye"></i> // ícone de olho
                )}
            </button>
          </div>

          {/* Campo de Confirmação de Senha */}
          <label className="text-sm font-medium text-gray-700 mb-1">Confirme a Senha:</label>
          <div className="relative mb-6">
            <input
              value={confirmPassword}
              type={isVisible ? "text" : "password"}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#fff] hover:text-white"
              onClick={PasswordVisible}
            >
              {isVisible ? (
                  <i className="fa-regular fa-eye-slash"></i> // ícone de olho 
                ) : (
                  <i className="fa-regular fa-eye"></i> // ícone de olho
                )}
            </button>
            <ToastContainer
                position="top-left"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
              />
          </div>

          {/* Botão de Registro */}
          <button
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors"
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Só um momento...</span>
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              ) : (
                "Registrar"
              )}
          </button>
           <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>
          
          {/* Link para a página de Login */}
          <Link
            href="/login"
            className="block w-full text-center font-medium border-2 border-solid bg-emerald-600 hover:bg-emerald-700 text-[#fff] rounded-md transition-colors py-3 shadow-lg mt-4 "
          >
            Já tem uma conta? Faça login
          </Link>
          </form>
        </div>
    </>
  );
};

export default RegisterPage;