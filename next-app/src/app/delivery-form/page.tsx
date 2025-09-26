"use client";
import React, { useState } from "react";
import Sidebar from "@/Components/sidebar";
import { useRouter } from "next/navigation";
import { AddNewDelivery, ValidateHomeAcess, GetAllClients, GetAllTrucksDrivers, GetAllProductsWithItens } from "@/lib/ts/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";

import { socketService } from "@/lib/config/sockteioConfig";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Define formato de cada item
interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  limit_quantity: number;
  lubally: string[];
  capacity:number;
}

export default function DeliveryFormPage() {
  const router = useRouter(); // Navegação
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

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
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  let unitOptions = [''];
  const [items, setItems] = useState<ItemEntry[]>([]); // Lista de itens no pedido
  const [clientInfo, setClientInfo] = useState<any>(null);
  // Estado para todos os motoristas
  const [driverInfo, setDriverInfo] = useState<any[]>([]);
  const [productsStocks, setProductsStocks] = useState<any[]>([]);
  // Estado para motorista selecionado
  const [selectedDriver, setSelectedDriver] = useState<any>(null);


  // Adiciona nova linha de item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", unit: unitOptions[0], quantity: 1, limit_quantity:0, lubally: [""], capacity:1},
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
      const can_access_home = await ValidateHomeAcess(router);


      if (!can_access_home) {
        router.push("/logout");

        return;
      }
      setPageIsLoading(false);

      const [clients, trucks_drivers, products_stocks] = await Promise.all([GetAllClients(), GetAllTrucksDrivers(), GetAllProductsWithItens()])
      if (typeof clients === "string") {
        switch (clients) {
          case "Credencial Invalida":
            showAlert("Suas credenciais são invalidas")
            router.push('/logout')

            break;
          default:
            showError("não possivel mostar os cliente tente novamte mais tarde")

            return;
        }
      }
      if (typeof trucks_drivers === "string") {
        switch (trucks_drivers) {
          case "Nenhum Caminoeiro Cadastrado":
            return;
          case "Credenciais Invalidas":
            showAlert("Suas credenciais são invalidas")
            router.push('/logout')
            return;
          default:
            showError("não possivel mostar os caminhoneiros tente novamte mais tarde")

            return;
        }
      }
      if (typeof products_stocks === "string") {
        switch (products_stocks) {
          case "Credenciais Invalidas":
            showAlert("Suas credenciais são invalidas")
            router.push('/logout')
            return;
          default:
            showError("não possivel mostar as embalagens tente novamte mais tarde")
            return;
        }
      }
      const driversArray = Array.isArray(trucks_drivers) ? trucks_drivers : [];


      setClients(clients)
      setDriverInfo(driversArray)
      setProductsStocks(products_stocks)

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
    const clientName = clientInfo.name
    e.preventDefault();
    const formData = {
      name: customerName,
      address,
      deliveryDate,
      items,
      clientName,
      clientId: clientInfo?.cpf || clientInfo?.cnpj || 'idClient',
      typeClientId: clientInfo?.cpf ? 'cpf' : clientInfo?.cnpj ? 'cpnj' : 'id',
      truckDriverEmail: selectedDriver?.email,
      truckDriverName: selectedDriver?.name
    };

    try {
      setIsLoading(true);
      const data = await AddNewDelivery(formData);
      const socket = await socketService.initSocket()
      if (data === true) {
        showSucess("Entrega Adicionada com Sucesso");
        // enviando para o sistema que tem uma nova entrega disponivel
        socket?.emit('new_delivery')

        setAddress("");
        setCustomerName("");
        setItems([]);
        setClientInfo("")
        setIsLoading(false);

      } else if (data === "Erro Interno") {
        showAlert("Opss.. Houve um erro");
        showAlert("Tente novamente mais tarde");
        setIsLoading(false);

      } else {

        router.push('/logout')
      }
    } catch (error) {
      showAlert("Opss.. Houve um erro");
      showAlert("Tente novamente mais tarde");
      setIsLoading(false);
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
        <div className="flex h-auto min-h-screen bg-gray-100">
          <Sidebar /> {/* Barra lateral */}
          <div className="flex-1 p-8 flex flex-col min-h-screen">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-800">Novo Pedido</h1>
              <button
                type="button"
                onClick={() => router.push("/deliverys")}
                className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
              >
                Voltar
              </button>
            </div>
            {/* Formulário de pedido */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow overflow-auto flex flex-col mb-6 min-h-fit"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Seleção do Cliente */}
                <div className="mb-4">
                  <label htmlFor="clientSelect" className="block text-green-900 text-[18px] mb-2">
                    Cliente
                  </label>
                  <select
                    id="clientSelect"
                    value={clientInfo?.cpf || clientInfo?.cnpj || ""}
                    onChange={(e) => {
                      const selectedClient = clients.find(
                        (c) => (c.cpf === e.target.value || c.cnpj === e.target.value)
                      );
                      setClientInfo(selectedClient || null);
                      if (selectedClient)
                        setAddress(selectedClient.address)
                      else
                        setAddress('')
                    }}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  >
                    <option value="">Escolha um cliente </option>
                    {clients.map((client, index) => (
                      <option key={index} value={client.cpf || client.cnpj}>
                        {client.name} - {client.cpf || client.cnpj}
                      </option>
                    ))}
                  </select>
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
                    className=" text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
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
                  <DatePicker
                    id="deliveryDate"
                    selected={deliveryDate} // Use 'selected' para passar a data
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
                </div>


                {/*Caminhoneiro*/}
                <div>
                  <label
                    htmlFor="driverSelect"
                    className="block text-green-900 text-[18px] mb-2"
                  >
                    Caminhoneiro
                  </label>
                  <select
                    id="driverSelect"
                    value={selectedDriver?.email || ""}
                    required
                    onChange={(e) => {
                      const driver = driverInfo.find((d: any) => d.email === e.target.value);
                      setSelectedDriver(driver || null);
                    }}
                    className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
                  >
                    <option value="">Escolha um Caminhoneiro</option>
                    {driverInfo.map((driver: any, index: number) => (
                      <option key={index} value={driver.email}>
                        {driver.name} - {driver.email}
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
                    className="bg-[#0a3b2c] text-white py-1 px-3 font-bold rounded-lg shadow hover:bg-[#117255] transition text-sm"
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
                      <select
                        value={item.name} // estado que guarda o valor selecionado
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          const selectedProduct = productsStocks.find(
                            (p: any) => p.name === selectedName
                          );

                          // Atualiza nome
                          updateItem(item.id, "name", selectedName);

                          // Atualiza os tipos de embalos disponivies para tal produto
                          if (selectedProduct) {
                            updateItem(item.id, "lubally", selectedProduct.lullaby);
                            updateItem(item.id, "limit_quantity" , selectedProduct.quantity)
                          }
                        }
                        }
                        className="text-black flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                        required
                      >
                        <option value="" disabled>Selecione uma categoria</option>
                        {productsStocks.map((product: any, index: number) => (
                          <option key={index} value={product.email}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <div className="flex space-x-4 md:space-x-[150px]">
                        {/* Quantidade */}
                        <input
                          type="number"
                          min={0}
                          max={item.limit_quantity/item.capacity < 0 ? 0 : Math.floor(item.limit_quantity/item.capacity)}
                          placeholder="Quantidade"
                          value={item.quantity}
                          onChange={(e) =>{

                            updateItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                        }
                          className="text-black w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                          required
                        />
                        {/* Unidade */}
                        <select
                          value={item.unit}
                          onChange={(e) =>{
                            updateItem(item.id, "unit", e.target.value)
                            updateItem(item.id, "capacity", item.lubally[e.target.value])
                            
                          }
                          }
                          className="text-black w-32 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                        >
                          {Object.keys(item.lubally).map((key) => (
                            <option key={key} value={key}>{key} - {item.lubally[key]}</option> // exibe: caixa, Vaso, ...
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
                  <br />
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