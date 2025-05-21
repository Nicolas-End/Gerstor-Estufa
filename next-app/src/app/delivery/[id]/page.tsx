"use client";

import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEscificDelivery, validateHomeAcess } from "@/lib/api";
import Sidebar from "@/Components/sidebar";

export default function ProdutoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysDatas, setDeliveryDatas] = useState<any[]>([]); // Array que guarda os dados do pedido
  const router = useRouter();
  const params = useParams();

  // Verifica se o ID existe, se não existir torna-se null
  const id: any = params?.id ? params.id : null;

  // Função para carregar os dados da entrega
  const initializeDeliverys = async () => {
    try {
      const can_access_home = await validateHomeAcess(router);
      if (!can_access_home) {
        router.push("/login");
        return;
      }

      if (id === null) {
        // Verifica se o ID é válido
        console.log("ID inválido");
        return;
      }

      const delivery: any = await getEscificDelivery(id);
      if (delivery === "invalid" || delivery === "error") {
        router.push("/login"); // Redireciona caso haja erro
        return;
      }

      setDeliveryDatas([delivery]); // Atualiza o estado com os dados da entrega
      setIsLoading(false);
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
      router.push("/login");
    }
  };

  // Carrega os dados do pedido assim que o ID estiver disponível
  useEffect(() => {
    if (id !== null) {
      initializeDeliverys(); // Chama a função de inicialização
    }
  }, [id]);

  // Exibe um carregamento até que os dados sejam carregados
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-semibold">
            Carregando dados do pedido...
          </span>
        </div>
      </div>
    );
  }

  // Aqui a variável selectedOrder é o primeiro pedido no array deliverysDatas
  const selectedOrder = deliverysDatas[0]; // Acessando o pedido único

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1>PEDIDOS</h1>

        {/* Cabeçalho escuro com nome e quantidade */}
        <div className={styles.orderBox}>
          <div className={styles.orderHeader}>
            <h1 className={styles.produto}>{selectedOrder.Produto}</h1>
            <div className={styles.totalQuantity}>
              <span>{selectedOrder.Quantidade}</span>
              <span>Caixas</span>
            </div>
          </div>
        </div>

        {/* Exibindo os detalhes adicionais do pedido */}
        <div className={styles.details}>
          <p>
            <strong>Local de Entrega:</strong> {selectedOrder.LocalEntrega}
          </p>
          <p>
            <strong>Quantidade de Caixas:</strong> {selectedOrder.Quantidade}
          </p>
        </div>
      </div>
    </div>
  );
}
