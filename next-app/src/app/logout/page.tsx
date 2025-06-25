
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") { // Garante que está no client
      localStorage.clear();
      router.push("/login");
    }
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
