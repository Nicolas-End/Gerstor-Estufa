"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { getDeliverys, validateHomeAcess } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PedidosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysToDo, setDeliverysToDo] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
       initializeDeliverys();
   }, []);

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
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Pedidos</h1>
              <div className={styles.count}>{deliverysToDo.length}</div>
            </div>
            <button
              onClick={() => router.push("/delivery-form")}
              className={styles.addButton}>
              + Adicionar
            </button>
          </div>
          <div className={styles.ordersList}>
            {deliverysToDo.map((order, index) => (
              <div
                key={index}
                className={styles.card}
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
                   <div className="gap-6 flex flex-row-reverse">
                      <div><button><FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " /></button></div>
                      <div><button><FontAwesomeIcon icon={faTruckFast} className="text-white hover:text-green-500 transition-colors duration-200" /></button></div>
                      <div><button onClick={() => router.push(`delivery-form/${order.id}`)}><FontAwesomeIcon icon={faPenToSquare} className="text-white hover:text-yellow-400 transition-colors duration-200" /></button></div>
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