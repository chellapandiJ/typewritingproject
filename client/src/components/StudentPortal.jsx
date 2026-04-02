import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentPortal = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [activeTests, setActiveTests] = useState([]);

    useEffect(() => {
        const storedStudent = localStorage.getItem('student');
        if (!storedStudent) {
            navigate('/');
            return;
        }
        setStudent(JSON.parse(storedStudent));
        fetchActiveTests();
    }, []);

    const fetchActiveTests = async () => {
        try {
            const res = await fetch('/api/tests/active');
            if (res.ok) {
                const data = await res.json();
                setActiveTests(Array.isArray(data) ? data : []);
            } else {
                console.error("Failed to fetch tests");
                setActiveTests([]);
            }
        } catch (err) {
            console.error(err);
            setActiveTests([]);
        }
    };

    if (!student) return null;

    return (
        <div className="layout-wrapper" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    Student Portal
                </div>
                <div className="nav-links">
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{student.name} ({student.rollNumber})</span>
                    <button className="btn btn-outline" onClick={() => {
                        localStorage.removeItem('student');
                        navigate('/');
                    }}>Logout</button>
                </div>
            </nav>

            <div className="home-container">
                <div className="dashboard-grid">
                    {/* Profile Card */}
                    <div className="card">
                        <h3>My Profile</h3>
                        <div style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                            <p><strong>Roll No:</strong> {student.rollNumber}</p>
                            <p><strong>Course:</strong> {student.course}</p>
                            <p><strong>Status:</strong> <span style={{ color: 'green' }}>Active</span></p>
                        </div>
                    </div>

                    {/* Active Tests Card */}
                    <div className="card" style={{ gridColumn: 'span 2' }}>
                        <h3>Available Exams</h3>
                        {activeTests.length === 0 ? (
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No active exams at the moment.</p>
                        ) : (
                            <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                                {activeTests.map(test => (
                                    <div key={test.id} style={{
                                        border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white'
                                    }}>
                                        <div>
                                            <h4 style={{ color: 'var(--primary-dark)' }}>{test.title}</h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                Duration: {Math.floor((new Date(test.end_time) - new Date(test.start_time)) / 60000)} mins
                                            </p>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => navigate(`/student/test/${test.id}`)}>
                                            Start Exam &rarr;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPortal;
