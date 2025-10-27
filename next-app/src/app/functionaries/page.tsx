"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { DeleteEspecificFunctionary, GetFunctionaries, ValidateHomeAcess } from "@/lib/ts/api";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showAlert, showError, showSucess } from "@/lib/controller/alerts-controller";
import { getRoleCookie } from "@/lib/controller/cookies-controller";
import { PassThrough } from "stream";

export default function FuncionarioPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [functionariesDatas, setFunctionariesDatas] = useState<any[]>([]);
    const [functionaryCount, setFunctionaryCount] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const params = useParams();
    const id: any = params?.id ?? null;

    const resultados = (Array.isArray(functionariesDatas) ? functionariesDatas : []).filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function confirmToastToDeleteFunctionary(id: string) {
        const toastId = toast.info(
            <div>
                <p>Tem certeza que deseja excluir essa entrega?</p>
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => {
                            toast.dismiss(toastId);

                            showDeleteFunctionaryBox(id)

                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                        Sim
                    </button>
                    <button
                        onClick={() => toast.dismiss(toastId)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                closeOnClick: false,
                closeButton: false,
            }
        )
    }


    async function showDeleteFunctionaryBox(functionary_email: string) {
        const data = await DeleteEspecificFunctionary(functionary_email)
        
        if (data === "Funcionario Deletado") {
            router.refresh()
            showSucess("Excluido com sucesso")

        } else if (data === "Credenciais Invalidas") {
            showAlert("Credencial invalida")
            router.push('/logout')
        } else {
            showAlert('Houve um erro interno Tente apagar denovo mais tarde')
        }

        if (data) {
            initializeFunctionary()
            return;
        }
        showAlert('Houve algum erro no processo !!')


    }


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
                                <div className={styles.functionaryCard} key={index} onDoubleClick={() => router.push(`functionary/${functionary.email}`)}>
                                    <FontAwesomeIcon icon={faCircleUser} className={styles.functionaryIcon} />
                                    <p className={styles.functionaryName}>{functionary.name}</p>
                                    <div className="gap-6 flex flex-row-reverse">
                                        <div><button><FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " /></button></div>
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/functionaries/${functionary.email}`)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                className="text-white hover:text-yellow-400 transition-colors duration-200"
                                            />
                                        </button>
                                    </div>
                                </div>
                            )) :
                            functionariesDatas.map((functionary: any, index: any) => (
                                <div className={styles.functionaryCard} key={index} onDoubleClick={() => router.push(`functionary/${functionary.email}`)}>
                                    <FontAwesomeIcon icon={faCircleUser} className={styles.functionaryIcon} />
                                    <p className={styles.functionaryName}>{functionary.name}</p>
                                    <div className="gap-6 flex flex-row-reverse">
                                        <div><button onClick={() => {confirmToastToDeleteFunctionary(functionary.email)}}><FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " /></button></div>
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/functionaries/${functionary.email}`)}
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