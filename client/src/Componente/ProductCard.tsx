import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
      <h2 className="text-xl font-bold mt-2">{product.name}</h2>
      <p className="text-lg text-gray-600">{product.price} €</p>
      <Link to={`/product/${product.id}`} className="block mt-4 text-center bg-black text-white py-2 rounded-md">
        Voir le produit
      </Link>
    </div>
  );
};

export default ProductCard;
