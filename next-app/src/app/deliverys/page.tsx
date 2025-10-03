"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { DeleteEspecificDelivery, EditDeliveryStatus, GetDeliverys } from "@/lib/ts/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";
import { socketService } from "@/lib/config/sockteioConfig";
import { Socket } from "socket.io-client";
import StatusChecklist, { Status } from "./status-delivery";

function normalizeStatus(raw: any) {
  const s = String(raw ?? "").toLowerCase();
  if (s.includes("and") || s.includes("em andamento") || s.includes("andamento")) return "andamento";
  if (s.includes("final") || s.includes("concl")) return "finalizado";
  return "pendente";
}

export default function PedidosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysToDo, setDeliverysToDo] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [searchStatus, setSearchStatus] = useState<'Todos' | 'pendente' | 'em andamento' | 'finalizado'>('Todos');

  // --- modal de status (somente visual) ---
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalOrder, setModalOrder] = useState<any | null>(null);
  const [modalStatus, setModalStatus] = useState<Status>("pendente");

  const openStatusModal = (order: any) => {
    setModalOrder(order);

    // tenta casar um valor visual inicial (se tiver order.status)
    const normalized = String(order?.status ?? "pendente").toLowerCase();
    if (normalized.includes("and") || normalized.includes("andamento")) setModalStatus("andamento");
    else if (normalized.includes("final") || normalized.includes("concluido")) setModalStatus("concluido");

    else setModalStatus("pendente");
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setModalOrder(null);
  };

  const handleSaveStatus = async() => {
    try{
    const response = await EditDeliveryStatus(modalOrder.id,modalStatus)
    if (response=== true){
      showSucess("Status Do Pedido Atualizado");

    }
    else if(response === "Credencial Invalida"){
      showError("Credenciais Invalidas")
      router.push('/logout')

    }
    else if(response === "Não Foi Possivel Editar Status"){
      showAlert('Não foi possivel mudar o status da entrega')

    }
    else{
      showAlert('Houve um erro Interno tente novamente mais tarde')

    }
    // Só fecha o modal — sem alterar nada no estado global / sem chamadas à API.
    closeStatusModal();
  }catch(error){
    showAlert('Houve um erro Interno tente novamente mais tarde')
  }
  };

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

  useEffect(() => {
    let socket: null | Socket = null;

    async function setup() {
      // Inicializando as deliverys
      initializeDeliverys();

      // Inicializando o socket apenas uma vez
      socket = await socketService.initSocket();

      // Adicionando o listener apenas uma vez
      socket?.on('add_delivery', () => {
        showSucess('Nova entrega cadastrada, Atualize a pagina');
      });
    }

    // Chama a função de setup
    setup();

    // Limpeza dos listeners e do socket ao desmontar
    return () => {
      if (socket) {
        socket.off('add_delivery'); // Remove o listener
      }
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
                    <div className={styles.nameRow}>
                      <span
                        className={`${(styles as any).statusDotInline} ${(styles as any)[`dot-${normalizeStatus(order.status)}`]}`}
                        aria-hidden="true"
                        title={String(order.status ?? "Pendente")}
                      />
                      <p className={styles.orderName}>{order.Produto}</p>
                    </div>
                    <div className={styles.orderQuantity}>
                      <span className={styles.orderCount}>{order.Quantidade}</span>{" "}
                      <span className={styles.orderUnit}>Caixas</span>
                    </div>
                    <div className="gap-6 flex flex-row-reverse">
                      {/* Botão que abre modal de status (somente visual) */}
                      <div><button onClick={() => confirmToast(order.id)}><FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " /></button></div>
                      <div><button onClick={() => openStatusModal(order)}><FontAwesomeIcon icon={faArrowsRotate} className="text-white hover:text-blue-500 transition-colors duration-200" /></button></div>
                      <div><button onClick={() => router.push(`delivery-form/${order.id}`)}><FontAwesomeIcon icon={faPenToSquare} className="text-white hover:text-yellow-400 transition-colors duration-200" /></button></div>
                    </div>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className={styles.details}>
                      <p className="text-black">
                        <strong>Local de Entrega:</strong> {order.LocalEntrega}
                      </p>
                      <p className="text-black">
                        <strong>Data de Entrega:</strong> {new Date(order.DataEntrega).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Modal de status: somente visual (sem persistência) */}
        {isStatusModalOpen && modalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeStatusModal} />
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 z-10">
              <h2 className="text-xl font-bold mb-4">Visualizar Status - {modalOrder.Produto ?? modalOrder.id}</h2>

              <StatusChecklist
                value={modalStatus}
                onChange={(s) => setModalStatus(s)}
                name={`status-checklist-${modalOrder.id}`}
              />

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={closeStatusModal} className="px-4 py-2 rounded border">
                  Cancelar
                </button>
                <button onClick={handleSaveStatus} className="px-4 py-2 rounded bg-[#005E40] text-white">
                  Concluir
                </button>
              </div>
            </div>
          </div>
        )}

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
