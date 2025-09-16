const express = require("express");
const router = express.Router();
const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  { verifyAdminToken } = require("../middlewares/verifyAdminToken");
const requireAdmin = require("../middlewares/requireAdmin"); // ✅ ajout du middleware admin
const verifyToken = require("../middlewares/verifyToken");

// 🔧 Vérifie que le dossier uploads existe
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// 🔧 Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ===================== REGISTER ADMIN =====================
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [exist] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (exist.length > 0) return res.status(400).json({ message: "Admin déjà existant" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO admins (email, password) VALUES (?, ?)", [email, hashedPassword]);

    res.status(201).json({ message: "Admin créé avec succès" });
  } catch (err) {
    console.error("Erreur création admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ===================== LOGIN ADMIN =====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Admin non trouvé" });

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error("Erreur login admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ===================== TEST AUTH ADMIN =====================
router.get("/check-auth", verifyAdminToken, requireAdmin, (req, res) => {
  res.json({ message: "Authentifié ✅", adminId: req.user.id });
});

// ===================== GESTION PRODUITS (PUBLIC) =====================
// Endpoint public pour récupérer les produits (pour le catalogue)
router.get("/products/public", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, name, description, price, stock, category, image FROM products WHERE stock > 0");
    console.log("📦 Produits publics récupérés:", results.length);
    res.json(results);
  } catch (err) {
    console.error("Erreur récupération produits publics :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ===================== GESTION PRODUITS =====================
router.get("/products", verifyAdminToken, requireAdmin, async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    res.json(results);
  } catch (err) {
    console.error("Erreur récupération produits :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/products", verifyAdminToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const image = req.file ? req.file.filename : null;

    await db.query(
      "INSERT INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category, image]
    );
    res.status(201).json({ message: "Produit ajouté avec succès" });
  } catch (err) {
    console.error("Erreur ajout produit :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/products/:id", verifyAdminToken, requireAdmin, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ? WHERE id = ?",
      [name, description, price, stock, category, image, id]
    );
    res.status(200).json({ message: "Produit modifié" });
  } catch (err) {
    console.error("Erreur modification produit :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/products/:id", verifyAdminToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.status(200).json({ message: "Produit supprimé" });
  } catch (err) {
    console.error("Erreur suppression produit :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ===================== GESTION CLIENTS =====================
router.get("/clients", verifyAdminToken, requireAdmin, async (req, res) => {
  try {
    const [clients] = await db.query("SELECT id, name, email FROM users WHERE role='client'");
    res.json(clients);
  } catch (err) {
    console.error("Erreur récupération clients :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ===================== GESTION COMMANDES =====================
router.get("/orders", verifyAdminToken, requireAdmin, async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(orders);
  } catch (err) {
    console.error("Erreur récupération commandes :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ===================== GESTION MESSAGES =====================
router.get("/messages", verifyAdminToken, requireAdmin, async (req, res) => {
  try {
    const [messages] = await db.query("SELECT * FROM messages ORDER BY created_at DESC");
    res.json(messages);
  } catch (err) {
    console.error("Erreur récupération messages :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ===================== DASHBOARD ADMIN =====================
router.get("/dashboard", verifyAdminToken, async (req, res) => {
  try {
    const [[{ totalClients }]] = await db.query("SELECT COUNT(*) AS totalClients FROM users WHERE role='client'");
    const [[{ totalProducts }]] = await db.query("SELECT COUNT(*) AS totalProducts FROM products");
    const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [[{ totalSales }]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS totalSales FROM orders WHERE status = 'paid'");

    res.json({
      totalClients,
      totalProducts,
      totalOrders,
      totalSales,
    });
  } catch (err) {
    console.error("Erreur récupération dashboard:", err);
    res.status(500).json({ message: "Erreur serveur lors du chargement du dashboard" });
  }
});


module.exports = router;
