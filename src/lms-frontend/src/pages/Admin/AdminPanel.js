import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import AdminOverview from './AdminOverview';
import AdminUserManagement from './AdminUserManagement';
import AdminCourseManagement from './AdminCourseManagement';

const AdminPanel = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="courses" element={<AdminCourseManagement />} />
        <Route path="settings" element={<div className="admin-card p-5">System Settings coming soon...</div>} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;
