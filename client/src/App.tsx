import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // On garde juste BrowserRouter
import CartProvider from './context/CartContext';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Header from './Componente/Header/Header';
import Contact from './pages/Contact';
import ProductList from './pages/ProductList';



function App() {
  return (

      <CartProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path='/productList' element={<ProductList />} />
          </Routes>
        </main>
      </CartProvider>
  
  );
}

export default App;
