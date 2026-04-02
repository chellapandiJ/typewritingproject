const db = require('./config/db');

const updateSchema = async () => {
    try {
        console.log('--- Updating Schema for Address ---');
        try {
            await db.execute("ALTER TABLE students ADD COLUMN address TEXT AFTER dob");
            console.log('✓ Added address to students');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('✓ Address column already exists');
            else console.log('! Error adding address:', e.message);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateSchema();
