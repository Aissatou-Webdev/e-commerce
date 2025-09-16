const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function createAdmin() {
  try {
    const email = "admin@example.com";
    const password = "Admin@123";
    const nom = "Administrator";
    
    // Vérifier si l'admin existe déjà
    const [existing] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (existing.length > 0) {
      console.log("✅ Admin existe déjà avec l'email:", email);
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'admin
    await db.query(
      "INSERT INTO admins (nom, email, password, role) VALUES (?, ?, ?, ?)",
      [nom, email, hashedPassword, "admin"]
    );

    console.log("✅ Admin créé avec succès !");
    console.log("📧 Email:", email);
    console.log("🔑 Mot de passe:", password);
    
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error);
  } finally {
    process.exit(0);
  }
}

createAdmin();