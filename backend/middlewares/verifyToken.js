const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Token invalide" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error("Erreur vérification token :", err);
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = { verifyToken };
