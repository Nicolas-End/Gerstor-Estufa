"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import ProductEdit from "./product-edit";
import { GetProductByID, ValidateHomeAcess } from "@/lib/ts/api";
import { showAlert, showError } from "@/lib/controller/alertsController";

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
  const [productDatas, setProductDatas] = useState<any>({});
  const [lumpingsInfo, setLumpingsInfo] = useState<any>({});
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false); // <--- modal state
  const params = useParams();
  const id: any = params?.id ? params.id : null;

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

  /**
   * Recebe os dados do modal quando o usuário submete.
   * Aqui atualizamos apenas o estado local (frontend).
   * Substitua por chamada à API se quiser persistir no backend.
   */
  const handleEditSubmit = (product: {
    name: string;
    quantity: number;
    items: Array<{
      id?: number;
      name?: string;
      unit?: string;
      quantity?: number;
      capacity?: number | "";
    }>;
  }) => {
    // Atualiza nome e quantidade
    setProductDatas((prev: any) => ({
      ...prev,
      name: product.name,
      quantity: product.quantity,
    }));

    // Converte items para o formato lumpingsInfo { unidade: capacidade }
    const lumpingsObj: Record<string, number> = {};
    if (Array.isArray(product.items)) {
      product.items.forEach((it) => {
        const unit = it.unit ?? "";
        const cap = typeof it.capacity === "number" ? it.capacity : (it.capacity === "" ? 0 : Number(it.capacity || 0));
        if (unit) lumpingsObj[unit] = cap;
      });
    }
    setLumpingsInfo(lumpingsObj);

    // Feedback visual
    showAlert("Produto atualizado com sucesso (apenas no front-end).");

    // Fecha o modal (o component ProductEdit também chama onClose)
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
          onSubmit={handleEditSubmit}
        />

        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    );
  }

  return null;
}
