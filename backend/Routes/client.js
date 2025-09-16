const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");

// ----------------------
// Route d'inscription
// ----------------------
router.post("/register", async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  console.log("Données reçues pour register:", req.body);

  // Vérification détaillée des champs requis
  if (!name) {
    return res.status(400).json({ message: "Le nom est obligatoire" });
  }
  if (!email) {
    return res.status(400).json({ message: "L'email est obligatoire" });
  }
  if (!password) {
    return res.status(400).json({ message: "Le mot de passe est obligatoire" });
  }
  if (!phone) {
    return res.status(400).json({ message: "Le téléphone est obligatoire" });
  }
  if (!address) {
    return res.status(400).json({ message: "L'adresse est obligatoire" });
  }

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, phone, address, role, created_at) VALUES (?, ?, ?, ?, ?, 'client', NOW())",
      [name, email, hashedPassword, phone, address]
    );

    // 🎯 Générer automatiquement un token JWT après l'inscription
    const [newUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = newUser[0];
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "Inscription réussie ✅", 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
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
    console.log("🔍 GET /profile - req.user:", req.user);
    
    if (!req.user || req.user.role !== "client") {
      console.log("❌ Accès refusé - Utilisateur:", req.user);
      return res.status(403).json({ message: "Accès refusé" });
    }

    console.log("🔍 Recherche utilisateur avec ID:", req.user.id);
    const [rows] = await db.query(
      "SELECT id, name, email, phone, address FROM users WHERE id = ?",
      [req.user.id]
    );
    
    console.log("🔍 Résultat de la requête:", rows);

    if (rows.length === 0) {
      console.log("❌ Utilisateur non trouvé pour ID:", req.user.id);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log("✅ Profil trouvé:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur profil client :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ----------------------
// Route mise à jour profil client
// ----------------------
router.put("/profile", verifyToken, async (req, res) => {
  try {
    console.log("🔄 PUT /profile - req.user:", req.user);
    console.log("🔄 PUT /profile - req.body:", req.body);
    
    if (!req.user || req.user.role !== "client") {
      console.log("❌ Accès refusé pour mise à jour - Utilisateur:", req.user);
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { name, phone, address } = req.body;
    
    // Validation des données
    if (!name) {
      console.log("❌ Nom manquant");
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    console.log("🔄 Mise à jour pour utilisateur ID:", req.user.id);
    // Mise à jour du profil
    const updateResult = await db.query(
      "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
      [name, phone, address, req.user.id]
    );
    
    console.log("🔄 Résultat de la mise à jour:", updateResult);

    // Retourner le profil mis à jour
    const [rows] = await db.query(
      "SELECT id, name, email, phone, address FROM users WHERE id = ?",
      [req.user.id]
    );
    
    console.log("🔄 Profil mis à jour:", rows[0]);

    res.json({ message: "Profil mis à jour avec succès", user: rows[0] });
  } catch (err) {
    console.error("Erreur mise à jour profil :", err);
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
