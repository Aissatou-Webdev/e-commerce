import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

import imgCremehydratante from "../assets/image/THE NIVEA GOODNESS (1).jpg"
import imgRougeLevres from "../assets/image/Rouge à lèvre1.jpg"
import imgFontDeteint from "../assets/image/Font de teint.jpg"
import imgGelDouce from "../assets/image/gel de douce2.jpg"
import imgHuilleCheveux from "../assets/image/Huille pour cheveux1.jpg"
import imgGloss from "../assets/image/Glooss.jpg"
import imgParfum from "../assets/image/Parfum1.jpg"
import imgBaya from "../assets/image/Baya1.jpg"
import imgBaumeLevres from "../assets/image/Vaseline aesthetics.jpg"

const products = [
  { id: 1, name: 'Crème hydratante', price: 20, description: 'Hydrate la peau en profondeur.', image: imgCremehydratante },
  { id: 2, name: 'Rouge à lèvres', price: 15, description: 'Un rouge éclatant pour toutes occasions.', image: imgRougeLevres },
  
  { id: 3, name: 'Fond de teint', price: 25, description: 'Couvre parfaitement les imperfections.', image: imgFontDeteint },
  { id: 4, name: 'Gel de douce', price: 25, description: 'Hydrate et nettoie la peau en douceur.', image: imgGelDouce },
  { id: 5, name: 'Huille pour cheveux', price: 25, description: 'Nourrit et protège les cheveux.', image: imgHuilleCheveux },
  { id: 6, name: 'Gloss', price: 25, description: 'Apporte une brillance lumineuse.', image: imgGloss },
  { id: 7, name: 'Parfum', price: 25, description: 'Une fragrance élégante et envoûtante.', image: imgParfum },
  { id: 8, name: 'Baya', price: 25, description: 'Laissant une senteur envoûtante et raffinée.', image: imgBaya },
  { id: 9, name: 'Baume à lèvres', price: 25, description: 'Une hydratation intense et un confort optimal.', image: imgBaumeLevres },
];

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <h1 className="text-center text-2xl text-red-500">Produit introuvable !</h1>;
  }

  return (
    <div className="p-8 w-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.image} alt={product.name} className="w-64 h-64 object-cover rounded-md" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">{product.price} €</p>
          <p className="mt-4">{product.description}</p>
          <button 
          className="button-ajouter-panier bg-black text-white py-2 rounded-md"
          onClick={() => addToCart({ ...product, quantity: 1 })}>
          Ajouter au panier
        </button>

        </div>
      </div>
    </div>
  );
};

export default Product;
