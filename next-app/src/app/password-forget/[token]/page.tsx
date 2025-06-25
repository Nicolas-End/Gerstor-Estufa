"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validateTokenUser } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
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
      // envia um sistema no back-end para verificar se o token do cadastrado do usuario é valido
      // se for valido e muda a senha do usuario
      const valid_token_user = await validateTokenUser(decodeURIComponent(token));

      if (valid_token_user == "ok") {
        setIsLoading(false)
        ShowAlert("Senha Mudada com sucesso");


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
    );
  }
  else{
  return (
    <div className="flex items-center justify-center h-screen bg-white text-gray-800">
         
         <Link
              href="/register"
              className=" fontRobo mt-4 text-center w-full py-3 border border-white text-white font-semibold rounded hover:bg-white hover:text-[#0a2c26] transition duration-200"
            >
              Registre-se
            </Link>
        
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

    
    
  );
}
}