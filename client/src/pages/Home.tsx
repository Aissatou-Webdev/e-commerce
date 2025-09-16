import React from 'react';
import { Link } from "react-router-dom";

import imgBanner from "../assets/image/vaseline_cocoa_radiant.jpg";
import img1 from "../assets/image/vaseline_cocoa_radiant.jpg";
import img2 from "../assets/image/rouge_levres.jpg";
import img3 from "../assets/image/fontde_teint.jpg";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-screen">
        {/* Bannière */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-black via-gray-900 to-black text-yellow-100 flex items-center justify-center">
        <img
          src={imgBanner}
          alt="Bannière"
          className="absolute w-full h-full object-cover opacity-60"
        />
        <div className="relative text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Bienvenue sur Notre Boutique
          </h1>
          <p className="mt-4 text-lg text-gray-300">Découvrez nos meilleurs produits cosmétiques</p>
          <Link
            to="/catalog"
            className="mt-6 inline-block bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-6 py-3 rounded-xl shadow-lg hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>

      {/* Produits phares */}
      <section className="py-12 px-6 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Nos Produits Phares</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 p-4 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-105">
            <img src={img1} alt="Produit 1" className="w-full h-48 object-cover rounded" />
            <h3 className="mt-4 text-lg font-semibold text-yellow-100">Crème hydratante</h3>
            <p className="text-amber-400 font-bold">20€</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 p-4 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-105">
            <img src={img2} alt="Produit 2" className="w-full h-48 object-cover rounded" />
            <h3 className="mt-4 text-lg font-semibold text-yellow-100">Rouge à lèvres</h3>
            <p className="text-amber-400 font-bold">15€</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 p-4 rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-105">
            <img src={img3} alt="Produit 3" className="w-full h-48 object-cover rounded" />
            <h3 className="mt-4 text-lg font-semibold text-yellow-100">Fond de teint</h3>
            <p className="text-amber-400 font-bold">25€</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            to="/catalog"
            className="bg-gradient-to-r from-yellow-600 to-amber-600 text-black px-6 py-3 rounded-xl shadow-lg hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Voir tous les produits
          </Link>
        </div>
      </section>

      {/* À propos */}
      <section className="py-12 px-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">À Propos de Nous</h2>
        <p className="text-lg text-center max-w-3xl mx-auto text-gray-300">
          Nous sommes une boutique spécialisée dans les produits cosmétiques de qualité.
          Notre mission est de vous offrir les meilleurs produits pour prendre soin de vous
          au quotidien.
        </p>
      </section>
      </div>
    </div>
  );
};

export default Home;
