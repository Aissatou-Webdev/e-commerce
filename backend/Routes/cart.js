// routes/cart.js
const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const pool = require("../config/db"); // connexion MySQL

const router = express.Router();

/**
 * ➕ Ajouter un produit au panier
 */
router.post("/products", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // injecté par verifyToken

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Produit et quantité sont requis."
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "La quantité doit être au moins de 1."
      });
    }

    // ✅ Ajout avec optimisation (ON DUPLICATE KEY)
    // Assure-toi d’avoir une contrainte UNIQUE sur (user_id, product_id) dans ta table cart
    await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, productId, quantity]
    );

    // Récupère le panier mis à jour
    const [updatedCart] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: "Produit ajouté au panier avec succès !",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Erreur ajout panier :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * 📦 Récupérer le panier de l’utilisateur connecté
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 Récupération panier pour userId:", userId);

    const [rows] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    console.log("🛒 Articles trouvés dans le panier:", rows.length);
    console.log("🛒 Détails complets:", rows);
    
    // 🖼️ Vérification spécifique des images
    if (rows.length > 0) {
      rows.forEach((item, index) => {
        console.log(`🖼️ Article ${index + 1} - Backend:`, {
          id: item.id,
          name: item.name,
          image: item.image,
          image_type: typeof item.image,
          image_path: item.image ? `uploads/${item.image}` : 'Pas d\'image'
        });
      });
    }

    res.json({ success: true, cart: rows });
  } catch (error) {
    console.error("Erreur récupération panier :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * ✏️ Mettre à jour la quantité d’un produit dans le panier
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ success: false, message: "Quantité requise" });
    }

    // Si quantité <= 0 → suppression directe
    if (quantity <= 0) {
      await pool.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [cartId, userId]);

      const [updatedCart] = await pool.query(
        `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = ?`,
        [userId]
      );

      return res.json({ success: true, message: "Produit retiré du panier", cart: updatedCart });
    }

    // Vérifie si le produit existe bien dans le panier
    const [exist] = await pool.query("SELECT * FROM cart WHERE id = ? AND user_id = ?", [
      cartId,
      userId,
    ]);

    if (exist.length === 0) {
      return res.status(404).json({ success: false, message: "Produit introuvable dans le panier" });
    }

    // Mise à jour de la quantité
    await pool.query("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [
      quantity,
      cartId,
      userId,
    ]);

    // Retourne le panier mis à jour
    const [updatedCart] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json({ success: true, message: "Quantité mise à jour avec succès", cart: updatedCart });
  } catch (error) {
    console.error("Erreur mise à jour panier :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * ❌ Supprimer un produit du panier
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartId = req.params.id;

    const [exist] = await pool.query("SELECT * FROM cart WHERE id = ? AND user_id = ?", [
      cartId,
      userId,
    ]);

    if (exist.length === 0) {
      return res.status(404).json({ success: false, message: "Produit introuvable dans le panier" });
    }

    await pool.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [
      cartId,
      userId,
    ]);

    // Retourne le panier mis à jour
    const [updatedCart] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json({ success: true, message: "Produit supprimé du panier", cart: updatedCart });
  } catch (error) {
    console.error("Erreur suppression panier :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;
