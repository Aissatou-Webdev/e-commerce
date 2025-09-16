import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../Componente/admin/AdminSidebar";
import AdminTopbar from "../Componente/admin/AdminTopbar";
import { 
  Save, 
  X, 
  Package, 
  DollarSign, 
  Hash,
  FileText,
  Tag,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";

// ✅ Interface pour typer le produit
interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: string;
}

interface Product extends ProductForm {
  id: number;
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>(); // ✅ Type pour useParams
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const token = localStorage.getItem("adminToken");

  // Vérification token admin
  useEffect(() => {
    if (!token) navigate("/login-admin");
  }, [navigate, token]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID du produit manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<Product[]>(`http://localhost:5001/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = response.data.find((p: Product) => p.id.toString() === id);

        if (found) {
          setProduct({
            name: found.name,
            description: found.description,
            price: found.price.toString(),
            stock: found.stock.toString(),
            category: found.category,
            image: found.image,
          });
        } else {
          setError("Produit non trouvé");
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("ID du produit manquant");
      return;
    }

    try {
      setError(null);

      await axios.put(`http://localhost:5001/api/admin/products/${id}`, {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Produit modifié avec succès !");
      navigate("/admin/products");
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError("Erreur lors de la mise à jour du produit");
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // ✅ Affichage conditionnel
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          <p className="text-xl font-bold text-yellow-100">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="max-w-xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-500/20">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-red-400 text-lg">Erreur</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/products")}
            className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-200"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

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
          title="Modifier le Produit"
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content */}
        <main className="p-8">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-yellow-100">Modifier le produit</h2>
                <p className="text-gray-300 mt-1">Mettez à jour les informations du produit</p>
              </div>
              <button
                onClick={() => navigate("/admin/products")}
                className="flex items-center space-x-2 bg-gray-700/50 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-600/50 transition-all duration-300 border border-gray-600/30"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5" />
                  <span><strong>Erreur:</strong> {error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-500/20 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom du produit */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-yellow-100 font-medium">
                      <Package className="w-4 h-4" />
                      <span>Nom du produit</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                      placeholder="Entrez le nom du produit"
                      required
                    />
                  </div>

                  {/* Prix */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-yellow-100 font-medium">
                      <DollarSign className="w-4 h-4" />
                      <span>Prix (€)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-yellow-100 font-medium">
                      <Hash className="w-4 h-4" />
                      <span>Stock</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={product.stock}
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  {/* Catégorie */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-yellow-100 font-medium">
                      <Tag className="w-4 h-4" />
                      <span>Catégorie</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                      placeholder="Entrez la catégorie"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-yellow-100 font-medium">
                    <FileText className="w-4 h-4" />
                    <span>Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 resize-none"
                    placeholder="Décrivez le produit..."
                    required
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-yellow-100 font-medium">
                    <ImageIcon className="w-4 h-4" />
                    <span>URL de l'image</span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={product.image}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-yellow-500/30 p-3 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                    placeholder="https://exemple.com/image.jpg"
                    required
                  />
                </div>

                {/* Preview de l'image */}
                {product.image && (
                  <div className="space-y-2">
                    <label className="text-yellow-100 font-medium">Aperçu de l'image</label>
                    <div className="border border-yellow-500/30 rounded-xl p-4 bg-gray-700/30">
                      <img
                        src={product.image}
                        alt="Aperçu"
                        className="w-32 h-32 object-cover rounded-xl mx-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-black px-6 py-3 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    <span>Sauvegarder les modifications</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-700/50 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-600/50 transition-all duration-300 border border-gray-600/30"
                  >
                    <X className="w-5 h-5" />
                    <span>Annuler</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
