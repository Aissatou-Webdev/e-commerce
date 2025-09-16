import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Calcul du total
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black">
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Mon Panier</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-300 text-lg">Ton panier est vide.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="mb-4 border-b border-yellow-500/20 pb-2 flex flex-col md:flex-row md:justify-between items-start md:items-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-4">
                <div>
                  <h3 className="font-semibold text-yellow-100">{item.name}</h3>
                  <p className="text-gray-300">Prix : {item.price} €</p>
                  <p className="text-gray-300">Quantité : {item.quantity}</p>
                </div>
                <button
                  className="mt-2 md:mt-0 bg-red-600 text-white px-3 py-1 rounded-xl hover:bg-red-500 transition-all duration-300 hover:scale-105"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right font-bold text-yellow-100 text-xl">
            Total : {total} €
          </div>
        </>
      )}
    </div>
        </div>
  );
}
