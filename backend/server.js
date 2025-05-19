const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Permet d'analyser les requêtes en JSON

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost', // Adresse du serveur MySQL
  user: 'root', // Ton nom d'utilisateur MySQL
  password: '', // Ton mot de passe MySQL
  database: 'ecommerce' // Le nom de ta base de données
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à MySQL ✅');
  }
});

// Route pour enregistrer un message dans la base de données
app.post('/api/contact', (req, res) => {
  const {firstname, name, email, message } = req.body;

  if (!firstname || !name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
  }

  const sql = 'INSERT INTO messages (firstname, name, email, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [firstname, name, email, message], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du message:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
    res.status(200).json({ success: true, message: 'Message enregistré avec succès !' });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT} 🚀`);
});
