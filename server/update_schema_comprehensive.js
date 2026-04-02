const db = require('./config/db');

const updateSchema = async () => {
    try {
        console.log('--- Updating Database Schema (ALTER Tables) ---');

        // 1. Staff Table Updates
        try {
            await db.execute("ALTER TABLE staff ADD COLUMN IF NOT EXISTS dob DATE");
            await db.execute("ALTER TABLE staff ADD COLUMN IF NOT EXISTS gender VARCHAR(10)");
            await db.execute("ALTER TABLE staff ADD COLUMN IF NOT EXISTS address TEXT");
            console.log('✓ Staff Table updated');
        } catch (e) { console.log('Staff table update skipped or error: ' + e.message); }

        // 2. Announcements Table Updates
        try {
            await db.execute("ALTER TABLE announcements ADD COLUMN IF NOT EXISTS media_url TEXT");
            await db.execute("ALTER TABLE announcements ADD COLUMN IF NOT EXISTS media_type VARCHAR(20)");
            console.log('✓ Announcements Table updated');
        } catch (e) { console.log('Announcements table update skipped or error: ' + e.message); }

        // 3. Tests Table Updates
        try {
            await db.execute("ALTER TABLE tests ADD COLUMN IF NOT EXISTS content TEXT");
            console.log('✓ Tests Table updated');
        } catch (e) { console.log('Tests table update skipped or error: ' + e.message); }

        // 4. Test Results Table Updates
        try {
            await db.execute("ALTER TABLE test_results ADD COLUMN IF NOT EXISTS speed_wpm INT");
            await db.execute("ALTER TABLE test_results ADD COLUMN IF NOT EXISTS accuracy INT");
            await db.execute("ALTER TABLE test_results ADD COLUMN IF NOT EXISTS time_taken VARCHAR(20)");
            console.log('✓ Test Results Table updated');
        } catch (e) { console.log('Test Results table update skipped or error: ' + e.message); }

        console.log('--- Schema Update Complete ---');
        process.exit();
    } catch (err) {
        console.error('Fatal Error updating schema:', err);
        process.exit(1);
    }
};

updateSchema();
