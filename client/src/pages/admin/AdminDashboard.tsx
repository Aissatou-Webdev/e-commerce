import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../Componente/admin/AdminSidebar";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get("http://localhost:5000/api/admin/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <Link
            to="/admin/add"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Ajouter un produit
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="bg-white rounded shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Produits ({products.length})</h2>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
                <Link
                  to="/admin/add"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Ajouter le premier produit
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.price}€</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:underline"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;