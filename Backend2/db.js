const { Pool } = require('pg');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false, // Required by Neon
  },
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Database connected successfully');
  release();
});

module.exports = pool;