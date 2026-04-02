const db = require('./config/db');

const resetStudentsTable = async () => {
    try {
        console.log('--- RESETTING STUDNETS TABLE ---');

        // 0. Disable FK Checks
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        // 1. Drop existing table
        await db.execute('DROP TABLE IF EXISTS students');
        console.log('✓ Dropped old students table');

        // 2. Re-create with FULL Schema
        await db.execute(`
            CREATE TABLE students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                roll_number VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                father_name VARCHAR(100),
                phone VARCHAR(15),
                father_phone VARCHAR(15),
                email VARCHAR(100),
                dob DATE,
                gender VARCHAR(10),
                address TEXT,
                course VARCHAR(255) DEFAULT 'English Lower',
                timing VARCHAR(50),
                admission_date DATE,
                batch_end_date DATE,
                allocated_machine_id INT,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created fresh students table with all columns');

        // 3. Re-enable FK Checks
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        process.exit();
    } catch (err) {
        console.error('Error resetting table:', err);
        process.exit(1);
    }
};

resetStudentsTable();
