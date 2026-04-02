const db = require('./config/db');

const createTables = async () => {
    try {
        console.log('--- Initializing Database Tables ---');

        // 1. Admins
        await db.execute(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Admins Table');

        // 2. Students
        await db.execute(`
            CREATE TABLE IF NOT EXISTS students (
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
                allocated_machine_id INT,
                admission_date DATE,
                batch_end_date DATE,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (allocated_machine_id) REFERENCES machines(id) ON DELETE SET NULL
            )
        `);
        console.log('✓ Students Table');

        // 3. Staff
        await db.execute(`
            CREATE TABLE IF NOT EXISTS staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                staff_id VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(15),
                email VARCHAR(100),
                dob DATE,
                gender VARCHAR(10),
                address TEXT,
                role VARCHAR(50) DEFAULT 'Instructor',
                password VARCHAR(255) NOT NULL,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Staff Table');

        // 4. Machines
        await db.execute(`
            CREATE TABLE IF NOT EXISTS machines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                machine_no VARCHAR(20) UNIQUE NOT NULL,
                type ENUM('English', 'Tamil') DEFAULT 'English',
                purchased_date DATE,
                status ENUM('Active', 'Inactive', 'Repair') DEFAULT 'Active'
            )
        `);
        console.log('✓ Machines Table');

        // 5. Batches
        await db.execute(`
            CREATE TABLE IF NOT EXISTS batches (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                machine_id INT,
                start_time TIME,
                end_time TIME,
                start_date DATE,
                end_date DATE,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE SET NULL
            )
        `);
        console.log('✓ Batches Table');

        // 6. Attendance
        await db.execute(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                date DATE,
                in_time TIME,
                out_time TIME,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Attendance Table');

        // 7. Fees
        await db.execute(`
            CREATE TABLE IF NOT EXISTS fees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                receipt_no VARCHAR(20) UNIQUE NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                payment_mode VARCHAR(50),
                remarks TEXT,
                fee_month VARCHAR(20), -- Format: YYYY-MM
                paid_on DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Fees Table');

        // 8. Announcements
        await db.execute(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100),
                message TEXT,
                media_url TEXT,
                media_type VARCHAR(20),
                link TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Announcements Table');

        // 9. Tests
        await db.execute(`
            CREATE TABLE IF NOT EXISTS tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100),
                test_link TEXT,
                content TEXT,
                start_time DATETIME,
                end_time DATETIME,
                difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Tests Table');

        // 10. Test Results
        await db.execute(`
            CREATE TABLE IF NOT EXISTS test_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                test_id INT,
                student_id INT,
                score INT,
                speed_wpm INT,
                accuracy INT,
                mistakes INT DEFAULT 0,
                time_taken VARCHAR(20),
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Test Results Table');

        // 11. Achievements
        await db.execute(`
            CREATE TABLE IF NOT EXISTS achievements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100),
                description TEXT,
                image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Achievements Table');

        // 12. Settings
        await db.execute(`
            CREATE TABLE IF NOT EXISTS settings (
                key_name VARCHAR(100) PRIMARY KEY,
                value TEXT
            )
        `);
        console.log('✓ Settings Table');

        // 13. Typing Practice
        await db.execute(`
            CREATE TABLE IF NOT EXISTS typing_practice (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                speed_wpm INT,
                accuracy INT,
                practiced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Typing Practice Table');

        // Seed Admin if not exists
        const [admins] = await db.execute('SELECT * FROM admins WHERE username = ?', ['admin']);
        if (admins.length === 0) {
            await db.execute('INSERT INTO admins (username, password, email) VALUES (?, ?, ?)', ['admin', 'admin123', 'admin@institute.com']);
            console.log('✓ Default Admin Created (User: admin, Pass: admin123)');
        }

        // Seed Default Settings
        const defaultSettings = [
            ['institute_name', 'Kiruthiga Typewriting Institute'],
            ['address', '123 Main St, Your City'],
            ['contact_phone', '9876543210'],
            ['email', 'info@kiruthiga.com'],
            ['about_us', 'Premier technical institute providing professional typing courses.']
        ];

        for (const [key, val] of defaultSettings) {
            await db.execute('INSERT IGNORE INTO settings (key_name, value) VALUES (?, ?)', [key, val]);
        }
        console.log('✓ Default Settings Initialized');

        console.log('--- Database Setup Complete ---');
        process.exit();
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
};

createTables();
