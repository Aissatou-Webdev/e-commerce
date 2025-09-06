// src/Componente/admin/AdminSidebar.tsx
import React, { Dispatch, SetStateAction } from "react";

interface AdminSidebarProps {
  activePage: string;
  setActivePage: Dispatch<SetStateAction<string>>;
  handleLogout: () => void;
}

export default function AdminSidebar({
  activePage,
  setActivePage,
  handleLogout,
}: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 fixed top-0 left-0 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
      <nav className="flex-1 flex flex-col space-y-4">
        <button
          onClick={() => setActivePage("dashboard")}
          className={`text-left ${activePage === "dashboard" ? "text-yellow-400 font-bold" : ""}`}
        >
          📊 Tableau de bord
        </button>
        <button
          onClick={() => setActivePage("products")}
          className={`text-left ${activePage === "products" ? "text-yellow-400 font-bold" : ""}`}
        >
          📦 Tous les produits
        </button>
        <button
          onClick={() => setActivePage("clients")}
          className={`text-left ${activePage === "clients" ? "text-yellow-400 font-bold" : ""}`}
        >
          👥 Utilisateurs
        </button>
        <button
          onClick={() => setActivePage("orders")}
          className={`text-left ${activePage === "orders" ? "text-yellow-400 font-bold" : ""}`}
        >
          🛒 Commandes
        </button>
        <button
          onClick={() => setActivePage("messages")}
          className={`text-left ${activePage === "messages" ? "text-yellow-400 font-bold" : ""}`}
        >
          ✉️ Messages
        </button>
      </nav>
      <div className="border-t border-gray-600 mt-6 pt-4">
        <button
          onClick={handleLogout}
          className="block w-full text-left hover:text-red-400"
        >
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
}
