const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'kiruthiga_institute'}`);
        console.log(`Database ${process.env.DB_NAME || 'kiruthiga_institute'} created or checked.`);
        await connection.end();
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }
}

createDatabase();
