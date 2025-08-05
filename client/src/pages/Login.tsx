import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Enregistrer le token
      localStorage.setItem("token", token);

      // ✅ Rediriger selon le rôle
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "client") {
        navigate("/profil"); // ou /home
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

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
};

export default Login;
