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
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Search
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
  firstname: string;
  name: string;
  email: string;
  subject?: string;
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
    if (!token) navigate("/login-admin");
  }, [navigate, token]);

  // 🔹 Fetch data selon la page active
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setLoading(true);
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
          console.log("🔍 Récupération des messages...");
          const res = await axios.get<Message[]>(
            "http://localhost:5001/api/admin/messages",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("📨 Messages reçus:", res.data);
          setMessages(res.data);
        }
      } catch (err) {
        console.error(`Erreur fetch ${activePage}:`, err);
        if (axios.isAxiosError(err)) {
          console.error("Status:", err.response?.status);
          console.error("Data:", err.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activePage, token]);

  // 🔑 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // 🗑️ Fonction de suppression de produit
  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5001/api/admin/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Recharger les produits après suppression
      if (activePage === "products") {
        const res = await axios.get<Product[]>(
          "http://localhost:5001/api/admin/products",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data);
      }
    } catch (err) {
      console.error(`Erreur suppression produit:`, err);
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard": return "Tableau de Bord";
      case "products": return "Gestion des Produits";
      case "clients": return "Gestion des Utilisateurs";
      case "orders": return "Gestion des Commandes";
      case "messages": return "Centre de Messages";
      default: return "Admin Panel";
    }
  };

  // Premium StatCard Component
  const StatCard = ({ icon: Icon, title, value, change, color, trend }: any) => (
    <div className="group bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-all duration-500 bg-gradient-to-br ${color}`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 animate-float`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-bold ${
            trend === 'up' 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{change}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-yellow-100 mb-2 group-hover:scale-105 transition-all duration-200">{value}</h3>
          <p className="text-gray-300 font-medium">{title}</p>
        </div>
        
        {/* Sparkle Effect */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-sparkle" />
        </div>
      </div>
    </div>
  );

  // 🔹 Contenu selon page active
  const renderPage = () => {
    if (loading) {
      return (
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="flex items-center justify-center space-x-6">
          <div className="animate-bounce">
            <div className="w-20 h-20 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent animate-pulse">Chargement des données...</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce animate-delay-100" />
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce animate-delay-200" />
            </div>
          </div>
        </div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Clients Actifs"
                value={stats?.totalClients || 0}
                change="+12.5"
                color="from-yellow-500 to-amber-600"
                trend="up"
              />
              <StatCard
                icon={Package}
                title="Produits en Stock"
                value={stats?.totalProducts || 0}
                change="+8.2"
                color="from-amber-500 to-yellow-600"
                trend="up"
              />
              <StatCard
                icon={ShoppingCart}
                title="Commandes Total"
                value={stats?.totalOrders || 0}
                change="-2.1"
                color="from-yellow-600 to-amber-700"
                trend="down"
              />
              <StatCard
                icon={DollarSign}
                title="Revenus (€)"
                value={`${stats?.totalSales || 0}`}
                change="+18.7"
                color="from-amber-600 to-yellow-500"
                trend="up"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity Chart */}
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-yellow-100">Activité Récente</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 80, 45, 90, 55, 75, 85].map((height, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-yellow-600 to-amber-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity duration-200" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-yellow-100">Commandes Récentes</h3>
                  <button className="text-yellow-400 hover:text-yellow-300 font-medium text-sm">
                    Voir tout
                  </button>
                </div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-yellow-500/10 rounded-lg transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-yellow-100">Commande #{1000 + index}</p>
                          <p className="text-sm text-gray-400">Client {index + 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-100">{(Math.random() * 100 + 20).toFixed(2)}€</p>
                        <p className="text-sm text-yellow-400">Payé</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "products":
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-100">Gestion des Produits</h2>
                <p className="text-gray-300 mt-1">Gérez votre inventaire et vos produits</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/60 text-gray-300 rounded-xl hover:bg-gray-700/60 border border-yellow-500/20 transition-colors duration-200">
                  <Filter className="w-4 h-4" />
                  <span>Filtrer</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/60 text-gray-300 rounded-xl hover:bg-gray-700/60 border border-yellow-500/20 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => navigate("/admin/add")}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-black rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un produit</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-yellow-100 mb-2">Aucun produit disponible</h3>
                <p className="text-gray-300 mb-6">Commencez par ajouter votre premier produit</p>
                <button
                  onClick={() => navigate("/admin/add")}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-black rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Ajouter le premier produit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      {product.image ? (
                        <img
                          src={`http://localhost:5001/uploads/${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors duration-200">
                          <Eye className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors duration-200">
                          <Edit3 className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors duration-200">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-yellow-100 truncate">{product.name}</h3>
                        <span className="text-lg font-bold text-yellow-100">{product.price}€</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-gray-800/60 text-gray-300 rounded-full text-xs font-medium border border-yellow-500/20">
                          {product.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
                          <span className="text-sm text-gray-300">Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "clients":
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-100">Gestion des Utilisateurs</h2>
                <p className="text-gray-300 mt-1">Gérez vos clients et leurs informations</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/60 text-gray-300 rounded-xl hover:bg-gray-700/60 border border-yellow-500/20 transition-colors duration-200">
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/60 text-gray-300 rounded-xl hover:bg-gray-700/60 border border-yellow-500/20 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Clients List */}
            {clients.length === 0 ? (
              <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-yellow-100 mb-2">Aucun client inscrit</h3>
                <p className="text-gray-300">Les clients apparaîtront ici une fois qu'ils se seront inscrits</p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50">
                      {clients.map((client, index) => (
                        <tr key={client.id} className="hover:bg-yellow-500/10 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-100">
                            #{client.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {client.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-yellow-100">{client.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {client.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                              Actif
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                            <button 
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case "messages":
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-100">Centre de Messages</h2>
                <p className="text-gray-300 mt-1">Gérez les messages de contact de vos clients</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/60 text-gray-300 rounded-xl hover:bg-gray-700/60 border border-yellow-500/20 transition-colors duration-200">
                  <Filter className="w-4 h-4" />
                  <span>Filtrer</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/60 text-gray-300 rounded-xl hover:bg-gray-700/60 border border-yellow-500/20 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Messages List */}
            {messages.length === 0 ? (
              <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📨</span>
                </div>
                <h3 className="text-xl font-semibold text-yellow-100 mb-2">Aucun message reçu</h3>
                <p className="text-gray-300">Les messages de contact apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20 p-6 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-200 hover:scale-[1.01]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {message.firstname ? message.firstname.charAt(0).toUpperCase() : message.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-yellow-100">
                            {message.firstname ? `${message.firstname} ${message.name}` : message.name}
                          </h3>
                          <p className="text-sm text-gray-300">{message.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(message.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </span>
                        <div className="flex space-x-1">
                          <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subject if exists */}
                    {message.subject && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-300">Sujet: </span>
                        <span className="text-sm text-gray-400">{message.subject}</span>
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-yellow-500/20">
                      <p className="text-gray-300 leading-relaxed">{message.message}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-yellow-500/20">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          Nouveau
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-100 transition-colors duration-200">
                          Marquer comme lu
                        </button>
                        <button className="px-4 py-2 bg-yellow-600 text-black text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors duration-200">
                          Répondre
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-100">Gestion des Commandes</h2>
                <p className="text-gray-300 mt-1">Suivez et gérez toutes les commandes</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200">
                  <Filter className="w-4 h-4" />
                  <span>Filtrer</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-yellow-100 mb-2">Aucune commande</h3>
                <p className="text-gray-300">Les commandes apparaîtront ici une fois que les clients passeront des commandes</p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Commande
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-yellow-500/20">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-yellow-500/10 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-100">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            Client #{order.user_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-100">
                            {order.total_amount}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              order.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}>
                              {order.status === 'paid' ? 'Payé' :
                               order.status === 'pending' ? 'En attente' :
                               order.status === 'shipped' ? 'Expédié' :
                               order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                            <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Contenu à implémenter pour {activePage}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Sidebar */}
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        handleLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Topbar */}
        <AdminTopbar
          title={getPageTitle()}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content */}
        <main className="p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;