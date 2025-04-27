'use client'
import styles from "./page.module.css";
import { useParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { useEffect } from 'react';
import { getEscificDelivery } from '@/lib/api';
import Sidebar from "@/Components/sidebar";
export default function ProdutoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [deliverysDatas, setDeliveryDatas] = useState<any[]>([]);
  const router = useRouter()
  const params = useParams();
  const id = Number(params.id);

  const initializeDeliverys = async () => {
    try {
      const alreadyValidated = localStorage.getItem("alreadyValidated");
    
      if (!alreadyValidated) {
        router.push("/login");
      }
      const delivery: any = await getEscificDelivery(id)
      if (delivery == "invalid" || delivery == "error") {
        router.push("/login");
      }

      setDeliveryDatas([delivery])
      setIsLoading(false);
    } catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/login");
    }
  };
  useEffect(() => {
    
    initializeDeliverys();
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
  }

  return (
    <div className={styles.container}>
        <Sidebar />
        <div >

          <div className={styles.content}>
            {deliverysDatas.map((order, index) => (



              <div key={index}  >
                <h1 >{order.Produto}</h1>
                <div>{order.Quantidade}</div>

                <div >
                  <span >{order.Quantidade}</span>{" "}
                  <span >Caixas</span>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}