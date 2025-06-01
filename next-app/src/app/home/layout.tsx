import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Sidebar from "@/Components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Estufa Fácil Industries",
  description: "Plant order management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    {children} {/*Não precisa de tag HTML nem de Tag Body, causa erro de hidratação, somente deixar com Body e HTMl no Layout.tsx raíz */}
    </>

  )
}

