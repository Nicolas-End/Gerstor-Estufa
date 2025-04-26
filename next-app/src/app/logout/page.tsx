'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react";
export default function Logout(){
    const router = useRouter();
    const cleanDatas = () =>{
        localStorage.clear()
        router.push('./login')
    };
    cleanDatas()
    return (
        <div className="flex items-center justify-center h-screen bg-white text-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-[#0a2c26] border-t-transparent rounded-full animate-spin" />
          <span className="text-xl font-medium">Saindo...</span>

        </div>
        
      </div>
    )
}