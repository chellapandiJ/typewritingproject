import React, { useState } from 'react';

const StudentEntry = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(null); // 'IN' or 'OUT' or null (not verified)
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // Check status to determine button state
    const verifyStudent = async () => {
        if (!rollNumber) {
            setMessage('Please enter Roll Number');
            return;
        }
        try {
            const res = await fetch(`/api/student/status?roll_number=${rollNumber}`);
            const data = await res.json();
            if (data.isIn !== undefined) {
                setStatus(data.isIn ? 'IN' : 'OUT');
                setIsVerified(true);
                setMessage('');
            } else {
                setMessage('Student not found');
                setIsVerified(false);
            }
        } catch (err) {
            setMessage('Verification error');
        }
    };

    const handleEntry = async () => {
        try {
            const res = await fetch('/api/student/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roll_number: rollNumber, password })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Success: ' + data.message);
                setStatus('IN');
                // Reset after delay?
            } else {
                setMessage('Error: ' + data.message);
            }
        } catch (err) {
            setMessage('Network error');
        }
    };

    const handleExit = async () => {
        try {
            const res = await fetch('/api/student/exit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roll_number: rollNumber, password })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Success: ' + data.message);
                setStatus('OUT');
            } else {
                setMessage('Error: ' + data.message);
            }
        } catch (err) {
            setMessage('Network error');
        }
    };

    const reset = () => {
        setIsVerified(false);
        setRollNumber('');
        setPassword('');
        setMessage('');
        setStatus(null);
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
            <div className="card">
                <h1>Student Entry</h1>

                {message && <p style={{ color: '#38bdf8', marginBottom: '1rem', background: 'rgba(56,189,248,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{message}</p>}

                {!isVerified ? (
                    <>
                        <input
                            type="text"
                            placeholder="Roll Number"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                        />
                        <button className="btn" onClick={verifyStudent} style={{ width: '100%' }}>Verify Status</button>
                    </>
                ) : (
                    <>
                        <p style={{ marginBottom: '1rem' }}>Roll Number: <strong>{rollNumber}</strong></p>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                className="btn"
                                onClick={handleEntry}
                                disabled={status === 'IN'} // Disable if already IN
                                style={{ flex: 1, filter: status === 'IN' ? 'grayscale(1)' : 'none' }}
                            >
                                IN
                            </button>
                            <button
                                className="btn"
                                onClick={handleExit}
                                disabled={status === 'OUT'} // Disable if already OUT (not in)
                                style={{ flex: 1, filter: status === 'OUT' ? 'grayscale(1)' : 'none' }}
                            >
                                OUT
                            </button>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <button onClick={reset} style={{ background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                                Back / Reset
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentEntry;
