"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import OrderItem from "@/Components/order-items";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { DeleteEspecificDelivery, GetDeliverys } from "@/lib/ts/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { cookies } from "next/headers";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";

import { Socket } from "socket.io-client";
import { socketService } from "@/lib/config/sockteioConfig";


export default function PedidosPage() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysToDo, setDeliverysToDo] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [searchStatus, setSearchStatus] = useState<'Todos' | 'pendente' | 'em andamento' | 'finalizado'>('Todos')


  function confirmToast(id: string) {
    const toastId = toast.info(
      <div>
        <p>Tem certeza que deseja excluir essa entrega?</p>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(toastId);

              showDeleteDeliveryBox(id)

            }}
            className="bg-green-600 text-white px-3 py-1 rounded mr-2"
          >
            Sim
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        closeOnClick: false,
        closeButton: false,
      }
    )
  }


  async function showDeleteDeliveryBox(delivery_id: string) {
    const data = await DeleteEspecificDelivery(delivery_id)
    if (data === true) {
      router.refresh()
      showSucess("Excluido com sucesso")

    } else if (data === "Credencial Invalida") {
      showAlert("Credencial invalida")
      router.push('/logout')
    } else {
      showAlert('Houve um erro interno Tente apagar denovo mais tarde')
    }

    if (data) {
      initializeDeliverys()
      return;
    }
    showAlert('Houve algum erro no processo !!')


  }
  const initializeDeliverys = async () => {
    try {

      const deliverys: any = await GetDeliverys();

      if (typeof deliverys == "string") {
        switch (deliverys) {
          case "Credencial Invalida":
            showAlert("Credencias Invalidas")

            router.push("/logout")
            return;
          default:
            showAlert("Houver um erro Interno Tente novamente mais tarde ")
            setIsLoading(false)
            return;
        }
      }

      if (!Array.isArray(deliverys)) {
        setDeliverysToDo([]);
        setIsLoading(false);
        return;
      }

      setDeliverysToDo(deliverys);
      setIsLoading(false);
    } catch (error) {
      showError("Houve um erro interno tente novamente mais tarde")
      setIsLoading(false)
    }
  };
  function esperar(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }
  useEffect(() => {
    let socket: any

    async function setup() {


      initializeDeliverys();

      const socket = await socketService.initSocket()

      socket?.on('add_delivery', () => {
        showSucess('Nova entrega cadastrada, Atualize a pagina')        
      })

    }

    setup();

    return () => {
      socket?.off('add_delivery')
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#005E40] border-t-transparent rounded-full animate-spin" />
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
          <select
            value={searchStatus}
            onChange={e =>
              setSearchStatus(e.target.value as 'Todos' | 'pendente' | 'em andamento' | 'finalizado')
            }
            className="w-fit px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            <option value="Todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em andamento</option>
            <option value="finalizado">Finalizado</option>
          </select>
          <div className={styles.ordersList}>

            {deliverysToDo.filter(order => {
              if (searchStatus === 'Todos') return true;
              return order.status === searchStatus
            })
              .map((order, index) => (
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
                      <div><button onClick={() => confirmToast(order.id)}><FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " /></button></div>
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
}