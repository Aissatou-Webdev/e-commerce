import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mon Panier</h1>

      {cartItems.length === 0 ? (
        <p>Ton panier est vide.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="mb-4 border-b pb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <p>Prix : {item.price} €</p>
              <p>Quantité : {item.quantity}</p>
              <button
                className="text-red-500 mt-2"
                onClick={() => removeFromCart(item.id)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
