import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Erreur profil client", error);
        navigate("/login");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/client/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Erreur commandes", error);
      }
    };

    fetchUser();
    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    navigate("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      {user && (
        <div className="mb-6">
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
        </div>
      )}

      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Déconnexion
      </button>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2">🧾 Mes Commandes</h2>
        {orders.length === 0 ? (
          <p>Aucune commande passée.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order: any) => (
              <li key={order.id} className="border p-4 rounded shadow">
                <p><strong>Commande #</strong> {order.id}</p>
                <p><strong>Total :</strong> {order.total_amount} €</p>
                <p><strong>Status :</strong> {order.status}</p>
                <p><strong>Date :</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
