"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { GetStocksProducts } from "@/lib/ts/api";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { showError } from "@/lib/controller/alertsController";

interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [productsDatas, setProductsDatas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form do modal
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState<number | "">("");
  const [items, setItems] = useState<ItemEntry[]>([]); // itens internos do produto (delivery-like)

  // Carrega produtos do backend
  const initializeProducts = async () => {
    try {
      const response = await GetStocksProducts();
      setProductsDatas(Array.isArray(response) ? response : []);
      setIsLoading(false);
    } catch (error) {
      showError("Houve um erro, tente novamente mais tarde");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeProducts();
  }, []);

  // Funções herdadas do delivery-form (adaptadas)
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", unit: "", quantity: 1 },
    ]);
  };

  const updateItem = (
    id: number,
    field: keyof Omit<ItemEntry, "id">,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Adiciona produto localmente (substituir por chamada API se quiser)
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      showError("Preencha o nome do produto");
      return;
    }
    if (productQuantity === "" || Number(productQuantity) < 0) {
      showError("Quantidade inválida");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName.trim(),
      quantity: Number(productQuantity),
      items: items.map((it) => ({ ...it })), // adicionar itens do modal
    };

    setProductsDatas((prev) => [newProduct, ...prev]);

    // reset form
    setProductName("");
    setProductQuantity("");
    setItems([]);
    setIsModalOpen(false);
  };

  // filtro de busca
  const resultados = (Array.isArray(productsDatas) ? productsDatas : []).filter(
    (item: any) => item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render de loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  // Render principal
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Produtos</h1>
          </div>
          <div className={styles.headerBottom}>
            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
              + Adicionar
            </button>
          </div>
        </div>

        <div className={styles.ordersList}>
          {(searchTerm ? resultados : productsDatas).map((product: any, index: any) => (
            <div
              className={styles.productCard}
              key={product.id ?? index}
              onDoubleClick={() => router.push(`product/${product.id}`)}
            >
              <FontAwesomeIcon icon={faBox} className={styles.productIcon} />
              <div>
                <p className={styles.productName}>{product.name}</p>
                {product.quantity !== undefined && (
                  <p className="text-sm opacity-80">
                    {product.quantity} {product.unit ?? ""}
                  </p>
                )}
                {/* mostra itens internos (se existirem) seguindo estilização leve */}
                {Array.isArray(product.items) && product.items.length > 0 && (
                  <div className="mt-2">
                    {product.items.map((it: ItemEntry) => (
                      <div key={it.id} className="text-xs opacity-75">
                        • {it.name || "(sem nome)"} — {it.quantity} {it.unit || ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="gap-6 flex flex-row-reverse">
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setProductsDatas((prev) => prev.filter((p) => p.id !== product.id))
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-white hover:text-red-600 transition-colors duration-200 " />
                  </button>
                </div>
                <button type="button" onClick={() => router.push(`/products/${product.id}`)}>
                  <FontAwesomeIcon icon={faPenToSquare} className="text-white hover:text-yellow-400 transition-colors duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 z-10">
            <h2 className="text-xl font-bold mb-4 text-[#005E40]">Adicionar Produto</h2>
            <form className="flex flex-col gap-4" onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Nome do Produto"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                className="border rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                min={0}
              />

              {/* Área de itens (como delivery-form) */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className=" text-green-900 text-[18px] font-bold">Embalos</p>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-[#0a3b2c] text-white py-1 px-3 font-bold rounded-lg shadow hover:bg-[#117255] transition text-sm"
                  >
                    + Adicionar Item
                  </button>
                </div>

                <div className="space-y-4">
                  {items.length === 0 && (
                    <p className="text-gray-600 text-center py-4">
                      Nenhuma unidade adicionada.
                    </p>
                  )}

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center md:space-x-4 bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 md:space-x-4 w-full">
                          <div className="flex flex-col w-full space-y-2">
                            {/* Unidade */}
                            <input
                              type="text"
                              placeholder="Unidade (ex: vasos, caixas, solto)"
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                              className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            {/*Quantia que a embalo aguenta*/}
                            <input
                              type="number"
                              placeholder="Valor suportado pela unidade"
                              value={(item as any).capacity ?? ""}
                              onChange={(e) => updateItem(item.id, "capacity" as any, e.target.value === "" ? "" : Number(e.target.value))}
                              className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                              min={0}
                            />
                          </div>
                      </div>

                      <div className="flex justify-center mt-2 md:mt-0">
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

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    // reset parcial opcional
                    setProductName("");
                    setProductQuantity("");
                    setItems([]);
                  }}
                  className="px-4 py-2 rounded-lg border text-black font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#005E40] font-bold text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
