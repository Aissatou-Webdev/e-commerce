const express = require("express");
const router = express.Router();
const db = require("../config/db");
const path = require("path");
const multer = require("multer");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

// 🔧 Configuration de multer pour gérer les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ✅ Route test : Vérifier l’authentification admin */
router.get("/check-auth", verifyAdminToken, (req, res) => {
  res.json({ message: "Authentifié ✅", adminId: req.adminId });
});

// 📦 Obtenir tous les produits
router.get("/products", verifyAdminToken, async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    res.json(results);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ➕ Ajouter un produit (avec image)
router.post(
  "/products",
  verifyAdminToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;
      const image = req.file ? req.file.filename : null;

      await db.query(
        "INSERT INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)",
        [name, description, price, stock, category, image]
      );

      res.status(201).json({ message: "Produit ajouté avec succès" });
    } catch (err) {
      console.error("Erreur lors de l’ajout du produit :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

// ✏️ Modifier un produit
router.put("/products/:id", verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image } = req.body;

  try {
    await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?",
      [name, description, price, stock, image, id]
    );
    res.status(200).json({ message: "Produit modifié" });
  } catch (err) {
    console.error("Erreur lors de la modification :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ❌ Supprimer un produit
router.delete("/products/:id", verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.status(200).json({ message: "Produit supprimé" });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
