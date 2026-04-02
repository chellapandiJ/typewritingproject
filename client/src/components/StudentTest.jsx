import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StudentTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [text, setText] = useState(''); // Text needed to be typed
    const [input, setInput] = useState(''); // User input
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    // Fetch test details
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await fetch(`/api/tests/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setTest({
                        ...data,
                        duration: 600 // Default 10 mins if not in DB, or use data.duration
                    });
                    setText(data.content);
                    setTimeLeft(600); // Or data.duration (seconds)
                } else {
                    alert('Test not found');
                    navigate('/student/portal');
                }
            } catch (err) { console.error(err); }
        };
        fetchTest();
    }, [id]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            submitTest();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Login Check
    useEffect(() => {
        const student = JSON.parse(localStorage.getItem('student'));
        if (!student) {
            alert('Please Login to continue.');
            navigate('/');
        }
    }, [navigate]);

    // Mistakes & Accuracy
    const [mistakes, setMistakes] = useState(0);

    const handleInput = (e) => {
        const val = e.target.value;
        if (!isActive) setIsActive(true);
        setInput(val);

        // Calculate Stats
        const words = val.trim().split(/\s+/).length;
        const minutesApplied = Math.max(0.1, (test.duration - timeLeft) / 60);
        const currWpm = Math.round((val.length / 5) / minutesApplied);
        setWpm(currWpm);

        // Mistakes & Accuracy
        let errs = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== text[i]) errs++;
        }
        setMistakes(errs);

        const currAcc = val.length > 0 ? Math.round(((val.length - errs) / val.length) * 100) : 100;
        setAccuracy(currAcc);
    };

    const submitTest = async () => {
        setIsActive(false);
        const student = JSON.parse(localStorage.getItem('student'));
        if (!student) return;

        const timeSpent = (test.duration || 600) - timeLeft;
        const mm = Math.floor(timeSpent / 60);
        const ss = timeSpent % 60;
        const timeTaken = `${mm}:${ss.toString().padStart(2, '0')}`;

        try {
            await fetch('/api/tests/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    test_id: id,
                    student_id: student.id,
                    wpm: wpm,
                    accuracy: accuracy,
                    mistakes: mistakes,
                    time_taken: timeTaken
                })
            });
            alert(`Test Submitted!\nWPM: ${wpm}\nMistakes: ${mistakes}\nAccuracy: ${accuracy}%`);
            navigate('/student/portal');
        } catch (err) {
            alert('Submission failed');
        }
    };

    const renderText = () => {
        const chars = text.split('');
        return chars.map((char, index) => {
            let color = '#64748B'; // Gray (Default)
            let bg = 'transparent';

            if (index < input.length) {
                if (input[index] === char) {
                    color = '#16A34A'; // Green
                    bg = '#DCFCE7';
                } else {
                    color = '#DC2626'; // Red
                    bg = '#FEE2E2';
                }
            } else if (index === input.length) {
                bg = '#E2E8F0'; // Cursor
            }

            return <span key={index} style={{ color, backgroundColor: bg, transition: 'all 0.1s' }}>{char}</span>;
        });
    };

    const [hasStarted, setHasStarted] = useState(false);

    if (!test) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--primary)' }}>Loading Examination... ⏳</div>;

    if (!hasStarted) {
        return (
            <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '3rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <h2 style={{ marginBottom: '0.5rem', color: '#1E293B' }}>{test.title}</h2>
                    <div style={{ fontSize: '1.1rem', color: '#64748B', marginBottom: '2.5rem' }}>
                        <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <p style={{ margin: 0 }}>⏱️ Duration: <strong>{Math.floor((test.duration || 600) / 60)} Minutes</strong></p>
                        </div>
                        <p>Read the paragraph carefully and type it as accurately as possible.</p>
                        <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>The timer starts when you click the button below.</p>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }} onClick={() => { setHasStarted(true); setIsActive(true); }}>
                        🚀 Start Examination Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#F1F5F9', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex-between">
                        <div>
                            <h2 style={{ margin: 0, color: '#1E293B' }}>{test.title}</h2>
                            <p style={{ color: '#64748B', margin: 0 }}>Progress Feedback Active ✅</p>
                        </div>
                        <div style={{
                            fontSize: '1.8rem', fontWeight: 'bold',
                            background: timeLeft < 60 ? '#FEE2E2' : '#E0F2FE',
                            color: timeLeft < 60 ? '#DC2626' : '#0369A1',
                            padding: '0.5rem 1.5rem', borderRadius: '12px', border: '2px solid currentColor'
                        }}>
                            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>

                <div className="grid-responsive" style={{ gridTemplateColumns: '3fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                    <div className="card" style={{ padding: '0' }}>
                        <div style={{
                            padding: '2rem', fontSize: '1.4rem', lineHeight: '2',
                            fontFamily: '"Courier New", Courier, monospace',
                            background: '#FFF', borderRadius: '12px 12px 0 0',
                            maxHeight: '400px', overflowY: 'auto', borderBottom: '2px solid #E2E8F0',
                            userSelect: 'none'
                        }}>
                            {renderText()}
                        </div>
                        <textarea
                            className="form-control"
                            rows="6"
                            placeholder="Type the above paragraph here..."
                            value={input}
                            onChange={handleInput}
                            spellCheck="false"
                            autoFocus
                            style={{
                                border: 'none', borderRadius: '0 0 12px 12px',
                                fontSize: '1.3rem', padding: '1.5rem',
                                fontFamily: '"Courier New", Courier, monospace',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                resize: 'none'
                            }}
                            onPaste={(event) => event.preventDefault()}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: 'white' }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Typing Speed</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{wpm}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Words Per Min</div>
                        </div>

                        <div className="card" style={{ textAlign: 'center', background: 'white', borderLeft: '4px solid #10B981' }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Accuracy</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>{accuracy}%</div>
                        </div>

                        <div className="card" style={{ textAlign: 'center', background: 'white', borderLeft: '4px solid #EF4444' }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Mistakes</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#DC2626' }}>{mistakes}</div>
                        </div>

                        <button className="btn btn-primary" onClick={submitTest} style={{
                            background: '#DC2626', border: 'none', padding: '1rem',
                            fontSize: '1.1rem', fontWeight: 'bold', width: '100%',
                            boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.3)'
                        }}>
                            Submit Examination 📤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTest;
