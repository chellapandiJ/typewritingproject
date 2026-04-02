const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const [students] = await db.execute('SELECT COUNT(*) as count FROM students WHERE status="Active"');
        const [tamil] = await db.execute('SELECT COUNT(*) as count FROM students WHERE course LIKE "%Tamil%" AND status="Active"');
        const [english] = await db.execute('SELECT COUNT(*) as count FROM students WHERE course LIKE "%English%" AND status="Active"');
        const [machines] = await db.execute('SELECT COUNT(*) as count FROM machines');

        // Count today's daily attendance
        const [attendance] = await db.execute('SELECT COUNT(DISTINCT student_id) as count FROM attendance WHERE date = CURDATE()');

        res.json({
            total_students: students[0].count,
            tamil_students: tamil[0].count,
            english_students: english[0].count,
            total_machines: machines[0].count,
            daily_attendance: attendance[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllMachines = async (req, res) => {
    try {
        const [machines] = await db.execute('SELECT * FROM machines ORDER BY machine_no ASC');
        res.json(machines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMachine = async (req, res) => {
    const { machine_no, type } = req.body;
    try {
        await db.execute('INSERT INTO machines (machine_no, type) VALUES (?, ?)', [machine_no, type]);
        res.status(201).json({ message: 'Machine added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMachineStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE machines SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMachine = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM machines WHERE id = ?', [id]);
        res.json({ message: 'Machine deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBatches = async (req, res) => {
    try {
        const [batches] = await db.execute(`
            SELECT b.*, s.name as student_name, s.roll_number, m.machine_no 
            FROM batches b
            JOIN students s ON b.student_id = s.id
            JOIN machines m ON b.machine_id = m.id
        `);
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addBatch = async (req, res) => {
    const { student_id, machine_id, start_time, end_time } = req.body;
    try {
        // Simple clash check (can be improved)
        const [clash] = await db.execute(`
            SELECT * FROM batches 
            WHERE machine_id = ? 
            AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))
        `, [machine_id, start_time, start_time, end_time, end_time]);

        if (clash.length > 0) return res.status(400).json({ error: 'Time slot clash for this machine' });

        await db.execute('INSERT INTO batches (student_id, machine_id, start_time, end_time) VALUES (?, ?, ?, ?)',
            [student_id, machine_id, start_time, end_time]);
        res.status(201).json({ message: 'Batch assigned' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- ANNOUNCEMENTS ---


exports.deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM announcements WHERE id = ?', [id]);
        res.status(200).json({ message: 'Announcement deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Auto Data Cleanup triggers on fetch (Simple way to keep DB clean)
exports.getAnnouncements = async (req, res) => {
    try {
        // Delete older than 2 days
        await db.execute('DELETE FROM announcements WHERE created_at < NOW() - INTERVAL 2 DAY');

        const [anns] = await db.execute('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(anns);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addAnnouncement = async (req, res) => {
    try {
        const { title, message, media_url, media_type, link } = req.body;
        console.log("Posting Announcement:", { title, message });

        const params = [
            title || null,
            message || null,
            media_url || null,
            media_type || null,
            link || null
        ];

        await db.query(
            'INSERT INTO announcements (title, message, media_url, media_type, link) VALUES (?, ?, ?, ?, ?)',
            params
        );
        res.status(201).json({ message: 'Announcement posted successfully 📢' });
    } catch (err) {
        console.error("Add Announcement Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// --- SETTINGS ---
exports.getSettings = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM settings');
        const settings = {};
        rows.forEach(r => settings[r.key_name] = r.value);
        res.json(settings);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateSettings = async (req, res) => {
    const settings = req.body; // { key: value, ... }
    try {
        for (const key in settings) {
            await db.execute('INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
                [key, settings[key], settings[key]]);
        }
        res.json({ message: 'Settings updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- ATTENDANCE REPORTS ---
exports.getMonthlyReport = async (req, res) => {
    const { month, year } = req.query; // Format: month=1, year=2024
    if (!month || !year) return res.status(400).json({ error: 'Month and Year required' });

    try {
        // 1. Get all students active in that month (or currently active)
        const [students] = await db.execute('SELECT id, name, roll_number, admission_date FROM students');

        // 2. Get attendance for that month
        const [attendance] = await db.execute(`
            SELECT student_id, DAY(date) as day, in_time 
            FROM attendance 
            WHERE MONTH(date) = ? AND YEAR(date) = ?
        `, [month, year]);

        // 3. Construct Report Data
        // Map: student_id -> { daily_status: { 1: 'P', 2: 'A', ... } }

        const daysInMonth = new Date(year, month, 0).getDate();
        const report = students.map(student => {
            const studentAtt = attendance.filter(a => a.student_id === student.id);
            const days = {};

            // Logic:
            // - If date < admission_date: 'Pending' (-)
            // - If date > today: '' (Future)
            // - If record exists: 'P' (Present)
            // - Else: 'A' (Absent)

            const admissionDate = new Date(student.admission_date);
            const today = new Date();

            for (let d = 1; d <= daysInMonth; d++) {
                const currentDate = new Date(year, month - 1, d);

                // Check if future date
                if (currentDate > today) {
                    days[d] = '';
                    continue;
                }

                // Check pending (before admission)
                if (currentDate < admissionDate) {
                    days[d] = '-'; // Pending / Not Joined
                    continue;
                }

                // Check Present
                const isPresent = studentAtt.find(a => a.day === d);
                days[d] = isPresent ? 'P' : 'A';
            }

            return {
                ...student,
                days,
                present_days: studentAtt.length,
                total_working_days: daysInMonth // (Simplified)
            };
        });

        res.json(report);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
