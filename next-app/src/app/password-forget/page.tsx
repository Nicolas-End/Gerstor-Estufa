"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { SendRecuperationEmail } from "@/lib/ts/api";
import { showAlert, showError, showSucess } from "@/lib/controller/alerts-controller";
import  Head  from "next/head";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const handleEmail = async () => {
    try {
      setIsLoading(true)
      if (password == "" || email == "" || confirmPassword == "") {
        showAlert('Preencha Todos os Campos')

        setIsLoading(false)
        return
      }
      else if (password !== confirmPassword) {
        showAlert("As senhas não coincidem!");
        setIsLoading(false)
        return;
      }
      else {
        const response = await SendRecuperationEmail(email, password)

          switch (response) {
            case "Enviado":
              showSucess("Email para recuperação enviado com sucesso")
              setIsLoading(false)
              return
            case "Não cadastrado":
              showAlert("Você é um usuario não cadastrado no nosso sistema")
              setIsLoading(false)
              return;

            default:
              showError("Não conseguimos enviar o email devido a um erro interno")
              setIsLoading(false)
              return;
          }
        


      }
    } catch (error) {
      showError("Não conseguimos enviar o email devido a um erro interno")
      setIsLoading(false)
    }
  }

  const PasswordVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Head>
        <title>Registro - Controle Verde</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>
      <div className="flex h-screen bg-gradient-to-r from-green-200 to-emerald-20 items-center justify-center">
        <div className="w-full max-w-md bg-white text-[#fff] p-8 rounded-lg shadow-2xl">
          <div className="flex items-center mb-6">
            <img src="/Logo.png" alt="Logo" className="w-12 h-12 mr-3" />
            <h1 className="text-4xl text-emerald-800 font-bold fontQuick">Controle Verde</h1>
          </div>
          <p className="text-sm mb-8 fontRobo text-emerald-700">Esqueci Minha Senha</p>
          {/* Campo de Nome da Empresa */}

          {/* Campo de Email */}
          <label className="text-sm mb-2 text-black fontRobo">Email:</label>
          <input
            value={email}
            type="email"
            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setEmail(e.target.value)}
          />


          {/* Campo de Senha */}
          <label className="text-sm mb-2 fontRobo text-black">Nova senha:</label>
          <div className="relative mb-4">
            <input
              value={password}
              type={isVisible ? "text" : "password"}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          <label className="text-sm mb-2 fontRobo text-black">Confirme a Senha:</label>
          <div className="relative mb-6">
            <input
              value={confirmPassword}
              type={isVisible ? "text" : "password"}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full fontMedium border-2 border-solid border-[#fff] bg-emerald-600 hover:bg-emerald-700 text-[#fff] rounded-lg py-3 shadow-lg transition transform"
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
            className="block w-full text-center text-[#fff] fontMedium bg-emerald-600 hover:bg-emerald-700 border-2 border-solid border-[#fff] bg-[#fff] text-[#0a2c26] rounded-lg py-3 shadow-lg mt-4"
          >
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
