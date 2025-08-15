// sidebar.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Bell,
  UserPlus,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Users,
  Truck,
  Settings,
  HardHat
} from "lucide-react";
import styles from "./sidebar.module.css";
import { getRoleCookie } from "@/lib/controller/cookiesController";
import { getRole } from "@/lib/controller/localStorageController";

export default function Sidebar() {
  const [minimized, setMinimized] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const pathname = usePathname();
  const role = getRole()

  const isActive = (path: string) => (pathname === path ? styles.navItemActive : "");

  const sidebarClass = minimized
    ? `${styles.sidebar} ${styles.minimized}`
    : styles.sidebar;

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowAccountMenu(false);
  };

  return (
    <div className={sidebarClass}>
      <button
        className={styles.toggleButton}
        onClick={() => setMinimized(!minimized)}
      >
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
        <Link
          href="/deliverys"
          className={`${styles.navItem} ${isActive("/deliverys") ||
            isActive("/delivery-form") ||
            isActive("/delivery")
            }`}
        >
          <ShoppingBag size={20} /> <span>Pedidos</span>
        </Link>
        <Link
          href="/historicos"
          className={`${styles.navItem} ${isActive("/historicos")}`}
        >
          <History size={20} /> <span>Histórico</span>
        </Link>
        <Link
          href="/notificacoes"
          className={`${styles.navItem} ${isActive("/notificacoes")}`}
        >
          <Bell size={20} /> <span>Notificações</span>
        </Link>

        {/* Mobile-only menu button */}

        {["ADM", "Secretaria", "Caminhoneiro", "Funcionario Comum", null].includes(role) && (
          <div
            className={`${styles.navItem} ${styles.mobileOnly}`}
            onClick={toggleMobileMenu}
          >
            <MoreVertical size={20} />
            <span className="text-xs">Mais</span>
            {showMobileMenu && (
              <div className={`${styles.accountMenu} ${styles.mobileDropdown}`}>
                {(role === "ADM" || role === "Secretaria") && (
                  <Link href="/functionaries" className={styles.menuItem}>
                    <HardHat size={16} /> <span>Funcionários</span>
                  </Link>
                )}
                {(role === "ADM" || role === "Secretaria" || role === "Caminhoneiro") && (
                  <>
                    <Link href="/clients" className={styles.menuItem}>
                      <Users size={16} /> <span>Clientes</span>
                    </Link>
                    <Link href="/caminhoes" className={styles.menuItem}>
                      <Truck size={16} /> <span>Caminhões</span>
                    </Link>
                  </>
                )}

              </div>
            )}
          </div>
        )}

        {role && (
          <div className="hidden md:flex flex-col">
            {(role === "ADM" || role === "Secretaria") && (
              <Link href="/functionaries" className={`${styles.navItem} mt-2`}>
                <UserPlus size={20} /> <span>Funcionários</span>
              </Link>
            )}

            {(role === "ADM" || role === "Secretaria" || role === "Caminhoneiro") && (
              <>
                <Link href="/clients" className={`${styles.navItem} mt-2`}>
                  <Users size={20} /> <span>Clientes</span>
                </Link>
                <Link href="/caminhoes" className={`${styles.navItem} mt-2`}>
                  <Truck size={20} /> <span>Caminhões</span>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Desktop account avatar */}
        <div
          className={`${styles.navItem} ${styles.accountItem} hidden md:flex`}
          onClick={toggleAccountMenu}
        >
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
                <LogOut size={16} /> <span>Encerrar Sessão</span>
              </Link>
              <Link href="/settings" className={styles.menuItem}>
                <Settings size={16} /> <span>Configurações</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}


