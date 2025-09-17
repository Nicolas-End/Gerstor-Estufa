"use client";
import React, { use, useState } from "react";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DeleteProduct, ValidateHomeAcess} from "@/lib/ts/api";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";

// Define formato de cada item
interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export default function DeliveryFormPage() {
  const router = useRouter(); // Navegação

  // Estados dos campos principais
  const [items, setItems] = useState<ItemEntry[]>([]);
  const [itemsInfo, setItemsInfo] = useState<any>({})
  const [pageIsLoading, setPageIsLoading] = useState(true)
  const params = useParams();
  const id: any = params?.id ? params.id : null;
  const deleteProduct = async (id:string) =>{
    try{
      const response = await DeleteProduct(id)
      switch(response){
        case "Credenciais Invalidas":
          showAlert("Suas Credenciais são invalidas")
          router.push('/logout')
          return
        case "Erro Interno":
          showError("Houve um erro Interno tente novamente mais tarde")
          return
        case "Produto Apagado":
          showSucess("Produto apagado com sucesso")
          break
        case "Produto Não Cadastrado":
          showAlert("Produto Não Existe")
          break
      }
      initializePage()
    }catch(error){
      showError("Houve um erro Interno tente novamente mais tarde")
    }
  }
  const initializePage = async () => {
      try {
        const canAccess = await ValidateHomeAcess(router);
        if (!canAccess) {
          router.push("/logout");
          return;
        }
        setItemsInfo(items)
        setPageIsLoading(false)
      } catch (err) {
        showError("Erro ao carregar. Redirecionando...");
        router.push("/login");
      }
    };

  useEffect(() => {
    initializePage();
  }, []);

  if (pageIsLoading) {
    return (
      <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        <header className={styles.topHeader} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 className={styles.title} style={{ flex: 1 }}>Consultar Produto</h1>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
            >
              Voltar
            </button>

            {/* Botão Editar - só aparece se houver id */}
            {id ? (
              <button
                type="button"
                onClick={() => router.push(`../products/${decodeURIComponent(id)}`)}
                className="bg-yellow-600 text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-yellow-700 transition"
              >
                Editar
              </button>
            ) : null}
          </div>
        </header>

        <section className={styles.banner}>
          <div>
            <div className={styles.bannerTitle}><span>Nome do produto</span></div>
          </div>

          <div className={styles.bannerRight}></div>
        </section>

        <section className={styles.productBox}>
          <div className={styles.productRow}>
            <div className={styles.productLabel}>Nome do produto:</div>
            <div className={styles.productValue}>Pimenta</div>
          </div>

          <div className={styles.productRow}>
            <div className={styles.productLabel}>Quantidade:</div>
            <div className={styles.productValue}><span>1000</span></div>
          </div>

          <div className={styles.productRow}>
            <div className={styles.productLabel}>Referência:</div>
            <div className={styles.productValue}></div>
          </div>
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
    )
  }
}
