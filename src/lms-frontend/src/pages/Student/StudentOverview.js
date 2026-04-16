import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaCheckCircle, 
  FaGraduationCap, 
  FaClock,
  FaArrowUp,
  FaEllipsisH
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './StudentOverview.css';

const StatCard = ({ title, value, icon, color, trend, lang }) => (
  <div className="inst-stat-card">
    <div className="inst-stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
      {icon}
    </div>
    <div className="inst-stat-info">
      <p className="inst-stat-title">{title}</p>
      <h3 className="inst-stat-value">{value}</h3>
      {trend && (
        <span className="inst-stat-trend">
          <FaArrowUp /> {trend}% {lang === 'th' ? 'เดือนนี้' : 'this month'}
        </span>
      )}
    </div>
    <button className="inst-stat-more"><FaEllipsisH /></button>
  </div>
);

const StudentOverview = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/courses/my-courses');
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="student-loading">Loading Overview...</div>;

  return (
    <div className="student-overview fade-in">
      <div className="student-welcome-section">
        <div className="welcome-text">
          <h1>{lang === 'th' ? `สวัสดีครับคุณ ${user.firstName}` : `Hello, ${user.firstName}`} 👋</h1>
          <p>{lang === 'th' ? 'พร้อมสำหรับการเรียนรู้ในวันนี้แล้วหรือยัง? ตรวจสอบความคืบหน้าได้ที่นี่' : 'Ready for learning today? Check your progress below.'}</p>
        </div>
        <div className="welcome-date">
          <span>{new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="inst-stats-grid">
        <StatCard 
          title={lang === 'th' ? 'คอร์สที่กำลังเรียน' : 'Enrolled Courses'} 
          value={courses.length} 
          icon={<FaBookOpen />} 
          color="#0d2750" 
          trend={5}
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'บทเรียนที่จบแล้ว' : 'Completed Lessons'} 
          value="12" 
          icon={<FaCheckCircle />} 
          color="#b59545" 
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'เกรดเฉลี่ยปัจจุบัน' : 'Current GPA'} 
          value="3.85" 
          icon={<FaGraduationCap />} 
          color="#0d2750" 
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'เวลาที่ใช้เรียน' : 'Study Hours'} 
          value="45h" 
          icon={<FaClock />} 
          color="#b59545" 
          lang={lang}
        />
      </div>

      <div className="student-dashboard-content">
        <div className="student-main-col">
          <div className="student-card">
            <div className="card-header">
              <h3>{lang === 'th' ? 'บทเรียนล่าสุดที่เข้าเรียน' : 'Continue Learning'}</h3>
              <button className="text-btn" onClick={() => navigate('/student/my-learning')}>
                {lang === 'th' ? 'ดูทั้งหมด' : 'See all'}
              </button>
            </div>
            <div className="activity-list">
              {courses.slice(0, 3).map(enrollment => (
                <div key={enrollment._id} className="course-progress-item">
                  <div className="course-thumb-mini"></div>
                  <div className="course-progress-details">
                    <div className="progress-label-row">
                      <h4>{enrollment.course.title}</h4>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="pro-progress-bar">
                      <div className="fill" style={{ width: `${enrollment.progress}%` }}></div>
                    </div>
                  </div>
                  <button className="continue-icon-btn" onClick={() => navigate(`/courses/${enrollment.course._id}`)}>
                    <FaArrowUp style={{ transform: 'rotate(90deg)' }} />
                  </button>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="empty-msg">{lang === 'th' ? 'ยังไม่ได้ลงทะเบียนวิชาใดๆ' : 'No courses enrolled yet.'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="student-side-col">
          <div className="student-card highlight-card">
            <h3>{lang === 'th' ? 'กำหนดส่งงานถัดไป' : 'Next Deadline'}</h3>
            <div className="deadline-item">
              <div className="deadline-date">
                <span className="day">18</span>
                <span className="month">APR</span>
              </div>
              <div className="deadline-info">
                <h4>Quiz: Module 4</h4>
                <p>React Fundamentals</p>
              </div>
            </div>
            <button className="action-btn-gold" style={{ marginTop: '1.5rem', width: '100%' }}>
              {lang === 'th' ? 'ไปที่กิจกรรม' : 'Go to Activities'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
