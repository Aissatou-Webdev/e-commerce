import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.warn("🔒 Aucun token trouvé dans localStorage !");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/admin/products", {
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
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // Refresh après suppression
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  }

  return (
    <div className="p-4 ml-64">
      <h2 className="text-2xl font-bold mb-4">🛍️ Liste des produits</h2>

      {/* 🔗 Bouton Ajouter un produit */}
      <Link
        to="/admin/add"
        className="inline-block mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Ajouter un produit
      </Link>

      {loading ? (
        <p className="text-gray-500">Chargement des produits...</p>
      ) : products.length === 0 ? (
        <p className="text-red-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow p-4 rounded flex flex-col"
            >
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-black font-bold mt-2">{product.price} €</p>

              <div className="flex justify-between mt-4">
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(product.id)}
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
    </div>
  );
};

export default AdminProducts;
