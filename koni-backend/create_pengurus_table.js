const pool = require('./config/db');

async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS pengurus (
      id VARCHAR(36) PRIMARY KEY,
      nama VARCHAR(150) NOT NULL,
      jabatan VARCHAR(100) NOT NULL,
      quotes TEXT,
      foto_url VARCHAR(255),
      order_num INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `;

  try {
    const [result] = await pool.query(query);
    console.log("Table 'pengurus' created or already exists.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating table:", error);
    process.exit(1);
  }
}

createTable();
