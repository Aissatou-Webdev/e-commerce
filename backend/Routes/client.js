// routes/client.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");


// 🔐 Connexion client
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Client introuvable" });
    }

    const client = rows[0];
    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: client.id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ token, user: { id: client.id, email: client.email, role: "client" } });
  } catch (error) {
    console.error("Erreur lors de la connexion client :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
