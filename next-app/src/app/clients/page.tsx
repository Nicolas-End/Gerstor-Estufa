"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faSearch, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { ToastContainer } from "react-toastify";
import { ValidateHomeAcess, GetAllClients } from "@/lib/ts/api";
;
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showAlert, showError } from "@/lib/controller/alertsController";
import { getRoleCookie } from "@/lib/controller/cookiesController";
import { verify } from "crypto";

export default function ClientsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [clientsDatas, setClientsDatas] = useState<any[]>([]);
    const [clientCount, setClientCount] = useState<number>(0);
    const [hasClient, setHasclient] = useState(Boolean)
    const [searchTerm, setSearchTerm] = useState("");
    const VerifyRole = async () => {
        const role = await getRoleCookie()
        switch (role) {
            case "ADM":
                break;
            case "Secretaria":
                break
            default:
                router.push('/home')
        }
    }
    const initializeClients = async () => {
        try {


            const clients: any = await GetAllClients();
            if (typeof clients === "string") {
                switch (clients) {
                    case "Credencial Invalida":
                        showAlert("Suas credenciais sõa invalidas")
                        router.push('/logout')
                        break;
                    default:
                        setIsLoading(false)
                        showError("Houve um erro interno tente novamente mais tarde")
                        return;
                }
            }
            setIsLoading(false);
            setHasclient(true)
            setClientsDatas(clients);
            const quantidy: number | undefined = clients?.length
            setClientCount(quantidy || 0);


        } catch (error) {
            showError("Houve um erro tente novamente mais tarde")
            setIsLoading(false)
            return;
        }
    };

    useEffect(() => {
        VerifyRole()
        initializeClients();
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
                            <h1 className={styles.title}>Clientes</h1>
                        </div>
                        <div className={styles.headerBottom}>
                            <div className={styles.searchContainer}>
                                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Pesquisar clientes..."
                                    className={styles.searchInput}
                                />
                            </div>
                            <button
                                onClick={() => router.push("/client-form")}
                                className={styles.addButton}>
                                + Adicionar
                            </button>
                        </div>
                    </div>
                    <div className={styles.ordersList}>
                        {hasClient ? clientsDatas.map((client: any, index: any) => (
                            <div className={styles.clientCard} key={index} onDoubleClick={() => router.push(`client/${client.cpf ? 'cpf' : 'cnpj'}&${client.cpf || client.cnpj}`)}>
                                <FontAwesomeIcon icon={faCircleUser} className={styles.clientIcon} />
                                <p className={styles.clientName}>{client.name}</p>
                                <div><button><FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " /></button></div>
                                <button
                                    type="button"
                                    onClick={() => router.push(`clients/${client.cpf ? 'cpf' : 'cnpj'}&${client.cpf || client.cnpj}`)}
                                >
                                    <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className="text-white hover:text-yellow-400 transition-colors duration-200"
                                    />
                                </button>
                            </div>
                        )) : <div className="text-center text-gray-500 text-lg py-8">
                            Nenhum cliente {searchTerm ? "encontrado" : "cadastrado"}
                        </div>}
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
