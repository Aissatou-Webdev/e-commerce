// src/components/ProductCard.tsx
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const handleAddToCart = async () => {
    const token = localStorage.getItem("clientToken");
    const userId = localStorage.getItem("clientId");

    if (!token || !userId) {
      toast.error("⚠️ Vous devez être connecté pour ajouter un produit au panier");
      return;
    }

    console.log("Token:", token, "UserId:", userId, "ProductId:", product.id); // debug

    try {
      const res = await axios.post(
        "http://localhost:5000/api",
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.cart) {
        toast.success(`✅ ${product.name} ajouté au panier !`);
        console.log("Panier mis à jour :", res.data.cart); // debug panier
      } else {
        toast.error(res.data.message || "Erreur lors de l'ajout au panier");
      }
    } catch (err: any) {
      console.error("Erreur ajout panier :", err);
      toast.error("❌ Impossible d'ajouter le produit au panier");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md text-center hover:shadow-xl hover:scale-105 transition-transform duration-300">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-cover mx-auto mb-4 rounded-lg"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.price} €</p>
      <button
        onClick={handleAddToCart}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300"
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
