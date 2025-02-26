"use client"; // Adicione isso se estiver usando hooks do React (useState, useEffect, etc.)

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import "./style.css";
import "./style-cell.css";
import Link from "next/link";

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

  // Função para lidar com o registro
  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    // Lógica de registro (pode ser uma chamada à API, por exemplo)
    console.log("Registrando usuário:", { email, password });
    router.push("/login"); // Redireciona para a página de login após o registro
  };

  return (
    <>
      <head>
        <title>Registro - Today</title>
      </head>
      <div className="flex h-screen bg-gradient-to-r from-[#f5e8da] to-[#2b192e] items-center justify-center">
        <div className="flex w-4/5 h-4/5 bg-white shadow-2xl rounded-lg overflow-hidden relative">
          {/* Contêiner do formulário */}
          <div className="w-full md:w-1/2 bg-[#f5e8da] text-[#2b192e] p-10 flex flex-col justify-center z-10">
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
              className="full-width mb-4 p-3 md:w-2/3 rounded bg-[#2b192e] text-[#f5e8da] shadow-md"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />

            {/* Campo de Senha */}
            <label className="text-sm mb-2 fontRobo">Senha:</label>
            <div className="relative md:w-2/3 mb-4">
              <input
                value={password}
                type={isVisible ? "text" : "password"}
                className="w-full p-3 pr-10 rounded bg-[#2b192e] text-[#f5e8da] shadow-md"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f5e8da] hover:text-white"
                onClick={PasswordVisible}
              >
                {isVisible ? "🚫" : "👁️"}
              </button>
            </div>

            {/* Campo de Confirmação de Senha */}
            <label className="text-sm mb-2 fontRobo">Confirme a Senha:</label>
            <div className="relative md:w-2/3 mb-4">
              <input
                value={confirmPassword}
                type={isVisible ? "text" : "password"}
                className="w-full p-3 pr-10 rounded bg-[#2b192e] text-[#f5e8da] shadow-md"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f5e8da] hover:text-white"
                onClick={PasswordVisible}
              >
                {isVisible ? "🚫" : "👁️"}
              </button>
            </div>

            {/* Botão de Registro */}
            <button
              className="fontDM mt-4 full-width md:w-2/3 border-2 border-solid border-[#2b192e] bg-[#f5e8da] text-[#2b192e] rounded-lg py-3 shadow-lg transition transform hover:bg-[#2b192e] hover:text-[#f5e8da] hover:-translate-y-1"
              onClick={handleRegister}
            >
              Registrar
            </button>

            {/* Link para a página de Login */}
            <Link
              href="/login"
              className="fontDM full-width md:w-2/3 border-2 border-solid border-[#2b192e] bg-[#2b192e] text-[#f5e8da] rounded-lg py-3 shadow-lg text-center mt-4 transition transform hover:bg-[#2b192e] hover:text-[#f5e8da] hover:-translate-y-1"
            >
              Já tem uma conta? Faça login
            </Link>
          </div>

          {/* Contêiner da logo de fundo */}
          <div className="hidden md:flex items-center justify-center w-1/2 bg-[#2b192e] absolute right-0 top-0 bottom-0 z-0">
            <div className="flex items-center justify-center w-full h-full">
              <div className="relative">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="logo-image animate-bounce-smooth opacity-50"
                />
                <div className="logo-shadow">
                  {/* Sombra abaixo da imagem */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Exportação padrão do componente
export default RegisterPage;