const db = require('../config/db');

exports.entry = async (req, res) => {
    const { roll_number, password } = req.body;
    try {
        // 1. Verify student
        const [students] = await db.execute('SELECT * FROM students WHERE roll_number = ?', [roll_number]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });

        const student = students[0];
        if (student.status !== 'Active') return res.status(403).json({ message: 'Account Inactive. Contact Admin.' });
        if (password !== student.password) return res.status(401).json({ message: 'Invalid password' });

        // 2. Check if already in
        const [attendance] = await db.execute(
            'SELECT * FROM attendance WHERE student_id = ? AND date = CURDATE() AND out_time IS NULL',
            [student.id]
        );

        if (attendance.length > 0) return res.status(400).json({ message: 'Already Checked In!' });

        // 3. Mark Entry
        await db.execute(
            'INSERT INTO attendance (student_id, date, in_time) VALUES (?, CURDATE(), CURTIME())',
            [student.id]
        );

        res.json({ message: `Welcome, ${student.name}!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exit = async (req, res) => {
    const { roll_number, password } = req.body;

    try {
        const [students] = await db.execute('SELECT * FROM students WHERE roll_number = ?', [roll_number]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });
        const student = students[0];
        if (password !== student.password) return res.status(401).json({ message: 'Invalid password' });

        // Check if they are actually in
        const [existing] = await db.execute(
            'SELECT * FROM attendance WHERE student_id = ? AND out_time IS NULL',
            [student.id]
        );
        if (existing.length === 0) return res.status(400).json({ message: 'Student is not currently in' });

        // Update out_time
        await db.execute(
            'UPDATE attendance SET out_time = NOW() WHERE student_id = ? AND out_time IS NULL',
            [student.id]
        );
        res.json({ message: 'Exit recorded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Student Login for Portal
exports.login = async (req, res) => {
    const { roll_number, password } = req.body;
    try {
        const [students] = await db.execute('SELECT * FROM students WHERE roll_number = ?', [roll_number]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });

        const student = students[0];
        if (student.status !== 'Active') return res.status(403).json({ message: 'Account Inactive. Contact Admin.' });
        if (password !== student.password) return res.status(401).json({ message: 'Invalid password' });

        res.json({
            message: 'Login successful',
            student: {
                id: student.id,
                name: student.name,
                rollNumber: student.roll_number,
                course: student.course
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Check status to verify if buttons should be enabled/disabled
exports.getStatus = async (req, res) => {
    const { roll_number } = req.query;
    try {
        const [students] = await db.execute('SELECT id, status FROM students WHERE roll_number = ?', [roll_number]);
        if (students.length === 0) return res.json({ isIn: false });

        if (students[0].status !== 'Active') return res.status(403).json({ message: 'Account Inactive. Contact Admin.' });

        const [existing] = await db.execute(
            'SELECT * FROM attendance WHERE student_id = ? AND out_time IS NULL',
            [students[0].id]
        );
        res.json({ isIn: existing.length > 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- ADMIN CRUD OPERATIONS ---

// Get All Students
exports.getAllStudents = async (req, res) => {
    try {
        const [students] = await db.execute('SELECT * FROM students ORDER BY roll_number DESC');
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create Student
exports.createStudent = async (req, res) => {
    const { name, father_name, phone, father_phone, email, dob, address, gender, course, timing, allocated_machine_id, admission_date } = req.body;
    try {
        // Auto-generate Roll Number (e.g., 2026001)
        const [lastStudent] = await db.execute('SELECT roll_number FROM students ORDER BY id DESC LIMIT 1');
        let newRoll = '2026001';
        if (lastStudent.length > 0) {
            const lastVal = parseInt(lastStudent[0].roll_number);
            newRoll = (lastVal + 1).toString();
        }

        // Auto-generate Password: DOB (DDMMYYYY) or generic if missing
        // If DOB is 2005-08-15 -> 15082005
        let password = 'password123';
        if (dob) {
            const [year, month, day] = dob.split('-');
            password = `${day}${month}${year}`;
        }

        await db.execute(
            `INSERT INTO students (roll_number, name, father_name, phone, father_phone, email, dob, address, gender, course, timing, allocated_machine_id, admission_date, password, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
            [newRoll, name, father_name, phone, father_phone, email, dob, address, gender, course, timing, allocated_machine_id || null, admission_date, password]
        );

        res.json({ message: 'Student created successfully', roll_number: newRoll, password: password });
    } catch (err) {
        console.error("Create Student Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update Student (Partial Update Supported)
exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Allowed fields to update
    const allowedFields = ['name', 'father_name', 'phone', 'father_phone', 'email', 'dob', 'address', 'gender', 'course', 'timing', 'allocated_machine_id', 'admission_date', 'status'];

    try {
        // Filter out keys that are not allowed or valid columns
        const keys = Object.keys(updates).filter(key => allowedFields.includes(key));

        if (keys.length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update' });
        }

        // Build Query Dynamically
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => {
            // Handle specific field logic if needed
            if (key === 'allocated_machine_id' && (updates[key] === '' || updates[key] === 'null')) return null;
            return updates[key];
        });

        // Add ID to values for WHERE clause
        values.push(id);

        await db.execute(`UPDATE students SET ${setClause} WHERE id = ?`, values);

        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM students WHERE id = ?', [id]);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
