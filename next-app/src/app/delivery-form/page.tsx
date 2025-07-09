"use client";
import React, { useState } from "react";
import Sidebar from "@/Components/sidebar";
import { useRouter } from "next/navigation";
import { addNewItemDelivery, validateHomeAcess } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

// Define formato de cada item
interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export default function DeliveryFormPage() {
  const router = useRouter(); // Navegação
  
  function ShowAlert(text: string) {
    toast(text, {
      style: {
        backgroundColor: "#fff",
        color: "#2b192e",
        fontFamily: "Arial, sans-serif",
      },
    });
  }

  // Estados dos campos principais
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const unitOptions = ["Caixas", "Vasos", "Solto"];
  const [items, setItems] = useState<ItemEntry[]>([]); // Lista de itens no pedido

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
      const can_access_home = await validateHomeAcess(router);

      if (!can_access_home) {
        router.push("/login");
        return;
      }
      setPageIsLoading(false);
    } catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/login");
    }
  };

  // Remove item pelo id
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Envia o formulário ao back-end
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      name: customerName,
      address,
      deliveryDate,
      items,
    };

    try {
      setIsLoading(true);
      const data = await addNewItemDelivery(formData);
      if (data === "ok") {
        ShowAlert("Entrega Adicionada com Sucesso");
        setAddress("");
        setCustomerName("");
        setDeliveryDate("");
        setItems([]);
        setIsLoading(false);
      } else {
        ShowAlert("Opss.. Houve um erro");
        ShowAlert("Tente novamente mais tarde");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
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
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar /> {/* Barra lateral */}
          <div className="flex-1 p-8 flex flex-col min-h-screen">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-800">Novo Pedido</h1>
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
              className="bg-white p-6 rounded-lg shadow flex-1 overflow-auto flex flex-col mb-6"
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
                    onChange={(e) => setAddress(e.target.value)}
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
                  </label>
                  <input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className=" text-gray-600 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
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
                      <div className="flex space-x-4 md:space-x-[150px]">
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
                    <span className="mr-2">Adicionando Entrega ...</span>
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                ) : (
                  "Enviar Pedido"
                )}
              </button>
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