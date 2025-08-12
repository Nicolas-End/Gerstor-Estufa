"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { GetFunctionaries, ValidateHomeAcess } from "@/lib/ts/api";
import { ToastContainer } from "react-toastify";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showAlert, showError } from "@/lib/controller/alertsController";
import { getRoleCookie } from "@/lib/controller/cookiesController";
import { PassThrough } from "stream";

export default function FuncionarioPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [functionariesDatas, setFunctionariesDatas] = useState<any[]>([]); 
    const [functionaryCount, setFunctionaryCount] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");

    const resultados = (Array.isArray(functionariesDatas) ? functionariesDatas : []).filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const VerifyRole = async () => {
        const role = await getRoleCookie()
        switch (role) {
            case "ADM":
                break;
            case "Secretaria":
                break
            default:
                router.push('/not-found')
                return;
        }
    }
    const initializeFunctionary = async () => {
        try {
            await VerifyRole()
            const functionaries = await GetFunctionaries();

            if (!Array.isArray(functionaries)) {
                switch (functionaries) {
                    case "Credencial Invalida":
                        showAlert("Suas Credenciais são inválidas");
                        router.push("/logout");
                        return; // impede continuar
                    case "Erro Interno":
                        showAlert("Houve um erro interno, tente novamente mais tarde");
                        return;
                }
            }

            setFunctionariesDatas(functionaries);
            setFunctionaryCount(functionaries.length);
            setIsLoading(false);
        } catch (error) {
            showError("Houve um erro, tente novamente mais tarde");
            setIsLoading(false);
        }
    };
    useEffect(() => {
        
        initializeFunctionary();
    }, []);

    if (isLoading) {
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
            <div className={styles.container}>
                <Sidebar />
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.headerTop}>
                            <h1 className={styles.title}>Funcionários</h1>
                        </div>
                        <div className={styles.headerBottom}>
                            <div className={styles.searchContainer}>
                                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Pesquisar funcionários..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                            <button
                                onClick={() => router.push("/functionary-form")}
                                className={styles.addButton}>
                                + Adicionar
                            </button>
                        </div>
                    </div>
                    <div className={styles.ordersList}>
                        {searchTerm ?
                            resultados.map((functionary: any, index: any) => (
                                <div className={styles.functionaryCard} key={index} onClick={() => router.push(`functionary/${functionary.email}`)}>
                                    <FontAwesomeIcon icon={faCircleUser} className={styles.functionaryIcon} />
                                    <p className={styles.functionaryName}>{functionary.name}</p>
                                </div>
                            )) :
                            functionariesDatas.map((functionary: any, index: any) => (
                                <div className={styles.functionaryCard} key={index} onClick={() => router.push(`functionary/${functionary.email}`)}>
                                    <FontAwesomeIcon icon={faCircleUser} className={styles.functionaryIcon} />
                                    <p className={styles.functionaryName}>{functionary.name}</p>
                                </div>
                            ))}
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
        );
    }
}