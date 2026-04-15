import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaEye, FaUsers } from 'react-icons/fa';
import { NPUCard, NPUButton } from '../../components/UI/UIComponents';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './InstructorPortal.css';

const InstructorPortal = () => {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Fetch Courses
        const { data: courseData } = await API.get('/courses?limit=100');
        const myCourses = courseData.courses.filter(c => c.instructor?._id === storedUser._id);
        setCourses(myCourses);

        // Fetch Users for approval (Instructors can see all pending students)
        const { data: userData } = await API.get('/users');
        const pending = userData.filter(u => !u.isApproved && u.role === 'student');
        setPendingUsers(pending);
      } catch (err) {
        console.error('Failed to fetch instructor data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await API.put(`/users/approve/${userId}`);
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  return (
    <div className="instructor-portal fade-in">
      <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--npu-navy)' }}>{lang === 'th' ? 'การจัดการผู้สอน' : 'Instructor Portal'}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {lang === 'th' ? 'จัดการคอร์สเรียนและการรับเข้าเรียนของนักศึกษา' : 'Manage your courses and student enrollment'}
          </p>
        </div>
        <NPUButton variant="primary">
          <FaPlus /> {lang === 'th' ? 'สร้างคอร์สใหม่' : 'Create New Course'}
        </NPUButton>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
        <button 
          onClick={() => setActiveTab('courses')}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'courses' ? '3px solid var(--npu-gold)' : 'none',
            color: activeTab === 'courses' ? 'var(--npu-navy)' : 'var(--text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {lang === 'th' ? 'คอร์สเรียนของฉัน' : 'My Courses'}
        </button>
        <button 
          onClick={() => setActiveTab('students')}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'students' ? '3px solid var(--npu-gold)' : 'none',
            color: activeTab === 'students' ? 'var(--npu-navy)' : 'var(--text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {lang === 'th' ? 'จัดการนักศึกษา' : 'Student Management'}
          {pendingUsers.length > 0 && <span style={{ background: 'var(--status-danger)', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>{pendingUsers.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '200px' }}>Loading...</div>
      ) : activeTab === 'courses' ? (
        <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {courses.map(course => (
            <NPUCard key={course._id} style={{ padding: '0', overflow: 'hidden' }}>
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{course.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <span><FaUsers /> {course.totalEnrolled || 0} {lang === 'th' ? 'นักเรียน' : 'Students'}</span>
                  <span style={{ color: course.isPublished ? 'var(--status-success)' : 'var(--status-warning)' }}>
                    {course.isPublished ? (lang === 'th' ? 'เผยแพร่แล้ว' : 'Published') : (lang === 'th' ? 'แบบร่าง' : 'Draft')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <NPUButton variant="secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <FaEdit /> {lang === 'th' ? 'แก้ไข' : 'Edit'}
                  </NPUButton>
                  <NPUButton variant="accent" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <FaEye /> {lang === 'th' ? 'ดู' : 'View'}
                  </NPUButton>
                </div>
              </div>
            </NPUCard>
          ))}
          {courses.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              {lang === 'th' ? 'คุณยังไม่มีคอร์สเรียน เริ่มสร้างคอร์สแรกของคุณเลย!' : 'You have no courses yet. Create your first course!'}
            </div>
          )}
        </div>
      ) : (
        <NPUCard title={lang === 'th' ? 'รายชื่อนักศึกษาที่รอการอนุมัติ' : 'Students Awaiting Approval'}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>{lang === 'th' ? 'รหัสนักศึกษา' : 'Student ID'}</th>
                  <th style={{ padding: '1rem 0.5rem' }}>{lang === 'th' ? 'ชื่อ - นามสกุล' : 'Name'}</th>
                  <th style={{ padding: '1rem 0.5rem' }}>{lang === 'th' ? 'ระดับการศึกษา' : 'Level'}</th>
                  <th style={{ padding: '1rem 0.5rem' }}>{lang === 'th' ? 'สาขาวิชา' : 'Department'}</th>
                  <th style={{ padding: '1rem 0.5rem' }}>{lang === 'th' ? 'การกระทำ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace' }}>{user.studentId}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{user.firstName} {user.lastName}</td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>{user.educationLevel}</td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>{user.department}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <button 
                        onClick={() => handleApprove(user._id)}
                        style={{ background: 'var(--status-success)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.3rem 0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      {lang === 'th' ? 'ไม่มีนักศึกษาที่รอการอนุมัติ' : 'No students awaiting approval'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </NPUCard>
      )}
    </div>
  );
};

export default InstructorPortal;
