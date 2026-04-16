import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaUsers, 
  FaStar, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChevronRight,
  FaGlobe
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import './InstructorLayout.css';
import npuLogo from '../../assets/images/npu_logo.png';

const InstructorLayout = ({ children }) => {
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
      path: '/instructor/overview', 
      icon: <FaChalkboardTeacher />, 
      label: lang === 'th' ? 'แดชบอร์ดผู้สอน' : 'Instructor Dashboard' 
    },
    { 
      path: '/instructor/courses', 
      icon: <FaBook />, 
      label: lang === 'th' ? 'คอร์สของฉัน' : 'My Courses' 
    },
    { 
      path: '/instructor/students', 
      icon: <FaUsers />, 
      label: lang === 'th' ? 'จัดการนักเรียน' : 'Student Progress' 
    },
    { 
      path: '/instructor/assessments', 
      icon: <FaStar />, 
      label: lang === 'th' ? 'การประเมินผล' : 'Assessments' 
    },
  ];

  return (
    <div className={`instructor-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* Sidebar - Teal/Navy Gradient for distinct identity */}
      <aside className="instructor-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={npuLogo} alt="NPU Logo" className="sidebar-logo" />
            <span className="logo-text">PROMETHEUS <br/><small>INSTRUCTOR PORTAL</small></span>
          </div>
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-label">{lang === 'th' ? 'เมนูบทบาทผู้สอน' : 'TEACHING MENU'}</p>
            {menuItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
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

      {/* Main Content */}
      <main className="instructor-main">
        <header className="instructor-top-nav">
          <div className="top-nav-left">
            <button className="desktop-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <h2 className="page-title">
              {menuItems.find(item => location.pathname.includes(item.path))?.label || (lang === 'th' ? 'ผู้สอน' : 'Teaching')}
            </h2>
          </div>

          <div className="top-nav-right">
            <button className="lang-toggle-btn" onClick={toggleLanguage}>
              <FaGlobe />
              <span>{lang === 'th' ? 'EN' : 'ไทย'}</span>
            </button>
            <div className="instructor-profile-badge">
              <div className="badge-info">
                 <span className="badge-name">{user.firstName} {user.lastName}</span>
                 <span className="badge-role">🎓 INSTRUCTOR</span>
              </div>
              <div className="badge-avatar">
                {user.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="instructor-content-scroll">
          <div className="instructor-content-container">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorLayout;
