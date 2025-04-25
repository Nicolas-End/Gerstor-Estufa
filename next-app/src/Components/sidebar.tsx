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
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => (pathname === path ? styles.navItemActive : "")
  
  const sidebarClass = minimized
    ? `${styles.sidebar} ${styles.minimized}`
    : styles.sidebar

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu)
  }

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
        <div className={`${styles.navItem} ${styles.accountItem}`} onClick={toggleAccountMenu}>
          <div className={styles.profileImageContainer}>
            <Image 
              src="/default-avatar.png" 
              alt="Profile" 
              width={24} 
              height={24} 
              className={styles.profileImage}
            />
          </div>
          <span>Minha Conta</span>
          
          {showAccountMenu && (
            <div className={styles.accountMenu}>
              <Link href="/logout" className={styles.menuItem}>
                <LogOut size={16} />
                <span>Log Out</span>
              </Link>
              <Link href="/help" className={styles.menuItem}>
                <HelpCircle size={16} />
                <span>Help</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}