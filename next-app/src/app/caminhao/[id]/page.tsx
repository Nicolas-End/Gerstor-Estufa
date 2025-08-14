"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/Components/sidebar";
import { ToastContainer } from "react-toastify";
import { GetEspecificTruck, ValidateHomeAcess } from "@/lib/ts/api";
import { showAlert, showError } from "@/lib/controller/alertsController";

export default function ProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [truckInfo, setTruckInfo] = useState<any>({});

  // Carrega e valida acesso
  const initializePage = async () => {
    try {
      const id: any = params?.id ?? null;
      const canAccess = await ValidateHomeAcess(router);
      if (!canAccess) {
        router.push("/login");
        return;
      }

      const response = await GetEspecificTruck(id)
      if (typeof response === "string"){
        switch (response){
            case "Credenciais invalidas":
                showAlert("Credenciais Invalidas")
                router.push('/logout')
                return;
            case "Caminhão não encontrado":
                showAlert("Caminhão não cadastrado no sistema")
                router.push('/caminhoes')
                return;
            default:
                showError("Erro Interno tente novamente mais tarde")
                router.push('/home')
                return;

        }
      }
      setTruckInfo(response)
      
      setPageIsLoading(false)
     
    } catch (err) {
      showError("Erro ao carregar. Redirecionando...");
      router.push("/home");
    }
  };

  useEffect(() => {
    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pageIsLoading) {
    return (
      <div className={styles.loaderWrap}>
        <div className={styles.loaderBox}>
          <div className={styles.spinner} />
          <span className={styles.loaderText}>Carregando...</span>
        </div>
        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        <header className={styles.topHeader}>
          <h1 className={styles.title}>Consultar Caminhão</h1>
          <button
            type="button"
            onClick={() => router.push("/caminhoes")}
            className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
          >
            Voltar
          </button>
        </header>

       
        <section className={styles.banner}>
          <div>
            
            placa = {truckInfo.placa}, chassi = {truckInfo.chassi}, cor = {truckInfo.cor },
             eixos = {truckInfo.eixos}, mercosul = {truckInfo.mercosul}, modelo = {truckInfo.modelo}
          </div>

          
          <div className={styles.bannerRight}>
            
          </div>
        </section>

        
        <section className={styles.clientBox}>
         
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
