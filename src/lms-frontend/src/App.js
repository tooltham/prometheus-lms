import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';

// Placeholder pages for construction
const Courses = () => <div className="fade-in"><h2>📚 My Courses</h2><p>Course list coming soon...</p></div>;
const Profile = () => <div className="fade-in"><h2>👤 My Profile</h2><p>Profile management coming soon...</p></div>;
const Settings = () => <div className="fade-in"><h2>⚙️ Settings</h2><p>Application settings coming soon...</p></div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={
        <div className="flex-center" style={{ height: '100vh', flexDirection: 'column' }}>
          <h1>404</h1>
          <p>Page Not Found</p>
          <a href="/" style={{ color: 'var(--npu-gold)', marginTop: '1rem' }}>Return Home</a>
        </div>
      } />
    </Routes>
  );
}

export default App;
