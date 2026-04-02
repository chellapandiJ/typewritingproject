import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Data States
    const [announcements, setAnnouncements] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [activeTest, setActiveTest] = useState(null);
    const [settings, setSettings] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeModal, setActiveModal] = useState(null); // 'about', 'contact', 'achievements', 'notifications'

    const fetchData = async () => {
        try {
            // Fetch Announcements
            const annRes = await fetch('/api/common/announcements');
            const annData = await annRes.json();
            const sorted = Array.isArray(annData) ? annData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];

            // Fetch Settings
            const setRes = await fetch('/api/common/settings');
            const settingsData = await setRes.json();
            setSettings(settingsData);

            // Fetch Achievements
            const achRes = await fetch('/api/extra/achievements');
            const achData = await achRes.json();
            const sortedAchs = Array.isArray(achData) ? achData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];

            console.log('Home Fetch - Anns:', annData, 'Achs:', achData);

            setAnnouncements(sorted);
            setAchievements(sortedAchs);

            // Fetch Active Test
            const testRes = await fetch('/api/tests/all');
            const testData = await testRes.json();
            let currentTest = null;
            if (Array.isArray(testData) && testData.length > 0) {
                const now = new Date();
                currentTest = testData.find(t => new Date(t.end_time) > now);
                setActiveTest(currentTest);
            }

            // Calculate unread count (Include Anns, Achs, and Tests)
            const lastViewed = localStorage.getItem('lastNotificationViewed') || 0;
            let newItems = sorted.filter(a => new Date(a.created_at).getTime() > lastViewed).length;
            newItems += achData.filter(a => new Date(a.created_at).getTime() > lastViewed).length;
            if (currentTest && new Date(currentTest.created_at).getTime() > lastViewed) newItems++;
            setUnreadCount(newItems);

        } catch (err) { console.error('Error fetching home data', err); }
    };

    useEffect(() => {
        fetchData();
        const lastToastTime = localStorage.getItem('lastToastTime');
        const now = Date.now();
        if (!lastToastTime || (now - parseInt(lastToastTime)) > 3600000) {
            setTimeout(() => setShowToast(true), 2000);
            localStorage.setItem('lastToastTime', now.toString());
        }
    }, []);

    const openNotifications = () => {
        setActiveModal('notifications');
        setUnreadCount(0);
        localStorage.setItem('lastNotificationViewed', Date.now().toString());
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!rollNumber || !password) { setMessage('Please enter credentials.'); return; }
        try {
            const statusRes = await fetch(`/api/student/status?roll_number=${rollNumber}`);
            const statusData = await statusRes.json();
            const endpoint = statusData.isIn ? '/api/student/exit' : '/api/student/entry';
            const action = statusData.isIn ? 'EXIT' : 'ENTRY';

            const res = await fetch(endpoint, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roll_number: rollNumber, password })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Success: ${action} Marked. ${data.message}`);
                setRollNumber('');
                setPassword('');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (err) { setMessage('Server Error. Please try again.'); }
    };

    const handlePortalLogin = async (target = 'portal') => {
        if (!rollNumber || !password) { setMessage('Enter Roll No & Password'); return; }
        try {
            const res = await fetch('/api/student/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roll_number: rollNumber, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('student', JSON.stringify(data.student));
                if (target === 'test' && activeTest) {
                    navigate(`/student/test/${activeTest.id}`);
                } else {
                    navigate('/student/portal');
                }
            } else { setMessage(data.message); }
        } catch (err) { setMessage('Login Error'); }
    };

    // Auto-scroll to message if it exists
    useEffect(() => {
        if (message) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // alert(message); // Optional: Uncomment if user still misses it
        }
    }, [message]);

    // Modal Component
    const Modal = ({ title, onClose, children }) => (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>×</button>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{title}</h3>
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>{children}</div>
            </div>
        </div>
    );

    // Toggle State for Login Form
    const [loginMode, setLoginMode] = useState('attendance'); // 'attendance', 'portal', 'test'

    return (
        <div className="layout-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">
                    KIRUTHIGA INSTITUTE<span style={{ color: 'var(--accent)' }}>.</span>
                </div>
                <div className="nav-links">
                    <button className="nav-btn-pill" onClick={() => setActiveModal('about')}>ℹ️ About Us</button>
                    <button className="nav-btn-pill" onClick={() => setActiveModal('contact')}>📞 Contact</button>
                    <button className="nav-btn-pill" onClick={() => setActiveModal('achievements')}>🏆 Achievements</button>
                    <button className="btn btn-primary" style={{ marginLeft: '1rem' }} onClick={() => navigate('/admin')}>Admin Portal</button>
                </div>
            </nav>

            <div className="home-container">
                <div className="hero-grid">
                    <div className="welcome-content">
                        <h2>Master Typewriting<br /> with <span style={{ color: 'var(--secondary)' }}>Precision.</span></h2>
                        <p>Premier Government Technical Institute. Join 2000+ certified students.</p>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn btn-primary" onClick={() => navigate('/practice')}>
                                ⌨️ Live Typing Practice
                            </button>
                            <button className="btn btn-outline badge-btn" onClick={openNotifications}>
                                🔔 Notifications
                                {unreadCount > 0 && <span className="badge-count whatsapp-style">{unreadCount}</span>}
                            </button>
                        </div>
                    </div>

                    <div className="login-wrapper">
                        <div className="login-card">
                            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Student Access</h3>

                            {/* Toggle Switch */}
                            <div className="form-toggle">
                                <button className={`toggle-btn ${loginMode === 'attendance' ? 'active' : ''}`} onClick={() => setLoginMode('attendance')}>Attendance</button>
                                <button className={`toggle-btn ${loginMode === 'portal' ? 'active' : ''}`} onClick={() => setLoginMode('portal')}>Portal</button>
                            </div>

                            {activeTest && (
                                <div style={{ margin: '1rem 0', padding: '0.5rem', background: '#FEF2F2', border: '1px solid #EF4444', borderRadius: '4px', textAlign: 'center', cursor: 'pointer' }}
                                    onClick={() => setLoginMode('test')}>
                                    <div style={{ color: '#DC2626', fontWeight: 'bold' }}>🔴 Live Test Available</div>
                                    <div style={{ fontSize: '0.8rem' }}>{activeTest.title}</div>
                                    <div style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>Click here to Login & Join</div>
                                </div>
                            )}

                            {message && <div className={message.includes('Success') ? 'alert-success' : 'alert-danger'} style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px', background: message.includes('Success') ? '#dcfce7' : '#fee2e2', color: message.includes('Success') ? '#166534' : '#991b1b', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

                            <form onSubmit={loginMode === 'attendance' ? handleLogin : (e) => { e.preventDefault(); handlePortalLogin(loginMode === 'test' ? 'test' : 'portal'); }}>
                                {loginMode === 'test' && <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '0.5rem', color: '#DC2626' }}>Login to Start Test</div>}
                                <div className="form-group">
                                    <label className="form-label">Roll Number</label>
                                    <input className="form-control" onChange={(e) => setRollNumber(e.target.value)} required placeholder="Ex: 2026001" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} required placeholder="******" />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                                    {loginMode === 'attendance' ? 'Mark In/Out' : (loginMode === 'test' ? 'Start Test' : 'Login to Portal')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FEATURED ACHIEVEMENTS SECTION */}
                {achievements.length > 0 && (
                    <div className="achievements-section">
                        <div className="section-header">
                            <h3 className="section-title">Institutional Highlights 🏆</h3>
                            <button className="view-all-btn" onClick={() => setActiveModal('achievements')}>View All Achievements</button>
                        </div>
                        <div className="achievements-peek">
                            {achievements.slice(0, 3).map((ach) => (
                                <div key={ach.id} className="peek-card" onClick={() => setActiveModal('achievements')}>
                                    <div className="peek-img-wrapper">
                                        <img
                                            src={ach.image ? ach.image : 'https://via.placeholder.com/400x250?text=KT+Institute'}
                                            alt={ach.title}
                                        />
                                    </div>
                                    <div className="peek-content">
                                        <h4>{ach.title}</h4>
                                        <p>{ach.description.length > 80 ? ach.description.substring(0, 80) + '...' : ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {activeModal === 'about' && (
                <Modal title="About Us" onClose={() => setActiveModal(null)}>
                    <p style={{ lineHeight: '1.6', color: '#555', whiteSpace: 'pre-wrap' }}>
                        {settings.about_us || 'Loading...'}
                        <br /><br />
                        <strong>Institute:</strong> {settings.institute_name}
                    </p>
                </Modal>
            )}

            {activeModal === 'contact' && (
                <Modal title="Contact Details" onClose={() => setActiveModal(null)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#444' }}>
                        <p><strong>📍 Address:</strong> {settings.address || 'Loading...'}</p>
                        <p><strong>📞 Phone:</strong> {settings.contact_phone || 'Loading...'}</p>
                        <p><strong>✉️ Email:</strong> {settings.email || 'Loading...'}</p>
                        <p style={{ color: 'green' }}>Open: Mon - Sat (6 AM - 8 PM)</p>
                    </div>
                </Modal>
            )}

            {activeModal === 'achievements' && (
                <Modal title="Achievements Gallery" onClose={() => setActiveModal(null)}>
                    {achievements.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#8E8E8E' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                            <p>No achievements posted yet.</p>
                        </div>
                    ) : (
                        <div className="achievement-grid">
                            {achievements.map(ach => (
                                <div key={ach.id} className="achievement-card">
                                    <img
                                        src={ach.image ? ach.image : 'https://via.placeholder.com/400?text=Achievement'}
                                        alt={ach.title}
                                        className="achievement-img"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; }}
                                    />
                                    <div className="achievement-body">
                                        <div className="achievement-title">{ach.title}</div>
                                        <div className="achievement-desc">{ach.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal>
            )}

            {activeModal === 'notifications' && (
                <Modal title="Kiruthiga Technical (Updates)" onClose={() => setActiveModal(null)}>
                    <div className="whatsapp-feed">
                        <div className="wa-banner">Today</div>

                        {activeTest && (
                            <div className="wa-message wa-incoming">
                                <div className="wa-bubble">
                                    <div className="wa-header">Institutional Assessment</div>
                                    <p>New <strong>{activeTest.title}</strong> is now live! 📝</p>
                                    <div className="wa-footer">
                                        <button className="wa-btn-link" onClick={() => { setActiveModal(null); setLoginMode('test'); }}>Take Test Now</button>
                                        <span className="wa-time">Just now <span className="wa-check">✓✓</span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {announcements.length === 0 && !activeTest ? (
                            <div className="wa-empty">
                                <p>No new updates today. Keep practicing! ⌨️</p>
                            </div>
                        ) : (
                            announcements.map((ann, index) => (
                                <div key={ann.id} className="wa-message wa-incoming" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="wa-bubble">
                                        <div className="wa-header">Announcement</div>
                                        <p><strong>{ann.title}</strong></p>
                                        <p>{ann.message}</p>
                                        {ann.link && (
                                            <div className="wa-link-preview">
                                                <a href={ann.link} target="_blank" rel="noreferrer">Open Link 🔗</a>
                                            </div>
                                        )}
                                        <div className="wa-footer">
                                            <span className="wa-time">
                                                {new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                <span className="wa-check">✓✓</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#999', marginTop: '1rem' }}>
                            🔒 Messages are synced with the Institute database
                        </div>
                    </div>
                </Modal>
            )}
            {showToast && (announcements.length > 0 || activeTest) && (
                <div className="instagram-toast" onClick={(e) => { e.stopPropagation(); openNotifications(); setShowToast(false); }}>
                    <div className="notification-avatar" style={{ width: '40px', height: '40px', margin: 0 }}>
                        <div className="notification-avatar-inner" style={{ fontSize: '0.9rem' }}>KT</div>
                    </div>
                    <div style={{ flex: 1, fontSize: '0.85rem' }}>
                        <span className="notification-user">Kiruthiga Technical</span>
                        posted a new update.
                    </div>
                    <button className="close-toast" onClick={(e) => { e.stopPropagation(); setShowToast(false); }}>×</button>
                </div>
            )}
        </div>
    );
};

export default Home;
