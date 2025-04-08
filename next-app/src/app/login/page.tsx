"use client";
import { validateWorkerLogin } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import "./style.css";
import "./style-cell.css";
import Link from "next/link";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const PasswordVisible = () => {
    setIsVisible(!isVisible);
  };

  const handleLogin = async () => {
    await setIsLoading(true);
    if (email === "" || password === "" || code === "") {
      ShowAlert("Preencha Todos os Campos");
      setIsLoading(false);
      return;
    }
    try {
      const response = await validateWorkerLogin(email, code, password, router);
      if (response === "wrong Pass") {
        ShowAlert("A senha esta incorreta");
      } else {
        ShowAlert("Usuario não encontrado");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      await setIsLoading(false);
    }
  };

  return (
    <>
      <head>
        <title>Login - Controle Verde</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <div className="flex h-screen bg-gradient-to-r from-[#fff] to-[#0a2c26] items-center justify-center">
        <div className="flex w-4/5 h-4/5 bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Contêiner do formulário */}
          <div className="md:w-1/2 w-full bg-[#0a2c26] text-[#fff] p-10 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              {/* Círculo branco com logo centralizada */}
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mr-3">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold fontQuick">Controle Verde</h1>
            </div>
            <p className="text-sm mb-8 fontRobo">Welcome to the site</p>

            {/* Campo de Email */}
            <label className="text-sm mb-2 fontRobo">Email:</label>
            <input
              value={email}
              type="email"
              className="mb-4 p-3 md:w-2/3 rounded bg-[#fff] text-[#000] shadow-md"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Campo de Código */}
            <label className="text-sm mb-2 fontRobo">Código:</label>
            <input
              value={code}
              type="text"
              className="mb-4 p-3 md:w-2/3 rounded bg-[#fff] text-[#000] shadow-md"
              onChange={(e) => setCode(e.target.value)}
            />

            {/* Campo de Senha */}
            <label className="text-sm mb-2 fontRobo">Senha:</label>
            <div className="relative md:w-2/3 mb-2">
              <input
                value={password}
                type={isVisible ? "text" : "password"}
                className="w-full p-3 pr-10 rounded bg-[#fff] text-[#000] shadow-md"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#000] hover:text-white"
                onClick={PasswordVisible}
              >
                {isVisible ? (
                  <i className="fa-regular fa-eye-slash text-[#0a2c26]"></i>
                ) : (
                  <i className="fa-regular fa-eye text-[#0a2c26]"></i>
                )}
              </button>
              <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
              />
            </div>

            {/* Botão de Login */}
            <button
              className="fontDM mt-4 md:w-2/3 border-2 border-solid border-[#fff] bg-[#fff] text-[#000] rounded-lg py-3 shadow-lg transition transform hover:bg-[#0a2c26] hover:text-[#fff] hover:-translate-y-1"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Só um momento...</span>
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* Link para a página de Registro */}
            <Link
              href="/register"
              className="fontDM md:w-2/3 border-2 border-solid border-[#fff] bg-[#fff] text-[#000] rounded-lg py-3 shadow-lg text-center mt-4 transition transform hover:bg-[#0a2c26] hover:text-[#fff] hover:-translate-y-1"
            >
              Registre-se
            </Link>
          </div>

          {/* Contêiner da imagem */}
          <div className="hidden md:flex items-center justify-center w-1/2 bg-[#fff] relative">
            {/* Bola branca atrás da imagem */}
            <div className="absolute -z-10 bg-white rounded-full w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Imagem com animação via CSS */}
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="logo-image"
                />
                {/* Sombra com animação via CSS */}
                <div className="logo-shadow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
