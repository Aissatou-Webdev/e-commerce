import { createContext, useState, ReactNode } from "react";

// Définir le type d’un article dans le panier
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

// Définir le type du contexte
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
};

// Créer le contexte avec des valeurs par défaut
export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
});

// Créer le provider du contexte
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      setCartItems(
        cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      );
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
