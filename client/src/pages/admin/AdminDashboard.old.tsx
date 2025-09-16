// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Componente/admin/AdminSidebar";
import AdminTopbar from "../../Componente/admin/AdminTopbar";
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Activity,
  BarChart3,
  PieChart
} from "lucide-react";

// 🔹 Interfaces
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface DashboardStats {
  totalClients: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
}

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // 🔒 Vérification token admin
  useEffect(() => {
    if (!token) navigate("/login-admin"); // 🔹 route corrigée
  }, [navigate, token]);

  // 🔹 Fetch data selon la page active
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        if (activePage === "dashboard") {
          const res = await axios.get<DashboardStats>(
            "http://localhost:5001/api/admin/dashboard",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStats(res.data);
        } else if (activePage === "products") {
          const res = await axios.get<Product[]>(
            "http://localhost:5001/api/admin/products",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProducts(res.data);
        } else if (activePage === "clients") {
          const res = await axios.get<Client[]>(
            "http://localhost:5001/api/admin/clients",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setClients(res.data);
        } else if (activePage === "orders") {
          const res = await axios.get<Order[]>(
            "http://localhost:5001/api/admin/orders",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOrders(res.data);
        } else if (activePage === "messages") {
          const res = await axios.get<Message[]>(
            "http://localhost:5001/api/admin/messages",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages(res.data);
        }
      } catch (err) {
        console.error(`Erreur fetch ${activePage}:`, err);
      }
    };

    fetchData();
  }, [activePage, token]);

  // 🔑 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // 🔹 Contenu selon page active
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return stats ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">📊 Tableau de Bord</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white shadow-md rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold">Clients</h3>
                <p className="text-3xl text-blue-600 font-bold">{stats.totalClients}</p>
              </div>
              <div className="bg-white shadow-md rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold">Produits</h3>
                <p className="text-3xl text-green-600 font-bold">{stats.totalProducts}</p>
              </div>
              <div className="bg-white shadow-md rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold">Commandes</h3>
                <p className="text-3xl text-purple-600 font-bold">{stats.totalOrders}</p>
              </div>
              <div className="bg-white shadow-md rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold">Ventes (€)</h3>
                <p className="text-3xl text-yellow-600 font-bold">{stats.totalSales}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Chargement des statistiques...</p>
        );

      case "products":
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📦 Gestion des Produits</h2>
              <button
                onClick={() => navigate("/admin/add")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ➕ Ajouter un produit
              </button>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Aucun produit disponible.</p>
                <button
                  onClick={() => navigate("/admin/add")}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Ajouter le premier produit
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="border p-4 rounded shadow">
                    <p><strong>Nom:</strong> {p.name}</p>
                    <p><strong>Description:</strong> {p.description}</p>
                    <p><strong>Prix:</strong> {p.price} €</p>
                    <p><strong>Stock:</strong> {p.stock}</p>
                    <p><strong>Catégorie:</strong> {p.category}</p>
                    {p.image && (
                      <img
                        src={`http://localhost:5001/uploads/${p.image}`}
                        alt={p.name}
                        className="w-32 mt-2"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "clients":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">👤 Gestion des Clients</h2>
            {clients.length === 0 ? (
              <p>Aucun client enregistré.</p>
            ) : (
              <ul className="space-y-3">
                {clients.map((c) => (
                  <li key={c.id} className="border p-4 rounded shadow">
                    <p><strong>Nom:</strong> {c.name}</p>
                    <p><strong>Email:</strong> {c.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">🛒 Gestion des Commandes</h2>
            {orders.length === 0 ? (
              <p>Aucune commande passée.</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="border p-4 rounded shadow">
                    <p><strong>Commande #</strong> {o.id}</p>
                    <p><strong>Client ID:</strong> {o.user_id}</p>
                    <p><strong>Total:</strong> {o.total_amount} €</p>
                    <p><strong>Status:</strong> {o.status}</p>
                    <p><strong>Date:</strong>{' '}
                      {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "messages":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">✉️ Messages de Contact</h2>
            {messages.length === 0 ? (
              <p>Aucun message reçu.</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className="border p-4 rounded shadow">
                    <p><strong>Nom:</strong> {m.name}</p>
                    <p><strong>Email:</strong> {m.email}</p>
                    <p><strong>Sujet:</strong> {m.subject}</p>
                    <p><strong>Message:</strong> {m.message}</p>
                    <p><strong>Date:</strong>{' '}
                      {new Date(m.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        return <h2 className="text-2xl font-bold">Bienvenue dans le tableau de bord Admin</h2>;
    }
  };

  return (
  <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar à gauche */}
    <div className="w-64 bg-white shadow-md">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        handleLogout={handleLogout}
      />
    </div>

    {/* Contenu principal à droite */}
    <main className="flex-1 p-6 overflow-y-auto">
      {renderPage()}
    </main>
  </div>
);

};

export default AdminDashboard;
