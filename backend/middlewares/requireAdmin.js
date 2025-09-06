// middlewares/requireAdmin.js
module.exports = function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé : admin uniquement" });
  }
  next(); // si c’est bien un admin, on continue
};
