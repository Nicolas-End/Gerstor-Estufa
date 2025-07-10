"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Sidebar from "@/Components/sidebar";
import { useRouter } from "next/navigation";
import { validateHomeAcess } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterEmployeePage() {
    const router = useRouter();
    const [pageIsLoading, setPageIsLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    // Campos do formulário
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");

    function ShowAlert(text: string) {
        toast(text, {
            style: {
                backgroundColor: "#fff",
                color: "#2b192e",
                fontFamily: "Arial, sans-serif",
            },
        });
    }

    const initializePage = async () => {
        try {
            const canAccess = await validateHomeAcess(router);
            if (!canAccess) {
                router.push("/login");
                return;
            }
            setPageIsLoading(false);
        } catch (error) {
            console.error("Erro ao iniciar:", error);
            router.push("/login");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            ShowAlert("As senhas não coincidem!");
            return;
        }

        const formData = {
            name,
            email,
            password,
            role,
        };

        try {
            setIsLoading(true);

            // Aqui você faria a chamada real à API, como:
            // await registerEmployee(formData);
            console.log("Dados do funcionário:", formData);

            ShowAlert("Funcionário cadastrado com sucesso!");

            // Resetar os campos
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRole("");
            setIsLoading(false);
        } catch (error) {
            ShowAlert("Erro ao cadastrar. Tente novamente.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializePage();
    }, []);

    if (pageIsLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xl font-medium">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
                        <h1 className="text-2xl font-bold text-gray-800">Cadastrar Funcionário</h1>
                        <button
                            type="button"
                            onClick={() => router.push("/functionaries")}
                            className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
                        >
                            Voltar
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-lg shadow flex-1 overflow-auto flex flex-col gap-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-green-900 text-[18px] mb-2">
                                    Nome
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Digite o nome completo"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-green-900 text-[18px] mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Digite o email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-green-900 text-[18px] mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={isPasswordVisible ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Digite a senha"
                                        required
                                    />
                                    <span
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-900 cursor-pointer"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-green-900 text-[18px] mb-2">
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Confirme a senha"
                                        required
                                    />
                                    <span
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-900 cursor-pointer"
                                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                    >
                                        {isConfirmPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="role" className="block text-green-900 text-[18px] mb-2">
                                    Cargo
                                </label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Selecione o cargo</option>
                                    <option value="Funcionário Comum">Funcionário Comum</option>
                                    <option value="Caminhoneiro">Caminhoneiro</option>
                                    <option value="Secretaria">Secretaria</option>
                                </select>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-900 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Cadastrando Funcionário..." : "Cadastrar"}
                        </button>
                    </form>
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
        </>
    );
}
