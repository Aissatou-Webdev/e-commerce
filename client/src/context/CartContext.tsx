// src/context/CartContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: number) => void;
  fetchCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  fetchCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const token = localStorage.getItem("clientToken");

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("Erreur récupération panier :", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (product: Product) => {
    if (!token) {
      toast.error("⚠️ Vous devez être connecté pour ajouter un produit au panier");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.cart) {
        setCartItems(res.data.cart);
        toast.success(`✅ ${product.name} ajouté au panier !`);
      }
    } catch (err: any) {
      console.error("Erreur ajout panier :", err);
      toast.error("❌ Impossible d'ajouter le produit au panier");
    }
  };

  const removeFromCart = async (cartId: number) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.id !== cartId));
      toast.info("Produit supprimé du panier");
    } catch (err) {
      console.error("Erreur suppression panier :", err);
      toast.error("❌ Impossible de supprimer le produit");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
