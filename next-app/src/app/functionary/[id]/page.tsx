"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/Components/sidebar";
import { ToastContainer } from "react-toastify";
import { ValidateHomeAcess, GetEspecificFunctionary } from "@/lib/ts/api";
import { showAlert, showError } from "@/lib/controller/alertsController";

export default function ProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [functionaryInfo, setFunctionaryInfo] = useState<any>({})

  const initializePage = async () => {
    try {
      const id: any = params?.id ?? null;
      const canAccess = await ValidateHomeAcess(router);
      if (!canAccess) {
        router.push("/logout");
        return;
      }

      const functionary = await GetEspecificFunctionary(decodeURIComponent(id))
      if (typeof functionary === "string") {
        switch (functionary) {
          case "Funcionario Não Cadastrado":
            showAlert("Funcionario Não Cadastrado no Sistema")
            break;
          case "Credenciais Invalidas":
            showAlert("Suas Credenciais são invalidas")
            router.push("/logout")
            return;
          case "Erro Interno":
            showError("Houver um erro Interno Tente novamente mais tarde")
            router.push("/functionaries")
            return;
        }
      }
      setFunctionaryInfo(functionary)
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
          <h1 className={styles.title}>Consultar Cliente</h1>
          <button
            type="button"
            onClick={() => router.push("/functionaries")}
            className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
          >
            Voltar
          </button>
        </header>

        <section className={styles.banner}>
          <div>
            <div className={styles.bannerTitle}>{functionaryInfo?.name || "Funcionário"}</div>
            {functionaryInfo?.obs ? <div className={styles.bannerSub}>{functionaryInfo.obs}</div> : null}
          </div>

          <div className={styles.bannerRight}>
          </div>
        </section>

        <section className={styles.functionaryBox}>
          <div className={styles.functionaryRow}>
            <div className={styles.functionaryLabel}>Nome:</div>
            <div className={styles.functionaryValue}>{functionaryInfo?.name || "-"}</div>
          </div>

          <div className={styles.functionaryRow}>
            <div className={styles.functionaryLabel}>E-mail:</div>
            <div className={styles.functionaryValue}>{functionaryInfo?.email}</div>
          </div>

          <div className={styles.functionaryRow}>
            <div className={styles.functionaryLabel}>Cargo:</div>
            <div className={styles.functionaryValue}>
              {functionaryInfo.role === "ADM" ? "Administrador" : functionaryInfo.role === "Secretaria" ? "Secretaria" : functionaryInfo.role}
            </div>
          </div>
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
