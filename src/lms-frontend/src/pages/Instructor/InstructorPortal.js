import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InstructorLayout from '../../components/Layout/InstructorLayout';
import InstructorOverview from './InstructorOverview';
import InstructorCourseManagement from './InstructorCourseManagement';
import InstructorStudentAnalytics from './InstructorStudentAnalytics';

const InstructorPortal = () => {
  return (
    <InstructorLayout>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<InstructorOverview />} />
        <Route path="courses" element={<InstructorCourseManagement />} />
        <Route path="students" element={<InstructorStudentAnalytics />} />
        <Route path="assessments" element={<div className="inst-card p-5">Assessments System coming soon...</div>} />
      </Routes>
    </InstructorLayout>
  );
};

export default InstructorPortal;
