"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/Components/sidebar";
import { useRouter } from "next/navigation";
import { AddNewTruck, ValidateHomeAcess } from "@/lib/ts/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";
import { validators } from "tailwind-merge";

export default function CaminhaoForm() {
    const router = useRouter();
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [chassi, setChassi] = useState("");
    const [cor, setCor] = useState("");
    const [eixos, setEixos] = useState("");
    const [mercosul, setMercosul] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pageIsLoading, setPageIsLoading] = useState(true)

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            const response = await AddNewTruck({
                modelo,
                placa,
                chassi,
                cor,
                eixos,
                mercosul,
            });

            switch (response) {
                case "Credenciais Invalidas":
                    showAlert("Suas credenciais são invalidas")
                    router.push('/logout')
                    return;
                case "Ja Cadastrado":
                    showAlert("Este Caminhão Já esta cadastrado no sistema")
                    setIsLoading(false);
                    return;
                case true:
                    showSucess('Caminhão cadastado com sucesso no sistema')
                    break;
                default:
                    showError('Houve um erro interno tente novamente mais tarde')
                    setIsLoading(false);
                    return;
            }

            setModelo("");
            setPlaca("");
            setChassi("");
            setCor("");
            setEixos("");
            setMercosul(false);


            setIsLoading(false);
        } catch (error) {
            showError("Houve um erro interno no sisteam tente novamente mais tarde")
        }
    };
    const initializePage = async () => {
        try {
            const canAccess = await ValidateHomeAcess(router);
            if (!canAccess) {
                router.push("/logout");
                return;
            }
            setPageIsLoading(false);
        } catch (error) {
            console.error("Erro ao iniciar:", error);
            router.push("/login");
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
    } else {
        return (
            <div className="flex min-h-screen bg-gray-100 text-black">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
                        <h1 className="text-2xl font-bold text-black">Cadastrar Caminhão</h1>
                        <button
                            onClick={() => router.push("/caminhoes")}
                            className="bg-[#0a3b2c] text-white py-2 px-4 rounded-lg"
                        >
                            Voltar
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-lg shadow space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-black text-lg">Modelo</label>
                                <input
                                    type="text"
                                    value={modelo}
                                    onChange={(e) => setModelo(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Ex: Scania P320"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-black text-lg">Chassi</label>
                                <input
                                    type="text"
                                    value={chassi}
                                    onChange={(e) => setChassi(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Digite o número do chassi"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-black text-lg">Cor</label>
                                <input
                                    type="text"
                                    value={cor}
                                    onChange={(e) => setCor(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Ex: Branco"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-black text-lg">Qtd. de Eixos</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={eixos}
                                    onChange={(e) => setEixos(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Ex: 2"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-black text-lg">Placa</label>
                                <input
                                    type="text"
                                    value={placa}
                                    onChange={(e) => setPlaca(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Ex: ABC-1234"
                                    required
                                />
                            </div>

                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    checked={mercosul}
                                    onChange={(e) => setMercosul(e.target.checked)}
                                    className="mr-2"
                                />
                                <label className="text-black text-[18px]">
                                    Placa é Mercosul
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-900 text-white py-2 px-4 rounded-lg"
                        >
                            {isLoading ? "Cadastrando..." : "Cadastrar Caminhão"}
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        );
    }
}