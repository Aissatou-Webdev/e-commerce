import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../Componente/admin/AdminSidebar";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: string;
}

export default function AddProduct() {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      setError("Tous les champs sont obligatoires");
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

      await axios.post("http://localhost:5000/api/admin/products", {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Produit ajouté avec succès !");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      setError("Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-6">Ajouter un Produit</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Erreur:</strong> {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-2xl"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nom du produit"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Description du produit"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Prix (€) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                min="0"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              URL de l'image
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://exemple.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Ajout en cours..." : "Ajouter le produit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
