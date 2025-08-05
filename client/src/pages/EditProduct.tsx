import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Interface pour typer le produit
interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
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
    image: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        const response = await axios.get<Product[]>(`http://localhost:5000/api/admin/products`);
        const found = response.data.find((p: Product) => p.id.toString() === id);

        if (found) {
          setProduct({
            name: found.name,
            description: found.description,
            price: found.price.toString(),
            stock: found.stock.toString(),
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

      await axios.put(`http://localhost:5000/api/admin/products/${id}`, {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      });

      alert("Produit modifié avec succès !");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError("Erreur lors de la mise à jour du produit");
    }
  };

  // ✅ Affichage conditionnel
  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
        <div className="text-center">Chargement du produit...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erreur:</strong> {error}
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Modifier le produit</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erreur:</strong> {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full border p-2 rounded"
        />
        <input
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Prix"
          type="number"
          className="w-full border p-2 rounded"
        />
        <input
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          className="w-full border p-2 rounded"
        />
        <input
          name="image"
          value={product.image}
          onChange={handleChange}
          placeholder="URL de l'image"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
