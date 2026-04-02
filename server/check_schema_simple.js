const db = require('./config/db');

const checkSchema = async () => {
    try {
        console.log('--- Checking "students" Table Schema ---');
        const [rows] = await db.execute('DESCRIBE students');
        rows.forEach(row => {
            console.log(`Column: ${row.Field} | Type: ${row.Type}`);
        });
        process.exit();
    } catch (err) {
        console.error('Error checking schema:', err);
        process.exit(1);
    }
};

checkSchema();
