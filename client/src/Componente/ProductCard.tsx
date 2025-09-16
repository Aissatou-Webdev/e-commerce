// src/components/ProductCard.tsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("⚠️ Vous devez être connecté pour ajouter au panier");
      return;
    }

    // Convertir le produit au format attendu par le contexte
    const cartProduct = {
      ...product,
      quantity: 1
    };

    addToCart(cartProduct);
  };

  return (
    <div className="p-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl shadow-lg text-center hover:shadow-yellow-500/10 hover:scale-105 transition-all duration-300">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-cover mx-auto mb-4 rounded-xl"
        />
      )}
      <h3 className="text-lg font-semibold mb-2 text-yellow-100">{product.name}</h3>
      <p className="text-amber-400 mb-4 font-bold">{product.price} €</p>
      <button
        onClick={handleAddToCart}
        className="bg-gradient-to-r from-yellow-600 to-amber-600 text-black px-4 py-2 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 hover:scale-105 font-semibold"
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
