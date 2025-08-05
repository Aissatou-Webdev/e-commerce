import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterClient = () => {
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

    try {
      await axios.post("http://localhost:5000/api/client/register", form);
      alert("Inscription réussie !");
      navigate("/login"); // Change selon ta route de connexion client
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        />
        <textarea
          name="address"
          placeholder="Adresse"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default RegisterClient;
