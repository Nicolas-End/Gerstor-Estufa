"use client";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { getDeliverys } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
export default function PedidosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysToDo, setDeliverysToDo] = useState<any[]>([]);
  const initializePedidos = async () => {
    try {
      const alreadyValidated = localStorage.getItem("alreadyValidated");
      // Controle para verficar se o usuario ja acessou o home alguma vez
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
  const orders = [
    { name: "Suculenta", quantity: 20, unit: "Caixas" },
    { name: "Cactos", quantity: 20, unit: "Caixas" },
    { name: "Pimenta", quantity: 60, unit: "porta vasos" },
    { name: "Túia", quantity: 10, unit: "Caixas" },
  ];
  useEffect(() => {
    initializePedidos();
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
              <div key={index} className={styles.orderItem}>
                <p className={styles.orderName}>{order.Produto}</p>
                <div className={styles.orderQuantity}>
                  <span className={styles.orderCount}>{order.Quantidade}</span>{" "}
                  <span className={styles.orderUnit}>Caixas</span>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
