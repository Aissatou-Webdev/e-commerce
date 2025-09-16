const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "secret123"; // 🔐 .env en prod

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Erreur vérification token :", err.message);
      return res.status(403).json({ message: "Token invalide" });
    }

    req.user = decoded; // ✅ essentiel
    next();
  });
};

module.exports = verifyToken;
