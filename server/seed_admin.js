const db = require('./config/db');
require('dotenv').config();

const seed = async () => {
    try {
        console.log('Seeding Admin...');
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', ['admin']);
        if (rows.length === 0) {
            await db.execute('INSERT INTO admins (username, password, email) VALUES (?, ?, ?)', ['admin', 'admin123', 'admin@kiruthiga.edu']);
            console.log('Admin created: admin / admin123');
        } else {
            console.log('Admin already exists.');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
