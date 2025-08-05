// backend/routes/authClient.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const db = require("../config/db");
require("dotenv").config();

// 📝 Inscription client
router.post("/register", async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO clients (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, address]
    );

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error("Erreur lors de l'inscription client :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Middleware de vérification du token client
const verifyClientToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token manquant" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.clientId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

// 👤 Route pour récupérer les infos du client connecté + ses commandes
router.get("/profile", verifyClientToken, async (req, res) => {
  try {
    const [clientRows] = await db.query("SELECT id, name, email, phone, address FROM clients WHERE id = ?", [req.clientId]);
    if (clientRows.length === 0)
      return res.status(404).json({ error: "Client non trouvé" });

    const [orders] = await db.query("SELECT * FROM orders WHERE user_id = ?", [req.clientId]);

    res.json({
      client: clientRows[0],
      orders,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil client :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
