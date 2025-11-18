const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Allow a full DATABASE_URL or individual vars
const connectionUri = process.env.POSTGRES_URL || null;
let sequelize;
if (connectionUri) {
  sequelize = new Sequelize(connectionUri, { dialect: 'postgres', logging: false });
} else {
  const db = process.env.POSTGRES_DB || 'doctorapp';
  const user = process.env.POSTGRES_USER || 'postgres';
  const pass = process.env.POSTGRES_PASSWORD || '2310991062';
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || 5432;
  sequelize = new Sequelize(db, user, pass, {
    host,
    port,
    dialect: 'postgres',
    logging: false,
  });
}

module.exports = sequelize;
