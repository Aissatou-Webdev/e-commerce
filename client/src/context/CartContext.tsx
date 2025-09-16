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
  
  // Vérifier l'authentification via localStorage pour éviter les imports circulaires
  const token = localStorage.getItem("clientToken");
  const isAuthenticated = !!token;

  const fetchCart = async () => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await axios.get("http://localhost:5001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.cart) {
        setCartItems(res.data.cart);
      }
    } catch (err) {
      console.error("Erreur récupération panier :", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]); // Vider le panier si non connecté
    }
  }, [isAuthenticated, token]);

  const addToCart = async (product: Product) => {
    if (!isAuthenticated || !token) {
      toast.error("⚠️ Vous devez être connecté pour ajouter un produit au panier");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/cart/products",
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.cart) {
        setCartItems(res.data.cart);
        toast.success(`✅ ${product.name} ajouté au panier !`);
      }
    } catch (err: any) {
      console.error("Erreur ajout panier :", err);
      toast.error("❌ Impossible d'ajouter le produit au panier");
    }
  };

  const removeFromCart = async (cartId: number) => {
    if (!isAuthenticated || !token) return;
    try {
      await axios.delete(`http://localhost:5001/api/cart/${cartId}`, {
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
