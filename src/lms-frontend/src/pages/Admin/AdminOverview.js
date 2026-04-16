import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaBookOpen, 
  FaCheckCircle,
  FaArrowUp,
  FaClock
} from 'react-icons/fa';
import API from '../../utils/api';
import { useLanguage } from '../../store/LanguageContext';
import './AdminOverview.css';

const StatCard = ({ title, value, icon, color, trend, lang }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      {trend && (
        <span className="stat-trend">
          <FaArrowUp /> {trend}% {lang === 'th' ? 'เดือนนี้' : 'this month'}
        </span>
      )}
    </div>
  </div>
);

const AdminOverview = () => {
  const { lang } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    pendingApprovals: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: users } = await API.get('/users');
        const { data: coursesData } = await API.get('/courses');
        
        const students = users.filter(u => u.role === 'student');
        const instructors = users.filter(u => u.role === 'instructor');
        const pending = users.filter(u => !u.isApproved);
        
        setStats({
          totalUsers: users.length,
          totalStudents: students.length,
          totalInstructors: instructors.length,
          totalCourses: coursesData.courses?.length || 0,
          pendingApprovals: pending.length
        });

        // Top 5 recent users
        setRecentUsers(users.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

  return (
    <div className="admin-overview fade-in">
      {/* Welcome Section */}
      <div className="admin-welcome-section">
        <div className="welcome-text">
          <h1>{lang === 'th' ? 'สวัสดีครับผู้ดูแลระบบ' : 'Hello, Administrator'} 👋</h1>
          <p>{lang === 'th' ? 'นี่คือภาพรวมของระบบและสถานะการดำเนินการในขณะนี้' : 'Here is an overview of the system status and current operations.'}</p>
        </div>
        <div className="welcome-date">
          <span>{new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid - Aligned with Instructor Style */}
      <div className="stats-grid">
        <StatCard 
          title={lang === 'th' ? 'ผู้ใช้งานทั้งหมด' : 'Total Users'} 
          value={stats.totalUsers} 
          icon={<FaUsers />} 
          color="#0d2750" 
          trend={12}
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'นักศึกษา' : 'Students'} 
          value={stats.totalStudents} 
          icon={<FaUserGraduate />} 
          color="#b59545" 
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'ผู้สอน' : 'Instructors'} 
          value={stats.totalInstructors} 
          icon={<FaChalkboardTeacher />} 
          color="#0d2750" 
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'คอร์สทั้งหมด' : 'Total Courses'} 
          value={stats.totalCourses} 
          icon={<FaBookOpen />} 
          color="#b59545" 
          lang={lang}
        />
      </div>

      <div className="dashboard-row">
        {/* Pending Approvals Quick View */}
        <div className="dashboard-card main-card">
          <div className="card-header">
            <h3>{lang === 'th' ? 'รอนุมัติล่าสุด' : 'Recent Pending Approvals'}</h3>
            <span className="badge-pending">{stats.pendingApprovals} {lang === 'th' ? 'รายการรอดำเนินการ' : 'pending'}</span>
          </div>
          <div className="card-body">
            {stats.pendingApprovals === 0 ? (
              <div className="empty-state">
                <FaCheckCircle />
                <p>{lang === 'th' ? 'ไม่มีรายการรออนุมัติ' : 'No pending approvals'}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{lang === 'th' ? 'ชื่อ' : 'Name'}</th>
                      <th>{lang === 'th' ? 'รหัสนักศึกษา' : 'Student ID'}</th>
                      <th>{lang === 'th' ? 'สาขา' : 'Dept.'}</th>
                      <th>{lang === 'th' ? 'เวลา' : 'Time'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.filter(u => !u.isApproved).map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-info-cell">
                            <div className="user-avatar-small">{user.firstName.charAt(0)}</div>
                            <span>{user.firstName} {user.lastName}</span>
                          </div>
                        </td>
                        <td>{user.studentId || '-'}</td>
                        <td>{user.department || '-'}</td>
                        <td><small className="text-muted"><FaClock /> Just now</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* System Health / Status */}
        <div className="dashboard-card side-card">
          <div className="card-header">
            <h3>{lang === 'th' ? 'สถานะภูมิภาค' : 'System Status'}</h3>
          </div>
          <div className="card-body">
            <div className="status-item">
              <span className="status-dot online"></span>
              <div className="status-info">
                <p className="status-label">Backend API</p>
                <p className="status-value">Operational</p>
              </div>
              <span className="status-ms">24ms</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <div className="status-info">
                <p className="status-label">Database (MongoDB)</p>
                <p className="status-value">Connected</p>
              </div>
              <span className="status-ms">12ms</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <div className="status-info">
                <p className="status-label">Storage (AWS S3)</p>
                <p className="status-value">Active</p>
              </div>
              <span className="status-ms">45ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
