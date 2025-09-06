import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

const ClientProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("clientToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileAndOrders = async () => {
      try {
        const profileRes = await axios.get<User>(
          "http://localhost:5000/api/client/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(profileRes.data);

        const ordersRes = await axios.get<Order[]>(
          "http://localhost:5000/api/client/orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(ordersRes.data);
      } catch (err: any) {
        console.error("Erreur récupération profil ou commandes :", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("clientToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    navigate("/login");
  };

  if (loading) {
    return <p className="p-8">Chargement en cours...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>

      {user ? (
        <div className="mb-6">
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
        </div>
      ) : (
        <p className="text-red-500">Impossible de récupérer le profil.</p>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
      >
        Déconnexion
      </button>

      <div>
        <h2 className="text-xl font-bold mb-2">🧾 Mes Commandes</h2>
        {orders.length === 0 ? (
          <p>Aucune commande passée.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
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
