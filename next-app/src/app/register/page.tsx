"use client"; // Adicione isso se estiver usando hooks do React (useState, useEffect, etc.)

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import "./style-cell.css";
import Link from "next/link";
import { registerNewAdm } from "@/Components/Worker";

const RegisterPage = () => {

  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Estado para visibilidade da senha
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
    if (password == "" || email == ""){
      MostrarAlerta('Preencha Todos os Campos')
      return
    }
    if (password !== confirmPassword) {
      MostrarAlerta("As senhas não coincidem!");
      return;
    }

    const reponse = await registerNewAdm(email,password)

    if (reponse == 'ok'){
      MostrarAlerta('Registrando o Novo Usuario')
      router.push("/login");
  }
    // Lógica de registro (pode ser uma chamada à API, por exemplo)
     // Redireciona para a página de login após o registro
  };

  return (
    <>
      <head>
        <title>Registro - Today</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
      
      </head>
      <div className="flex h-screen bg-gradient-to-r from-[#fff] to-[#2b192e] items-center justify-center">
        
        <div className="w-full max-w-md bg-[#fff] text-[#2b192e] p-8 rounded-lg shadow-2xl">
          <div className="flex items-center mb-6">
            <img src="/Logo.png" alt="Logo" className="w-12 h-12 mr-3" />
            <h1 className="text-4xl font-bold fontDM">Today</h1>
          </div>
          <p className="text-sm mb-8 fontRobo">Crie sua conta</p>

          {/* Campo de Email */}
          <label className="text-sm mb-2 fontRobo">Email:</label>
          <input
            value={email}
            type="email"
            className="w-full mb-4 p-3 rounded bg-[#2b192e] text-[#fff] shadow-md"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Campo de Senha */}
          <label className="text-sm mb-2 fontRobo">Senha:</label>
          <div className="relative mb-4">
            <input
              value={password}
              type={isVisible ? "text" : "password"}
              className="w-full p-3 pr-10 rounded bg-[#2b192e] text-[#fff] shadow-md"
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
          <label className="text-sm mb-2 fontRobo">Confirme a Senha:</label>
          <div className="relative mb-6">
            <input
              value={confirmPassword}
              type={isVisible ? "text" : "password"}
              className="w-full p-3 pr-10 rounded bg-[#2b192e] text-[#fff] shadow-md"
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
            className="w-full fontDM border-2 border-solid border-[#2b192e] bg-[#fff] text-[#2b192e] rounded-lg py-3 shadow-lg transition transform hover:bg-[#2b192e] hover:text-[#fff] hover:-translate-y-1"
            onClick={handleRegister}
          >
            Registrar
          </button>

          {/* Link para a página de Login */}
          <Link
            href="/login"
            className="block w-full text-center fontDM border-2 border-solid border-[#2b192e] bg-[#2b192e] text-[#fff] rounded-lg py-3 shadow-lg mt-4 transition transform hover:bg-[#2b192e] hover:text-[#fff] hover:-translate-y-1"
          >
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;