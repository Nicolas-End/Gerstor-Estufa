
'use client'
import { useRouter } from "next/navigation"
import { deleteCookies } from "@/lib/controller/cookiesController";
import { useEffect } from "react";
import { socketService } from "@/lib/config/sockteioConfig";

export default function Logout(){
    const router = useRouter();
    useEffect(() => {
      // Este código só roda no browser
      deleteCookies()
      socketService.closeSocket()
      router.push('./login');
    }, []);


  return (
    <div className="flex items-center justify-center h-screen bg-white text-gray-800">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
        <span className="text-xl font-medium">Saindo...</span>
      </div>
    </div>
  );
}
