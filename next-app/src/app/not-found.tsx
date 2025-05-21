'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="bg-green-500 flex flex-col items-center justify-start min-h-screen pt-20 px-4">
      <h1 className="text-gray-800 text-5xl font-bold mb-4">Ops...</h1>

      <p className="text-gray-800 text-center mb-6 text-3xl">
        Essa página que tentou acessar não existe!
      </p>

      <div className="mb-6 flex justify-center">
        <Image
          src="/not-found.png"
          alt="Foto Not-Found"
          width={450}
          height={500}
          className="rounded-md"
        />
      </div>

      <button
        className="relative overflow-hidden bg-green-600 text-white text-lg font-semibold px-8 py-3
         rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105
         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 group"
         onClick={() => router.back()}
      >
        Voltar para Home
      </button>
    </div>
  );
}
