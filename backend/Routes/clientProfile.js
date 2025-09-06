const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware d'authentification pour client
const authClient = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token manquant" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.clientId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

// 📌 Récupérer profil client
router.get("/profile", authClient, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM clients WHERE id = ?",
      [req.clientId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur profil client :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📌 Récupérer commandes du client
router.get("/client/orders", authClient, async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT id, total_amount, status, created_at FROM orders WHERE client_id = ? ORDER BY created_at DESC",
      [req.clientId]
    );
    res.json(orders);
  } catch (error) {
    console.error("Erreur commandes client :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
