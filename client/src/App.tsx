import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import EditProduct from "./pages/EditProduct";
import Product from "./pages/Product";
import AddProduct from "./pages/AddProduct";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProduct";
import AdminLogin from "./pages/admin/LoginAdmin"; // ✅ Import du login admin
import Navbar from "./Componente/Navbar";
import Footer from "./Componente/Footer";
import AdminRoute from "./Componente/admin/AdminRoute";

// ✅ On regroupe connexion admin + client dans une seule page
import Login from "./pages/Login";
import ClientProfile from "./pages/ClientProfile";
import RegisterClient from "./pages/RegisterClient";

// ✅ Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  
  // ✅ Vérifier si l'utilisateur est admin ou sur une page admin
  const isAdminToken = !!localStorage.getItem("adminToken");
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  // ✅ Masquer la navbar si : 
  // - L'utilisateur a un token admin OU
  // - L'utilisateur est sur une route admin (y compris /login-admin)
  const shouldHideNavbar = isAdminToken || isAdminRoute;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* ✅ Afficher la navbar seulement si pas admin */}
      {!shouldHideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product />} />

          {/* ✅ Page unique de connexion (Client) */}
          <Route path="/login" element={<Login />} />

          {/* ✅ Page de connexion spécifique Admin */}
          <Route path="/login-admin" element={<AdminLogin />} />

          <Route path="/register" element={<RegisterClient />} />
          <Route path="/profil" element={<ClientProfile />} />

          {/* ✅ Routes protégées pour Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
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
                <AdminProducts />
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

      {/* ✅ Afficher le footer seulement si pas admin */}
      {!shouldHideNavbar && <Footer />}

      {/* ✅ Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
