import ProductCard from "../Componente/ProductCard";

import img1 from "../assets/image/the_nivea.jpg"
import img2 from "../assets/image/rouge_levres.jpg"
import img3 from "../assets/image/fontde_teint.jpg"
import img4 from "../assets/image/gel_douce.jpg"
import img5 from "../assets/image/huille_cheveux.jpg"
import img6 from "../assets/image/glooss.jpg"
import img7 from "../assets/image/parfum1.jpg"
import img8 from "../assets/image/Baya1.jpg"
import img9 from "../assets/image/baume.jpg"
import Navbar from "../Componente/Navbar";

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

  console.log(localStorage.getItem("clientToken"));
  return (
    <div className="min-h-screen flex flex-col justify-between  ">
         <Navbar/>
    
    <div className="p-8 w-screen">
      <h1 className="text-3xl font-bold text-black">Nos Produits</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
        </div>
  );
};

export default Catalog;
