import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBookOpen, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaChartLine,
  FaArrowUp,
  FaEllipsisH
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './InstructorOverview.css';

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

const InstructorOverview = () => {
  const { lang } = useLanguage();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    avgProgress: 0,
    pendingAssessments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        // Fetch instructor-specific stats
        const { data } = await API.get('/courses?limit=100');
        const myCourses = data.courses.filter(c => c.instructor?._id === user._id);
        
        let studentsCount = 0;
        myCourses.forEach(c => studentsCount += (c.totalEnrolled || 0));

        setStats({
          totalStudents: studentsCount,
          activeCourses: myCourses.length,
          avgProgress: 75, // Mock for now
          pendingAssessments: 5 // Mock for now
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="inst-loading">Loading Dashboard...</div>;

  return (
    <div className="instructor-overview fade-in">
      <div className="inst-welcome-section">
        <div className="welcome-text">
          <h1>{lang === 'th' ? 'สวัสดีครับอาจารย์' : 'Hello, Instructor'} 👋</h1>
          <p>{lang === 'th' ? 'นี่คือภาพรวมคอร์สเรียนและนักเรียนของคุณในวันนี้' : 'Here is an overview of your courses and students today.'}</p>
        </div>
        <div className="welcome-date">
          <span>{new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="inst-stats-grid">
        <StatCard 
          title={lang === 'th' ? 'นักเรียนทั้งหมด' : 'Total Students'} 
          value={stats.totalStudents} 
          icon={<FaUsers />} 
          color="#b59545" 
          trend={8}
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'คอร์สที่สอน' : 'Active Courses'} 
          value={stats.activeCourses} 
          icon={<FaBookOpen />} 
          color="#0d2750" 
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'ความคืบหน้าเฉลี่ย' : 'Avg. Progress'} 
          value={`${stats.avgProgress}%`} 
          icon={<FaChartLine />} 
          color="#0d2750" 
          lang={lang}
        />
        <StatCard 
          title={lang === 'th' ? 'รอการประเมิน' : 'Pending Tasks'} 
          value={stats.pendingAssessments} 
          icon={<FaHourglassHalf />} 
          color="#ef5350" 
          lang={lang}
        />
      </div>

      <div className="inst-dashboard-content">
        <div className="inst-main-col">
          <div className="inst-card">
            <div className="inst-card-header">
              <h3>{lang === 'th' ? 'ความเคลื่อนไหวล่าสุด' : 'Recent Activity'}</h3>
              <button className="text-btn">{lang === 'th' ? 'ดูทั้งหมด' : 'See all'}</button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon student"><FaUsers /></div>
                <div className="activity-details">
                  <p><strong>นักศึกษา ใหม่</strong> {lang === 'th' ? 'สมัครเข้าเรียนในคอร์ส' : 'enrolled in'} "React Advanced"</p>
                  <span>2 {lang === 'th' ? 'ชม. ที่แล้ว' : 'hours ago'}</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon task"><FaCheckCircle /></div>
                <div className="activity-details">
                  <p><strong>สมชาย ใจดี</strong> {lang === 'th' ? 'ส่งแบบฝึกหัด' : 'submitted assignment'} "Module 1 Quiz"</p>
                  <span>5 {lang === 'th' ? 'ชม. ที่แล้ว' : 'hours ago'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="inst-side-col">
          <div className="inst-card quick-stats">
            <h3>{lang === 'th' ? 'ประสิทธิภาพคอร์ส' : 'Course Performance'}</h3>
            <div className="mini-chart-dummy">
                {/* Mock Chart UI */}
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '40%'}}></div>
                <div className="bar" style={{height: '90%'}}></div>
                <div className="bar" style={{height: '70%'}}></div>
            </div>
            <p className="chart-label">{lang === 'th' ? 'อัตราการเรียนจบเพิ่มขึ้น 12%' : 'Completion rate up by 12%'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorOverview;
