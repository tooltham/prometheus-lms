import React from 'react';
import { 
  FaBookOpen, 
  FaAward, 
  FaClock, 
  FaChevronRight 
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { NPUCard, NPUButton } from '../../components/UI/UIComponents';
import { useLanguage } from '../../store/LanguageContext';
import './Dashboard.css';

const data = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 5 },
  { name: 'Wed', hours: 3 },
  { name: 'Thu', hours: 7 },
  { name: 'Fri', hours: 1 },
  { name: 'Sat', hours: 4 },
  { name: 'Sun', hours: 6 },
];

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <h1>{t('welcome')}, อภิรักษ์! 👋</h1>
          <p>{t('todayTask', { count: 3 })}</p>
        </div>
        <NPUButton variant="accent">{t('viewSchedule')}</NPUButton>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon navy-bg"><FaBookOpen /></div>
          <div className="stat-info">
            <span className="stat-value">12</span>
            <span className="stat-label">{t('enrolledCourses')}</span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon gold-bg"><FaAward /></div>
          <div className="stat-info">
            <span className="stat-value">4</span>
            <span className="stat-label">{t('certificates')}</span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon blue-bg"><FaClock /></div>
          <div className="stat-info">
            <span className="stat-value">45 {t('hours')}</span>
            <span className="stat-label">{t('totalStudyTime')}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <NPUCard title={t('recentCourses')} className="recent-courses">
          <div className="course-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="course-item">
                <div className="course-thumb npu-gradient"></div>
                <div className="course-details">
                  <h4>{t('lang') === 'th' ? 'การเขียนโปรแกรม React เบื้องต้น' : 'Intro to React Programming'} #{i}</h4>
                  <div className="course-progress-bar">
                    <div className="progress-fill" style={{ width: `${i * 30}%` }}></div>
                  </div>
                  <span className="progress-text">เรียนไปแล้ว {i * 30}%</span>
                </div>
                <NPUButton variant="outline" size="sm">{t('continue')} <FaChevronRight /></NPUButton>
              </div>
            ))}
          </div>
        </NPUCard>

        <NPUCard title={t('studyAnalytics')} className="study-analytics">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(13, 39, 80, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="hours" fill="var(--npu-navy)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NPUCard>
      </div>
    </div>
  );
};

export default Dashboard;
