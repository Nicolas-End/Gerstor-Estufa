'use client'
import Sidebar from "@/Components/sidebar";
import { showAlert, showError } from "@/lib/controller/alertsController";
import { GetDeliverysToHistory } from "@/lib/ts/api";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

interface OrdersDatas {
  'id': string,
  'caminhoneiro': string,
  "cliente": string,
  "dataEntrega": string,
  "localEntrega": string,
  "quantidade": string,
  "status": string
}

export default function OrderDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrdersDatas[]>([])
  const [pageIsLoading, setPageIsLoading] = useState(true)

  const initializeDeliverysHistory = async () => {
    try {
      const order = await GetDeliverysToHistory()
      if (order === "Credencial Invalida") {
        router.push('/logout')
        return;
      } else if (order === "Erro Interno") {
        showAlert('Houve um erro tente novamente mais tarde')
        setPageIsLoading(false)
        return;
      }
      setOrders(order)
      setPageIsLoading(false)
    } catch (error) {
      showError('Houve um erro interno tente novamente mais tarde')
    }
  }
 useEffect(() => {
    initializeDeliverysHistory()
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
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border">
              <div>
                <p className="text-sm font-medium text-gray-500">Entregas dos dias</p>
                <h1 className="text-xl font-semibold text-gray-900">
                  15/05/2025 - 19/09/2025
                </h1>
              </div>

              <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-gray-700">{orders.length} pedidos</span>
              </div>
            </div>

            {/* Tabela de pedidos */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700"> Nº PEDIDO</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">CLIENTE</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">QUANTIDADE PRODUTOS</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STATUS</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-red-50 hover"
  
                      >
                        <td className="py-3 px-4">
                          <span className="text-blue-600 text-sm font-medium">{order.id}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{order.cliente}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-900">{order.quantidade}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status.includes("cancelado") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                            }`}>
                            {order.status.includes("cancelado") ? "Cancelado" : "Concluído"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-purple-600 text-sm hover:text-purple-800"
                          onClick={()=>{
                            router.push(`/delivery/${order.id}`)
                          }}>
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}