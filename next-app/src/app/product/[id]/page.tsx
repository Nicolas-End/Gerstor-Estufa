"use client";

import React, { use, useState, useEffect } from "react";
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
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-medium">Carregando...</span>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.content}>
          <header
            className={styles.topHeader}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <h1 className={styles.title} style={{ flex: 1 }}>
              Consultar Produto
            </h1>

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
                  onClick={() =>
                    router.push(`../products/${decodeURIComponent(id)}`)
                  }
                  className="bg-yellow-600 text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-yellow-700 transition"
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

            <div className={styles.tableArea}>
              <div className={styles.refTableWrapper}>
                <table className={styles.refTable} role="table" aria-label="Tabela de tipos de embalagem e capacidades">
                  <thead>
                    <tr>
                      <th>Tipos de embalagem</th>
                      <th>Capacidade máxima (p/Und)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Saco</td>
                      <td>10 Und</td>
                    </tr>
                    <tr>
                      <td>Caixa</td>
                      <td>25 Und</td>
                    </tr>
                  </tbody>
                </table>
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
