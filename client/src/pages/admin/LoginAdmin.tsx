// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
