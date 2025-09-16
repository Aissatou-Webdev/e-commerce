const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login client
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const client = rows[0];
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: client.id, role: "client" },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "24h" }
    );

    // Renvoyer le token ET les informations utilisateur
    res.json({ 
      token,
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: client.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Inscription client
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajouter l'utilisateur
    await db.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, "client"]
    );

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
