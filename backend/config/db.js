const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Création du pool de connexions
const db = mysql.createPool(dbConfig);

// Test de connexion
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connexion à MySQL réussie');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur de connexion à MySQL:', error.message);
  }
};

// Tester la connexion au démarrage
testConnection();

module.exports = db;
