import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBookOpen, 
  FaTasks, 
  FaGraduationCap,
  FaCalendarAlt,
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChevronRight,
  FaGlobe,
  FaSearch
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import './StudentLayout.css';
import npuLogo from '../../assets/images/npu_logo.png';

const StudentLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLang(lang === 'th' ? 'en' : 'th');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { 
      path: '/student/overview', 
      icon: <FaChartLine />, 
      label: lang === 'th' ? 'แผงควบคุม' : 'Overview' 
    },
    { 
      path: '/student/my-learning', 
      icon: <FaBookOpen />, 
      label: lang === 'th' ? 'คอร์สของฉัน' : 'My Learning' 
    },
    { 
      path: '/student/activities', 
      icon: <FaTasks />, 
      label: lang === 'th' ? 'งานและกิจกกรม' : 'Activities' 
    },
    { 
      path: '/student/results', 
      icon: <FaGraduationCap />, 
      label: lang === 'th' ? 'ผลการเรียน' : 'My Grades' 
    },
    { 
      path: '/student/schedule', 
      icon: <FaCalendarAlt />, 
      label: lang === 'th' ? 'ตารางเรียน' : 'Schedule' 
    },
    { 
      path: '/courses', 
      icon: <FaSearch />, 
      label: lang === 'th' ? 'ค้นหาบทเรียน' : 'Browse Courses' 
    },
  ];

  return (
    <div className={`student-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* Sidebar - Professional Navy/Gold */}
      <aside className="student-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={npuLogo} alt="NPU Logo" className="sidebar-logo" />
            <span className="logo-text">PROMETHEUS <br/><small>STUDENT PORTAL</small></span>
          </div>
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-label">{lang === 'th' ? 'เมนูนักศึกษา' : 'LEARNER MENU'}</p>
            {menuItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.path === '/student/overview'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                <FaChevronRight className="active-arrow" />
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>{lang === 'th' ? 'ออกจากระบบ' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="student-main">
        <header className="student-top-nav">
          <div className="top-nav-left">
            <button className="desktop-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <h2 className="page-title">
              {menuItems.find(item => location.pathname === item.path)?.label || (lang === 'th' ? 'นักเรียน' : 'Student')}
            </h2>
          </div>

          <div className="top-nav-right">
            <button className="lang-toggle-btn" onClick={toggleLanguage}>
              <FaGlobe />
              <span>{lang === 'th' ? 'EN' : 'ไทย'}</span>
            </button>
            <div className="student-profile-badge">
              <div className="badge-info">
                 <span className="badge-name">{user.firstName} {user.lastName}</span>
                 <span className="badge-role">🎓 STUDENT</span>
              </div>
              <div className="badge-avatar">
                {user.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="student-content-scroll">
          <div className="student-content-container">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
