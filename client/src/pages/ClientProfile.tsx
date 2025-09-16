import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  ShoppingCart, 
  Package, 
  Settings, 
  LogOut, 
  Edit3, 
  Trash2,
  Plus,
  Minus,
  Eye,
  Calendar,
  CreditCard,
  Phone,
  MapPin,
  Mail
} from "lucide-react";

// Import des images originales du catalogue
import img1 from "../assets/image/the_nivea.jpg";
import img2 from "../assets/image/rouge_levres.jpg";
import img3 from "../assets/image/fontde_teint.jpg";
import img4 from "../assets/image/gel_douce.jpg";
import img5 from "../assets/image/huille_cheveux.jpg";
import img6 from "../assets/image/glooss.jpg";
import img7 from "../assets/image/parfum1.jpg";
import img8 from "../assets/image/baya1.jpg";
import img9 from "../assets/image/baume.jpg";

// Mappage des IDs de produits avec les images originales du catalogue
const getStaticImageForProduct = (productId: number): string => {
  const imageMap: { [key: number]: string } = {
    1: img1, // Crème hydratante
    2: img2, // Rouge à lèvres
    3: img3, // Fond de teint
    4: img4, // Gel de douce
    5: img5, // Huille pour cheveux
    6: img6, // Gloss
    7: img7, // Parfum
    8: img8, // Baya
    9: img9, // Baume à lèvres
  };
  
  return imageMap[productId] || img1; // Image par défaut si ID non trouvé
};

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

const ClientProfile = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'cart' | 'orders'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [authUser, navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      
      // Récupérer le profil utilisateur
      const profileRes = await axios.get<UserProfile>(
        "http://localhost:5001/api/client/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(profileRes.data);
      setEditForm({
        name: profileRes.data.name,
        phone: profileRes.data.phone || '',
        address: profileRes.data.address || ''
      });

      // Récupérer le panier
      const cartRes = await axios.get(
        "http://localhost:5001/api/cart",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(cartRes.data.cart || []);

      // Récupérer les commandes
      const ordersRes = await axios.get<Order[]>(
        "http://localhost:5001/api/client/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(ordersRes.data);
    } catch (error: any) {
      console.error("Erreur récupération données :", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (cartId: number, newQuantity: number) => {
    const token = localStorage.getItem("clientToken");
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:5001/api/cart/${cartId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Recharger les données
    } catch (error) {
      console.error("Erreur mise à jour quantité :", error);
    }
  };

  const removeFromCart = async (cartId: number) => {
    const token = localStorage.getItem("clientToken");
    if (!token) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/cart/${cartId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Recharger les données
    } catch (error) {
      console.error("Erreur suppression article :", error);
    }
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("clientToken");
    
    if (!token) {
      alert("Token d'authentification manquant. Veuillez vous reconnecter.");
      navigate("/login");
      return;
    }

    // Validation des champs
    if (!editForm.name.trim()) {
      alert("Le nom est obligatoire");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5001/api/client/profile",
        {
          name: editForm.name.trim(),
          phone: editForm.phone.trim(),
          address: editForm.address.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Mise à jour réussie
      alert("Profil mis à jour avec succès !");
      setEditMode(false);
      
      // Recharger les données pour refléter les changements
      await fetchData();
      
    } catch (error: any) {
      console.error("❌ Erreur mise à jour profil :", error);
      
      if (error.response?.status === 401) {
        alert("Session expirée. Veuillez vous reconnecter.");
        logout();
        navigate("/login");
      } else if (error.response?.status === 400) {
        alert(error.response.data.message || "Données invalides");
      } else if (error.response?.status === 404) {
        alert("Route API non trouvée. Vérifiez que le serveur backend fonctionne.");
      } else {
        alert("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          <p className="text-xl font-semibold text-yellow-100">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Bienvenue, {user?.name}</h1>
                <p className="text-gray-300">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl mb-8 border border-yellow-500/20">
          <div className="flex border-b border-yellow-500/30">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-500/10'
                  : 'text-gray-300 hover:text-yellow-300 hover:bg-gray-700/30'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Mon Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'cart'
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-500/10'
                  : 'text-gray-300 hover:text-yellow-300 hover:bg-gray-700/30'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Mon Panier</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-500/10'
                  : 'text-gray-300 hover:text-yellow-300 hover:bg-gray-700/30'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Mes Commandes</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-yellow-500/20">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-yellow-100">Informations Personnelles</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-black rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 hover:scale-105 font-semibold"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{editMode ? 'Annuler' : 'Modifier'}</span>
                </button>
              </div>

              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-100 mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                      placeholder="Entrez votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-100 mb-2">Téléphone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                      placeholder="Entrez votre numéro de téléphone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-yellow-100 mb-2">Adresse</label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 resize-none"
                      placeholder="Entrez votre adresse complète"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      onClick={updateProfile}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 hover:scale-105 font-semibold"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Nom complet</p>
                      <p className="font-semibold text-yellow-100">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-semibold text-yellow-100">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Téléphone</p>
                      <p className="font-semibold text-yellow-100">{user?.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Adresse</p>
                      <p className="font-semibold text-yellow-100">{user?.address || 'Non renseignée'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cart' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-yellow-100">Mon Panier</h2>
                <div className="text-lg font-semibold text-yellow-400">
                  Total: {totalCartValue.toFixed(2)} €
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-100 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-300 mb-6">Aucun produit ajouté au panier. Allez sur le catalogue pour ajouter des produits à votre panier.</p>
                  
                  <button
                    onClick={() => navigate('/catalog')}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-black rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    Parcourir le catalogue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    // Utiliser l'image statique du catalogue au lieu de l'image de la base de données
                    const staticImage = getStaticImageForProduct(item.product_id);
                    
                    return (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-yellow-500/30 rounded-xl bg-gray-700/30">
                      <div className="w-16 h-16 bg-gray-600/50 rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src={staticImage}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-100">{item.name}</h3>
                        <p className="text-gray-300">{item.price} € / unité</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-full bg-gray-600/50 hover:bg-gray-500/50 disabled:opacity-50 text-yellow-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold text-yellow-100">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-600/50 hover:bg-gray-500/50 text-yellow-400"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-100">{(item.price * item.quantity).toFixed(2)} €</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    );
                  })}
                  <div className="flex justify-end pt-4 border-t border-yellow-500/30">
                    <button
                      onClick={() => navigate('/cart')}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 hover:scale-105 font-semibold"
                    >
                      Finaliser la commande
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-yellow-100">Mes Commandes</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
                  <p className="text-gray-600">Vous n'avez pas encore passé de commande</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Commande #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'paid' ? 'Payée' :
                           order.status === 'pending' ? 'En attente' :
                           order.status === 'shipped' ? 'Expédiée' :
                           order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Total</p>
                            <p className="font-semibold">{order.total_amount} €</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-semibold">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                            <span>Voir détails</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
