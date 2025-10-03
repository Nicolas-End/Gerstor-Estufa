"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "./page.module.css";
import Sidebar from "@/Components/sidebar";
import { AddNewProduct, DeleteProduct, GetStocksProducts } from "@/lib/ts/api";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";
import ProductForm from "./products-form";
import ProductsEditForm from "../product/[id]/product-edit";

interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  capacity?: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [productsDatas, setProductsDatas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string>('');

  // função para abrir o modal de edição
  const openEditModal = (id: string) => {
    setEditingProductId(id);
    setIsEditModalOpen(true);
  };

  // função de fechar
  const closeEditModal = () => {
    setEditingProductId('');
    setIsEditModalOpen(false);
  };

  // modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteProduct = async (id: string) => {
    try {
      const response = await DeleteProduct(id)
      switch (response) {
        case "Credenciais Invalidas":
          showAlert("Suas Credenciais são invalidas")
          router.push('/logout')
          return
        case "Erro Interno":
          showError("Houve um erro Interno tente novamente mais tarde")
          return
        case "Produto Apagado":
          showSucess("Produto apagado com sucesso")
          break
        case "Produto Não Cadastrado":
          showAlert("Produto Não Existe")
          break
      }
      initializeProducts()
    } catch (error) {
      showError("Houve um erro Interno tente novamente mais tarde")
    }

  }
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

  // Adiciona produto localmente (substituir por chamada API se quiser)
  const handleAddProduct = async (product: { name: string; quantity: number; items: ItemEntry[] }) => {
    try {
      if (!product.name.trim()) {
        showError("Preencha o nome do produto");
        return;
      }
      if (product.quantity === undefined || Number(product.quantity) < 0) {
        showError("Quantidade inválida");
        return;
      }

      const newProduct = {
        id: Date.now(),
        ...product,
      };
      setIsModalOpen(false);
      const response = await AddNewProduct(product)
      switch (response) {
        case "Credencial Invalida":
          showError("Credenciais Invalidas")
          router.push('/logout')
          return;
        case "Criado com Sucesso":
          showSucess("Produto Adicinado com sucesso")
          break;
        case "Erro Interno":
          showError("Houve um erro Interno tente novamente mais tarde")
          return;
        case "Produto Ja Cadastrado":
          showAlert("Produto Ja esta cadastrado no sistema")
          return;
      }
      setProductsDatas((prev) => [newProduct, ...prev]);

    } catch (error) {
      showError("Houve um erro Interno tente novamente mais tarde")
    }
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
              key={index}
              onDoubleClick={() => router.push(`product/${product.id}`)}
            >
              <FontAwesomeIcon icon={faBox} className={styles.productIcon} />
              <div>

                <p className={styles.productName}>{product.name}</p>
                {product.quantity !== undefined && (
                  <p className="text-sm opacity-80">
                    Quantidade: {product.quantity} {product.unit ?? ""}
                  </p>
                )}

              </div>

              <div className="flex items-center ml-auto gap-6">
                <div>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-white hover:text-red-600 transition-colors duration-200 "

                    />
                  </button>
                </div>
                <button type="button" onClick={() => openEditModal(product.id)}>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="text-white hover:text-yellow-400 transition-colors duration-200"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer position="top-right" autoClose={4000} />
      </div>
      {/* Modal de adicionar produto */}
      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      {/* Modal de editar produto */}
      {editingProductId !== null && (
        <ProductsEditForm
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={(updatedProduct) => {
            setProductsDatas((prev) =>
              prev.map((p) =>
                p.id === editingProductId ? { ...p, ...updatedProduct } : p
              )
            );
          }}
          id={editingProductId}
        />
      )}
    </div>
  );
}
