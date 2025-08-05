// src/Componente/AdminSidebar.tsx
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 fixed top-0 left-0">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin/dashboard" className="hover:text-yellow-400">📊 Tableau de bord</Link>
        <Link to="/admin/products" className="hover:text-yellow-400">📦 Tous les produits</Link>
        <Link to="/admin/add" className="hover:text-yellow-400">➕ Ajouter un produit</Link>
        <Link to="/admin/orders" className="hover:text-yellow-400">🛒 Commandes</Link>
        <Link to="/admin/users" className="hover:text-yellow-400">👥 Utilisateurs</Link>
        <div className="border-t border-gray-600 mt-6 pt-4">
          <Link to="/" className="hover:text-red-400">🏠 Retour à l'accueil</Link>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "/admin/login";
            }}
            className="block w-full text-left hover:text-red-400 mt-2"
          >
            🚪 Déconnexion
          </button>
        </div>
      </nav>
    </aside>
  );
}
