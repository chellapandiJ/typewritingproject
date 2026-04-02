import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('login'); // 'login' or 'reset'
    const [formData, setFormData] = useState({ username: '', password: '', new_password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.username, password: formData.password })
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/dashboard');
            } else {
                setIsError(true);
                setMessage(data.message);
            }
        } catch (err) {
            setIsError(true);
            setMessage('Server connection failed');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('/api/admin/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.username, new_password: formData.new_password })
            });
            const data = await res.json();
            if (res.ok) {
                setIsError(false);
                setMessage('Password Updated! Please Login.');
                setView('login');
                setFormData({ ...formData, password: '', new_password: '' });
            } else {
                setIsError(true);
                setMessage(data.message);
            }
        } catch (err) {
            setIsError(true);
            setMessage('Update failed');
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card">
                <div className="login-header">
                    <h2>Admin Portal</h2>
                    <p style={{ color: '#64748B' }}>Kiruthiga Institute</p>
                </div>

                {message && <div style={{ color: isError ? 'red' : 'green', textAlign: 'center', marginBottom: '1rem', background: isError ? '#FEF2F2' : '#F0FDFA', padding: '0.5rem', borderRadius: '4px' }}>{message}</div>}

                {view === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username</label>
                            <input className="form-control" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                            <input className="form-control" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
                        <a className="forgot-link" onClick={() => setView('reset')} style={{ cursor: 'pointer', display: 'block', textAlign: 'center', marginTop: '1rem', color: '#3B82F6' }}>Forgot / Update Password?</a>
                    </form>
                ) : (
                    <form onSubmit={handleReset}>
                        <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>Reset Password</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username</label>
                            <input className="form-control" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required placeholder="Enter Username" />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Password</label>
                            <input className="form-control" type="password" value={formData.new_password} onChange={(e) => setFormData({ ...formData, new_password: e.target.value })} required placeholder="Enter New Password" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
                        <a className="forgot-link" onClick={() => setView('login')} style={{ cursor: 'pointer', display: 'block', textAlign: 'center', marginTop: '1rem', color: '#64748B' }}>← Back to Login</a>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
