"use client";

import { ValidateLogin } from "@/lib/ts/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showAlert, showError } from "@/lib/controller/alertsController";
import { addRole } from "@/lib/controller/localStorageController";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();



  const handleLogin = async () => {
    setIsLoading(true);

    if (!email || !password) {
      showAlert("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await ValidateLogin(email, password);
      if (response.status === "ok") {
        const role = response.role
        addRole(role)
        router.push('/home')
      } else {
        showAlert("Email ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      showError("Erro interno ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-200 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Bolhas de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg">
              <img src="/Logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">Controle Verde</h1>
            <p className="text-emerald-600/80 text-sm">Sistema de gestão sustentável</p>
          </div>

          <div className="rounded-xl border bg-white/80 p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Bem-vindo de volta</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#000] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    className="w-full h-10 rounded-md border text-gray-700 border-gray-300 px-3 py-2 text-sm pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <Link
                href="/password-forget"
                className="text-sm text-emerald-600 hover:underline block text-right"
              >
                Esqueceu a senha?
              </Link>

              <button
                type="submit"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full h-11 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors"
                onClick={() => router.push("/register")}
                disabled={isLoading}
              >
                Criar nova conta
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-sm text-emerald-600/70">
            © 2025 Controle Verde. Todos os direitos reservados.
          </p>
        </div>
        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    </>
  );
};

export default Login;
