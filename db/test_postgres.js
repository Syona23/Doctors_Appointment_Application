const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const connectionUri = process.env.POSTGRES_URL || null;
let sequelize;

console.log('Testing PostgreSQL connection...');
console.log('Connection URI:', connectionUri || 'Using individual env vars');

if (connectionUri) {
  sequelize = new Sequelize(connectionUri, { dialect: 'postgres', logging: false });
} else {
  const db = process.env.POSTGRES_DB || 'doctorapp';
  const user = process.env.POSTGRES_USER || 'postgres';
  const pass = process.env.POSTGRES_PASSWORD || '2310991062';
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || 5432;
  
  console.log(`Connecting to ${host}:${port}/${db} as ${user}...`);
  
  sequelize = new Sequelize(db, user, pass, {
    host,
    port,
    dialect: 'postgres',
    logging: false,
  });
}

sequelize.authenticate()
  .then(() => {
    console.log('✓ PostgreSQL connection successful!');
    return sequelize.close();
  })
  .catch(err => {
    console.error('✗ PostgreSQL connection failed:', err.message);
    process.exitCode = 1;
  });
