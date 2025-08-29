"use client";
import styles from "./page.module.css";
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetEspecificDelivery } from "@/lib/ts/api";
import Sidebar from "@/Components/sidebar";
import { showAlert } from "@/lib/controller/alertsController";
import { ToastContainer, toast } from "react-toastify";


export default function ProdutoPage() {

  const [isLoading, setIsLoading] = useState(true);
  const [deliverysDatas, setDeliveryDatas] = useState<any>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  const [clientInfo, setClientInfo] = useState<any>({})
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
            router.push('/logout')
            break;
          case "Entrega inexistente":
            showAlert('Entrega não Existente')
            router.push('/deliverys')
            break;
          default:
            showAlert('Entrega Interno tente novamente mais tarde')
            router.push('/deliverys')
            break;
        }
      }
      const clienttypeId = delivery.deliveryDatas.cpf ? 'cpf' : delivery.deliveryDatas.cnpj ? 'cnpj' : ''
      const clientId = delivery.deliveryDatas.cpf || delivery.deliveryDatas.cnpj || ''

      setDeliveryDatas(delivery.deliveryDatas);
      setClientInfo({ clientId: clientId, typeId: clienttypeId })
      setProducts(delivery.products);
      setIsLoading(false);
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (id !== null) {
      initializeDeliverys();
      // serve para salvar as produtos ja preparados
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
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-semibold">Carregando dados do pedido...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        <header className={styles.topHeader}>
          <h1 className={styles.title}>Consultar Pedido</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => router.push("/functionaries")}
              className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
            >
              Voltar
            </button>

            {products.map((order) => (
              <button key={order.id}
                type="button"
                onClick={() => router.push(`delivery-form/${order.id}`)}
                className="bg-yellow-600 text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-yellow-700 transition"
              >
                Editar
              </button>
            ))}
          </div>
        </header>

        <section className={styles.banner}>
          <div>
            <div className={styles.bannerTitle}>{deliverysDatas.produto}</div>
          </div>

          <div className={styles.bannerRight}>
            <span className={styles.quantityBadge}>
              {deliverysDatas.quantidade}
            </span>
          </div>
        </section>

        {products.map((product) => (
          <section key={product.id} className={styles.functionaryBox}>
            <div className={styles.functionaryRow}>
              <div className={styles.functionaryLabel}>Nome:</div>
              <div className={styles.functionaryValue}>{product.name}</div>
            </div>

            <div className={styles.functionaryRow}>
              <div className={styles.functionaryLabel}>Quantidade:</div>
              <div className={styles.functionaryValue}>{product.quantidade}{product.unit}</div>
            </div>

            <div className={styles.functionaryRow}>
              <div className={styles.functionaryLabel}>Data da entrega:</div>
              <div className={styles.functionaryValue}>
                {formatDateBR(deliverysDatas.data)}
              </div>
            </div>
            <div className={styles.functionaryRow}>
              <div className={styles.functionaryLabel}>Endereço:</div>
              <div className={styles.functionaryValue}>{deliverysDatas.endereco}</div>
            </div>

            <div className={styles.functionaryRow}>
              <div className={styles.functionaryLabel}>Cliente:</div>
              <Link href={`/client/${clientInfo.typeId}/${clientInfo.clientId}`}>
                <div className={styles.functionaryValue}>
                  <span className="underline"> {clientInfo?.name} Reginaldo</span>
                </div>
              </Link>
            </div>
          </section>
        ))}
      </main>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}