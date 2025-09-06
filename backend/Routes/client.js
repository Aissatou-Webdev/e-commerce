const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/verifyToken");

// ----------------------
// Route d'inscription
// ----------------------
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Données reçues pour register:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires" });
  }

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, 'client', NOW())",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Inscription réussie ✅" });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ----------------------
// Route de connexion
// ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Données reçues pour login:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const client = rows[0];
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    // 🔑 Génération d’un token valable 7 jours
    const token = jwt.sign(
      { id: client.id, role: client.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token, role: client.role });
  } catch (err) {
    console.error("Erreur lors du login:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ----------------------
// Route profil client
// ----------------------
router.get("/profile", verifyToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "client") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const [rows] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur profil client :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ----------------------
// Route commandes client
// ----------------------
router.get("/orders", verifyToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "client") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const [orders] = await db.query(
      "SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(orders);
  } catch (err) {
    console.error("Erreur récupération commandes :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
