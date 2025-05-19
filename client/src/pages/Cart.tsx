import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  return (
    <div className="p-6 w-screen">
      <h2 className="text-2xl font-bold mb-4">🛍️ Votre panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p>{item.price} €</p>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 border px-2"
                />
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600">
                Supprimer
              </button>
            </div>
          ))}
          <div className="text-right font-bold text-lg">
            Total : {getTotal()} €
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
