import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../Componente/admin/AdminSidebar";
import AdminTopbar from "../../Componente/admin/AdminTopbar";
import { 
  Plus,
  Edit3,
  Trash2,
  Package
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // Vérification token admin
  useEffect(() => {
    if (!token) navigate("/login-admin");
  }, [navigate, token]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.warn("🔒 Aucun token trouvé dans localStorage !");
        navigate("/login-admin");
        return;
      }

      const res = await axios.get("http://localhost:5001/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des produits :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5001/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // Refresh après suppression
      alert("Produit supprimé avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression du produit");
    }
  }

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Sidebar */}
      <AdminSidebar
        activePage="products"
        setActivePage={() => {}}
        handleLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Topbar */}
        <AdminTopbar
          title="Gestion des Produits"
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content */}
        <main className="p-8">
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-100">Liste des Produits</h2>
                <p className="text-gray-300 mt-1">Gérez votre inventaire et vos produits</p>
              </div>
              <Link
                to="/admin/add"
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-black rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un produit</span>
              </Link>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                  <p className="text-gray-300">Chargement des produits...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-yellow-100 mb-2">Aucun produit disponible</h3>
                <p className="text-gray-300 mb-6">Commencez par ajouter votre premier produit</p>
                <Link
                  to="/admin/add"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-black rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
                >
                  Ajouter le premier produit
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-black/40 backdrop-blur-sm rounded-2xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  >
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
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4 text-yellow-400" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors duration-200"
                        >
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;
