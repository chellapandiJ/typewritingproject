import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // Import the new Premium CSS

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => navigate('/');

    // Render Content Based on Active Tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardStats />;
            case 'students': return <StudentManager />;
            case 'staff': return <StaffManager />;
            case 'machines': return <MachineManager />;
            case 'attendance_report': return <AttendanceReport />;
            case 'admission_report': return <AdmissionReport />;
            case 'fees': return <FeesManager />;
            case 'announcements': return <AnnouncementManager />;
            case 'tests': return <TestManager />;
            case 'profile': return <ProfileManager />;
            case 'achievements': return <AchievementManager />;
            case 'settings': return <SettingsManager />;
            default: return <DashboardStats />;
        }
    };

    return (
        <div className="admin-layout">
            {/* Premium Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin Portal</h2>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>Kiruthiga Institute</p>
                </div>

                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><span>📊</span> Dashboard</button>
                    <button className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}><span>👨‍🎓</span> Student Management</button>
                    <button className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}><span>👔</span> Staff Management</button>
                    <button className={`nav-item ${activeTab === 'machines' ? 'active' : ''}`} onClick={() => setActiveTab('machines')}><span>⌨️</span> Machine Management</button>
                    <button className={`nav-item ${activeTab === 'attendance_report' ? 'active' : ''}`} onClick={() => setActiveTab('attendance_report')}><span>📋</span> Attendance Report</button>
                    <button className={`nav-item ${activeTab === 'admission_report' ? 'active' : ''}`} onClick={() => setActiveTab('admission_report')}><span>📄</span> Admission Report</button>
                    <button className={`nav-item ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}><span>💰</span> Fees Management</button>
                    <button className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}><span>📢</span> Announcement</button>
                    <button className={`nav-item ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}><span>📝</span> Online Live Test</button>
                    <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><span>👤</span> Profile</button>
                    <button className={`nav-item ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}><span>🏆</span> Achievements</button>
                    <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><span>⚙️</span> Settings</button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn-styled" onClick={handleLogout}><span>🚪</span> Secure Logout</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-bar">
                    <h1>{activeTab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
                    <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </header>
                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

// --- Sub-Components ---

const DashboardStats = () => {
    const [stats, setStats] = useState({ total_students: 0, tamil_students: 0, english_students: 0, total_machines: 0, daily_attendance: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/common/stats');
                setStats(await res.json());
            } catch (e) { console.error(e); }
        };
        fetchStats();
    }, []);

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{stats.total_students}</div>
                <div className="stat-trend" style={{ background: '#DCFCE7', color: '#166534' }}>Active Learners</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Tamil Students</div>
                <div className="stat-value">{stats.tamil_students}</div>
                <div className="stat-trend" style={{ background: '#FEF9C3', color: '#854D0E' }}>Tamil Typewriting</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">English Students</div>
                <div className="stat-value">{stats.english_students}</div>
                <div className="stat-trend" style={{ background: '#DBEAFE', color: '#1E40AF' }}>English Typewriting</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Total Machines</div>
                <div className="stat-value">{stats.total_machines}</div>
                <div className="stat-trend" style={{ background: '#FCE7F3', color: '#9D174D' }}>Machines Inventory</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Daily Attendance</div>
                <div className="stat-value">{stats.daily_attendance}</div>
                <div className="stat-trend" style={{ background: '#E0E7FF', color: '#3730A3' }}>Present Today</div>
            </div>
        </div>
    );
};

// --- MACHINE MANAGER ---
const MachineManager = () => {
    const [machines, setMachines] = useState([]);
    const [newMachine, setNewMachine] = useState({ machine_no: '', type: 'English' });

    useEffect(() => { fetchMachines(); }, []);

    const fetchMachines = async () => {
        try {
            const res = await fetch('/api/common/machines');
            const data = await res.json();
            setMachines(data);
        } catch (err) { console.error(err); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await fetch('/api/common/machines/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMachine)
            });
            setNewMachine({ machine_no: '', type: 'English' });
            fetchMachines();
        } catch (err) { alert('Error adding machine'); }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Repair' : 'Active';
        try {
            await fetch(`/api/common/machines/status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchMachines(); // Refresh to see red/green change
        } catch (err) { alert('Error updating status'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete machine?')) return;
        try {
            await fetch(`/api/common/machines/delete/${id}`, { method: 'DELETE' });
            fetchMachines();
        } catch (err) { alert('Failed to delete'); }
    };

    return (
        <div className="content-card">
            <h3>Machine Management</h3>
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>

                {/* Add Machine Form */}
                <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#1E293B' }}>Add New Machine</h4>
                    <form onSubmit={handleAdd}>
                        <div className="form-group">
                            <label className="form-label">Machine No / ID</label>
                            <input className="form-control" value={newMachine.machine_no} onChange={e => setNewMachine({ ...newMachine, machine_no: e.target.value })} required placeholder="Ex: TW-01, TW-T01" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select className="form-control" value={newMachine.type} onChange={e => setNewMachine({ ...newMachine, type: e.target.value })}>
                                <option value="English">English</option>
                                <option value="Tamil">Tamil</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>+ Add Machine</button>
                    </form>
                </div>

                {/* Machine List Grid */}
                <div>
                    <h4 style={{ marginBottom: '1rem', color: '#1E293B' }}>Inventory Status</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                        {machines.map(m => (
                            <div key={m.id} style={{
                                background: m.status === 'Repair' ? '#FEF2F2' : 'white',
                                border: `1px solid ${m.status === 'Repair' ? '#EF4444' : '#E2E8F0'}`,
                                padding: '1rem', borderRadius: '12px', textAlign: 'center', position: 'relative',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: m.status === 'Repair' ? '#991B1B' : '#1E293B' }}>{m.machine_no}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.5rem' }}>{m.type}</div>

                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.8rem' }}>
                                    <button
                                        className="btn-sm"
                                        style={{
                                            background: m.status === 'Active' ? '#DCFCE7' : '#FEE2E2',
                                            color: m.status === 'Active' ? '#166534' : '#991B1B',
                                            border: '1px solid transparent',
                                            fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer'
                                        }}
                                        onClick={() => toggleStatus(m.id, m.status)}
                                    >
                                        {m.status === 'Active' ? 'Set Repair' : 'Set Active'}
                                    </button>
                                    <button
                                        className="btn-sm"
                                        style={{ background: 'white', border: '1px solid #CBD5E1', color: '#EF4444', borderRadius: '4px', cursor: 'pointer' }}
                                        onClick={() => handleDelete(m.id)}
                                        title="Delete Machine"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StudentManager = () => {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', father_name: '', phone: '', father_phone: '', email: '',
        dob: '', address: '', gender: 'Male', course: 'English Lower', timing: '10:00 AM - 11:00 AM', admission_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => { fetchStudents(); }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/student/all');
            const data = await res.json();
            setStudents(data);
        } catch (err) { console.error(err); }
    };

    // Slot Picker State
    const [showSlotPicker, setShowSlotPicker] = useState(false);
    const [slotData, setSlotData] = useState({ machines: [], allocations: [] });

    const openSlotPicker = async () => {
        const mRes = await fetch('/api/common/machines');
        const sRes = await fetch('/api/student/all');
        const machines = await mRes.json();
        const students = await sRes.json();

        // Convert students allocation to simple array
        // Expected Logic: Students have allocated_machine_id and timing
        const allocations = students.filter(s => s.allocated_machine_id).map(s => ({
            roll_number: s.roll_number,
            name: s.name,
            allocated_machine_id: s.allocated_machine_id,
            timing: s.timing
        }));

        setSlotData({ machines, allocations });
        setShowSlotPicker(true);
    };

    const handleSlotSelect = (machine, hour) => {
        // Format: "10:00 AM - 11:00 AM"
        const startTime = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        const endTime = `${(hour + 1) > 12 ? (hour + 1) - 12 : (hour + 1)}:00 ${(hour + 1) >= 12 ? 'PM' : 'AM'}`;
        const fullTiming = `${startTime} - ${endTime}`;

        setFormData({
            ...formData,
            allocated_machine_id: machine.id,
            timing: fullTiming
        });
        setShowSlotPicker(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const url = isEditing ? `/api/student/update/${editId}` : '/api/student/create';
        try {
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Success! ${isEditing ? 'Updated' : 'Created'}. \n${!isEditing ? `Roll No: ${data.roll_number}\nPassword: ${data.password}` : ''}`);
                setShowForm(false);
                setIsEditing(false);
                setFormData({ name: '', father_name: '', phone: '', father_phone: '', email: '', dob: '', address: '', gender: 'Male', course: 'English Lower', timing: '10:00 AM - 11:00 AM', admission_date: new Date().toISOString().split('T')[0] });
                fetchStudents();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) { alert('Failed to save student'); }
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            father_name: student.father_name,
            phone: student.phone,
            father_phone: student.father_phone || '',
            email: student.email || '',
            dob: student.dob ? student.dob.split('T')[0] : '',
            address: student.address || '',
            gender: student.gender || 'Male',
            course: student.course,
            timing: student.timing || '',
            admission_date: student.admission_date ? student.admission_date.split('T')[0] : ''
        });
        setEditId(student.id);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await fetch(`/api/student/delete/${id}`, { method: 'DELETE' });
            fetchStudents();
        } catch (err) { alert('Failed to delete'); }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        if (!window.confirm(`Change status to ${newStatus}?`)) return;
        try {
            await fetch(`/api/student/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchStudents();
        } catch (err) { alert('Failed to update status'); }
    };

    return (
        <div className="content-card">
            <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Student Management</h3>
                <button className="btn btn-primary" onClick={() => {
                    setShowForm(!showForm);
                    setIsEditing(false);
                    setFormData({ name: '', father_name: '', phone: '', father_phone: '', email: '', dob: '', address: '', gender: 'Male', course: 'English Lower', timing: '10:00 AM - 11:00 AM', admission_date: new Date().toISOString().split('T')[0] });
                }}>
                    {showForm ? 'Cancel' : '+ Add New Student'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ marginBottom: '1.5rem', color: '#1E293B' }}>{isEditing ? 'Edit Student Details' : 'New Student Registration'}</h4>
                    <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

                        {/* Personal Info */}
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input type="date" className="form-control" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Residential Address</label>
                            <textarea className="form-control" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows="2"></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <select className="form-control" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Contact Info */}
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email ID</label>
                            <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>

                        {/* Parent Info */}
                        <div className="form-group">
                            <label className="form-label">Parent/Guardian Name</label>
                            <input className="form-control" value={formData.father_name} onChange={(e) => setFormData({ ...formData, father_name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Parent Phone</label>
                            <input className="form-control" value={formData.father_phone} onChange={(e) => setFormData({ ...formData, father_phone: e.target.value })} />
                        </div>

                        {/* Course Info */}
                        <div className="form-group">
                            <label className="form-label">Course Selection</label>
                            <select className="form-control" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}>
                                <option value="English Lower">English Lower</option>
                                <option value="English Higher">English Higher</option>
                                <option value="Tamil Lower">Tamil Lower</option>
                                <option value="Tamil Higher">Tamil Higher</option>
                                <option value="Both Higher">Both Higher</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Batch Logic</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ flex: 1, padding: '0.8rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white' }}>
                                    {formData.timing ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><strong>Selected:</strong> {formData.timing}</span>
                                            <span style={{ fontSize: '0.8rem', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>Machine Assigned</span>
                                        </div>
                                    ) : <span style={{ color: '#94A3B8' }}>No Slot Selected</span>}
                                </div>
                                <button type="button" className="btn btn-outline" onClick={openSlotPicker}>Select Machine Slot 📅</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Admission Date</label>
                            <input type="date" className="form-control" value={formData.admission_date} onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                        {isEditing ? 'Update Student Details' : 'Register Student'}
                    </button>
                </form>
            )
            }

            {/* SLOT PICKER MODAL (Refined: Time Rows x Machine Columns) */}
            {
                showSlotPicker && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', width: '98%', maxWidth: '1400px', height: '90vh', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <h3>Select Machine Slot</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Select a Green slot to book. Red columns are machines in Repair.</p>
                                </div>
                                <button onClick={() => setShowSlotPicker(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            </div>

                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 16, height: 16, background: '#DCFCE7', borderRadius: 4, border: '1px solid #86EFAC' }}></div> Available</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 16, height: 16, background: '#FEF9C3', borderRadius: 4, border: '1px solid #FDE047' }}></div> Booked (Roll No)</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 16, height: 16, background: '#FEE2E2', borderRadius: 4, border: '1px solid #FCA5A5' }}></div> Repair / Inactive</div>
                            </div>

                            <div className="slot-grid-container" style={{ flex: 1, overflow: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
                                    <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#F8FAFC' }}>
                                        <tr>
                                            <th style={{ padding: '10px', background: '#F1F5F9', position: 'sticky', left: 0, zIndex: 20, borderRight: '2px solid #E2E8F0', borderBottom: '2px solid #E2E8F0' }}>Time / Machine</th>
                                            {slotData.machines.map(m => (
                                                <th key={m.id} style={{
                                                    padding: '8px',
                                                    minWidth: '60px',
                                                    background: m.status === 'Repair' ? '#FEF2F2' : '#F8FAFC',
                                                    borderBottom: m.status === 'Repair' ? '2px solid #EF4444' : '2px solid #E2E8F0',
                                                    color: m.status === 'Repair' ? '#991B1B' : '#1E293B'
                                                }}>
                                                    <div>{m.machine_no}</div>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 'normal' }}>{m.type}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(h => {
                                            const displayTime = `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`;
                                            return (
                                                <tr key={h} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                                    <td style={{
                                                        padding: '8px', fontWeight: 'bold', background: '#F8FAFC',
                                                        position: 'sticky', left: 0, zIndex: 10,
                                                        borderRight: '2px solid #E2E8F0', whiteSpace: 'nowrap'
                                                    }}>
                                                        {displayTime} - {(h + 1) > 12 ? (h + 1) - 12 : (h + 1)} {h + 1 >= 12 ? 'PM' : 'AM'}
                                                    </td>
                                                    {slotData.machines.map(m => {
                                                        const isRepair = m.status === 'Repair';

                                                        // Check Allocation
                                                        // Format match: "10:00 AM" starts with "10"
                                                        const hourStart = h > 12 ? h - 12 : h;
                                                        const hourStr = `${hourStart}:`;

                                                        const allocation = slotData.allocations.find(a =>
                                                            a.allocated_machine_id === m.id &&
                                                            a.timing &&
                                                            a.timing.startsWith(hourStr) &&
                                                            a.timing.includes(h >= 12 ? 'PM' : 'AM')
                                                        );

                                                        let bg = isRepair ? '#FEF2F2' : '#DCFCE7'; // Red Row or Green
                                                        let content = '';
                                                        let cursor = isRepair ? 'not-allowed' : 'pointer';

                                                        if (allocation) {
                                                            bg = '#FEF9C3'; // Yellow
                                                            content = allocation.roll_number; // Show Roll No
                                                            cursor = 'not-allowed';
                                                        }

                                                        // Highlight selected slot
                                                        const isSelected = formData.allocated_machine_id === m.id && formData.timing.startsWith(`${hourStart}:`) && formData.timing.includes(h >= 12 ? 'PM' : 'AM');
                                                        if (isSelected) {
                                                            bg = '#3B82F6'; // Blue selected
                                                            content = 'Selected';
                                                        }

                                                        return (
                                                            <td
                                                                key={m.id}
                                                                onClick={() => { if (!isRepair && !allocation) handleSlotSelect(m, h); }}
                                                                style={{
                                                                    padding: '4px', background: bg,
                                                                    borderRight: '1px solid #F1F5F9',
                                                                    cursor: cursor, height: '45px', fontSize: '0.75rem', color: isSelected ? 'white' : 'inherit'
                                                                }}
                                                                title={allocation ? `${allocation.name} (${allocation.roll_number})` : (isRepair ? 'Machine Repair' : 'Available')}
                                                            >
                                                                {content}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }

            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Roll No</th>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Course</th>
                        <th style={{ padding: '1rem' }}>Timing</th>
                        <th style={{ padding: '1rem' }}>Phone</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '1rem', fontWeight: 'bold', color: '#3B82F6' }}>{student.roll_number}</td>
                            <td style={{ padding: '1rem' }}>{student.name}</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{student.course}</span>
                            </td>
                            <td style={{ padding: '1rem' }}>{student.timing || '-'}</td>
                            <td style={{ padding: '1rem' }}>{student.phone}</td>
                            <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-sm btn-outline" onClick={() => handleEdit(student)}>✏️</button>
                                <button className="btn-sm btn-outline" style={{ color: student.status === 'Active' ? 'orange' : 'green', borderColor: 'currentColor' }} onClick={() => toggleStatus(student.id, student.status)}>
                                    {student.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button className="btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleDelete(student.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};

const FeesManager = () => {
    const [view, setView] = useState('pending'); // pending, history
    const [dailyReport, setDailyReport] = useState([]);
    const [pendingList, setPendingList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [formData, setFormData] = useState({ student_id: '', amount: '', payment_mode: 'Cash', remarks: '', fee_month: new Date().toISOString().slice(0, 7) });
    const [students, setStudents] = useState([]);
    const [receiptData, setReceiptData] = useState(null); // For Receipt Modal

    useEffect(() => {
        fetchDailyReport();
        fetchPendingFees();
        fetchStudents();
    }, [selectedMonth]);

    const fetchDailyReport = async () => {
        const res = await fetch('/api/fees/daily');
        setDailyReport(await res.json());
    };

    const fetchPendingFees = async () => {
        const res = await fetch(`/api/fees/pending?month=${selectedMonth}`);
        setPendingList(await res.json());
    };

    const fetchStudents = async () => {
        const res = await fetch('/api/student/all');
        const data = await res.json();
        setStudents(data);
    };

    const handlePay = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/fees/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                // Show Receipt Modal
                const student = students.find(s => s.id == formData.student_id);
                setReceiptData({
                    ...formData,
                    receipt_no: data.receipt_no,
                    student_name: student?.name,
                    roll_number: student?.roll_number,
                    course: student?.course,
                    date: new Date().toLocaleString()
                });

                alert('Fee Collected Successfully!');
                setShowForm(false);
                fetchDailyReport();
                fetchPendingFees();
            } else { alert('Error: ' + data.error); }
        } catch (err) { alert('Error processing payment'); }
    };

    const sendEmailReceipt = async () => {
        alert(`Receipt emailed to student! (Simulation)\nTo: ${receiptData.student_name}\nReceipt: ${receiptData.receipt_no}`);
    };

    return (
        <div className="content-card">
            {/* View Switching Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <button className={`btn ${view === 'pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('pending')}>⚠️ Pending Fees</button>
                <button className={`btn ${view === 'history' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('history')}>📜 Collection History</button>
                <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowForm(true)}>+ Collect Fee</button>
            </div>

            {/* Receipt Modal */}
            {receiptData && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px', textAlign: 'center' }}>
                        <div style={{ border: '2px solid #059669', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 10px', color: '#059669', fontWeight: 'bold' }}>✅ Payment Success</div>
                            <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Kiruthiga Institute</h3>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Vikkiramangalam Main Road, Madurai</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>+91 98765 43210 | help@kiruthiga.edu</div>
                            <hr style={{ margin: '1rem 0', borderColor: '#E2E8F0' }} />
                            <div style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: '1.6', position: 'relative' }}>
                                {/* Watermark or Background Logo could go here */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Receipt No:</span>
                                    <strong>{receiptData.receipt_no}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Date:</span>
                                    <span>{receiptData.date}</span>
                                </div>
                                <hr style={{ borderColor: '#E2E8F0', margin: '0.5rem 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Student Name:</span>
                                    <strong>{receiptData.student_name}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Roll Number:</span>
                                    <span>{receiptData.roll_number}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Course:</span>
                                    <span>{receiptData.course}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Fee Month:</span>
                                    <span>{receiptData.fee_month}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Payment Mode:</span>
                                    <span>{receiptData.payment_mode}</span>
                                </div>
                                <hr style={{ borderStyle: 'dashed', borderColor: '#E2E8F0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#059669' }}>
                                    <span>Total Paid:</span>
                                    <strong>₹{receiptData.amount}</strong>
                                </div>
                            </div>

                            {/* Signature Area */}
                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', color: '#059669' }}>✓</div>
                                    <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 'bold' }}>PAID</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'Cursive', fontSize: '1.2rem', color: '#1E293B', marginBottom: '-5px' }}>Boobalan</div>
                                    <hr style={{ width: '100px', borderColor: '#94A3B8' }} />
                                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Authorized Signature</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => window.print()}>🖨️ Print</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={sendEmailReceipt}>📧 Email Student</button>
                            </div>
                            <button style={{ marginTop: '1rem', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#64748B' }} onClick={() => setReceiptData(null)}>Close Receipt</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Collect Fee Form */}
            {
                showForm && (
                    <div style={{ background: '#F0FDFA', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #CCFBF1' }}>
                        <h4 style={{ marginBottom: '1rem', color: '#0F766E' }}>New Fee Collection</h4>
                        <form onSubmit={handlePay} className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            <div className="form-group">
                                <label className="form-label">Select Student</label>
                                <select className="form-control" onChange={e => setFormData({ ...formData, student_id: e.target.value })} required>
                                    <option value="">-- Choose Student --</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fee Month</label>
                                <input type="month" className="form-control" value={formData.fee_month} onChange={e => setFormData({ ...formData, fee_month: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount (₹)</label>
                                <input type="number" className="form-control" onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payment Mode</label>
                                <select className="form-control" onChange={e => setFormData({ ...formData, payment_mode: e.target.value })}>
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI / GPay</option>
                                    <option value="Bank">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Remarks</label>
                                <input className="form-control" placeholder="Optional remarks" onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                                <button className="btn btn-primary" style={{ flex: 1 }}>Collect & Generate Receipt</button>
                                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )
            }

            {/* Content Views */}
            {
                view === 'pending' ? (
                    <div>
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <h4>Pending Fees for {selectedMonth}</h4>
                            <input type="month" className="form-control" style={{ width: 'auto' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
                        </div>
                        {pendingList.length === 0 ? <p style={{ color: '#059669', textAlign: 'center', padding: '2rem' }}>🎉 No Pending Fees for this month!</p> : (
                            <div className="grid-responsive">
                                {pendingList.map(s => (
                                    <div key={s.id} className="card" style={{ borderLeft: '4px solid #EF4444', padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                                        <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{s.roll_number}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>📞 {s.phone}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>✉️ {s.email}</div>
                                        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.9rem', color: '#DC2626' }}>Pending</div>
                                            <button className="btn-sm" style={{ background: '#DCFCE7', color: '#166534', border: 'none', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setFormData({ ...formData, student_id: s.id, amount: '', remarks: '' });
                                                    setShowForm(true);
                                                }}>Pay Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Receipt</th>
                                    <th>Date</th>
                                    <th>Student</th>
                                    <th>Month</th>
                                    <th>Amount</th>
                                    <th>Mode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyReport.map(fee => (
                                    <tr key={fee.id}>
                                        <td style={{ fontWeight: 'bold' }}>{fee.receipt_no}</td>
                                        <td>{new Date(fee.paid_on).toLocaleDateString()}</td>
                                        <td>{fee.name}<br /><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{fee.roll_number}</span></td>
                                        <td>{fee.fee_month || '-'}</td>
                                        <td style={{ color: '#059669', fontWeight: 'bold' }}>₹{fee.amount}</td>
                                        <td><span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px', fontSize: '0.75rem' }}>{fee.payment_mode}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div >
    );
};

const TestManager = () => {
    const [view, setView] = useState('list'); // list, create, leaderboard
    const [tests, setTests] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [formData, setFormData] = useState({ title: '', content: '', start_time: '', end_time: '' });

    useEffect(() => { fetchTests(); }, []);

    const fetchTests = async () => {
        const res = await fetch('/api/tests/all');
        const data = await res.json();
        setTests(data);
    };

    const fetchLeaderboard = async (testId) => {
        const res = await fetch(`/api/tests/results/${testId}`);
        const data = await res.json();
        setLeaderboard(data);
        setView('leaderboard');
    };

    const [showSuccess, setShowSuccess] = useState(null); // { id, link }

    const paragraphs = {
        Beginner: [
            "The quick brown fox jumps over the lazy dog. Programming is fun.",
            "Typewriting is a skill that requires practice and patience.",
            "Apple, Banana, Cherry, Date, Elderberry, Fig, Grape, Honeydew."
        ],
        Intermediate: [
            "Technology is evolving at a rapid pace. Artificial Intelligence and Machine Learning are changing the world. It is essential to keep learning active.",
            "Success is not final, failure is not fatal: It is the courage to continue that counts. Winston Churchill said this famous quote about resilience.",
            "The internet has connected the world in ways previously unimagined. Information is now available at our fingertips, transforming education and business."
        ],
        Advanced: [
            "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's metabolic activities.",
            "In computer science, a data structure is a data organization, management, and storage format that is usually chosen for efficient access to data. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.",
            "The theory of relativity usually encompasses two interrelated theories by Albert Einstein: special relativity and general relativity. Special relativity applies to all physical phenomena in the absence of gravity."
        ]
    };

    const generateParagraph = () => {
        const level = formData.difficulty || 'Intermediate';
        const opts = paragraphs[level];
        const random = opts[Math.floor(Math.random() * opts.length)];
        setFormData({ ...formData, content: random });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Generate a unique ID first for the link (or let DB do it and get ID back)
            // We'll let DB do it.
            const res = await fetch('/api/tests/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, test_link: '' }) // Link generatd below
            });
            const data = await res.json();

            if (res.ok) {
                // Construct Link
                const link = `${window.location.origin}/student/test/${data.id}`;
                // Update DB with link (Optional, but good for record)
                // For now, we just show it to the user.

                setShowSuccess({ link });
                setView('list');
                fetchTests();
            } else {
                alert('Failed to create test: ' + data.error);
            }
        } catch (err) { alert('Failed to create test'); }
    };

    return (
        <div className="content-card">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3>Online Test Portal</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${view === 'list' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('list')}>All Tests</button>
                    <button className={`btn ${view === 'create' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setView('create'); setFormData({ title: '', content: '', start_time: '', end_time: '' }); setShowSuccess(null); }}>+ Create Test</button>
                </div>
            </div>

            {showSuccess && (
                <div style={{ background: '#DCFCE7', border: '1px solid #166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <strong style={{ color: '#166534' }}>✓ Test Created Successfully!</strong>
                        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Share this link: <u style={{ color: 'blue' }}>{showSuccess.link}</u></div>
                    </div>
                    <button className="btn-sm btn-primary" onClick={() => { navigator.clipboard.writeText(showSuccess.link); alert('Link Copied!'); }}>📋 Copy Link</button>
                </div>
            )}

            {view === 'create' && (
                <form onSubmit={handleCreate} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Create New Test Paper</h4>
                    <div className="form-group">
                        <label className="form-label">Test Title</label>
                        <input className="form-control" placeholder="Ex: Senior Grade Speed Test 1" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div className="dashboard-grid" style={{ marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Start Time</label>
                            <input type="datetime-local" className="form-control" onChange={e => setFormData({ ...formData, start_time: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Time</label>
                            <input type="datetime-local" className="form-control" onChange={e => setFormData({ ...formData, end_time: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Difficulty</label>
                            <select className="form-control" value={formData.difficulty || 'Intermediate'} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="flex-between">
                            <label className="form-label">Test Content</label>
                            <button type="button" className="btn-sm btn-outline" onClick={generateParagraph}>✨ Auto Generate Paragraph</button>
                        </div>
                        <textarea className="form-control" rows="10" placeholder="Paste or Generate content..." value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required></textarea>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Publish Test</button>
                </form>
            )}

            {view === 'list' && (
                <div className="grid-responsive">
                    {tests.map(t => (
                        <div key={t.id} className="card" style={{ borderLeft: '4px solid #3B82F6', position: 'relative' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{t.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.5rem 0' }}>
                                📅 {new Date(t.start_time).toLocaleString()} <br />
                                ⏱️ Duration: 10 Mins
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button className="btn-sm btn-outline" onClick={() => fetchLeaderboard(t.id)}>🏆 View Results</button>
                                <button className="btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }}>End / Delete</button>
                            </div>
                            {new Date() > new Date(t.end_time) && <span style={{ position: 'absolute', top: 10, right: 10, background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>Ended</span>}
                        </div>
                    ))}
                </div>
            )}

            {view === 'leaderboard' && (
                <div>
                    <button className="btn-sm btn-outline" style={{ marginBottom: '1rem' }} onClick={() => setView('list')}>← Back to Tests</button>
                    <h4 style={{ marginBottom: '1rem', color: '#CA8A04' }}>🏆 Top Performers</h4>
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: '#FEF9C3' }}>
                                <th>Rank</th>
                                <th>Student</th>
                                <th>Score</th>
                                <th>Speed (WPM)</th>
                                <th>Accuracy</th>
                                <th>Mistakes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center' }}>No results yet</td></tr> : null}
                            {leaderboard.map((r, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 'bold' }}>#{i + 1}</td>
                                    <td>{r.student_name} <br /><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{r.roll_number}</span></td>
                                    <td style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{r.score}</td>
                                    <td style={{ fontWeight: 'bold', color: '#166534' }}>{r.speed_wpm}</td>
                                    <td style={{ color: r.accuracy > 90 ? 'green' : 'orange' }}>{r.accuracy}%</td>
                                    <td style={{ color: 'red', fontWeight: 'bold' }}>{r.mistakes || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


// --- NEW MODULES ---

// --- NEW COMPONENTS ---

const StaffManager = () => {
    const [staff, setStaff] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', role: 'Instructor', address: '', gender: 'Male', dob: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => { fetchStaff(); }, []);

    const fetchStaff = async () => {
        const res = await fetch('/api/staff/all');
        setStaff(await res.json());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `/api/staff/update/${editId}` : '/api/staff/create';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Success! ${isEditing ? 'Updated' : 'Created'}. \n${!isEditing ? `Staff ID: ${data.staff_id}\nPassword: ${data.password}` : ''}`);
                setShowForm(false);
                setFormData({ name: '', phone: '', email: '', role: 'Instructor', address: '', gender: 'Male', dob: '' });
                setIsEditing(false);
                fetchStaff();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) { alert('Operation failed'); }
    };

    const handleEdit = (s) => {
        setFormData({ name: s.name, phone: s.phone, email: s.email, role: s.role, address: s.address || '', gender: s.gender || 'Male', dob: s.dob ? s.dob.split('T')[0] : '' });
        setEditId(s.id);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        await fetch(`/api/staff/delete/${id}`, { method: 'DELETE' });
        fetchStaff();
    };

    return (
        <div className="content-card">
            <div className="flex-between">
                <h3>Staff Management</h3>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setIsEditing(false); setFormData({ name: '', phone: '', email: '', role: 'Instructor', address: '', gender: 'Male', dob: '' }); }}>
                    {showForm ? 'Cancel' : '+ Add New Staff'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#334155' }}>{isEditing ? 'Edit Staff Details' : 'Onboard New Staff'}</h4>
                    <div className="dashboard-grid">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option>Instructor</option>
                                <option>Admin</option>
                                <option>Receptionist</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input type="date" className="form-control" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <select className="form-control" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Address</label>
                            <textarea className="form-control" rows="2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>{isEditing ? 'Update Staff' : 'Create Account'}</button>
                </form>
            )}

            <div className="grid-responsive">
                {staff.map(s => (
                    <div key={s.id} className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
                        <div className="flex-between">
                            <div>
                                <h4 style={{ margin: 0 }}>{s.name}</h4>
                                <span style={{ fontSize: '0.8rem', background: '#F3E8FF', color: '#7C3AED', padding: '2px 8px', borderRadius: '12px' }}>{s.role}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', color: '#4B5563' }}>{s.staff_id}</div>
                                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{s.phone}</div>
                            </div>
                        </div>
                        <hr style={{ margin: '1rem 0', borderColor: '#F3F4F6' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button className="btn-sm btn-outline" onClick={() => handleEdit(s)}>Edit</button>
                            <button className="btn-sm btn-outline" style={{ color: '#EF4444', borderColor: '#EF4444' }} onClick={() => handleDelete(s.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AttendanceReport = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchReport(); }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/common/attendance/monthly?month=${month}&year=${year}`);
            const data = await res.json();
            setReport(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const days = new Date(year, month, 0).getDate();
    const headers = Array.from({ length: days }, (_, i) => i + 1);

    return (
        <div className="content-card">
            <div className="flex-between">
                <h3>Monthly Attendance Report</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select className="form-control" value={month} onChange={e => setMonth(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>)}
                    </select>
                    <select className="form-control" value={year} onChange={e => setYear(e.target.value)}>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                    <button className="btn btn-primary" onClick={fetchReport}>Generate</button>
                    <button className="btn btn-outline" onClick={() => window.print()}>Print / PDF</button>
                </div>
            </div>

            {loading ? <p>Loading report...</p> : (
                <div style={{ overflowX: 'auto', marginTop: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'center' }}>
                        <thead style={{ background: '#F8FAFC' }}>
                            <tr>
                                <th style={{ padding: '8px', position: 'sticky', left: 0, background: '#F8FAFC', borderRight: '1px solid #E2E8F0', minWidth: '150px' }}>Student Name</th>
                                {headers.map(d => <th key={d} style={{ padding: '4px', border: '1px solid #E2E8F0', minWidth: '25px' }}>{d}</th>)}
                                <th style={{ padding: '8px' }}>Present</th>
                                <th style={{ padding: '8px' }}>Absent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                    <td style={{ padding: '8px', textAlign: 'left', position: 'sticky', left: 0, background: 'white', borderRight: '1px solid #E2E8F0' }}>
                                        <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{s.roll_number}</div>
                                    </td>
                                    {headers.map(d => {
                                        const status = s.days[d];
                                        let bg = 'white';
                                        let text = status;
                                        if (status === 'P') { bg = '#DCFCE7'; text = 'P'; }
                                        else if (status === 'A') { bg = '#FEE2E2'; text = 'A'; }
                                        else if (status === '-') { bg = '#F1F5F9'; text = '-'; } // Pending
                                        return (
                                            <td key={d} style={{ background: bg, border: '1px solid #F1F5F9', color: status === 'A' ? 'red' : 'green' }}>{text}</td>
                                        );
                                    })}
                                    <td style={{ fontWeight: 'bold' }}>{s.present_days}</td>
                                    <td style={{ color: 'red' }}>{s.total_working_days - s.present_days}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AdmissionReport = () => {
    const [students, setStudents] = useState([]);
    const [filter, setFilter] = useState({ month: '', course: 'All', status: 'Active' });

    useEffect(() => { fetchStudents(); }, []);

    const fetchStudents = async () => {
        const res = await fetch('/api/student/all');
        setStudents(await res.json());
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        if (!window.confirm(`Change status to ${newStatus}?`)) return;
        try {
            await fetch(`/api/student/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchStudents();
        } catch (err) { alert('Failed to update status'); }
    };

    const filtered = students.filter(s => {
        if (filter.status !== 'All' && s.status !== filter.status) return false;
        if (filter.course !== 'All' && s.course !== filter.course) return false;
        if (filter.month) {
            const admMonth = new Date(s.admission_date).getMonth() + 1;
            if (admMonth.toString() !== filter.month) return false;
        }
        return true;
    });

    return (
        <div className="content-card">
            <h3>Admission Report</h3>
            <div className="flex-between" style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select className="form-control" onChange={e => setFilter({ ...filter, month: e.target.value })}>
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>)}
                    </select>
                    <select className="form-control" onChange={e => setFilter({ ...filter, course: e.target.value })}>
                        <option value="All">All Courses</option>
                        <option value="English Lower">English Lower</option>
                        <option value="English Higher">English Higher</option>
                        <option value="Tamil Lower">Tamil Lower</option>
                    </select>
                    <select className="form-control" onChange={e => setFilter({ ...filter, status: e.target.value })}>
                        <option value="Active">Active Students</option>
                        <option value="Inactive">Inactive / Alumni</option>
                        <option value="All">All</option>
                    </select>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3B82F6' }}>Total: {filtered.length}</div>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Admission Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(s => (
                        <tr key={s.id}>
                            <td>{s.roll_number}</td>
                            <td>
                                <div>{s.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.phone}</div>
                            </td>
                            <td>{s.course}</td>
                            <td>{s.admission_date ? s.admission_date.split('T')[0] : '-'}</td>
                            <td>
                                <span style={{
                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                    background: s.status === 'Active' ? '#DCFCE7' : '#E2E8F0',
                                    color: s.status === 'Active' ? '#166534' : '#64748B',
                                    marginRight: '1rem', display: 'inline-block'
                                }}>{s.status}</span>
                                <button className="btn-sm btn-outline"
                                    style={{ fontSize: '0.7rem', padding: '2px 6px', height: 'auto', color: s.status === 'Active' ? 'orange' : 'green' }}
                                    onClick={() => toggleStatus(s.id, s.status)}>
                                    {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ProfileManager = () => {
    return <div className="content-card"><h3>Admin Profile</h3><p>Manage your profile details.</p></div>;
};


const BatchManager = () => {
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [machines, setMachines] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => { fetchBatches(); fetchMeta(); }, []);
    const fetchBatches = async () => { const res = await fetch('/api/common/batches'); setBatches(await res.json()); };
    const fetchMeta = async () => {
        setStudents(await (await fetch('/api/student/all')).json());
        setMachines(await (await fetch('/api/common/machines')).json());
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/common/batches/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        if (res.ok) { setShowForm(false); fetchBatches(); } else { alert('Error: Time Clash or Invalid Data'); }
    };

    return (
        <div className="card">
            <div className="flex-between"><h3>Batch Scheduling</h3><button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Assign Batch</button></div>
            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', background: '#F0FDFA', padding: '1rem' }}>
                    <div className="dashboard-grid">
                        <select className="form-control" onChange={e => setFormData({ ...formData, student_id: e.target.value })} required>
                            <option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>)}
                        </select>
                        <select className="form-control" onChange={e => setFormData({ ...formData, machine_id: e.target.value })} required>
                            <option value="">Select Machine</option>{machines.map(m => <option key={m.id} value={m.id}>{m.machine_no}</option>)}
                        </select>
                        <input type="time" className="form-control" onChange={e => setFormData({ ...formData, start_time: e.target.value })} required />
                        <input type="time" className="form-control" onChange={e => setFormData({ ...formData, end_time: e.target.value })} required />
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Assign Slot</button>
                </form>
            )}
            <table className="data-table"><thead><tr><th>Student</th><th>Machine</th><th>Time</th><th>Status</th></tr></thead><tbody>
                {batches.map(b => <tr key={b.id}><td>{b.student_name}</td><td>{b.machine_no}</td><td>{b.start_time} - {b.end_time}</td><td>Active</td></tr>)}
            </tbody></table>
        </div>
    );
};

const AnnouncementManager = () => {
    const [anns, setAnns] = useState([]);
    const [formData, setFormData] = useState({ title: '', message: '' });
    useEffect(() => { fetchAnns(); }, []);
    const fetchAnns = async () => { const res = await fetch('/api/common/announcements'); setAnns(await res.json()); };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/common/announcements/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert('Announcement posted to Home Page! 📢');
            setFormData({ title: '', message: '', link: '' });
            fetchAnns();
        } else {
            alert('Error posting announcement.');
        }
    };

    return (
        <div className="card">
            <h3>Announcements Board</h3>
            <form onSubmit={handleSubmit} style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input className="form-control" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <textarea className="form-control" placeholder="Message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required rows="3" />
                <input className="form-control" placeholder="Link / File URL (Optional)" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                <button className="btn btn-primary">Post Announcement</button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {anns.map(a => (
                    <div key={a.id} style={{ borderLeft: '4px solid var(--primary)', padding: '1rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4>{a.title}</h4>
                            <p>{a.message}</p>
                            {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'blue' }}>🔗 Attachment</a>}
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(a.created_at).toLocaleString()}</div>
                        </div>
                        <button className="btn-sm btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={async () => {
                            if (!window.confirm('Delete this announcement?')) return;
                            await fetch(`/api/common/announcements/${a.id}`, { method: 'DELETE' });
                            fetchAnns();
                        }}>🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
};



const AchievementManager = () => {
    const [achs, setAchs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => { fetchAchs(); }, []);
    const fetchAchs = async () => { const res = await fetch('/api/extra/achievements'); setAchs(await res.json()); };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (imageFile) formData.append('image', imageFile);

        const res = await fetch('/api/extra/achievements/add', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            alert('Achievement Added Successfully! 🏆');
            setTitle('');
            setDescription('');
            setImageFile(null);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            fetchAchs();
        } else {
            alert('Failed to add achievement. Please try again.');
        }
    };

    return (
        <div className="card">
            <h3>Achievements Gallery</h3>
            <form onSubmit={handleSubmit} style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input className="form-control" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <textarea className="form-control" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required rows="3" />
                <label className="form-label">Upload Photo (Optional)</label>
                <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                <button className="btn btn-primary">Add Achievement</button>
            </form>
            <div className="dashboard-grid">
                {achs.map(a => (
                    <div key={a.id} className="card" style={{ padding: '1rem', position: 'relative' }}>
                        {a.image && <img src={a.image} alt={a.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />}
                        <h4>{a.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>{a.description}</p>
                        <button className="btn-sm btn-outline" style={{ position: 'absolute', top: 10, right: 10, color: 'red', borderColor: 'red', padding: '2px 6px' }}
                            onClick={async () => {
                                if (!window.confirm('Delete this achievement?')) return;
                                await fetch(`/api/extra/achievements/${a.id}`, { method: 'DELETE' });
                                fetchAchs();
                            }}>🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsManager = () => {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        fetch('/api/common/settings').then(res => res.json()).then(setSettings);
    }, []);

    const handleChange = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

    const handleSave = async (e) => {
        e.preventDefault();
        await fetch('/api/common/settings/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        alert('Settings Updated Successfully');
    };

    return (
        <div className="card">
            <h3>Institute Settings</h3>
            <form onSubmit={handleSave} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                    <label className="form-label">Institute Name</label>
                    <input className="form-control" value={settings.institute_name || ''} onChange={e => handleChange('institute_name', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">About Us</label>
                    <textarea className="form-control" rows="4" value={settings.about_us || ''} onChange={e => handleChange('about_us', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input className="form-control" value={settings.contact_phone || ''} onChange={e => handleChange('contact_phone', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={settings.email || ''} onChange={e => handleChange('email', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" value={settings.address || ''} onChange={e => handleChange('address', e.target.value)} />
                </div>
                <button className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default AdminDashboard;
