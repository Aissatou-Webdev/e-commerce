import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ firstname: '', name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, name, email, message } = formData;

    if (!firstname || !name || !email || !message) {
      setStatus('Tous les champs sont obligatoires');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, name, email, message }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('Message enregistré avec succès !');
        setFormData({ firstname: '', name: '', email: '', message: '' });
      } else {
        setStatus('Erreur lors de l\'enregistrement. Veuillez réessayer.');
      }
    } catch (error) {
      setStatus('Erreur de connexion. Vérifiez votre serveur.');
    }
  };

  return (
    <div className="p-8 w-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Contactez-nous</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-lg">Prénom</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full p-3 border rounded"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Envoyer
        </button>
      </form>
      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
};

export default Contact;
