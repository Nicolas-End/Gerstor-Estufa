"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/Components/sidebar";
import {
  GetEspecificDelivery,
  EditDelivery,
  GetAllClients,
  GetAllTrucksDrivers,
  GetAllProductsWithItens,
} from "@/lib/ts/api";
import {
  showAlert,
  showError,
  showSucess,
} from "@/lib/controller/alerts-controller";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ConstructionIcon } from "lucide-react";
import { faCropSimple } from "@fortawesome/free-solid-svg-icons";


interface ItemEntry {
  item_id: number;
  name: string;
  unit: string;
  quantity: number;
  limit_quantity: number;
  lubally: string[];
  capacity: number;
  product_id: string;
}

export default function EditDeliveryFormPage() {
  const router = useRouter();
  const params = useParams();
  const id: any = params?.id ? params.id : null;

  // Estados
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<any>({});
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ItemEntry[]>([]);
  let unitOptions = [''];
  const [driverInfo, setDriverInfo] = useState<any[]>([])
  const [productsStocks, setProductsStocks] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  // Funções auxiliares
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { item_id: Date.now(), name: "", unit: unitOptions[0], quantity: 1, limit_quantity: 0, lubally: [""], capacity: 1, product_id: '' },
    ]);
  };

  // Atualiza campo de um item específico
  const updateItem = (
    id: number,
    field: keyof Omit<ItemEntry, "id">,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.item_id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.item_id !== id));
  };


  const initializeDeliverForm = async () => {
    try {
      setPageIsLoading(false);
      const delivery: any = await GetEspecificDelivery(id);

      if (typeof delivery === "string") {
        switch (delivery) {
          case "Credencial Invalida":
            router.push("/logout");
            return;
          case "Entrega inexistente":
            showAlert("Entrega não existente");
            router.push("/deliverys");
            return;
          default:
            showAlert("Erro interno. Tente novamente mais tarde");
            router.push("/deliverys");
            return;
        }
      }

      // Preenche estados em relação aos dados da entrega

      setCustomerName(delivery.deliveryDatas.produto);
      setAddress(delivery.deliveryDatas.endereco);
      setDeliveryDate(new Date(delivery.deliveryDatas.data));
      setSelectedDriver({ 'email': delivery.deliveryDatas.email_cami, 'name': delivery.deliveryDatas.nome_cami });

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
      //products_stocks
      //delivery.products
      const productsToAdd = delivery.products.map((product: any) => {
        const product_selected = products_stocks.find(item => item.id === product.id);
        if (!product_selected) return null;
        console.log(product_selected)
        return {
          item_id: Date.now() + Math.random(), // para evitar IDs duplicados
          name: product_selected.name || "",
          unit: product.unit || unitOptions[0],
          quantity: product.quantity,
          limit_quantity: product_selected.quantity || 0,
          lubally: product_selected.lullaby || [""],
          capacity: product_selected.lullaby[product.unit] || 1,
          product_id: product_selected.id,
        };
      });

      // filtra nulls e adiciona de uma vez
      setItems(productsToAdd.filter(Boolean));

      const idClient =
        delivery.deliveryDatas.cpf || delivery.deliveryDatas.cnpj || "";
      const selectedClient = clients.find(
        (c: any) => c.cpf === idClient || c.cnpj === idClient
      );
      if (selectedClient) {
        setClientInfo(selectedClient);
      }
    } catch (error) {
      console.log("Erro ao iniciar formulário:", error);
      router.push("/home");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientId = clientInfo.cpf || clientInfo.cnpj || "idClient";
    const typeClientId = clientInfo.cpf
      ? "cpf"
      : clientInfo.cnpj
        ? "cnpj"
        : "id";

    const formData = {
      id: id,
      name: customerName,
      address,
      deliveryDate,
      items,
      clientId,
      typeClientId,
    };

    try {
      setIsLoading(true);
      const data = await EditDelivery(formData);
      switch (data) {
        case true:
          showSucess("Entrega editada com sucesso");
          break;
        case "Credencial Invalida":
          showError("Suas credenciais são inválidas");
          break;
        default:
          showAlert("Houve um erro interno");
          showAlert("Tente novamente mais tarde");
          break;
      }
      setIsLoading(false);
    } catch (error) {
      showError("Erro interno ao editar entrega");
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
          <Sidebar />
          <div className="flex-1 p-8 flex flex-col min-h-screen">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-800">Editar Pedido</h1>
              <button
                type="button"
                onClick={() => router.push("/deliverys")}
                className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
              >
                Voltar
              </button>
            </div>

            {/* Formulário */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow overflow-auto flex flex-col mb-6 min-h-fit"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Cliente */}
                <div>
                  <label
                    htmlFor="clientSelect"
                    className="block text-green-900 text-[18px] mb-2"
                  >
                    Cliente
                  </label>
                  <select
                    id="clientSelect"
                    value={clientInfo?.cpf || clientInfo?.cnpj || ""}
                    onChange={(e) => {
                      const selectedClient = clients.find(
                        (c: any) => c.cpf === e.target.value || c.cnpj === e.target.value
                      );
                      if (selectedClient) {
                        setClientInfo(selectedClient);
                        setAddress(selectedClient.address);
                      } else {
                        setClientInfo("");
                        setAddress("");
                      }
                    }}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  >
                    <option value="">Escolha um cliente</option>
                    {clients.map((client: any, index: number) => (
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
                      setClientInfo("");
                      setAddress(e.target.value);
                    }}
                    className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                    placeholder="Digite o endereço"
                    required
                  />
                </div>

                {/* Data */}
                <div>
                  <label
                    htmlFor="deliveryDate"
                    className="block text-green-900 text-[18px] mb-2"
                  >
                    Data de Entrega
                  </label>
                  <DatePicker
                    id="deliveryDate"
                    selected={deliveryDate}
                    onChange={(date: Date | null) => setDeliveryDate(date)}
                    className="text-gray-600 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholderText="dd/mm/aaaa"
                    required
                    minDate={new Date()}
                    maxDate={(() => {
                      const max = new Date();
                      max.setMonth(max.getMonth() + 2);
                      return max;
                    })()}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

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
                      key={item.item_id}
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

                          // Atualiza nome a quantidade e o id do produto em si
                          updateItem(item.item_id, "name", selectedName);
                          updateItem(item.item_id, 'quantity', 0)
                          updateItem(item.item_id, 'product_id', selectedProduct.id)
                          updateItem(item.item_id, "unit", "")
                          // Atualiza os tipos de embalos disponivies para tal produto
                          if (selectedProduct) {
                            updateItem(item.item_id, "lubally", selectedProduct.lullaby);
                            updateItem(item.item_id, "limit_quantity", selectedProduct.quantity)
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
                          max={item.limit_quantity / item.capacity < 0 ? 0 : Math.floor(item.limit_quantity / item.capacity)}
                          placeholder="Quantidade"
                          value={item.quantity}
                          onChange={(e) => {
                            updateItem(
                              item.item_id,
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
                          onChange={(e) => {
                            const value: any = e.target.value
                            updateItem(item.item_id, "unit", value)
                            updateItem(item.item_id, "capacity", item.lubally[value])
                            updateItem(item.item_id, 'quantity', 0)
                          }
                          }
                          className="text-black w-32 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                        >
                          <option value="" disabled>Escolha uma unidade</option>
                          {Object.keys(item.lubally).map((key: any) => (
                            <option key={key} value={key}>{key} - {item.lubally[key]}</option> // exibe: caixa, Vaso, ...
                          ))}

                        </select>
                      </div>
                      <div className="flex justify-center">
                        {/* Botão remover */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.item_id)}
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
              {/* Botão Submit */}
              <button
                type="submit"
                disabled={items.length === 0 || isLoading}
                className="mt-auto bg-green-900 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-800 transition self-end disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">Salvando alterações...</span>
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                ) : (
                  "Salvar Pedido"
                )}
              </button>
            </form>
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
      </>
    );
  }
}
