const db = require('./config/db');

const updateSchemaV3 = async () => {
    try {
        console.log('--- Updating Database Schema V3 ---');

        // Add mistakes to test_results
        try {
            await db.execute("ALTER TABLE test_results ADD COLUMN mistakes INT DEFAULT 0 AFTER score");
            console.log("✓ Added mistakes to test_results");
        } catch (e) { console.log("- mistakes column already exists or error"); }

        console.log("--- Update Complete ---");
        process.exit();
    } catch (err) {
        console.error("Update Failed:", err);
        process.exit(1);
    }
};

updateSchemaV3();
