const db = require("./config/db");

async function checkCartTable() {
  try {
    console.log("🔍 Vérification de la table cart...");

    // Vérifier si la table cart existe
    const [tables] = await db.query("SHOW TABLES LIKE 'cart'");
    
    if (tables.length === 0) {
      console.log("❌ Table cart n'existe pas !");
      return;
    }

    console.log("✅ Table cart existe !");

    // Vérifier la structure de la table
    const [structure] = await db.query("DESCRIBE cart");
    console.log("📋 Structure de la table cart :");
    structure.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });

    // Vérifier les contraintes
    const [constraints] = await db.query(`
      SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE 
      FROM information_schema.TABLE_CONSTRAINTS 
      WHERE TABLE_SCHEMA = 'ecommerce' AND TABLE_NAME = 'cart'
    `);
    
    console.log("🔗 Contraintes :");
    constraints.forEach(constraint => {
      console.log(`  - ${constraint.CONSTRAINT_NAME}: ${constraint.CONSTRAINT_TYPE}`);
    });

    console.log("✅ Vérification terminée !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
    process.exit(1);
  }
}

checkCartTable();