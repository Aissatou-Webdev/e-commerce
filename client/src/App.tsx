import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import EditProduct from "./pages/EditProduct";
import Product from "./pages/Product";
import AddProduct from "./pages/AddProduct"; // ✅ Formulaire d'ajout

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductsList from "./pages/admin/AdminProduct"; // ✅ Liste des produits
import Navbar from "./Componente/Navbar";
import Footer from "./Componente/Footer";
import LoginAdmin from "./pages/admin/LoginAdmin";
import AdminRoute from "./Componente/admin/AdminRoute";
import Login from "./pages/Login";
import ClientProfile from "./pages/ClientProfile";
import LoginClient from "./pages/client/LoginClient";
import RegisterClient from "./pages/RegisterClient";


function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profil" element={<ClientProfile />} />
          


          {/* Connexion admin */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Routes protégées */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="/login" element={<LoginClient />} />
          <Route path="/register" element={<RegisterClient />} />

          <Route
            path="/admin/add"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductsList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
