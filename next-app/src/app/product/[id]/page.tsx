"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import ProductEdit from "./product-edit";
import { EditProduct, GetProductByID, ValidateHomeAcess } from "@/lib/ts/api";
import { showAlert, showError, showSucess } from "@/lib/controller/alerts-controller";

// Define formato de cada item
interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export default function DeliveryFormPage() {
  const router = useRouter(); // Navegação
  const params = useParams();
  const id: any = params?.id ? params.id : null;
  // Estados dos campos principais
  const [productDatas, setProductDatas] = useState<any>({});
  const [lumpingsInfo, setLumpingsInfo] = useState<any>({});
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  

  const initializePage = async () => {
    try {
      const canAccess = await ValidateHomeAcess(router);
      if (!canAccess) {
        router.push("/logout");
        return;
      }
      const response = await GetProductByID(id)
      if (typeof response === "string") {
        switch (response) {
          case "Produto Não Cadastrado":
            showAlert('Produto não cadastrado no sistema')
            router.push('/products')
            return;
          case "Credenciais Invalidas":
            showError("Suas Credenciais São invalidas");
            router.push('/logout')
            return;
          case "Erro Interno":
            router.push('/products')
            return;
        }
      }
      setProductDatas(response.ProductsDatas)
      setLumpingsInfo(response.LumpingsInfos)
      setPageIsLoading(false);
    } catch (err) {
      showError("Erro ao carregar. Redirecionando...");
      router.push("/home");
    }
  };

    /**
   * Recebe os dados do modal quando o usuário submete. 
   */

  const handleEdit = async(product: { name: string; quantity: number; items: ItemEntry[],id:string }) =>{
    try{
        const response = await EditProduct(product)
        switch(response){
          case "Credenciais Invalidas":
            showAlert("Suas Credenciais São Invalidas")
            router.push('/logout')
            return;
          case "Produto Editado":
            showSucess("Produto Editado com sucesso")
            router.refresh()
            return;
          case "Valores Inseridos Invalidos":
            showAlert("Alguns dos valores inseridos são invalidos")
            return;
          default:
            showAlert("Houve um erro interno tente novamente mais tarde")
            return;
        }
    }catch(error){
      showError("Houve um erro internotente novamente mais tarde")
    }
  }
  useEffect(() => {
    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Abre o modal
  const openEditModal = () => {
    setIsEditOpen(true);
  };

  // Fecha o modal
  const closeEditModal = () => {
    setIsEditOpen(false);
  };



  if (pageIsLoading) {
    return (
      <div className={styles.loaderWrap}>
        <div className={styles.loaderBox}>
          <div className={styles.spinner} />
          <span className={styles.loaderText}>Carregando...</span>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.content}>
          <header className={styles.topHeader}>
            <h1 className={styles.title}>
              Consultar Produto
            </h1>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className={styles.backBtn}
              >
                Voltar
              </button>

              {/* Botão Editar - só aparece se houver id */}
              {id ? (
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={openEditModal}
                >
                  Editar
                </button>
              ) : null}
            </div>
          </header>

          <section className={styles.banner}>
            <div>
              <div className={styles.bannerTitle}>
              </div>
            </div>
            <div className={styles.bannerRight}></div>
          </section>

          <section className={styles.productBox}>
            <div className={styles.productRow}>
              <div className={styles.productLabel}>Nome do produto:</div>
              <div className={styles.productValue}>{productDatas.name}</div>
            </div>

            <div className={styles.productRow}>
              <div className={styles.productLabel}>Quantidade:</div>
              <div className={styles.productValue}>
                <span>{productDatas.quantity}</span>
              </div>
            </div>

            <div className={styles.productRow}>
              <div className={styles.productLabel}>Embalagens:</div>
              <div className={styles.productValue}>
                <div className={styles.tableArea}>
                  <div className={styles.refTableWrapper}>
                    {/* Layout Desktop/Tablet - Tabela tradicional */}
                    <table className={styles.refTable}>
                      <thead>
                        <tr>
                          <th>Tipo de Embalagem</th>
                          <th>Capacidade Máxima</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(lumpingsInfo).map(([key, value]: any, index) => (
                          <tr key={index}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}


                      </tbody>
                    </table>

                    {/* Layout Mobile - Cards */}
                    <div className={styles.mobileCards}>
                      <div className={styles.mobileCard}>
                        <div className={styles.cardTitle}>Caixa</div>
                        <div className={styles.cardSubtitle}>Quantidade Máxima</div>
                        <div className={styles.cardValue}>10</div>
                      </div>

                      <div className={styles.mobileCard}>
                        <div className={styles.cardTitle}>Pacote</div>
                        <div className={styles.cardSubtitle}>Capacidade Máxima</div>
                        <div className={styles.cardValue}>5</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Modal de edição - ligado ao estado isEditOpen */}
        <ProductEdit
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSubmit={handleEdit}
          id={id}
        />

        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    );
  }

  return null;
}
