import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Chargement des produits...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Liste des Produits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold text-green-600">{product.price}€</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}