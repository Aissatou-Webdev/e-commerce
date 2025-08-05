// src/Componente/Navbar.tsx
import { Link } from "react-router-dom";
import { Home, ShoppingCart, UserPlus, UserCog } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-black">Ma Boutique</Link>

      <nav className="flex items-center space-x-6 text-gray-700">
        <Link to="/" className="hover:text-black flex items-center gap-1">
          <Home size={18} />
          Accueil
        </Link>

        <Link to="/catalog" className="hover:text-black">
          Catalogue
        </Link>

        <Link to="/contact" className="hover:text-black">
          Contact
        </Link>

        <Link to="/cart" className="hover:text-black flex items-center gap-1">
          <ShoppingCart size={18} />
          Panier
        </Link>

        <Link
          to="/register"
          className="hover:text-black flex items-center gap-1"
        >
          <UserPlus size={18} />
          S'inscrire
        </Link>

        <Link
          to="/admin/login"
          className="hover:text-black flex items-center gap-1"
        >
          <UserCog size={18} />
          Admin
        </Link>
      </nav>
    </header>
  );
}
