const db = require('./config/db');

const updateSchema = async () => {
    try {
        console.log('--- Updating Database Schema ---');

        // 1. Add fee_month to fees
        try {
            await db.execute("ALTER TABLE fees ADD COLUMN fee_month VARCHAR(20) AFTER amount");
            console.log("✓ Added fee_month to fees");
        } catch (e) { console.log("- fee_month already exists or error"); }

        // 2. Add link to announcements
        try {
            await db.execute("ALTER TABLE announcements ADD COLUMN link TEXT AFTER media_url");
            console.log("✓ Added link to announcements");
        } catch (e) { console.log("- link already exists or error"); }

        // 3. Add difficulty to tests
        try {
            await db.execute("ALTER TABLE tests ADD COLUMN difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate' AFTER title");
            console.log("✓ Added difficulty to tests");
        } catch (e) { console.log("- difficulty already exists or error"); }

        // 4. Create Settings Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                key_name VARCHAR(50) UNIQUE NOT NULL,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("✓ Created settings table");

        // Seed Default Settings
        const defaults = [
            { key: 'institute_name', value: 'Kiruthiga Typewriting Institute' },
            { key: 'about_us', value: 'Premier Government Technical Institute. Join 2000+ certified students.' },
            { key: 'contact_phone', value: '+91 98765 43210' },
            { key: 'address', value: 'Vikkiramangalam Main Road, Madurai' },
            { key: 'email', value: 'help@kiruthiga.edu' }
        ];

        for (const d of defaults) {
            await db.execute("INSERT IGNORE INTO settings (key_name, value) VALUES (?, ?)", [d.key, d.value]);
        }
        console.log("✓ Seeded default settings");

        console.log("--- Update Complete ---");
        process.exit();
    } catch (err) {
        console.error("Update Failed:", err);
        process.exit(1);
    }
};

updateSchema();
