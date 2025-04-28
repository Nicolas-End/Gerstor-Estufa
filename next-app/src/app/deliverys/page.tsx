"use client";

import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { getDeliverys } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PedidosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysToDo, setDeliverysToDo] = useState<any[]>([]); // Inicializa como array vazio
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Inicializa os dados dos pedidos
  const initializeDeliverys = async () => {
    try {
      const alreadyValidated = localStorage.getItem("alreadyValidated");
      if (!alreadyValidated) {
        router.push("/login");
        return;
      }

      const deliverys: any = await getDeliverys();
      console.log("Resposta da API: ", deliverys);

      // Verifica se deliverys é um array válido
      if (!Array.isArray(deliverys)) {
        console.error("A resposta da API não é um array.");
        setDeliverysToDo([]); // Se não for um array, define como array vazio
        setIsLoading(false);
        return;
      }

      setDeliverysToDo(deliverys); // Atualiza o estado com os pedidos
      setIsLoading(false);
    } catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/login");
    }
  };

  // Chama a função de inicialização ao montar o componente
  useEffect(() => {
    initializeDeliverys();
  }, []);

  // Carregando...
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-medium">Carregando...</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Pedidos</h1>
            <div className={styles.count}>{deliverysToDo.length}</div>
          </div>

          <div className={styles.ordersList}>
            {deliverysToDo.map((order, index) => (
              <div key={index} className={styles.card}>
                <div 
                  onDoubleClick={() => router.push(`delivery/${order.id}`)}
                  onClick={() => setSelectedOrder(order)} // Altera o pedido selecionado
                  className={styles.orderItem}
                >
                  <p className={styles.orderName}>{order.Produto}</p>
                  <div className={styles.orderQuantity}>
                    <span className={styles.orderCount}>{order.Quantidade}</span>{" "}
                    <span className={styles.orderUnit}>Caixas</span>
                  </div>
                </div>

                {/* Exibe os detalhes se o pedido estiver selecionado */}
                {selectedOrder?.id === order.id && (
                  <div className={styles.details}>
                    <p><strong>Local de Entrega:</strong> {order.LocalEntrega}</p>
                    <p><strong>Data de Entrega: </strong> {order.DataEntrega}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
