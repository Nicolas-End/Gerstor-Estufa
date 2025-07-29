"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { RecuperationEmail } from "@/lib/ts/api";
const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function ShowAlert(text: string) {
    toast(text, {
      style: {
        backgroundColor: "#fff",
        color: "#2b192e",
        fontFamily: "Arial, sans-serif",
      },
    });
  }
  const handleEmail = async () => {
    setIsLoading(true)
    if (password == "" || email == "" || confirmPassword == "" ){
      ShowAlert('Preencha Todos os Campos')
      setIsLoading(false)
      return  
    }
    else if (password !== confirmPassword) {
      ShowAlert("As senhas não coincidem!");
      setIsLoading(false)
      return;
    }
    else{
      const response = await RecuperationEmail(email,password)
      if (response == 'ok'){
        ShowAlert('Email Enviado com Sucesso')
        setIsLoading(false)
      }
      else if (response == 'noexist'){
        ShowAlert('Email não cadastrado')
        setIsLoading(false)
      }
      else{
        ShowAlert('Oopps houve algum erro')
        setIsLoading(false)
      }
    }
  }

  const PasswordVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <head>
        <title>Registro - Controle Verde</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <div className="flex h-screen bg-gradient-to-r from-[#0a2c26] to-[#fff] items-center justify-center">
        <div className="w-full max-w-md bg-[#0a2c26] text-[#fff] p-8 rounded-lg shadow-2xl">
          <div className="flex items-center mb-6">
            <img src="/Logo.png" alt="Logo" className="w-12 h-12 mr-3" />
            <h1 className="text-4xl font-bold fontQuick">Controle Verde</h1>
          </div>
          <p className="text-sm mb-8 fontRobo">Esqueci Minha Senha</p>
          {/* Campo de Nome da Empresa */}

          {/* Campo de Email */}
          <label className="text-sm mb-2 fontRobo">Email:</label>
          <input
            value={email}
            type="email"
            className="w-full mb-4 p-3 rounded bg-[#fff] text-[#0a2c26] shadow-md"
            onChange={(e) => setEmail(e.target.value)}
          />


          {/* Campo de Senha */}
          <label className="text-sm mb-2 fontRobo">Nova senha:</label>
          <div className="relative mb-4">
            <input
              value={password}
              type={isVisible ? "text" : "password"}
              className="w-full p-3 pr-10 rounded bg-[#fff] text-[#0a2c26] shadow-md"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0a2c26] hover:text-gray-700"
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
              className="w-full p-3 pr-10 rounded bg-[#fff] text-[#0a2c26] shadow-md"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0a2c26] hover:text-gray-700"
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

          {/* Botão de Enviar Email para Validação */}
          <button
            className="w-full fontQuick border-2 border-solid border-[#fff] bg-[#fff] text-[#0a2c26] rounded-lg py-3 shadow-lg transition transform hover:bg-[#0a2c26] hover:text-[#fff] hover:-translate-y-1"
            onClick={handleEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">Só um momento...</span>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              "Enviar Email de Validação"
            )}
          </button>

          {/* Link para a página de Login */}
          <Link
            href="/login"
            className="block w-full text-center fontQuick border-2 border-solid border-[#fff] bg-[#fff] text-[#0a2c26] rounded-lg py-3 shadow-lg mt-4 transition transform hover:bg-[#0a2c26] hover:text-[#fff] hover:-translate-y-1"
          >
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
