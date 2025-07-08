"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderItem from "@/Components/order-items";
import styles from "../deliverys/page.module.css";
import Sidebar from "@/Components/sidebar";
import { validateHomeAcess } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FuncionarioPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [functionaryCount, setFunctionaryCount] = useState<number>(0); // substituindo DeliverysToDo

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

            // Simulação de contador de algo (ex: pedidos feitos, funcionários ativos etc.)
            const count = 5; // aqui você pode colocar sua lógica real depois
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
                        <h1 className={styles.title}>Pedidos</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push("/delivery-form")}
                                className="bg-[#0a3b2c] text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-800 transition"
                            >
                                + Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
