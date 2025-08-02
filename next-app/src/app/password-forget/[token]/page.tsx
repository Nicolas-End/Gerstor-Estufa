"use client";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validateTokenUser } from "@/lib/ts/api";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { showAlert, showError, showSucess } from "@/lib/controller/alertsController";
import { renderToHTMLOrFlight } from "next/dist/server/app-render/app-render";
export default function ProdutoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const token: any = params?.token ? params.token : null;



  const verifyTokenUser = async () => {
    try {
      // envia um sistema no back-end para verificar se o token do cadastrado do usuario é valido
      // se for valido e muda a senha do usuario
      const response = await validateTokenUser(decodeURIComponent(token));

      switch (response) {
        case "Senha modificada":
          setIsLoading(false)
          showSucess("Senha Mudada com sucesso")

          return;
        case "Token Invalido":
          setIsLoading(false)
          showAlert("Token Invalido");

          return;
        case "Erro Interno":
          setIsLoading(false )
          showError("Houve um erro Interno tente novamente mais tarde")

          return;
      }

    }
    catch (error) {
      setIsLoading(false)
      showError("Houve um pequeno erro tente novamente mais tarde")
      return;
      
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
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          toastStyle={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    );
  }
  else {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-800">

        <Link
          href="/register"
          className=" fontRobo mt-4 text-center w-full py-3 border border-white text-white font-semibold rounded hover:bg-white hover:text-[#0a2c26] transition duration-200"
        >
          Registre-se
        </Link>

        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          toastStyle={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>



    );
  }
}