"use client"

import Link from "next/link"
import Sidebar from "@/Components/sidebar"

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <main className="flex-1 overflow-auto bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-[#0a3b2c] mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/pedidos"
            className="bg-[#0a3b2c] text-white p-6 rounded-xl shadow hover:bg-[#0d4b38] transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">Pedidos</h2>
            <p className="text-4xl font-bold">4</p>
          </Link>

          <div className="bg-[#0a3b2c] text-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Estatísticas</h2>
            <p className="text-4xl font-bold">12</p>
          </div>

          <div className="bg-[#0a3b2c] text-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Notificações</h2>
            <p className="text-4xl font-bold">3</p>
          </div>
        </div>
      </main>
    </div>
  )
}
