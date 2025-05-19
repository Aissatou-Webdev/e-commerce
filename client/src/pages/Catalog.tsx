import ProductCard from "../Componente/ProductCard";

import img1 from "../assets/image/Vaseline Cocoa Radiant (1).jpg"
import img2 from "../assets/image/Rouge à lèvre1.jpg"
import img3 from "../assets/image/Font de teint.jpg"
import img4 from "../assets/image/gel de douce2.jpg"
import img5 from "../assets/image/Huille pour cheveux1.jpg"
import img6 from "../assets/image/Glooss.jpg"
import img7 from "../assets/image/Parfum1.jpg"
import img8 from "../assets/image/Baya1.jpg"
import img9 from "../assets/image/téléchargement (8).jpg"

const products = [
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
  return (
    <div className="p-8 w-screen">
      <h1 className="text-3xl font-bold text-black">Nos Produits</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
