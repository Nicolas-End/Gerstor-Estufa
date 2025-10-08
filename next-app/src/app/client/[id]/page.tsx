"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/Components/sidebar";
import { ToastContainer } from "react-toastify";
import { ValidateHomeAcess, GetEspecificClient } from "@/lib/ts/api";
import { showAlert, showError } from "@/lib/controller/alertsController";

export default function ProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<any>({});
  const [id, setId] = useState("");

  // Carrega e valida acesso
  const initializePage = async () => {
    try {
      const idParam: any = params?.id ?? null;
      const canAccess = await ValidateHomeAcess(router);
      if (!canAccess) {
        router.push("/login");
        return;
      }

      const response = await GetEspecificClient(decodeURIComponent(idParam));
      if (typeof response === "string") {
        switch (response) {
          case "Credenciais Invalidas":
            showAlert("Suas credenciais são inválidas");
            router.push("/logout");
            return;
          case "Cliente Não Existe":
            showAlert("Cliente inexistente");
            router.push("/clients");
            return;
          default:
            showError("Houve um erro interno. Tente novamente mais tarde.");
            router.push("/clients");
            return;
        }
      }

      setClientInfo(response || {});
      setId(decodeURIComponent(idParam));
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
        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        <header className={styles.topHeader} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 className={styles.title} style={{ flex: 1 }}>Consultar Cliente</h1>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
            >
              Voltar
            </button>

            {/* Botão Editar - só aparece se houver id */}
            {id ? (
              <button
                type="button"
                onClick={() => router.push(`../clients/${decodeURIComponent(id)}`)}
                className="bg-yellow-600 text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-yellow-700 transition"
              >
                Editar
              </button>
            ) : null}
          </div>
        </header>

        <section className={styles.banner}>
          <div>
            <div className={styles.bannerTitle}>{clientInfo?.name || "Cliente"}</div>
            {clientInfo?.obs ? <div className={styles.bannerSub}>{clientInfo.obs}</div> : null}
          </div>

          <div className={styles.bannerRight}></div>
        </section>

        <section className={styles.clientBox}>
          <div className={styles.clientRow}>
            <div className={styles.clientLabel}>Nome:</div>
            <div className={styles.clientValue}>{clientInfo?.name || "-"}</div>
          </div>

          <div className={styles.clientRow}>
            <div className={styles.clientLabel}>
              {clientInfo?.cnpj ? "CNPJ:" : clientInfo?.cpf ? "CPF:" : "Documento"}
            </div>
            <div className={styles.clientValue}>
              {clientInfo?.cnpj || clientInfo?.cpf || "-"}
            </div>
          </div>

          <div className={styles.clientRow}>
            <div className={styles.clientLabel}>Endereço:</div>
            <div className={styles.clientValue}>{clientInfo?.address || "-"}</div>
          </div>

          <div className={styles.clientRow}>
            <div className={styles.clientLabel}>Referência:</div>
            <div className={styles.clientValue}>{clientInfo?.refe || "-"}</div>
          </div>

          {/* se quiser mostrar telefone/email adicione clientInfo.phone/email */}
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
