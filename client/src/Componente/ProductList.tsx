import React from "react";
import { useCart } from "../context/CartContext"; // importe ton hook personnalisé

const produits = [
  {
    id: 1,
    nom: "Rouge à lèvres classique",
    prix: 12.99,
    image: "/images/rouge-classique.jpg",
  },
  {
    id: 2,
    nom: "Rouge à lèvres mat",
    prix: 14.99,
    image: "/images/rouge-mat.jpg",
  },
  {
    id: 3,
    nom: "Rouge à lèvres brillant",
    prix: 13.5,
    image: "/images/rouge-brillant.jpg",
  },
];

export default function ProductList() {
  const { addToCart } = useCart(); // ✅ récupère addToCart depuis le contexte

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {produits.map((product) => (
        <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={product.image}
            alt={product.nom}
            className="w-full h-48 object-cover rounded-md"
          />
          <h2 className="text-lg font-semibold mt-2">{product.nom}</h2>
          <p className="text-gray-700 mb-2">{product.prix.toFixed(2)} €</p>
          <button
            className="button-ajouter-panier"
            onClick={() => addToCart({ ...product, quantity: 1 })}
          >
            Ajouter au panier
          </button>
        </div>
      ))}
    </div>
  );
}
