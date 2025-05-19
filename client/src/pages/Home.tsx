import React from 'react';

import { Link } from "react-router-dom";
import imgBanner from "../assets/image/Vaseline Cocoa Radiant.jpg"; // Remplace avec ton image de bannière
import img1 from "../assets/image/Vaseline Cocoa Radiant (1).jpg";
import img2 from "../assets/image/Rouge à lèvre1.jpg";
import img3 from "../assets/image/Font de teint.jpg";


const Home = () => {

  
  return (
    <div className='w-screen'>
      {/* Bannière */}
      <div className="relative w-full h-[400px] bg-black text-white flex items-center justify-center">
        <img
          src={imgBanner}
          alt="Bannière"
          className="absolute w-full h-full object-cover opacity-60"
        />
        <div className="relative text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Bienvenue sur Notre Boutique
          </h1>
          <p className="mt-4 text-lg">Découvrez nos meilleurs produits cosmétiques</p>
          <Link
            to="/catalog"
            className="mt-6 inline-block bg-white text-black px-6 py-3 rounded shadow hover:bg-gray-200"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>

      {/* Section Produits phares */}
      <section className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Nos Produits Phares</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border p-4 rounded shadow">
            <img src={img1} alt="Produit 1" className="w-full h-48 object-cover rounded" />
            <h3 className="mt-4 text-lg font-semibold">Crème hydratante</h3>
            <p className="text-gray-700">20€</p>
          </div>
          <div className="border p-4 rounded shadow">
            <img src={img2} alt="Produit 2" className="w-full h-48 object-cover rounded" />
            <h3 className="mt-4 text-lg font-semibold">Rouge à lèvres</h3>
            <p className="text-gray-700">15€</p>
          </div>
          <div className="border p-4 rounded shadow">
            <img src={img3} alt="Produit 3" className="w-full h-48 object-cover rounded" />
            <h3 className="mt-4 text-lg font-semibold">Fond de teint</h3>
            <p className="text-gray-700">25€</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            to="/catalog"
            className="bg-black text-white px-6 py-3 rounded shadow hover:bg-gray-800"
          >
            Voir tous les produits
          </Link>
        </div>
      </section>

      {/* Section À propos */}
      <section className="py-12 px-6 bg-gray-500">
        <h2 className="text-3xl font-bold text-center mb-6">À Propos de Nous</h2>
        <p className="text-lg text-center max-w-3xl mx-auto">
          Nous sommes une boutique spécialisée dans les produits cosmétiques de qualité.
          Notre mission est de vous offrir les meilleurs produits pour prendre soin de vous
          au quotidien.
        </p>
      </section>
    </div>
  );
};

export default Home;
