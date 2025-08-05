import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminSidebar from "../../Componente/admin/AdminSidebar";

// ✅ Interface pour typer les produits
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
}

const AdminProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Récupération des produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const res = await axios.get("http://localhost:5000/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err);
      setError("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Suppression
  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Token d'authentification manquant");
        return;
      }

      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Supprime le produit du state local pour une mise à jour immédiate
      setProducts(prev => prev.filter(product => product.id !== id));

    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      setError("Erreur lors de la suppression du produit");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Affichage conditionnel avec loading et erreurs
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Erreur:</strong> {error}
        <button
          onClick={fetchProducts}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Produits ({products.length})</h2>
        <Link
          to="/admin/products/add"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Ajouter un produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Aucun produit trouvé</p>
          <Link
            to="/admin/products/add"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Ajouter le premier produit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow rounded p-4 border flex flex-col"
          >
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <p className="text-black font-bold mb-4">{product.price} €</p>
            <div className="flex justify-between mt-auto">
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-500 hover:underline"
              >
                Supprimer
              </button>
              <Link
                to={`/admin/products/edit/${product.id}`}
                className="text-blue-500 hover:underline"
              >
                Modifier
              </Link>
            </div>
          </div>
        ))}
        </div>
      )}
      </main>
    </div>
  );
};

export default AdminProductsList;
