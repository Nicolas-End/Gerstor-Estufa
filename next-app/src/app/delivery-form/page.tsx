"use client";

import React, { useState } from "react";
import Sidebar from "@/Components/sidebar";
import { useRouter } from "next/navigation";

// Define formato de cada item
interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export default function DeliveryFormPage() {
  const router = useRouter(); // Hook para navegação

  // Estados dos campos principais
  const [customerName, setCustomerName] = useState(""); // Nome do cliente
  const [address, setAddress] = useState("");          // Endereço de entrega

  // Opções de unidade disponíveis
  const unitOptions = ["Caixas", "Vasos", "Garrafas", "Cestas"];
  const [items, setItems] = useState<ItemEntry[]>([]);    // Lista de itens no pedido

  // Adiciona nova linha de item
  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now(), name: "", unit: unitOptions[0], quantity: 1 }
    ]);
  };

  // Atualiza campo de um item específico
  const updateItem = (
    id: number,
    field: keyof Omit<ItemEntry, 'id'>,
    value: string | number
  ) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Remove item pelo id
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Lida com submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name: customerName, address, items };
    console.log("Form Data:", formData); // Exibe dados
    // TODO: enviar formData para API
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> {/* Barra lateral */}
      <div className="flex-1 p-8 flex flex-col">

        {/* Cabeçalho com título e botão voltar */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800">Novo Pedido</h1>
          <button
            type="button"
            onClick={() => router.push('/deliverys')}
            className="bg-green-900 text-white font-medium py-1 px-4 rounded-lg shadow hover:bg-green-800 transition"
          >
            Voltar
          </button>
        </div>

        {/* Formulário de pedido */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow flex-1 overflow-auto flex flex-col"
        >
          {/* Campos Nome e Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="customerName" className="block text-gray-700 font-medium mb-2">
                Nome
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Digite o nome"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Endereço
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Digite o endereço"
                required
              />
            </div>
          </div>

          {/* Seção de Itens Dinâmicos */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-700 font-medium">Itens a entregar</p>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-900 text-white py-1 px-3 rounded-lg shadow hover:bg-green-800 transition text-sm"
              >
                + Adicionar Item
              </button>
            </div>

            {/* Lista de itens renderizada */}
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center md:space-x-4 bg-gray-50 p-4 rounded-lg"
                >
                  {/* Nome do item */}
                  <input
                    type="text"
                    placeholder="Nome do item"
                    value={item.name}
                    onChange={e => updateItem(item.id, 'name', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                    required
                  />
                  {/* Quantidade */}
                  <input
                    type="number"
                    min={1}
                    placeholder="Quantidade"
                    value={item.quantity}
                    onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                    required
                  />
                  {/* Unidade */}
                  <select
                    value={item.unit}
                    onChange={e => updateItem(item.id, 'unit', e.target.value)}
                    className="w-32 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 md:mb-0"
                  >
                    {unitOptions.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  {/* Botão remover linha */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Enviar Pedido */}
          <button
            type="submit"
            className="mt-auto bg-green-900 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-800 transition self-end"
          >
            Enviar Pedido
          </button>
        </form>
      </div>
    </div>
  );
}
