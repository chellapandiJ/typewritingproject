const db = require('../config/db');

// Get Fees for a student
exports.getStudentFees = async (req, res) => {
    const { student_id } = req.params;
    try {
        const [fees] = await db.execute('SELECT * FROM fees WHERE student_id = ? ORDER BY paid_on DESC', [student_id]);
        res.json(fees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add New Fee Payment
exports.addFee = async (req, res) => {
    const { student_id, amount, payment_mode, remarks, fee_month } = req.body;
    try {
        // Generate Receipt No (e.g., REC-20250001)
        const [lastFee] = await db.execute('SELECT id FROM fees ORDER BY id DESC LIMIT 1');
        const nextId = lastFee.length > 0 ? lastFee[0].id + 1 : 1;
        const receipt_no = `REC-${new Date().getFullYear()}${String(nextId).padStart(4, '0')}`;

        await db.execute(
            'INSERT INTO fees (student_id, amount, paid_on, payment_mode, receipt_no, remarks, fee_month) VALUES (?, ?, CURDATE(), ?, ?, ?, ?)',
            [student_id, amount, payment_mode, receipt_no, remarks, fee_month]
        );

        res.json({ message: 'Fee paid successfully', receipt_no });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Pending Fees
exports.getPendingFees = async (req, res) => {
    const { month } = req.query; // YYYY-MM
    if (!month) return res.status(400).json({ error: 'Month required' });

    try {
        // 1. Get all Active Students
        const [students] = await db.execute('SELECT * FROM students WHERE status = "Active"');

        // 2. Get fees paid for this month
        // We now check the fee_month column
        const [paid] = await db.execute('SELECT student_id FROM fees WHERE fee_month = ?', [month]);
        const paidIds = paid.map(p => p.student_id);

        // 3. Filter
        const pending = students.filter(s => {
            // Check if already paid
            if (paidIds.includes(s.id)) return false;

            // Check admission date validity
            // If student joined in 2024-03, and we check 2024-02, they are NOT pending.
            const admDate = new Date(s.admission_date); // e.g. 2024-03-15
            const checkDate = new Date(month + '-01'); // e.g. 2024-02-01

            // Compare YYYY-MM
            const admMonthStr = s.admission_date ? s.admission_date.toISOString().slice(0, 7) : '0000-00';

            if (month < admMonthStr) return false;

            return true;
        });

        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Daily Collection Report
exports.getDailyReport = async (req, res) => {
    try {
        const [report] = await db.execute(`
            SELECT f.*, s.name, s.roll_number 
            FROM fees f 
            JOIN students s ON f.student_id = s.id 
            WHERE f.paid_on = CURDATE()
        `);
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
