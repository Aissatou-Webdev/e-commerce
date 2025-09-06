// routes/cart.js
const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const pool = require("../config/db"); // connexion MySQL

const router = express.Router();

/**
 * ➕ Ajouter un produit au panier
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // récupéré depuis verifyToken

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: "Produit et quantité requis" });
    }

    // Vérifie si le produit est déjà dans le panier
    const [rows] = await pool.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (rows.length > 0) {
      // Mise à jour quantité
      await pool.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, productId]
      );
    } else {
      // Nouvelle insertion
      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
    }

    // Retourne le panier mis à jour
    const [updatedCart] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json({ success: true, message: "Produit ajouté au panier avec succès !", cart: updatedCart });
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

    const [rows] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

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

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantité invalide" });
    }

    const [exist] = await pool.query("SELECT * FROM cart WHERE id = ? AND user_id = ?", [
      cartId,
      userId,
    ]);

    if (exist.length === 0) {
      return res.status(404).json({ success: false, message: "Produit introuvable dans le panier" });
    }

    await pool.query("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [
      quantity,
      cartId,
      userId,
    ]);

    res.json({ success: true, message: "Quantité mise à jour avec succès" });
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

    res.json({ success: true, message: "Produit supprimé du panier" });
  } catch (error) {
    console.error("Erreur suppression panier :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;
