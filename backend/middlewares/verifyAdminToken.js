const jwt = require("jsonwebtoken");

// Middleware pour sécuriser les routes admin
function verifyAdminToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Format de token invalide" });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    req.user = decoded; // stocke les infos admin (compatible avec requireAdmin)
    next();
  } catch (err) {
    console.error("Erreur vérification token admin :", err);
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = { verifyAdminToken };
