"use client";

import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { getDeliverys, validateHomeAcess } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function PedidosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysToDo, setDeliverysToDo] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const initializeDeliverys = async () => {
    try {
      const can_access_home = await validateHomeAcess(router);
      if (!can_access_home) {
        router.push("/login");
        return;
      }

      const deliverys: any = await getDeliverys();
      console.log("Resposta da API: ", deliverys);

      if (!Array.isArray(deliverys)) {
        setDeliverysToDo([]);
        setIsLoading(false);
        return;
      }

      setDeliverysToDo(deliverys);
      setIsLoading(false);
    } catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/login");
    }
  };


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

            <div className="flex items-center space-x-4">
              <div className={styles.count}>{deliverysToDo.length}</div>

              <button
                onClick={() => router.push("/delivery-form")}
                className="bg-green-900 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-800 transition"
              >
                + Adicionar
              </button>
            </div>
          </div>

          <div className={styles.ordersList}>
            {deliverysToDo.map((order, index) => (
              <div
                key={index}
                className={styles.card}
                data-aos="fade-up"
                data-aos-duration="3000"
              >
                <div
                  onDoubleClick={() => router.push(`delivery/${order.id}`)}
                  onClick={() => setSelectedOrder(order)}
                  className={styles.orderItem}
                >
                  <p className={styles.orderName}>{order.Produto}</p>
                  <div className={styles.orderQuantity}>
                    <span className={styles.orderCount}>{order.Quantidade}</span>{" "}
                    <span className={styles.orderUnit}>Caixas</span>
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className={styles.details}>
                    <p className="text-black">
                      <strong>Local de Entrega:</strong> {order.LocalEntrega}
                    </p>
                    <p className="text-black">
                      <strong>Data de Entrega:</strong> {order.DataEntrega}
                    </p>
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
