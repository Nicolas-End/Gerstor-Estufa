import Link from "next/link"
import UserHeader from "@/Components/user-header"

export default function Home() {
  return (
    <div className="h-full">
      <UserHeader />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/pedidos"
            className="bg-[#0a3b2c] text-white p-6 rounded-lg shadow-md hover:bg-[#0d4b38] transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Pedidos</h2>
            <p className="text-3xl font-bold">4</p>
          </Link>
          <div className="bg-[#0a3b2c] text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Estatísticas</h2>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-[#0a3b2c] text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Notificações</h2>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>
      </div>
    </div>
  )
}

