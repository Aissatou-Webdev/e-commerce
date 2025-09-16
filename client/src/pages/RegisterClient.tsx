import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterClient = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérification côté frontend que tous les champs sont remplis
    if (!form.name || !form.email || !form.password || !form.phone || !form.address) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      console.log("📤 Envoi des données d'inscription:", form);
      
      // Utiliser la route complète qui supporte tous les champs
      const response = await axios.post("http://localhost:5001/api/client/register", form);
      
      console.log("✅ Réponse d'inscription reçue:", response.data);
      
      // 🎯 Utiliser le contexte d'authentification pour se connecter automatiquement
      if (response.data.token && response.data.user) {
        login(response.data.user, response.data.token);
      }
      
      alert("Inscription réussie ! Redirection vers le catalogue...");
      
      // 🚀 Redirection automatique vers les fonctionnalités client
      navigate("/catalog");
    } catch (err: any) {
      console.error("❌ Erreur lors de l'inscription:", err);
      const errorMessage = err.response?.data?.message || "Erreur lors de l'inscription";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-96 border border-yellow-500/20">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
          Créer un compte
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-gray-700/50 border border-yellow-500/30 p-2 mb-4 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring focus:ring-yellow-400/50"
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-gray-700/50 border border-yellow-500/30 p-2 mb-4 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring focus:ring-yellow-400/50"
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full bg-gray-700/50 border border-yellow-500/30 p-2 mb-4 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring focus:ring-yellow-400/50"
          required
        />
        
        <input
          type="text"
          name="phone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
          className="w-full bg-gray-700/50 border border-yellow-500/30 p-2 mb-4 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring focus:ring-yellow-400/50"
          required
        />
        
        <textarea
          name="address"
          placeholder="Adresse"
          value={form.address}
          onChange={handleChange}
          className="w-full bg-gray-700/50 border border-yellow-500/30 p-2 mb-4 rounded-xl text-yellow-100 placeholder-gray-400 focus:ring focus:ring-yellow-400/50"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-black p-2 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 hover:scale-105 font-semibold"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default RegisterClient;
