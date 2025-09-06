import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../Componente/Navbar";

export default function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Calcul du total
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen flex flex-col justify-between  ">
         <Navbar/>
    
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mon Panier</h1>

      {cartItems.length === 0 ? (
        <p>Ton panier est vide.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="mb-4 border-b pb-2 flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>Prix : {item.price} €</p>
                  <p>Quantité : {item.quantity}</p>
                </div>
                <button
                  className="mt-2 md:mt-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right font-bold">
            Total : {total} €
          </div>
        </>
      )}
    </div>
        </div>
  );
}
