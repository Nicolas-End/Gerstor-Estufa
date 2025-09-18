
"use client";

import React, { use, useState } from "react";
import Sidebar from "@/Components/sidebar";
import { ValidateHomeAcess, GetEspecificDelivery, EditDelivery, GetAllClients } from "@/lib/ts/api";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Define formato de cada item
interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export default function DeliveryFormPage() {
  const router = useRouter(); // Navegação

  // Estados dos campos principais
  const [customerName, setCustomerName] = useState("");

  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [pageIsLoading, setPageIsLoading] = useState(true)
  const [clientInfo, setClientInfo] = useState<any>({})
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const unitOptions = ["Caixas", "Vasos", "Solto"];
  const [items, setItems] = useState<ItemEntry[]>([]);
  const params = useParams();
  const id: any = params?.id ? params.id : null; // Lista de itens no pedido

  // Adiciona nova linha de item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", unit: unitOptions[0], quantity: 1 },
    ]);
  };

  // Atualiza campo de um item específico
  const updateItem = (
    id: number,
    field: keyof Omit<ItemEntry, "id">,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };
  // Inicia a Pagina Form Verifica se o usuario é valido
  const initializeDeliverForm = async () => {
    try {

      setPageIsLoading(false);
      const delivery: any = await GetEspecificDelivery(id);
      if (typeof delivery === "string") {
        switch (delivery) {
          case "Credencial Invalida":
            router.push('/logout')
            return;
          case "Entrega inexistente":
            showAlert('Entrega não Existente')
            router.push('/deliverys')
            return;
          default:
            showAlert('Erro Interno tente novamente mais tarde')
            router.push('/deliverys')
            return;
        }
      }



      setItems(delivery.products);
      setCustomerName(delivery.deliveryDatas.produto);
      setAddress(delivery.deliveryDatas.endereco);
      setDeliveryDate(delivery.deliveryDatas.data);


      const clients = await GetAllClients()
      if (typeof clients === "string") {
        switch (clients) {
          case "Credencial Invalida":
            showAlert("Suas credenciais sõa invalidas")
            router.push('/logout')
            break;
          default:
            showError("não possivel mostar os cliente tente novamte mais tarde")
            return;
        }
      }
      setClients(clients)

      const idClient = delivery.deliveryDatas.cpf || delivery.deliveryDatas.cnpj || ''

      const selectedClient = clients.find(
        (c: any) => c.cpf === idClient || c.cnpj === idClient
      );
      if (selectedClient) {
        setClientInfo(selectedClient);
      }

    } catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/home");
    }



  }
  // Remove item pelo id
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  function esperar(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }
  // Envia o formulário ao back-end 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientId = clientInfo.cpf || clientInfo.cnpj || 'idClient'
    const typeClientId = clientInfo.cpf ? 'cpf' : clientInfo.cnpj ? 'cnpj' : 'id'
    const formData = {
      id: id,
      name: customerName,
      address,
      deliveryDate,
      items,
      clientId,
      typeClientId
    };

    try {
      setIsLoading(true)
      const data = await EditDelivery(formData);
      switch (data) {
        case true:
          showSucess('Entrega Editada com Sucesso')

          esperar()
          break;
        case "Credencial Invalida":
          showError("Suas Credencias são Invalidas")
          esperar()
          break;
        default:
          showAlert('Houve um erro Interno')
          showAlert('Tente novamente mais tarde')
          break;
      }
      setIsLoading(false)

    } catch (error) {
      showError("Houve erro Interno")
    }
  };
  useEffect(() => {
    initializeDeliverForm();

  }, []);
  if (pageIsLoading) {
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
      <>
        <div className="flex flex-row min-h-screen bg-gray-100 overflow-y-auto">
          <Sidebar /> {/* Barra lateral */}
          <div className="flex-1 p-8 flex flex-col">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-800">Editar Pedido</h1>
              <button
                type="button"
                onClick={() => router.push("/deliverys")}
                className="bg-green-900 text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-green-800 transition"
              >
                Voltar
              </button>
            </div>

            {/* Formulário de pedido */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg w-full shadow gap-4 flex flex-col mb-6"
            >
              {/* Campos Nome, Endereço e Data de Entrega */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Nome do cliente */}
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-green-900 text-[18px] mb-2"
                  >
                    Nome
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600"
                    placeholder="Digite o nome da entrega"
                    required
                  />
                </div>
                {/* Endereço */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-green-900 text-[18px] mb-2"
                  >
                    Endereço
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setClientInfo("")
                      setAddress(e.target.value)
                    }}
                    className=" text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600"
                    placeholder="Digite o endereço"
                    required
                  />
                </div>
                {/* Data de Entrega */}
                <div>
                  <label
                    htmlFor="deliveryDate"
                    className="block text-green-900 text-[18px] mb-2"
                  >
                    Data de Entrega
                  </label><DatePicker
                    id="deliveryDate"
                    selected={deliveryDate} 
                    onChange={(date: Date | null) => setDeliveryDate(date)}
                    className="text-gray-600 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholderText="dd/mm/aaaa"
                    required
                    minDate={new Date()} // Limita a data mínima para o dia atual(Para que não haja datas anteriores ao dia de hoje)
                    maxDate={(() => {
                      const max = new Date();
                      max.setMonth(max.getMonth() + 2);
                      return max;
                    })()} // Limita a data máxima para 2 meses no futuro
                    dateFormat="dd/MM/yyyy" // Formato que será exibido a data 
                  />
                  <div>
                    <label
                      htmlFor="deliveryDate"
                      className="block text-green-900 text-[18px] mb-2"
                    >Cliente
                    </label>
                    <select
                      value={clientInfo?.cpf || clientInfo?.cnpj || ""}
                      onChange={(e) => {

                        const selectedClient = clients.find(
                          (c: any) => c.cpf === e.target.value || c.cnpj === e.target.value
                        );
                        if (selectedClient) {
                          setClientInfo(selectedClient);

                          setAddress(selectedClient.address);
                        } else {
                          setClientInfo("")
                          setAddress("")
                        }
                      }}
                      className="w-fit px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    >
                      <option value="">Escolha um cliente (Opcional)</option>
                      {clients.map((client: any, index: number) => (
                        <option key={index} value={client.cpf || client.cnpj}>
                          {client.name} - {client.cpf || client.cnpj}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Seção Dinâmica */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className=" text-green-900 text-[18px]">Itens a entregar</p>
                    <button
                      type="button"
                      onClick={addItem}
                      className="bg-green-900 text-white py-1 px-3 font-bold rounded-lg shadow hover:bg-green-800 transition text-sm"
                    >
                      + Adicionar Item
                    </button>
                  </div>

                  {/* Lista de itens */}
                  <div className="space-y-4">
                    {items.length === 0 && (
                      <p className="text-gray-600 text-center py-4">
                        Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                      </p>
                    )}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row md:items-center md:space-x-4 bg-gray-50 p-4 rounded-lg"
                      >
                        {/* Nome do item */}
                        <input
                          type="text"
                          placeholder="Nome do item"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          className="text-black flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0 placeholder-gray-600"
                          required
                        />
                        <div className="flex space-x-[150px]">
                          {/* Quantidade */}
                          <input
                            type="number"
                            min={0}
                            placeholder="Quantidade"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="text-black w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                            required
                          />
                          {/* Unidade */}
                          <select
                            value={item.unit}
                            onChange={(e) =>
                              updateItem(item.id, "unit", e.target.value)
                            }
                            className="text-black w-32 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                          >
                            {unitOptions.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-center">
                          {/* Botão remover */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão Enviar Pedido */}
                <button
                  type="submit"
                  disabled={items.length === 0 || isLoading}
                  className="mt-auto bg-green-900 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-800 transition self-end disabled:bg-gray-400 disabled:cursor-not-allowed "
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">Editando Entrega ...</span>
                      <i className="fas fa-spinner fa-spin"></i>
                    </div>
                  ) : (
                    "Editar Pedido"
                  )}

                </button>
                </div>
            </form>
          </div>
        </div>

        {/* Estilização para tornar o ícone de data branco */}
        <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(1);
        }
      `}</style>
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
      </>
    );
  }
}
