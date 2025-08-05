// app/caminhoes/page.tsx
"use client";
import Sidebar from "@/Components/sidebar";
import styles from "../functionaries/page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import { faSearch, faTruck } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { GetTrucks,ValidateHomeAcess } from "@/lib/ts/api"; 
import { useRouter } from "next/navigation";
import { showError } from "@/lib/controller/alertsController";

export default function CaminhoesPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [trucks, setTrucks] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        initializeTrucks();
    }, []);

    const initializeTrucks = async () => {
            try {
                const can_access_home = await ValidateHomeAcess(router);
                if (!can_access_home) {
                    router.push("/logout");
                    return;
                }
                const data: any = await GetTrucks();
                if (typeof data === 'string') {
                    switch (data){
                        case 'Login':
                            showError('Por favor refaça o Login')
                            router.push('/logout')
                        default :
                            showError ('Ops houve um erro interno')
                            showError('Tente novamente mais tarde pfv')
                            return;
                    }
                
                }
                setTrucks(data)
                setIsLoading(false)
                return;

            } catch (error) {
                console.error("Erro ao verificar acesso do cliente:", error);
                router.push("/login");
            }
        };
    const resultados = trucks.filter((t) =>
        t.placa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-medium">Carregando...</span>
        </div>
        <ToastContainer position="top-right" autoClose={4000} />    
      </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.title}>Caminhões</h1>
                    </div>
                    <div className={styles.headerBottom}>
                        <div className={styles.searchContainer}>
                            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Pesquisar por placa..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <button
                            onClick={() => router.push("/caminhao-form")}
                            className={styles.addButton}
                        >
                            + Adicionar
                        </button>
                    </div>
                </div>

                <div className={styles.ordersList}>
                    {(searchTerm ? resultados : trucks).length === 0 ? (
                        <div className="text-center text-gray-500 text-lg py-8">
                            Nenhum caminhão {searchTerm ? "encontrado" : "cadastrado"}.
                        </div>
                    ) : (
                        (searchTerm ? resultados : trucks).map((truck, index) => (
                            <div key={index} className={styles.functionaryCard}>
                                <FontAwesomeIcon icon={faTruck} className={styles.functionaryIcon} />
                                <div>
                                    <p className={styles.functionaryName}>Placa: {truck.placa}</p>
                                    <p>Modelo: {truck.modelo}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={4000} />
        </div>
    );
}
