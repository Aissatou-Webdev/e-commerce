import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../Componente/admin/AdminSidebar";
import AdminTopbar from "../Componente/admin/AdminTopbar";
import { 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Package, 
  DollarSign, 
  Hash,
  FileText,
  Tag,
  Image as ImageIcon
} from "lucide-react";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: File | null;
}

export default function AddProduct() {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category) {
      setError("Tous les champs obligatoires doivent être remplis");
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError("Le prix doit être supérieur à 0");
      return;
    }

    if (parseInt(formData.stock) < 0) {
      setError("Le stock ne peut pas être négatif");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Token d'authentification manquant");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category", formData.category);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await axios.post("http://localhost:5001/api/admin/products", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Produit ajouté avec succès !");
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      setError("Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login-admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black particle-bg">
      {/* Sidebar */}
      <AdminSidebar
        activePage="add-product"
        setActivePage={() => {}}
        handleLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Topbar */}
        <AdminTopbar
          title="Ajouter un Produit"
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content */}
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Success Message */}
            {success && (
              <div className="mb-8 p-6 bg-black/40 backdrop-blur-sm border border-yellow-500/20 rounded-2xl animate-bounce-in">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center animate-glow">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-100 text-lg">Produit ajouté avec succès !</h3>
                    <p className="text-gray-300">Redirection vers le tableau de bord...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="mb-8 text-center animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-4">Créer un Nouveau Produit</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">Donnez vie à vos idées avec notre interface de création premium</p>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 mx-auto mt-4 rounded-full" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 animate-scale-up animate-delay-200">
              {/* Error Message */}
              {error && (
                <div className="p-6 bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-2xl animate-slide-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-400 text-lg">Erreur de validation</h3>
                      <p className="text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Form Content - Premium Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Left Column - Form Fields */}
                <div className="xl:col-span-3 space-y-8">
                  {/* Product Information Card */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.01] animate-slide-in-left">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 rounded-2xl flex items-center justify-center animate-morph">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Informations Produit</h3>
                        <p className="text-gray-400 text-sm">Détails essentiels de votre produit</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center space-x-2">
                          <span>Nom du produit</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Ex: Crème hydratante premium anti-âge"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl smooth-focus transition-all duration-300 group-hover:border-yellow-400/50 text-yellow-100 placeholder-gray-400"
                          required
                        />
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center space-x-2">
                          <span>Description détaillée</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          placeholder="Décrivez en détail les caractéristiques, avantages et bénéfices de votre produit..."
                          value={formData.description}
                          onChange={handleChange}
                          rows={5}
                          className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl smooth-focus transition-all duration-300 group-hover:border-yellow-400/50 text-yellow-100 placeholder-gray-400 resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Stock Card */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.01] animate-slide-in-left animate-delay-200">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-600 rounded-2xl flex items-center justify-center animate-float">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Prix & Inventaire</h3>
                        <p className="text-gray-400 text-sm">Gestion financière et stock</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center space-x-2">
                          <span>Prix de vente (€)</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <input
                            type="number"
                            name="price"
                            placeholder="49.99"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full pl-14 pr-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl smooth-focus transition-all duration-300 group-hover:border-yellow-400/50 text-yellow-100 font-semibold"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center space-x-2">
                          <span>Quantité en stock</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                            <Hash className="w-4 h-4 text-white" />
                          </div>
                          <input
                            type="number"
                            name="stock"
                            placeholder="100"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full pl-14 pr-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl smooth-focus transition-all duration-300 group-hover:border-yellow-400/50 text-yellow-100 font-semibold"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Card */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.01] animate-slide-in-left animate-delay-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 via-yellow-600 to-yellow-500 rounded-2xl flex items-center justify-center animate-sparkle">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Catégorie</h3>
                        <p className="text-gray-400 text-sm">Classification du produit</p>
                      </div>
                    </div>
                    
                    <div className="group">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl smooth-focus transition-all duration-300 group-hover:border-yellow-400/50 text-yellow-100 font-medium"
                        required
                      >
                        <option value="" className="text-gray-400">Sélectionner une catégorie</option>
                        <option value="cosmetiques">💄 Cosmétiques</option>
                        <option value="soin-visage">🧴 Soin du visage</option>
                        <option value="soin-corps">🧴 Soin du corps</option>
                        <option value="maquillage">💋 Maquillage</option>
                        <option value="parfum">🌸 Parfum</option>
                        <option value="accessoires">✨ Accessoires</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Upload & Preview */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.01] animate-slide-in-right animate-delay-500 h-fit">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 rounded-2xl flex items-center justify-center animate-glow">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Visuel Produit</h3>
                        <p className="text-gray-400 text-sm">Image haute qualité recommandée</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="border-3 border-dashed border-yellow-500/30 rounded-3xl p-8 text-center hover:border-solid hover:border-yellow-400/50 transition-all duration-500 bg-gray-800/30 backdrop-blur-sm group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer block">
                          {imagePreview ? (
                            <div className="space-y-4 animate-scale-up">
                              <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                                <img
                                  src={imagePreview}
                                  alt="Aperçu"
                                  className="w-full h-64 object-cover group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-white text-sm font-medium">Cliquez pour modifier l'image</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                              <div className="space-y-6 py-12">
                              <div className="relative">
                                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300" />
                                <div className="absolute inset-0 w-16 h-16 mx-auto animate-pulse-ring bg-yellow-500/20 rounded-full" />
                              </div>
                              <div>
                                <p className="text-lg font-bold text-yellow-100 mb-2">Glissez-déposez ou cliquez</p>
                                <p className="text-sm text-gray-300 mb-2">Formats acceptés: PNG, JPG, WEBP</p>
                                <p className="text-xs text-gray-400">Taille maximale: 10MB | Ratio recommandé: 1:1</p>
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="space-y-4 animate-fade-in">
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, image: null });
                            }}
                            className="w-full flex items-center justify-center space-x-3 p-4 text-red-400 hover:text-red-300 bg-gray-800/30 backdrop-blur-sm hover:bg-red-500/10 rounded-2xl transition-all duration-300 group border border-red-500/30 hover:border-red-400/50"
                          >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-all duration-300" />
                            <span className="font-medium">Supprimer l'image</span>
                          </button>
                          
                          {/* Image Info */}
                          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/20">
                            <h4 className="font-bold text-yellow-100 mb-3">Informations image</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Format:</span>
                                <span className="font-medium text-yellow-100">{formData.image?.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Taille:</span>
                                <span className="font-medium text-yellow-100">
                                  {formData.image ? (formData.image.size / 1024 / 1024).toFixed(2) + ' MB' : '--'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tips Card */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.01] animate-slide-in-right animate-delay-700">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto">
                        <span className="text-2xl">💡</span>
                      </div>
                      <h4 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Conseils Pro</h4>
                      <ul className="text-sm text-gray-300 space-y-2 text-left">
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span>Utilisez des images haute résolution (min. 800x800px)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span>Privilégiez un fond blanc ou neutre</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span>Montrez le produit sous plusieurs angles</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span>Optez pour un éclairage naturel et uniforme</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions - Premium Buttons */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-8 border-t border-yellow-500/20 animate-slide-up animate-delay-1000">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 text-gray-300 rounded-2xl hover:bg-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 font-semibold group ripple"
                  >
                    <span className="flex items-center space-x-3">
                      <X className="w-5 h-5 group-hover:rotate-90 transition-all duration-300" />
                      <span>Annuler</span>
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 text-gray-300 rounded-2xl hover:bg-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 font-semibold group ripple"
                  >
                    <span className="flex items-center space-x-3">
                      <FileText className="w-5 h-5" />
                      <span>Brouillon</span>
                    </span>
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-black disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105 rounded-2xl ripple"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Création en cours...</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce animate-delay-100" />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce animate-delay-200" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Check className="w-6 h-6" />
                      <span>Créer le Produit</span>
                      <span className="text-lg">🚀</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
