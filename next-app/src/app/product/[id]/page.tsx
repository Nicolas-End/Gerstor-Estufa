"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";

import { ValidateHomeAcess } from "@/lib/ts/api";
import { showError } from "@/lib/controller/alertsController";

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
  const [itemsInfo, setItemsInfo] = useState<any>({});
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const params = useParams();
  const id: any = params?.id ? params.id : null;
 
  const initializePage = async () => {
    try {
      const canAccess = await ValidateHomeAcess(router);
      if (!canAccess) {
        router.push("/logout");
        return;
      }
      setItemsInfo(items);
      setPageIsLoading(false);
    } catch (err) {
      showError("Erro ao carregar. Redirecionando...");
      router.push("/login");
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
                  onClick={() =>
                    router.push(`../products/${decodeURIComponent(id)}`)
                  }
                  className={styles.editBtn}
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
              <div className={styles.productValue}>Pimenta</div>
            </div>

            <div className={styles.productRow}>
              <div className={styles.productLabel}>Quantidade:</div>
              <div className={styles.productValue}>
                <span>1000</span>
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
                        <tr>
                          <td>Caixa</td>
                          <td>10</td>
                        </tr>
                        <tr>
                          <td>Pacote</td>
                          <td>5</td>
                        </tr>
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

        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    );
  }

  return null;
}