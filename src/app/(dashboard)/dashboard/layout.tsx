"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, LogOut, Settings } from "lucide-react"
import Cookies from 'js-cookie';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/users", label: "Users", icon: "👥" },
    { href: "/dashboard/posts", label: "Posts", icon: "📝" },
    { href: "/dashboard/profile", label: "Profile", icon: "⚙️" },
  ]
  
  const logoutHandle=()=>{
      const handelLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear cookies
    Cookies.remove("token", { path: "/" });
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("userRole", { path: "/" });

    // Optional: Redirect to login page
    window.location.href = "/login";
  };

  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-sm">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button onClick={logoutHandle} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 transition text-sm">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
