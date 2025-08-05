const express = require("express");
const cors = require("cors");
const path = require("path");
const adminRoutes = require("./Routes/Admin");
const authAdminRoutes = require("./Routes/authAdmin");
const clientRoutes = require("./Routes/client"); // ✅ Ajout des routes client
const authClientRoutes = require("./Routes/authClient");

const app = express();
const PORT =  5000;


// ✅ Middleware
app.use(cors());
app.use(express.json());

app.use("/api/client", authClientRoutes);

// 📂 Permet d'accéder aux images depuis /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔐 Routes d'authentification admin
app.use("/api/admin", authAdminRoutes);

// 📦 Routes de gestion admin (produits, commandes, etc.)
app.use("/api/admin", adminRoutes);

// 👤 Routes client
app.use("/api/client", clientRoutes); // ✅ Ajout

// 🗑️ Supprimer un utilisateur
app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.status(200).json({ message: "Utilisateur supprimé" });
  });
});

// 📩 Enregistrement d’un message depuis le formulaire contact
app.post("/api/contact", (req, res) => {
  const { firstname, name, email, message } = req.body;

  if (!firstname || !name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont obligatoires",
    });
  }

  const sql =
    "INSERT INTO messages (firstname, name, email, message) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstname, name, email, message], (err, result) => {
    if (err) {
      console.error("❌ Erreur lors de l'insertion du message:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erreur serveur" });
    }
    res.status(200).json({
      success: true,
      message: "Message enregistré avec succès !",
    });
  });
});



// 🚀 Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur : http://localhost:${PORT}`);
});
