import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import StudentOverview from './StudentOverview';
import StudentMyLearning from './StudentMyLearning';
import StudentGrades from './StudentGrades';

const StudentPortal = () => {
  return (
    <StudentLayout>
      <Routes>
        <Route path="overview" element={<StudentOverview />} />
        <Route path="my-learning" element={<StudentMyLearning />} />
        <Route path="results" element={<StudentGrades />} />
        
        {/* Fallback to Overview */}
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </StudentLayout>
  );
};

export default StudentPortal;
