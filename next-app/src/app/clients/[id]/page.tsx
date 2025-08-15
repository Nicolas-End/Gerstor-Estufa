"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/Components/sidebar";
import { useParams, useRouter } from "next/navigation";
import { ValidateHomeAcess, AddNewClient, GetEspecificClient } from "@/lib/ts/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [clientInfo, setClientInfo] = useState<any>({});

  // Tipo de documento: CPF ou CNPJ
  const [idType, setIdType] = useState<'cpf' | 'cnpj'>('cpf');
  const [idValue, setIdValue] = useState("");

  // Campos de endereço / formulário (controlados)
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [reference, setReference] = useState("");

  // Carrega e valida acesso, carrega cliente se houver id e pré-preenche campos
  const initializePage = async () => {
    try {
      const id: any = params?.id ?? null;
      const canAccess = await ValidateHomeAcess(router);
      if (!canAccess) {
        router.push("/login");
        return;
      }

      if (id) {
        const response = await GetEspecificClient(decodeURIComponent(id));
        if (typeof response === "string") {
          switch (response) {
            case "Credenciais Invalidas":
              showAlert("Suas credenciais são inválidas");
              router.push("/logout");
              return;
            case "Cliente Não Existe":
              showAlert("Cliente inexistente");
              router.push("/clients");
              return;
            default:
              showError("Houve um erro interno. Tente novamente mais tarde.");
              router.push("/clients");
              return;
          }
        }

        // Preenche clientInfo e os estados do formulário
        setClientInfo(response || {});

        // documento: prioriza cnpj -> cpf
        if (response?.cnpj) {
          setIdType("cnpj");
          setIdValue(String(response.cnpj || "").replace(/\D/g, ""));
        } else if (response?.cpf) {
          setIdType("cpf");
          setIdValue(String(response.cpf || "").replace(/\D/g, ""));
        } else {
          setIdType("cpf");
          setIdValue("");
        }

        // demais campos (ajuste conforme a forma que sua API retorna)
        setName(response?.name || "");
        setStreet(response?.street || response?.address || "");
        setNeighborhood(response?.neighborhood || "");
        setNumber(response?.number ?? "");
        setReference(response?.refe || response?.reference || "");
      }

      setPageIsLoading(false);
    } catch (error) {
      console.error("Erro ao iniciar:", error);
      router.push("/login");
    }
  };

  useEffect(() => { initializePage(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remover formatação para envio
    const rawId = idValue.replace(/\D/g, '');

    try {
      const address = {
        "street": street,
        "neighborhood": neighborhood,
        "number": typeof number === "string" ? (number === "" ? 0 : parseInt(number)) : number,
        "reference": reference
      };
      const document = {
        "type": idType,
        "value": rawId
      };

      setIsLoading(true);

      // Chamada à API (se quiser usar AddNewClient ou UpdateClient)
      // Exemplo (comentado): await AddNewClient(name, address, document);
      // Por enquanto o seu código apenas limpa os campos (mantive isso)
      // Caso queira que eu invoque AddNewClient/UpdateClient aqui, me fala que eu já colo.

      // limpeza de formulário (se esse for o comportamento desejado)
      setName("");
      setIdValue("");
      setStreet("");
      setNeighborhood("");
      setNumber(0);
      setReference("");
      setIsLoading(false);
      return;
    } catch (error) {
      showAlert("Houve um erro Interno Tente novamente mais tarde");
      setIsLoading(false);
    }
  };

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

  // Determinar comprimento máximo de dígitos (conforme idType)
  const minLengt = idType === 'cpf' ? 11 : 14;
  const maxLengt = idType === 'cpf' ? 11 : 14;

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800">Editar Cliente</h1>
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

              <div></div>

              {/* Escolha por radio (CPF / CNPJ) */}
              <div className="md:col-span-2 flex items-center gap-4">
                <label className="text-green-900 text-[18px]">Documento:</label>
                <label className="flex items-center gap-2 text-green-900">
                  <input
                    type="radio"
                    name="idType"
                    value="cpf"
                    checked={idType === "cpf"}
                    onChange={() => { setIdType("cpf"); setIdValue(""); }}
                    required
                  />
                  CPF
                </label>
                <label className="flex items-center gap-2 text-green-900">
                  <input
                    type="radio"
                    name="idType"
                    value="cnpj"
                    checked={idType === "cnpj"}
                    onChange={() => { setIdType("cnpj"); setIdValue(""); }}
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
                <label htmlFor="street" className="block text-green-900 text-[18px] mb-2">Endereço</label>
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

              <div className="md:col-span-2">
                <label htmlFor="reference" className="block text-green-900 text-[18px] mb-2">Referência</label>
                <input
                  id="reference"
                  type="text"
                  value={clientInfo?.refe}
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
              {isLoading ? "Cliente Editado..." : "Concluir Edição"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}
