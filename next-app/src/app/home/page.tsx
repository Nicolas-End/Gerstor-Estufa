"use client";

import { validateHomeAcess, countDeliveryQuantidy } from "@/lib/api";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/Components/sidebar";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryQuantidy, setDeliveryQuantidy] = useState(0);
  const initializeDashboard = async () => {
    try {
      const alreadyValidated = localStorage.getItem("alreadyValidated");
      // Controle para verficar se o usuario ja acessou o home alguma vez
      if (!alreadyValidated) {
        const can_access_home = await validateHomeAcess(router);
        if (!can_access_home) {
          router.push("/login");
          return;
        }
        localStorage.setItem("alreadyValidated", "true");
      }
      const deliverys_quantidy: any = await countDeliveryQuantidy();
      // Após a verficação do usuario
      // Verifica a quantidade de entregas pendentes a fazer
      setDeliveryQuantidy(deliverys_quantidy);
      setIsLoading(false);
    } catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    initializeDashboard();
  }, []);
  if (isLoading) {
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
      <div className="flex h-screen bg-gray-50 overflow-auto">
        <Sidebar />

        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <h1 className="text-3xl font-bold text-[#0a3b2c] mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/deliverys"
              className="bg-[#0a3b2c] text-white p-6 rounded-xl shadow hover:bg-[#0d4b38] transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">Pedidos</h2>
              <p className="text-4xl font-bold">{deliveryQuantidy}</p>
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
    );
  }
}
