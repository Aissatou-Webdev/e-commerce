const mysql = require('mysql2');

// Configuration de la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce'
});

async function updateDatabase() {
  try {
    console.log('🔄 Mise à jour de la structure de la base de données...');
    
    // Vérifier et ajouter la colonne category à la table products
    try {
      await connection.promise().execute(
        'ALTER TABLE products ADD COLUMN category VARCHAR(100) AFTER stock'
      );
      console.log('✅ Colonne "category" ajoutée à la table products');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  La colonne "category" existe déjà dans la table products');
      } else {
        console.error('❌ Erreur lors de l\'ajout de la colonne category:', err.message);
      }
    }
    
    // Vérifier et ajouter la colonne created_at à la table messages
    try {
      await connection.promise().execute(
        'ALTER TABLE messages ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
      );
      console.log('✅ Colonne "created_at" ajoutée à la table messages');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  La colonne "created_at" existe déjà dans la table messages');
      } else {
        console.error('❌ Erreur lors de l\'ajout de la colonne created_at:', err.message);
      }
    }
    
    // Mettre à jour les produits existants avec des catégories par défaut
    try {
      await connection.promise().execute(
        'UPDATE products SET category = "cosmetiques" WHERE category IS NULL OR category = ""'
      );
      console.log('✅ Catégories par défaut ajoutées aux produits existants');
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour des catégories:', err.message);
    }
    
    // Vérifier la structure des tables
    const [productsStructure] = await connection.promise().execute('DESCRIBE products');
    const [messagesStructure] = await connection.promise().execute('DESCRIBE messages');
    
    console.log('📋 Structure de la table products:');
    console.table(productsStructure);
    
    console.log('📋 Structure de la table messages:');
    console.table(messagesStructure);
    
    console.log('🎉 Mise à jour de la base de données terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    connection.end();
    process.exit(0);
  }
}

updateDatabase();