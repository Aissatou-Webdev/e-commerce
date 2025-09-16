// src/Componente/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { Home, ShoppingCart, UserPlus, UserCog, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black shadow-xl px-6 py-4 flex justify-between items-center border-b border-yellow-500/20">
      <Link to="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Ma Boutique</Link>

      <nav className="flex items-center space-x-6 text-gray-300">
        <Link to="/" className="hover:text-yellow-400 flex items-center gap-1 transition-colors duration-200">
          <Home size={18} />
          Accueil
        </Link>

        <Link to="/catalog" className="hover:text-yellow-400 transition-colors duration-200">
          Catalogue
        </Link>

        <Link to="/contact" className="hover:text-yellow-400 transition-colors duration-200">
          Contact
        </Link>

        <Link to="/cart" className="hover:text-yellow-400 flex items-center gap-1 transition-colors duration-200">
          <ShoppingCart size={18} />
          Panier
        </Link>

        {/* Affichage conditionnel selon l'état de connexion */}
        {!isAuthenticated ? (
          <>
            <Link
              to="/register"
              className="hover:text-yellow-400 flex items-center gap-1 transition-colors duration-200"
            >
              <UserPlus size={18} />
              S'inscrire
            </Link>

            <Link
              to="/login"
              className="hover:text-yellow-400 flex items-center gap-1 transition-colors duration-200"
            >
              <UserCog size={18} />
              Se connecter
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profil"
              className="hover:text-yellow-400 flex items-center gap-1 transition-colors duration-200"
            >
              <User size={18} />
              {user?.name || 'Mon Profil'}
            </Link>

            <button
              onClick={handleLogout}
              className="hover:text-yellow-400 flex items-center gap-1 cursor-pointer transition-colors duration-200"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
