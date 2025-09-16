import ProductCard from "../Componente/ProductCard";
import { useAuth } from "../context/AuthContext";

// Import des images originales
import img1 from "../assets/image/the_nivea.jpg";
import img2 from "../assets/image/rouge_levres.jpg";
import img3 from "../assets/image/fontde_teint.jpg";
import img4 from "../assets/image/gel_douce.jpg";
import img5 from "../assets/image/huille_cheveux.jpg";
import img6 from "../assets/image/glooss.jpg";
import img7 from "../assets/image/parfum1.jpg";
import img8 from "../assets/image/baya1.jpg";
import img9 from "../assets/image/baume.jpg";

// Interface pour typer les produits
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

// Produits originaux du catalogue
const staticProducts: Product[] = [
  { id: 1, name: 'Crème hydratante', price: 20, image: img1 },
  { id: 2, name: 'Rouge à lèvres', price: 15, image: img2 },
  { id: 3, name: 'Fond de teint', price: 25, image: img3 },
  { id: 4, name: 'Gel de douce', price: 25, image: img4 },
  { id: 5, name: 'Huille pour cheveux', price: 25, image: img5 },
  { id: 6, name: 'Gloss', price: 25, image: img6 },
  { id: 7, name: 'Parfum', price: 25, image: img7 },
  { id: 8, name: 'Baya', price: 25, image: img8 },
  { id: 9, name: 'Baume à lèvres', price: 25, image: img9 },
];

const Catalog = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="p-8 w-screen">
        {/* Message de bienvenue personnalisé */}
        {isAuthenticated && user && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-yellow-100">
              🎉 Bienvenue {user.name} !
            </h2>
            <p className="text-gray-300 mt-1">
              Découvrez notre sélection de produits de beauté et ajoutez vos favoris au panier.
            </p>
          </div>
        )}
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">Nos Produits</h1>
        
        {/* Grille des produits statiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staticProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
