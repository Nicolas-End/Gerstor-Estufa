"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/Components/sidebar";
import { useRouter } from "next/navigation";
import { ValidateHomeAcess, AddNewClient } from "@/lib/ts/api";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";

export default function RegisterClientPage() {
  const router = useRouter();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Tipo de documento: CPF ou CNPJ
  const [idType, setIdType] = useState<'cpf' | 'cnpj'>('cpf');
  const [idValue, setIdValue] = useState("");

  // Campos de endereço
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [number, setNumber] = useState(0);
  const [reference, setReference] = useState("");



  const initializePage = async () => {
    try {
      const canAccess = await ValidateHomeAcess(router);
      if (!canAccess) {
        router.push("/logout");
        return;
      }
      setPageIsLoading(false);
    } catch (error) {
      console.error("Erro ao iniciar:", error);
      router.push("/login");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remover formatação para envio
    const rawId = idValue.replace(/\D/g, '');


    try {
      const address = {
        "street": street,
        "neighborhood": neighborhood,
        "number": number,
        "reference": reference
      }
      const document = {
        "type": idType,
        "value": rawId

      }
      setIsLoading(true);
      const result = await AddNewClient(name, address, document)

      switch (result) {
        case true:
          showSucess("Cliente Cadastro no sistema com sucesso")
          break;
        case "Credencial Invalida":
          showAlert("Suas credenciais são invalidas")
          router.push('/logout')
          
          return;
        case "Cliente ja Existe":
          showAlert("Cliente ja Constatado no sistema")
          break;
        default:
          showError("Houver um error interno tente novamente mais tarde")
          break;
<<<<<<< HEAD
=======

>>>>>>> feat
      }


      setName("");
      setIdValue("");
      setStreet("");
      setNeighborhood("");
      setNumber(0);
      setReference("");
      setIsLoading(false);
      return;
    } catch (error) {
      showAlert("Houve um erro Interno Tente novamente mais tarde")
      setIsLoading(false);
    }
  };

  useEffect(() => { initializePage(); }, []);

  if (pageIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  // Determinar comprimento máximo de dígitos
  const minLengt = idType === 'cpf' ? 11 : 14;
  const maxLengt = idType === 'cpf' ? 11 : 14;

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800">Cadastrar Cliente</h1>
            <button
              type="button"
              onClick={() => router.push("/clients")}
              className="bg-[#0a3b2c] text-white font-bold py-1 px-4 rounded-lg shadow hover:bg-[#117255] transition"
            >
              Voltar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow flex-1 overflow-auto flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-green-900 text-[18px] mb-2">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-black"
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div>

              </div>

              {/* Escolha por radio */}
              <div className="md:col-span-2 flex items-center gap-4">
                <label className="text-green-900 text-[18px]">Documento:</label>
                <label className="flex items-center gap-2 text-green-900">
                  <input
                    type="radio"
                    name="idType"
                    value="cpf"
                    checked={idType === 'cpf'}
                    onChange={() => { setIdType('cpf'); setIdValue(''); }}
                    required
                  />
                  CPF
                </label>
                <label className="flex items-center gap-2 text-green-900">
                  <input
                    type="radio"
                    name="idType"
                    value="cnpj"
                    checked={idType === 'cnpj'}
                    onChange={() => { setIdType('cnpj'); setIdValue(''); }}
                    required
                  />
                  CNPJ
                </label>
              </div>

              <div>
                <label htmlFor="idValue" className="block text-green-900 text-[18px] mb-2">
                  {idType.toUpperCase()}
                </label>
                <input
                  id="idValue"
                  type="text"
                  value={idValue}
                  onChange={e => setIdValue(e.target.value.replace(/\D/g, ''))}
                  minLength={minLengt}
                  maxLength={maxLengt}
                  className="w-full border border-gray-300 rounded-lg p-2 text-black"
                  placeholder={idType === 'cpf' ? 'Só dígitos, ex: 00000000000' : 'Só dígitos, ex: 00000000000000'}
                  
                  
                  required
                />
              </div>

              <div>
                <label htmlFor="street" className="block text-green-900 text-[18px] mb-2">Rua</label>
                <input
                  id="street"
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-black"
                  placeholder="Digite a rua"
                  required
                />
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-green-900 text-[18px] mb-2">Bairro</label>
                <input
                  id="neighborhood"
                  type="text"
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-black"
                  placeholder="Digite o bairro"
                  required
                />
              </div>

              <div>
                <label htmlFor="number" className="block text-green-900 text-[18px] mb-2">Número</label>
                <input
                  id="number"
                  type="number"
                  value={number}
                  onChange={e => setNumber(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-black"
                  placeholder="Número da residência"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="reference" className="block text-green-900 text-[18px] mb-2">Referência</label>
                <input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-black"
                  placeholder="Referência (opcional)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-900 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Cadastrando Cliente..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}
