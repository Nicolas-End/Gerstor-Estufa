// Components/sidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard, BarChart2, ShoppingBag, History,
  Bell, Settings, LogOut, HelpCircle, ChevronLeft, ChevronRight
} from "lucide-react"
import styles from "./sidebar.module.css"

export default function Sidebar() {
  const [minimized, setMinimized] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => (pathname === path ? styles.navItemActive : "")

  const sidebarClass = minimized
    ? `${styles.sidebar} ${styles.minimized}`
    : styles.sidebar

  return (
    <div className={sidebarClass}>
      <button className={styles.toggleButton} onClick={() => setMinimized(!minimized)}>
        {minimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className={styles.logo}>
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle}>
            <Image src="/Logo.png" alt="Logo" width={30} height={30} />
          </div>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link href="/home" className={`${styles.navItem} ${isActive("/home")}`}>
          <LayoutDashboard size={20} />
          <span>Home</span>
        </Link>
        <Link href="/" className={`${styles.navItem} ${isActive("/")}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/estatisticas" className={`${styles.navItem} ${isActive("/estatisticas")}`}>
          <BarChart2 size={20} />
          <span>Estatísticas</span>
        </Link>
        <Link href="/pedidos" className={`${styles.navItem} ${isActive("/pedidos")}`}>
          <ShoppingBag size={20} />
          <span>Pedidos</span>
        </Link>
        <Link href="/historicos" className={`${styles.navItem} ${isActive("/historicos")}`}>
          <History size={20} />
          <span>Histórico</span>
        </Link>
        <Link href="/notificacoes" className={`${styles.navItem} ${isActive("/notificacoes")}`}>
          <Bell size={20} />
          <span>Notificações</span>
        </Link>
        <Link href="/configuracoes" className={`${styles.navItem} ${isActive("/configuracoes")}`}>
          <Settings size={20} />
          <span>Configuração</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <Link href="/logout" className={styles.navItem}>
          <LogOut size={20} />
          <span>Log Out</span>
        </Link>
        <Link href="/help" className={styles.navItem}>
          <HelpCircle size={20} />
          <span>Help</span>
        </Link>
      </div>
    </div>
  )
}
