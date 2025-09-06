import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
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
          ? "http://localhost:5000/api/admin/login"
          : "http://localhost:5000/api/client/login";

      console.log("📤 Données envoyées :", { email, password, role });

      const res = await axios.post(url, { email, password });

      console.log("✅ Réponse backend :", res.data);

      if (!res.data?.token) {
        throw new Error("Réponse invalide du serveur.");
      }

      if (role === "admin") {
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Connexion admin réussie ✅");
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("clientToken", res.data.token);
        if (res.data.user?.id) {
          localStorage.setItem("clientId", res.data.user.id);
        }
        toast.success("Connexion client réussie ✅");
        navigate("/home");
      }
    } catch (err: any) {
      console.error("❌ Erreur login :", err);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Sélecteur du rôle */}
          <div>
            <label className="block text-sm font-medium">Connexion en tant que</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "client" | "admin")}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
            >
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* ✅ Affichage du lien d'inscription uniquement si client */}
        {role === "client" && (
          <p className="text-center mt-4 text-sm">
            Pas encore inscrit ?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Créer un compte
            </Link>
          </p>
        )}

        <p className="text-center mt-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
          Mot de passe oublié ?
        </p>
      </div>
    </div>
  );
};

export default Login;
