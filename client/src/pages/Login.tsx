import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState<"client" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        role === "admin"
          ? "http://localhost:5001/api/admin/login"
          : "http://localhost:5001/api/auth/client/login";

      console.log("📤 Données envoyées :", { email, password, role });
      console.log("🌐 URL utilisée :", url);

      const res = await axios.post(url, { email, password });

      console.log("✅ Réponse backend complète :", res.data);

      if (!res.data?.token) {
        throw new Error("Réponse invalide du serveur - pas de token.");
      }

      if (role === "admin") {
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Connexion admin réussie ✅");
        console.log("🚀 Redirection vers /admin/dashboard");
        navigate("/admin/dashboard");
      } else {
        // 👤 Utiliser le contexte d'authentification
        if (res.data.user) {
          console.log("👤 Utilisation du contexte d'authentification avec:", res.data.user);
          login(res.data.user, res.data.token);
        } else {
          // Fallback pour compatibilité avec ancienne API
          console.log("⚠️ Pas d'infos utilisateur, utilisation du fallback localStorage");
          localStorage.setItem("clientToken", res.data.token);
        }
        
        if (res.data.user?.id) {
          localStorage.setItem("clientId", res.data.user.id);
        }
        
        toast.success("Connexion client réussie ✅");
        
        // 🚀 Redirection vers le catalogue pour accéder aux fonctionnalités
        console.log("🚀 Redirection vers /catalog");
        navigate("/catalog");
      }
    } catch (err: any) {
      console.error("❌ Erreur login complète :", err);
      console.error("❌ Réponse d'erreur :", err.response);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erreur lors de la connexion.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md border border-yellow-500/20">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Sélecteur du rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Connexion en tant que</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "client" | "admin")}
              className="w-full p-2 bg-gray-700/50 border border-yellow-500/30 rounded-lg focus:ring focus:ring-yellow-400/50 text-yellow-100 placeholder-gray-400"
            >
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-700/50 border border-yellow-500/30 rounded-lg focus:ring focus:ring-yellow-400/50 text-yellow-100 placeholder-gray-400"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700/50 border border-yellow-500/30 rounded-lg focus:ring focus:ring-yellow-400/50 text-yellow-100 placeholder-gray-400"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg transition-colors font-semibold ${
              loading
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-gradient-to-r from-yellow-600 to-amber-600 text-black hover:from-yellow-500 hover:to-amber-500"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* ✅ Affichage du lien d'inscription uniquement si client */}
        {role === "client" && (
          <p className="text-center mt-4 text-sm text-gray-300">
            Pas encore inscrit ?{" "}
            <Link to="/register" className="text-yellow-400 hover:text-yellow-300 hover:underline">
              Créer un compte
            </Link>
          </p>
        )}

        <p className="text-center mt-2 text-xs text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors duration-200">
          Mot de passe oublié ?
        </p>
      </div>
    </div>
  );
};

export default Login;
