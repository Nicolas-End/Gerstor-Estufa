"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { getFunctionaries } from "@/lib/api";
import { validateHomeAcess } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetAllClients } from "@/lib/api";

export default function ClientsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [clientsDatas, setClientsDatas] = useState<any>([]);
    const [clientCount, setClientCount] = useState<number>(0);
    const [hasClient, setHasclient] = useState(Boolean)
    const [searchTerm, setSearchTerm] = useState("");

    const initializeClients = async () => {
        try {
            const can_access_home = await validateHomeAcess(router);
            if (!can_access_home) {
                router.push("/home");
                return;
            }
            const clients: any = await GetAllClients();
            if (clients === "nothing") {
                setClientsDatas([])
                setHasclient(false)
                setIsLoading(false)
                
                return;
            }
            setHasclient(true)
            setClientsDatas(clients);
            const quantidy: number|undefined = clients?.length
            setClientCount(quantidy || 0);
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao verificar acesso do cliente:", error);
            router.push("/login");
        }
    };

    useEffect(() => {
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
                        {hasClient? clientsDatas.map((client:any,index:any) => (
                            <div className={styles.clientCard} key={index}>
                                <FontAwesomeIcon icon={faCircleUser} className={styles.clientIcon} />
                                <p className={styles.clientName}>{client.name}</p>
                            </div>
                        )): <div className="text-center text-gray-500 text-lg py-8">
                            Nenhum cliente {searchTerm ? "encontrado" : "cadastrado"}
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}
