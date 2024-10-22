require('dotenv').config({ path: './chat.env' }); // Ensure you're using chat.env
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Function to check database connection
const checkConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()'); // Simple query to check the connection
    console.log('Database connected:', res.rows[0]);
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error('Database connection error:', error.stack);
  }
};

module.exports = { pool, checkConnection };
