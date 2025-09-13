"use client";
import React from "react";

interface ItemEntry {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  capacity?: number;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: {
    name: string;
    quantity: number;
    items: ItemEntry[];
  }) => void;
}

export default function ProductForm({ isOpen, onClose, onSubmit }: ProductFormProps) {
  const [productName, setProductName] = React.useState("");
  const [productQuantity, setProductQuantity] = React.useState<number | "">("");
  const [items, setItems] = React.useState<ItemEntry[]>([]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", unit: "", quantity: 1, capacity: 0 },
    ]);
  };

  const updateItem = (
    id: number,
    field: keyof ItemEntry,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || productQuantity === "") return;

    onSubmit({
      name: productName.trim(),
      quantity: Number(productQuantity),
      items,
    });

    setProductName("");
    setProductQuantity("");
    setItems([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 z-10">
        <h2 className="text-xl font-bold mb-4 text-[#005E40]">Adicionar Produto</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            onChange={(e) =>
              setProductQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            min={0}
          />

          {/* Unidades */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-green-900 text-[18px] font-bold">Embalagens</p>
              <button
                type="button"
                onClick={addItem}
                className="bg-[#0a3b2c] text-white py-1 px-3 font-bold rounded-lg shadow hover:bg-[#117255] transition text-sm"
              >
                + Adicionar Item
              </button>
            </div>

            <div className="space-y-4 max-h-56 overflow-y-auto pr-2">
              {items.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  Nenhuma unidade adicionada.
                </p>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col space-y-2 bg-gray-50 p-3 rounded-lg"
                >
                  {/* Unidade */}
                  <input
                    type="text"
                    placeholder="Unidade (ex: vasos, caixas, solto)"
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                    className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  {/* Valor da unidade */}
                  <input
                    type="number"
                    placeholder="Valor suportado pela unidade"
                    value={item.capacity ?? ""}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "capacity",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min={0}
                  />

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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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
  );
}
