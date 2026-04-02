import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import StudentEntry from './components/StudentEntry';
import AdminDashboard from './components/AdminDashboard';

import StudentPortal from './components/StudentPortal';
import StudentTest from './components/StudentTest';
import Practice from './components/Practice'; // New Component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} /> {/* New Route */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/student/portal" element={<StudentPortal />} />
        <Route path="/student/test/:id" element={<StudentTest />} />
      </Routes>
    </Router>
  );
}

export default App;
