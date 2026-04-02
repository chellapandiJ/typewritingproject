const db = require('../config/db');

exports.getAllStaff = async (req, res) => {
    try {
        const [staff] = await db.execute('SELECT * FROM staff ORDER BY id DESC');
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createStaff = async (req, res) => {
    const { name, phone, email, dob, gender, address, role } = req.body;
    try {
        // Generate Staff ID (ST-001, etc.)
        const [result] = await db.execute('SELECT COUNT(*) as count FROM staff');
        const count = result[0].count + 1;
        const staff_id = `ST-${String(count).padStart(3, '0')}`;
        const password = 'staff' + Math.floor(1000 + Math.random() * 9000); // Simple auto-password

        await db.execute(
            'INSERT INTO staff (staff_id, name, phone, email, dob, gender, address, role, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [staff_id, name, phone, email, dob, gender, address, role || 'Instructor', password, 'Active']
        );

        res.status(201).json({ message: 'Staff created successfully', staff_id, password });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStaff = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, dob, gender, address, role, status } = req.body;
    try {
        await db.execute(
            'UPDATE staff SET name=?, phone=?, email=?, dob=?, gender=?, address=?, role=?, status=? WHERE id=?',
            [name, phone, email, dob, gender, address, role, status, id]
        );
        res.json({ message: 'Staff updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM staff WHERE id = ?', [id]);
        res.json({ message: 'Staff deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
