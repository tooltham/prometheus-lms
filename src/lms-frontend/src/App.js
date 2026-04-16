import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import WaitingForApproval from './pages/Auth/WaitingForApproval';
import MainLayout from './components/Layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import CoursesPage from './pages/Courses/CoursesPage';
import CourseDetail from './pages/Courses/CourseDetail';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/SettingsPage';
import InstructorPortal from './pages/Instructor/InstructorPortal';
import AdminPanel from './pages/Admin/AdminPanel';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/waiting-approval" element={<WaitingForApproval />} />

      {/* Protected routes — wrapped with PrivateRoute auth guard */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* Instructor routes - using its own dedicated InstructorLayout (inside InstructorPortal) */}
      <Route
        path="/instructor/*"
        element={
          <PrivateRoute roles={['instructor']}>
            <InstructorPortal />
          </PrivateRoute>
        }
      />
      
      {/* Admin routes - using its own dedicated AdminLayout (inside AdminPanel) */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={
        <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '4rem', color: 'var(--npu-navy)' }}>404</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Page Not Found</p>
          <a href="/" style={{ color: 'var(--npu-gold)', textDecoration: 'none', fontWeight: 600 }}>← Return Home</a>
        </div>
      } />
    </Routes>
  );
}

export default App;
