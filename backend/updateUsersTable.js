const db = require("./config/db");

async function updateUsersTable() {
  try {
    console.log("🔄 Mise à jour de la table users...");

    // Ajouter les colonnes phone et address si elles n'existent pas
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS address TEXT
    `);

    console.log("✅ Table users mise à jour avec succès !");
    console.log("📋 Colonnes ajoutées : phone, address");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    process.exit(1);
  }
}

updateUsersTable();