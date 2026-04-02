import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Practice.css';

const Practice = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(600); // 10 Minutes
    const [isActive, setIsActive] = useState(false);
    const [text] = useState("Typewriting is the process of writing or inputting text by pressing keys on a typewriter, computer keyboard, mobile phone, or calculator. It can be distinguished from other means of text input, such as handwriting and speech recognition. The world's first commercially successful typewriter was invented in 1868 by Americans Christopher Latham Sholes, Frank Haven Hall, Carlos Glidden and Samuel W. Soule.");
    const [input, setInput] = useState('');
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const inputRef = useRef(null);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleInput = (e) => {
        if (!isActive) setIsActive(true);
        const val = e.target.value;
        setInput(val);

        // Live Calculation
        const words = val.length / 5;
        const minutes = (600 - timeLeft) / 60;
        const grossWpm = minutes > 0 ? Math.round(words / minutes) : 0;
        setWpm(grossWpm);

        // Accuracy
        let correctChars = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] === text[i]) correctChars++;
        }
        const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
        setAccuracy(acc);
    };

    const handleRestart = () => {
        setIsActive(false);
        setTimeLeft(600);
        setInput('');
        setWpm(0);
        setAccuracy(100);
        if (inputRef.current) inputRef.current.focus();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Render Text with Colors
    const renderText = () => {
        return text.split('').map((char, index) => {
            let color = '#64748B'; // Default Gray
            let bg = 'transparent';

            if (index < input.length) {
                if (input[index] === char) {
                    color = '#16A34A'; // Green (Correct)
                    bg = '#DCFCE7';
                } else {
                    color = '#DC2626'; // Red (Wrong)
                    bg = '#FEE2E2';
                }
            } else if (index === input.length) {
                bg = '#E2E8F0'; // Cursor Position
            }

            return <span key={index} style={{ color, backgroundColor: bg, padding: '0 1px' }}>{char}</span>;
        });
    };

    return (
        <div style={{ background: '#F1F5F9', minHeight: '100vh', padding: '2rem' }}>
            <div className="practice-container">
                <div className="practice-header">
                    <h2 style={{ color: 'var(--primary)' }}>Live Typing Practice ⚡</h2>
                    <div className="timer-box" style={{ background: timeLeft < 60 ? '#FEE2E2' : '#FEF3C7', color: timeLeft < 60 ? '#DC2626' : '#D97706' }}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="stats-bar" style={{ marginBottom: '2rem', marginTop: 0 }}>
                    <div className="stat-item">
                        <div className="stat-val">{wpm}</div>
                        <div className="stat-label">WPM</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-val" style={{ color: accuracy < 90 ? '#DC2626' : '#16A34A' }}>{accuracy}%</div>
                        <div className="stat-label">ACCURACY</div>
                    </div>
                </div>

                <div className="text-display" style={{ fontFamily: 'Courier New', fontSize: '1.4rem', lineHeight: '2' }}>
                    {renderText()}
                </div>

                <textarea
                    ref={inputRef}
                    className="input-area"
                    rows="3"
                    placeholder="Start typing..."
                    value={input}
                    onChange={handleInput}
                    spellCheck="false"
                    autoFocus
                    style={{ opacity: 0.5 }} // Subtle input box, focus is on text display
                />

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button className="btn btn-outline" onClick={handleRestart}>🔄 Restart</button>
                    <button className="btn btn-primary" style={{ marginLeft: '1rem' }} onClick={() => navigate('/')}>Finish & Exit</button>
                </div>
            </div>
        </div>
    );
};

export default Practice;
