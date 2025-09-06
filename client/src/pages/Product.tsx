import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import imgCremehydratante from "../assets/image/the_nivea.jpg";
import imgRougeLevres from "../assets/image/rouge_levres.jpg";
import imgFontDeteint from "../assets/image/fontde_teint.jpg";
import imgGelDouce from "../assets/image/gel_douce.jpg";
import imgHuilleCheveux from "../assets/image/huille_cheveux.jpg";
import imgGloss from "../assets/image/glooss.jpg";
import imgParfum from "../assets/image/parfum1.jpg";
import imgBaya from "../assets/image/baume.jpg";
import imgBaumeLevres from "../assets/image/baume.jpg";
import Navbar from '../Componente/Navbar';

const products = [
  { id: 1, name: 'Crème hydratante', price: 20, description: 'Hydrate la peau en profondeur.', image: imgCremehydratante },
  { id: 2, name: 'Rouge à lèvres', price: 15, description: 'Un rouge éclatant pour toutes occasions.', image: imgRougeLevres },
  { id: 3, name: 'Fond de teint', price: 25, description: 'Couvre parfaitement les imperfections.', image: imgFontDeteint },
  { id: 4, name: 'Gel de douce', price: 25, description: 'Hydrate et nettoie la peau en douceur.', image: imgGelDouce },
  { id: 5, name: 'Huile pour cheveux', price: 25, description: 'Nourrit et protège les cheveux.', image: imgHuilleCheveux },
  { id: 6, name: 'Gloss', price: 25, description: 'Apporte une brillance lumineuse.', image: imgGloss },
  { id: 7, name: 'Parfum', price: 25, description: 'Une fragrance élégante et envoûtante.', image: imgParfum },
  { id: 8, name: 'Baya', price: 25, description: 'Laissant une senteur envoûtante et raffinée.', image: imgBaya },
  { id: 9, name: 'Baume à lèvres', price: 25, description: 'Une hydratation intense et un confort optimal.', image: imgBaumeLevres },
];

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { cart, addToCart } = useContext(CartContext);
  const product = products.find((p) => p.id === parseInt(id ?? "0"));

  if (!product) {
    return <h1 className="text-center text-2xl text-red-500">Produit introuvable !</h1>;
  }

  const handleAddToCart = () => {
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      addToCart({ ...product, quantity: existingItem.quantity + 1 });
    } else {
      addToCart({ ...product, quantity: 1 });
    }

    toast.success(`${product.name} ajouté au panier !`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between  ">
         <Navbar/>
    
    <div className="p-8 w-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image ?? "/placeholder.jpg"}
          alt={product.name ?? "Produit"}
          className="w-64 h-64 object-cover rounded-md"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">{product.price} €</p>
          <p className="mt-4">{product.description}</p>
          <button
            className="bg-black text-yellow-400 py-2 px-4 rounded-md hover:bg-gray-900 transition"
            onClick={handleAddToCart}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
        </div>
  );
};

export default Product;
