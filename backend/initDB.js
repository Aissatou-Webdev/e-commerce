const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Configuration de la base de données sans spécifier la DB
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Adapte selon ta configuration
  multipleStatements: true
});

async function initDatabase() {
  try {
    console.log('🔄 Connexion à MySQL...');
    
    // Créer la base de données si elle n'existe pas
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS ecommerce');
    console.log('✅ Base de données "ecommerce" créée/vérifiée');
    
    // Fermer la première connexion et en créer une nouvelle pour la base ecommerce
    connection.end();
    
    const dbConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ecommerce'
    });
    
    console.log('✅ Connexion à la base de données "ecommerce"');
    
    // Créer les tables
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('client') DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category VARCHAR(100),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];
    
    for (const query of queries) {
      await dbConnection.promise().execute(query);
    }
    console.log('✅ Tables créées avec succès');
    
    // Créer un admin par défaut
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    try {
      await dbConnection.promise().execute(
        'INSERT IGNORE INTO admins (nom, email, password, role) VALUES (?, ?, ?, ?)',
        ['Administrator', adminEmail, hashedPassword, 'admin']
      );
      console.log('✅ Admin par défaut créé');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Mot de passe:', adminPassword);
    } catch (err) {
      console.log('ℹ️  Admin existe déjà');
    }
    
    // Ajouter quelques produits de démonstration
    const products = [
      ['Crème hydratante', 'Crème hydratante pour le visage, toutes peaux', 20.00, 50, 'cosmetiques', null],
      ['Rouge à lèvres', 'Rouge à lèvres longue tenue', 15.00, 30, 'maquillage', null],
      ['Fond de teint', 'Fond de teint couvrance parfaite', 25.00, 25, 'maquillage', null]
    ];
    
    for (const product of products) {
      try {
        await dbConnection.promise().execute(
          'INSERT IGNORE INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)',
          product
        );
      } catch (err) {
        // Produit existe déjà, on ignore
      }
    }
    console.log('✅ Produits de démonstration ajoutés');
    
    console.log('🎉 Initialisation de la base de données terminée !');
    
    dbConnection.end();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    process.exit(0);
  }
}

initDatabase();