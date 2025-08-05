// src/components/AdminTopbar.tsx
import { Link } from "react-router-dom";

export default function AdminTopbar() {
  return (
    <div className="w-full bg-black text-white flex justify-between items-center px-6 py-4 shadow">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:underline">Accueil</Link>
        <Link to="/admin/dashboard" className="hover:underline">Produits</Link>
        <Link to="/admin/orders" className="hover:underline">Commandes</Link>
        <Link to="/admin/users" className="hover:underline">Utilisateurs</Link>
      </div>
    </div>
  );
}
