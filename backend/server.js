const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const bcrypt = require("bcrypt"); // 🔹 pour hacher le mot de passe

// 📂 Import des routes
const adminRoutes = require("./Routes/Admin");
const authAdminRoutes = require("./Routes/authAdmin");
const clientRoutes = require("./Routes/client");
const authClientRoutes = require("./Routes/authClient");
const cartRoutes = require("./Routes/cart");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors({ origin: "*" })); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Rendre le dossier uploads accessible pour les images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================== 🔐 AUTHENTIFICATION ========================
app.use("/api/auth/client", authClientRoutes); // Inscription & login client
app.use("/api/auth/admin", authAdminRoutes);   // Login admin

// ======================== 👤 CLIENT ========================
app.use("/api/client", clientRoutes);

// ======================== 📦 ADMIN ========================
app.use("/api/admin", adminRoutes);

// ======================== 🔹 CREATION ADMIN ========================
app.post("/api/admin/create", async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérifie si l'admin existe déjà
    const [existing] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Admin déjà existant" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la table admins avec rôle 'admin'
    await db.query(
      "INSERT INTO admins (nom, email, password, role) VALUES (?, ?, ?, ?)",
      [nom, email, hashedPassword, "admin"]
    );

    res.status(201).json({ message: "Admin créé avec succès ✅" });
  } catch (err) {
    console.error("Erreur création admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ======================== 🛒 PANIER ========================
app.use("/api/cart", cartRoutes);

// ======================== 📩 CONTACT ========================
app.post("/api/contact", (req, res, next) => {
  const { firstname, name, email, message } = req.body;

  if (!firstname || !name || !email || !message) {
    return res.status(400).json({ success: false, message: "Tous les champs sont obligatoires" });
  }

  const sql = "INSERT INTO messages (firstname, name, email, message) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstname, name, email, message], (err, result) => {
    if (err) {
      console.error("❌ Erreur contact :", err);
      return next(err); 
    }
    res.status(201).json({ success: true, message: "Message enregistré avec succès !" });
  });
});

// ======================== ❌ SUPPRESSION UTILISATEUR (ADMIN) ========================
app.delete("/api/admin/users/:id", (req, res, next) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  });
});

// ======================== ⚠️ 404 - ROUTE INCONNUE ========================
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// ======================== ⚠️ GESTION GLOBALE DES ERREURS ========================
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// 🚀 Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur : http://localhost:${PORT}`);
});
