"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { validateHomeAcess } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FuncionarioPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [functionaryCount, setFunctionaryCount] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        initializeFunctionary();
    }, []);

    const initializeFunctionary = async () => {
        try {
            const can_access_home = await validateHomeAcess(router);
            if (!can_access_home) {
                router.push("/login");
                return;
            }
            const count = 5;
            setFunctionaryCount(count);
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao verificar acesso do funcionário:", error);
            router.push("/login");
        }
    };

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
                            <h1 className={styles.title}>Funcionarios</h1>
                        </div>
                        <div className={styles.headerBottom}>
                            <div className={styles.searchContainer}>
                                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Pesquisar funcionários..."
                                    className={styles.searchInput}
                                />
                            </div>
                            <button
                                onClick={() => router.push("")}
                                className={styles.addButton}>
                                + Adicionar
                            </button>
                        </div>
                    </div>
                    <div className={styles.ordersList}>
                        <div className={styles.card}>
                            <div className={styles.orderFunctionary}>
                                <div className="grid grid-cols-1 gap-4 mt-6 w-full">
                                    <div className={styles.functionaryCard}>
                                        <FontAwesomeIcon icon={faCircleUser} className={styles.functionaryIcon} />
                                        <p className={styles.functionaryName}>Mathias Ferreira Mengardo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}