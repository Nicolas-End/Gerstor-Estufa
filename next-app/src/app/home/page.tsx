"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Home, Settings, Users, ShoppingCart, BarChart3, Layers, ChevronDown, Menu, X, LogOut } from "lucide-react"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  submenu?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/products",
    icon: ShoppingCart,
    submenu: [
      {
        title: "All Products",
        href: "/products",
        icon: Layers,
      },
      {
        title: "Add Product",
        href: "/products/new",
        icon: Layers,
      },
    ],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        aria-label="Toggle Menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          ${collapsed ? "w-20" : "w-64"}
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                A
              </div>
              {!collapsed && <span className="ml-3 text-xl font-semibold">Admin</span>}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronDown
                className={`transform transition-transform ${collapsed ? "rotate-90" : "-rotate-90"}`}
                size={20}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.title}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center w-full p-2 rounded-md transition-colors
                          ${isActive(item.href) ? "bg-gray-100 dark:bg-gray-700 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                          ${collapsed ? "justify-center" : "justify-between"}`}
                      >
                        <div className="flex items-center">
                          <item.icon size={20} className={isActive(item.href) ? "text-primary" : ""} />
                          {!collapsed && <span className="ml-3">{item.title}</span>}
                        </div>
                        {!collapsed && (
                          <ChevronDown
                            size={16}
                            className={`transform transition-transform ${openSubmenu === item.title ? "rotate-180" : ""}`}
                          />
                        )}
                      </button>
                      {(openSubmenu === item.title || collapsed) && (
                        <ul
                          className={`mt-2 space-y-1 ${collapsed ? "absolute left-20 top-0 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md min-w-[160px] border border-gray-200 dark:border-gray-700" : ""}`}
                        >
                          {item.submenu.map((subItem) => (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.href}
                                className={`flex items-center p-2 rounded-md transition-colors
                                  ${isActive(subItem.href) ? "bg-gray-100 dark:bg-gray-700 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                  ${collapsed ? "" : "pl-9"}`}
                              >
                                <subItem.icon size={16} className={isActive(subItem.href) ? "text-primary" : ""} />
                                <span className="ml-3">{subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md transition-colors
                        ${isActive(item.href) ? "bg-gray-100 dark:bg-gray-700 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                        ${collapsed ? "justify-center" : ""}`}
                    >
                      <item.icon size={20} className={isActive(item.href) ? "text-primary" : ""} />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                </div>
              )}
              {!collapsed && (
                <button className="ml-auto p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

