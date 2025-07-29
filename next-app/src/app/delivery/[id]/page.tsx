"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEscificDelivery } from "@/lib/ts/api";
import Sidebar from "@/Components/sidebar";


export default function ProdutoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysDatas, setDeliveryDatas] = useState<any>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
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
      const delivery: any = await getEscificDelivery(id);
      if (delivery === "invalid" || delivery === "error") {
        router.push("/login");
        return;
      }
      setDeliveryDatas(delivery.deliveryDatas);
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
      <div className={`${styles.content} p-6`}>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#0a2c26]">PEDIDOS</h1>
          <button
            type="button"
            onClick={() => router.push("/deliverys")}
            className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
          >
            Voltar
          </button>
        </div>

        <div className="bg-[#0a2c26] text-white rounded-xl p-6 shadow-md flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{deliverysDatas.produto}</h2>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold">{deliverysDatas.quantidade}</span>
            <span className="text-sm uppercase tracking-wider">Caixas</span>
          </div>
        </div>

        <div className="border border-zinc-300 rounded-lg overflow-hidden text-black">

          <div className="hidden sm:grid grid-cols-5 font-semibold text-black px-4 py-2 text-sm border-b border-zinc-300">
            <span>Selecionar</span>
            <span>Nome</span>
            <span className="text-center">Quantidade</span>
            <span className="text-center">Data</span>
            <span className="text-right">Local</span>
          </div>

          {products.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-5 px-4 py-3 border-t border-zinc-200 text-sm gap-y-1 sm:items-center text-black"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checkedItems[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                  className="w-4 h-4"
                /> 
                <span className="text-sm">Preparado</span>
              </div>
              <div>
                <span className="sm:hidden font-semibold">Nome: </span>
                {product.name}
              </div>
              <div className="text-left sm:text-center">
                <span className="sm:hidden font-semibold">Quantidade: </span>
                {product.quantity} {product.unit}
              </div>
              <div className="text-left sm:text-center">
                <span className="sm:hidden font-semibold">Data: </span>
                {formatDateBR(deliverysDatas.data)}
              </div>
              <div className="text-left sm:text-right">
                <span className="sm:hidden font-semibold">Local: </span>
                {deliverysDatas.endereco}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}