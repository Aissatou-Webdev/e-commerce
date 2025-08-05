import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext'; // adapte selon ton dossier

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gold">Ma Boutique</Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gold">Accueil</Link>
          <Link to="/catalog" className="hover:text-gold">Catalogue</Link>
          <Link to="/contact" className="hover:text-gold">Contact</Link>
          <Link to="/cart" className="relative hover:text-gold">
            <FaShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
