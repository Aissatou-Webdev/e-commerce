const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "Admin@123"; // Nouveau mot de passe admin
  const hash = await bcrypt.hash(password, 10);
  console.log("Hash généré :", hash);
}

generateHash();
