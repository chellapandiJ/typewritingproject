const db = require('./config/db');

const updateSchema = async () => {
    try {
        console.log('--- Updating Schema for Machines ---');

        // 1. Add Type to Machines (Tamil/English)
        try {
            await db.execute("ALTER TABLE machines ADD COLUMN type ENUM('English', 'Tamil') NOT NULL DEFAULT 'English' AFTER machine_no");
            console.log('✓ Added type to machines');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('✓ Type column already exists in machines');
            else console.log('! Error adding type:', e.message);
        }

        // 2. Add allocated_machine_id to Students (Direct Mapping)
        try {
            await db.execute("ALTER TABLE students ADD COLUMN allocated_machine_id INT, ADD FOREIGN KEY (allocated_machine_id) REFERENCES machines(id) ON DELETE SET NULL");
            console.log('✓ Added allocated_machine_id to students');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('✓ allocated_machine_id already exists in students');
            else console.log('! Error adding allocated_machine_id:', e.message);
        }

        console.log('--- Machine Update Complete ---');
        process.exit();
    } catch (err) {
        console.error('Fatal Error:', err);
        process.exit(1);
    }
};

updateSchema();
