"use client";

import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { getDeliverys } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PedidosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysToDo, setDeliverysToDo] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
{/*Estado SelectedOrder verifica qual o order selecionado  */}

  const initializeDeliverys = async () => {
    try {
      const alreadyValidated = localStorage.getItem("alreadyValidated");
      if (!alreadyValidated) {
        router.push("/login");
      }
      const deliverys: any = await getDeliverys();
      if (deliverys == "invalid" || deliverys == "error") {
        router.push("/login");
      }
      setDeliverysToDo(deliverys);
      setIsLoading(false);
    } catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    initializeDeliverys();
  }, []);

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
              <div key={index}>
                <div 
                  onClick={() => setSelectedOrder(order)}
                  className={styles.orderItem}
                >
                  <p className={styles.orderName}>{order.Produto}</p>
                  <div className={styles.orderQuantity}>
                    <span className={styles.orderCount}>{order.Quantidade}</span>{" "}
                    <span className={styles.orderUnit}>Caixas</span>
                  </div>
                </div>

                {/* Mostrando os detalhes se o card estiver selecionado */}
                {selectedOrder?.id === order.id && (
                  <div className={styles.details}>
                    <p><strong>Local de Entrega:</strong> {order.LocalEntrega}</p>
                    <p><strong>Quantidade de Caixas:</strong> {order.Quantidade}</p>
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
