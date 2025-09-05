"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { GetStocksProducts, ValidateHomeAcess } from "@/lib/ts/api";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showError } from "@/lib/controller/alertsController";

export default function ProductsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [productsDatas, setProductsDatas] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const resultados = (Array.isArray(productsDatas) ? productsDatas : []).filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const initializeProducts = async () => {
        try {
            setIsLoading(false);
        } catch (error) {
            showError("Houve um erro, tente novamente mais tarde");
            setIsLoading(false);
            const initializeProducts = async () => {
                try {
                    const products = await GetStocksProducts()
                    setIsLoading(false);
                } catch (error) {
                    showError("Houve um erro, tente novamente mais tarde");
                    setIsLoading(false);
                }
            };

            useEffect(() => {
                initializeProducts();
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
                                    <h1 className={styles.title}>Produtos</h1>
                                </div>
                                <div className={styles.headerBottom}>
                                    <div className={styles.searchContainer}>
                                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                        <input
                                            type="text"
                                            placeholder="Pesquisar produtos..."
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                    </div>
                                    <button
                                        onClick={() => router.push("/product-form")}
                                        className={styles.addButton}>
                                        + Adicionar
                                    </button>
                                </div>
                            </div>
                            <div className={styles.ordersList}>
                                {(searchTerm ? resultados : productsDatas).map((product: any, index: any) => (
                                    <div className={styles.productCard} key={index} onDoubleClick={() => router.push(`product/${product.id}`)}>
                                        <FontAwesomeIcon icon={faBox} className={styles.productIcon} />
                                        <p className={styles.productName}>{product.name}</p>
                                        <div className="gap-6 flex flex-row-reverse">
                                            <div>
                                                <button>
                                                    <FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/products/${product.id}`)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    className="text-white hover:text-yellow-400 transition-colors duration-200"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ToastContainer position="top-right" autoClose={4000} />
                    </div>
                );
            }
        };

        useEffect(() => {
            initializeProducts();
        }, []);

        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-screen text-gray-800">
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
                                <h1 className={styles.title}>Produtos</h1>
                            </div>
                            <div className={styles.headerBottom}>
                                <div className={styles.searchContainer}>
                                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar produtos..."
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className={styles.addButton}
                                >
                                    + Adicionar
                                </button>
                            </div>
                        </div>
                        <div className={styles.ordersList}>
                            {(searchTerm ? resultados : productsDatas).map((product: any, index: any) => (
                                <div
                                    className={styles.productCard}
                                    key={index}
                                    onDoubleClick={() => router.push(`product/${product.id}`)}
                                >
                                    <FontAwesomeIcon icon={faBox} className={styles.productIcon} />
                                    <p className={styles.productName}>{product.name}</p>
                                    <div className="gap-6 flex flex-row-reverse">
                                        <div>
                                            <button>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-white hover:text-red-600 transition-colors duration-200 "
                                                />
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/products/${product.id}`)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                className="text-white hover:text-yellow-400 transition-colors duration-200"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ToastContainer position="top-right" autoClose={4000} />

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            {/* Fundo borrado */}
                            <div
                                className="absolute inset-0 backdrop-blur-md"
                                onClick={() => setIsModalOpen(false)}
                            />
                            {/* Card do formulário */}
                            <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 z-10">
                                <h2 className="text-xl font-bold mb-4 text-[#005E40]">Adicionar Produto</h2>
                                <form className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nome do Produto"
                                        className="border rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Quantidade"
                                        className="border rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 rounded-lg border text-black font-bold"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-[#005E40] font-bold text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    }
}
