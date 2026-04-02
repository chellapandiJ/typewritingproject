const db = require('../config/db');

exports.getAllTests = async (req, res) => {
    try {
        const [tests] = await db.execute('SELECT * FROM tests ORDER BY start_time DESC');
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getActiveTests = async (req, res) => {
    try {
        const [tests] = await db.execute('SELECT * FROM tests WHERE end_time > NOW() ORDER BY start_time DESC');
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTest = async (req, res) => {
    try {
        const { title, test_link, content, start_time, end_time, difficulty } = req.body;
        console.log("Creating Test Body:", req.body);

        const params = [
            title || null,
            test_link || null,
            content || null,
            start_time || null,
            end_time || null,
            difficulty || 'Intermediate'
        ];

        console.log("Test Query Params:", params);

        const [result] = await db.query(
            'INSERT INTO tests (title, test_link, content, start_time, end_time, difficulty) VALUES (?, ?, ?, ?, ?, ?)',
            params
        );
        res.status(201).json({ message: 'Test created', id: result.insertId });
    } catch (err) {
        console.error("Create Test Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTest = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM tests WHERE id = ?', [id]);
        res.json({ message: 'Test deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitResult = async (req, res) => {
    const { test_id, student_id, wpm, accuracy, mistakes, time_taken } = req.body;
    try {
        // Prevent multiple submissions if needed (Optional)
        const [existing] = await db.execute('SELECT * FROM test_results WHERE test_id = ? AND student_id = ?', [test_id, student_id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You have already submitted this test.' });
        }

        // Calculate Score (Simple: WPM weighted by Accuracy)
        // Adjust formula as per requirements. Here: Score = WPM
        const score = wpm;

        await db.execute(
            'INSERT INTO test_results (test_id, student_id, score, speed_wpm, accuracy, mistakes, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [test_id, student_id, score, wpm, accuracy, mistakes || 0, time_taken || '10:00']
        );
        res.status(201).json({ message: 'Result submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTestResults = async (req, res) => {
    const { test_id } = req.params;
    try {
        const [results] = await db.execute(`
            SELECT tr.*, s.name, s.roll_number 
            FROM test_results tr
            JOIN students s ON tr.student_id = s.id
            WHERE tr.test_id = ?
            ORDER BY tr.score DESC, tr.speed_wpm DESC
        `, [test_id]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTestDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [test] = await db.execute('SELECT * FROM tests WHERE id = ?', [id]);
        if (test.length === 0) return res.status(404).json({ error: 'Test not found' });
        res.json(test[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentResults = async (req, res) => {
    const { student_id } = req.params;
    try {
        const [results] = await db.execute(`
            SELECT tr.*, t.title 
            FROM test_results tr
            JOIN tests t ON tr.test_id = t.id
            WHERE tr.student_id = ?
            ORDER BY tr.submitted_at DESC
        `, [student_id]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
