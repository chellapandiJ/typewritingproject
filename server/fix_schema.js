const db = require('./config/db');

const fixSchema = async () => {
    try {
        console.log('--- Patching Database Schema ---');

        // Helper to add column safely
        const addColumn = async (table, column, definition) => {
            try {
                await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
                console.log(`✓ Added ${column} to ${table}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`- ${column} already exists in ${table}`);
                } else {
                    console.error(`Error adding ${column}:`, err.message);
                }
            }
        };

        // Fix Students Table
        await addColumn('students', 'father_name', 'VARCHAR(100) AFTER name');
        await addColumn('students', 'father_phone', 'VARCHAR(15) AFTER phone');
        await addColumn('students', 'address', 'TEXT AFTER gender');
        await addColumn('students', 'gender', 'VARCHAR(10) AFTER dob');
        await addColumn('students', 'dob', 'DATE AFTER email');
        await addColumn('students', 'admission_date', 'DATE');
        await addColumn('students', 'allocated_machine_id', 'INT'); // For slot booking reference

        // Fix Machines Table just in case
        await addColumn('machines', 'type', "ENUM('English', 'Tamil') DEFAULT 'English'");

        console.log('--- Schema Patch Complete ---');
        process.exit();
    } catch (err) {
        console.error('Fatal Error:', err);
        process.exit(1);
    }
};

fixSchema();
