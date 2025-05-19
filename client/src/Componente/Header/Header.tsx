import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gold">Ma Boutique</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-gold">Accueil</Link></li>
            <li><Link to="/catalog" className="hover:text-gold">Catalogue</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/cart" className="hover:text-gold">Panier</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
