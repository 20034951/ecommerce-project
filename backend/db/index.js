// backend/db/index.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'ecommerce_user',
    password: process.env.DB_PASS || 'ecommerce_pass',
    database: process.env.DB_NAME || 'ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Helper para consultas
async function query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

export default { pool, query };
export { pool, query };

