'use client'
import { validateWorkerLogin } from "@/Components/Worker";
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
  const router = useRouter();

  const PasswordVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <head>
        <title>Login - Today</title>
      </head>
      <div className="flex h-screen bg-gradient-to-r from-[#f5e8da] to-[#2b192e] items-center justify-center">
        <div className="flex w-4/5 h-4/5 bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Contêiner do formulário */}
          <div className="md:w-1/2 w-full bg-[#f5e8da] text-[#2b192e] p-10 flex flex-col justify-center">
            <div className="flex items-center mb-6">
              <img src="/Logo.png" alt="Logo" className="w-12 h-12 mr-3" />
              <h1 className="text-4xl font-bold fontDM">Today</h1>
            </div>
            <p className="text-sm mb-8 fontRobo">Welcome to the site</p>

            {/* Campo de Email */}
            <label className="text-sm mb-2 fontRobo">Email:</label>
            <input
              value={email}
              type="email"
              className="full-width mb-4 p-3 md:w-2/3 rounded bg-[#2b192e] text-[#f5e8da] shadow-md"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Campo de Código */}
            <label className="text-sm mb-2 fontRobo">Código:</label>
            <input
              value={code}
              type="text"
              className="full-width md:w-2/3 mb-4 p-3 rounded bg-[#2b192e] text-[#f5e8da] shadow-md"
              onChange={(e) => setCode(e.target.value)}
            />

            {/* Campo de Senha */}
            <label className="text-sm mb-2 fontRobo">Senha:</label>
            <div className="relative md:w-2/3 mb-2">
              <input
                value={password}
                type={isVisible ? "text" : "password"}
                className="w-full p-3 pr-10 rounded bg-[#2b192e] text-[#f5e8da] shadow-md"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f5e8da] hover:text-white"
                onClick={PasswordVisible}
              >
                {isVisible ? "🚫" : "👁️"}
              </button>
            </div>

            {/* Botão de Login */}
            <button
              className="fontDM mt-4 full-width md:w-2/3 border-2 border-solid border-[#2b192e] bg-[#f5e8da] text-[#2b192e] rounded-lg py-3 shadow-lg transition transform hover:bg-[#2b192e] hover:text-[#f5e8da] hover:-translate-y-1"
              onClick={() => validateWorkerLogin(email, code, password, router)}
            >
              Login
            </button>

            {/* Link para a página de Registro */}
            <Link
              href="/register" // Caminho absoluto para a página de registro
              className="fontDM full-width md:w-2/3 border-2 border-solid border-[#2b192e] bg-[#2b192e] text-[#f5e8da] rounded-lg py-3 shadow-lg text-center mt-4 transition transform hover:bg-[#2b192e] hover:text-[#f5e8da] hover:-translate-y-1"
            >
              Registre-se
            </Link>
          </div>

          {/* Contêiner da imagem */}
          <div className="hidden md:flex items-center justify-center w-1/2 bg-[#2b192e]">
            <div className="real flex items-center justify-center w-full h-full">
              <div className="flex items-center justify-center bg-[#2b192e]">
                <div className="relative">
                  <img
                    src="/Logo.png"
                    alt="Logo"
                    className="logo-image animate-bounce-smooth"
                  />
                  <div className="logo-shadow">
                    {/* Sombra abaixo da imagem */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;