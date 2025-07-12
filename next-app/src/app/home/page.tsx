"use client";

import {
  validateHomeAcess,
  countDeliveryQuantidy,
  funtionariesQuantity,
} from "@/lib/api";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/Components/sidebar";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryQuantidy, setDeliveryQuantidy] = useState(0);
  const [functionariesQuantidy, setFunctionariesQuantidy] = useState(0);
  const initializeDashboard = async () => {
    try {
      const can_access_home = await validateHomeAcess(router);
      if (!can_access_home) {
        router.push("/login");
        return;
      }
      setIsLoading(false);

      const deliverys_quantidy: any = await countDeliveryQuantidy();
      const functionaries_quantity: any = await funtionariesQuantity();
      // Após a verficação do usuario
      // Verifica a quantidade de entregas pendentes a fazer

      setDeliveryQuantidy(deliverys_quantidy);
      setFunctionariesQuantidy(functionaries_quantity);
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
              <p className="text-4xl font-bold">
                {deliveryQuantidy || (
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}
              </p>
            </Link>
            <Link
              href="/functionaries"
              className="bg-[#0a3b2c] text-white p-6 rounded-xl shadow hover:bg-[#0d4b38] transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">Funcionários</h2>
              <p className="text-4xl font-bold">
                {functionariesQuantidy || (
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}
              </p>
            </Link>
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
