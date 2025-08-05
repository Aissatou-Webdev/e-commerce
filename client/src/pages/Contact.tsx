import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { firstname, name, email, message } = formData;

    if (!firstname || !name || !email || !message) {
      setStatus("Tous les champs sont obligatoires ❗");
      setSuccess(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setStatus("💌 Message envoyé avec succès !");
        setFormData({ firstname: "", name: "", email: "", message: "" });
        setSuccess(true);
      } else {
        setStatus("Une erreur est survenue. Veuillez réessayer.");
        setSuccess(false);
      }
    } catch (error) {
      setStatus("Erreur de connexion avec le serveur.");
      setSuccess(false);
    }
  };

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Contactez-nous
        </h1>

        {status && (
          <div
            className={`text-center mb-4 p-3 rounded ${
              success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-black">Prénom</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="exemple@mail.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Votre message ici..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-yellow-400 font-semibold py-3 rounded hover:bg-gray-900 transition"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
