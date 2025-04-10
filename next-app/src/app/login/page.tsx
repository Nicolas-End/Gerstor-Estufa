"use client";
import { validateWorkerLogin } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
    setIsLoading(true);
    if (email === "" || password === "" || code === "") {
      ShowAlert("Preencha Todos os Campos");
      setIsLoading(false);
      return;
    }
    try {
      const response = await validateWorkerLogin(email, code, password, router);
      if (response === "wrong Pass") {
        ShowAlert("A senha está incorreta");
      } else {
        ShowAlert("Usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
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

      <div className="min-h-screen bg-gradient-to-r from-[#fff] to-[#0a2c26] flex items-center justify-center p-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden">
          
          {/* Formulário */}
          <div className="w-full md:w-1/2 bg-[#0a2c26] text-white p-8 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center mr-3">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold">Controle Verde</h1>
            </div>

            <p className="text-sm mb-6">Bem-vindo ao sistema</p>

            <label className="text-sm mb-1">Email:</label>
            <input
              value={email}
              type="email"
              className="mb-4 p-3 w-full rounded bg-white text-black shadow"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="text-sm mb-1">Código:</label>
            <input
              value={code}
              type="text"
              className="mb-4 p-3 w-full rounded bg-white text-black shadow"
              onChange={(e) => setCode(e.target.value)}
            />

            <label className="text-sm mb-1">Senha:</label>
            <div className="relative mb-4">
              <input
                value={password}
                type={isVisible ? "text" : "password"}
                className="w-full p-3 pr-10 rounded bg-white text-black shadow"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={PasswordVisible}
              >
                {isVisible ? (
                  <i className="fa-regular fa-eye-slash text-black"></i>
                ) : (
                  <i className="fa-regular fa-eye text-black"></i>
                )}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-white text-[#0a2c26] font-semibold rounded shadow hover:bg-[#0a2c26] hover:text-white transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Entrando...</span>
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              ) : (
                "Login"
              )}
            </button>

            <Link
              href="/register"
              className="mt-4 text-center w-full py-3 border border-white text-white font-semibold rounded hover:bg-white hover:text-[#0a2c26] transition duration-200"
            >
              Registre-se
            </Link>
          </div>

          {/* Imagem (visível apenas em telas médias ou maiores) */}
          <div className="hidden md:flex w-1/2 bg-white items-center justify-center relative">
            <div className="absolute -z-10 bg-white rounded-full w-60 h-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <img src="/Logo.png" alt="Logo" className="w-40 h-40 object-contain z-10" />
          </div>
        </div>

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
    </>
  );
};

export default Login;
