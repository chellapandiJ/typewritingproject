const db = require('./config/db');

const updateSchema = async () => {
    try {
        console.log('--- Updating Database Schema ---');

        // 1. Modify Course to be flexible (VARCHAR) instead of ENUM
        try {
            await db.execute("ALTER TABLE students MODIFY COLUMN course VARCHAR(255)");
            console.log('✓ Modified course column to VARCHAR');
        } catch (e) { console.log('! Course column modification skipped or failed:', e.message); }

        // 2. Add Gender
        try {
            await db.execute("ALTER TABLE students ADD COLUMN gender VARCHAR(10) AFTER dob");
            console.log('✓ Added gender column');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('✓ Gender column already exists');
            else console.log('! Failed to add gender:', e.message);
        }

        // 3. Add Timing preference
        try {
            await db.execute("ALTER TABLE students ADD COLUMN timing VARCHAR(50) AFTER course");
            console.log('✓ Added timing column');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('✓ Timing column already exists');
            else console.log('! Failed to add timing:', e.message);
        }

        console.log('--- Schema Update Complete ---');
        process.exit();
    } catch (err) {
        console.error('Fatal Error:', err);
        process.exit(1);
    }
};

updateSchema();
