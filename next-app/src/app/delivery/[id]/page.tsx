"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetEspecificDelivery } from "@/lib/ts/api";
import Sidebar from "@/Components/sidebar";
import { showAlert } from "@/lib/controller/alertsController";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "lucide-react";

export default function ProdutoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysDatas, setDeliveryDatas] = useState<any>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  const [clientInfo, setClientInfo] = useState<any>({});
  const router = useRouter();
  const params = useParams();
  const id: any = params?.id ? params.id : null;
  const localStorageKey = `checked-products-${id}`;

  const initializeDeliverys = async () => {
    try {
      if (id === null) {
        router.push("/deliverys");
        return;
      }
      const delivery: any = await GetEspecificDelivery(id);
      if (typeof delivery === "string") {
        switch (delivery) {
          case "Credencial Invalida":
            router.push("/logout");
            break;
          case "Entrega inexistente":
            showAlert("Entrega não Existente");
            router.push("/deliverys");
            break;
          default:
            showAlert("Erro interno, tente novamente mais tarde");
            router.push("/deliverys");
            break;
        }
      }
      const clienttypeId = delivery.deliveryDatas.cpf
        ? "cpf"
        : delivery.deliveryDatas.cnpj
          ? "cnpj"
          : "";
      const clientId = delivery.deliveryDatas.cpf || delivery.deliveryDatas.cnpj || "";

      setDeliveryDatas(delivery.deliveryDatas);
      setClientInfo({ clientId: clientId, typeId: clienttypeId });
      setProducts(delivery.products);
      setIsLoading(false);
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (id !== null) {
      initializeDeliverys();
      const savedChecks = localStorage.getItem(localStorageKey);
      if (savedChecks) {
        setCheckedItems(JSON.parse(savedChecks));
      }
    }
  }, [id]);

  const handleCheckboxChange = (index: number) => {
    const updated = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
  };

  function formatDateBR(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  if (isLoading) {
    return (
      <div className={styles.loaderWrap}>
        <div className={styles.loaderBox}>
          <div className={styles.spinner}></div>
          <span className={styles.loaderText}>Carregando dados do pedido...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.topHeader}>
          <h1 className={styles.title}>Consultar pedidos</h1>

          {/* Botões agrupados */}
          <div style={{ display: "flex", gap: "7px" }}>
            <button
              type="button"
              onClick={() => router.push("/deliverys")}
              className={styles.backBtn}
            >
              Voltar
            </button>

            {clientInfo.clientId && (
              <button
                type="button"
                onClick={() =>
                  router.push(`/client/${clientInfo.typeId}&${clientInfo.clientId}`)
                }
                className={styles.backBtn}
              >
                Acessar Cliente
              </button>
            )}

            {id ? (
              <button
                type="button"
                onClick={() => router.push(`../delivery-form/${decodeURIComponent(id)}`)}
                className={styles.editBtn}
              >
                Editar
              </button>
            ) : null}
          </div>
        </div>

        {/* Banner do cliente */}
        <div className={styles.banner}>
          <h2 className={styles.bannerTitle}
            onClick={() =>
              router.push(`/client/${clientInfo.typeId}&${clientInfo.clientId}`)
            }>{deliverysDatas.produto}</h2>
          <div className={styles.bannerRight}>
            <span className={styles.quantityBadge}>{deliverysDatas.quantidade}</span>
            <span className={styles.bannerSub}>Caixas</span>
          </div>
        </div>

        {/* Tabela de produtos */}
        <div className="border border-zinc-300 rounded-lg overflow-hidden text-black">
          {/* cabeçalho - agora com 6 colunas */}
          <div className="hidden sm:grid grid-cols-6 items-center font-semibold text-[#0a2c26] px-4 py-2 text-sm border-b border-zinc-300">
            <span>Selecionar</span>
            <span>Nome</span>
            <span className="text-center">Quantidade</span>
            <span className="text-center">Data</span>
            <span className="text-right">Local</span>
            <span className="text-right">Entregue por</span>
          </div>

          {products.map((product, index) => (
            <div
              key={index}
              /* aqui também 6 colunas em sm (mobile: 1 coluna) */
              className="grid grid-cols-1 sm:grid-cols-6 px-4 py-3 border-t border-zinc-200 text-sm gap-y-1 sm:items-center text-black"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checkedItems[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{checkedItems[index] ? "Preparado" : "Preparando"}</span>
              </div>

              <div>
                <span className="sm:hidden font-semibold text-[#0a2c26]">Nome: </span>
                {product.name}
              </div>

              <div className="text-left sm:text-center">
                <span className="sm:hidden font-semibold text-[#0a2c26]">Quantidade:</span>{" "}
                {product.quantity} {product.unit}
              </div>

              <div className="text-left sm:text-center">
                <span className="sm:hidden font-semibold text-[#0a2c26]">Data:</span>
                {formatDateBR(deliverysDatas.data)}
              </div>

              <div className="text-left sm:text-right">
                <span className="sm:hidden font-semibold text-[#0a2c26]">Local:</span>
                {deliverysDatas.endereco}
              </div>

              <div className="text-left sm:text-right">
                <span className="sm:hidden font-semibold text-[#0a2c26]">Entregue por: </span>
                {deliverysDatas.nome_cami || "—"}
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
