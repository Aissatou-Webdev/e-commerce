// routes/authAdmin.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

// Route de connexion admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Admin introuvable" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Erreur lors de la connexion admin :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
