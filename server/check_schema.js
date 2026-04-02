const db = require('./config/db');

const checkSchema = async () => {
    try {
        console.log('--- Checking "students" Table Schema ---');
        const [rows] = await db.execute('DESCRIBE students');
        console.table(rows);
        process.exit();
    } catch (err) {
        console.error('Error checking schema:', err);
        process.exit(1);
    }
};

checkSchema();
