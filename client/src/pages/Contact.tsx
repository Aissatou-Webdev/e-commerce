import { useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle, AlertCircle, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    // Afficher la notification toast
    if (type === 'success') {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    // Afficher aussi une notification locale
    setNotification({ show: true, type, message });
    
    // Masquer la notification locale après 5 secondes
    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' });
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { firstname, name, email, message } = formData;

    if (!firstname || !name || !email || !message) {
      showNotification('error', "❗ Tous les champs sont obligatoires");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📤 Envoi du message de contact...", formData);
      
      const response = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("📥 Réponse reçue:", response.status, response.statusText);
      
      const data = await response.json();
      console.log("📋 Données reçues:", data);
      
      if (response.ok && data.success) {
        showNotification('success', "💌 Message envoyé avec succès ! Nous vous répondrons bientôt.");
        setFormData({ firstname: "", name: "", email: "", message: "" });
      } else {
        showNotification('error', "❌ " + (data.message || "Une erreur est survenue. Veuillez réessayer."));
      }
    } catch (error) {
      console.error("🔥 Erreur lors de l'envoi du message:", error);
      showNotification('error', "🔌 Erreur de connexion avec le serveur. Vérifiez votre connexion internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black">
    <div className="w-full bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-yellow-500/20">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">
          Contactez-nous
        </h1>
        
        <p className="text-center text-gray-300 mb-8">
          Une question ? Un conseil ? N'hésitez pas à nous écrire, nous vous répondrons rapidement.
        </p>

        {/* Notification locale */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 animate-pulse ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-300">Prénom</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full border border-yellow-500/30 bg-gray-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-yellow-100 placeholder-gray-400"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-yellow-500/30 bg-gray-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-yellow-100 placeholder-gray-400"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-yellow-500/30 bg-gray-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-yellow-100 placeholder-gray-400"
              placeholder="exemple@mail.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full border border-yellow-500/30 bg-gray-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-yellow-100 placeholder-gray-400"
              placeholder="Votre message ici..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
              isLoading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-600 to-amber-600 text-black hover:from-yellow-500 hover:to-amber-500"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Envoi en cours...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
        </div>
  );
};

export default Contact;
