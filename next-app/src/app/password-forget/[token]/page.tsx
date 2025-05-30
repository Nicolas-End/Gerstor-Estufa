"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validateTokenUser } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
export default function ProdutoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const token: any = params?.token ? params.token : null;

  function ShowAlert(text: string) {

    toast(text, {
      style: {
        backgroundColor: "#fff",
        color: "#2b192e",
        fontFamily: "Arial, sans-serif",
      },
    });
  }

  const verifyTokenUser = async () => {
    try{
      const valid_token_user = await validateTokenUser(decodeURIComponent(token));

      if (valid_token_user == "ok") {

        ShowAlert("Senha Mudada com sucesso");
        router.push("/login");

        return ;

      }
      else if(valid_token_user == "invalid token") {

        ShowAlert("Token Invalido");
        router.push("/login");
        return ;

      }
      else{
        ShowAlert("Oopps houve algum erro");
        router.push("/login");
        return ;
      }
    }
    catch (error) {
      console.log("Erro ao iniciar dashboard:", error);
      router.push("/login");
    }
  }

  useEffect(() => {
    verifyTokenUser();
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
  else{
  return (
    <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-medium">Carregando...</span>
          <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
        </div>
      </div>
    
    
  );
}
}