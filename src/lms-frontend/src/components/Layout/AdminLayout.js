import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUsers, 
  FaBook, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChevronRight,
  FaUserShield,
  FaGlobe
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import './AdminLayout.css';
import npuLogo from '../../assets/images/npu_logo.png';

const AdminLayout = ({ children }) => {
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
      path: '/admin/overview', 
      icon: <FaChartLine />, 
      label: lang === 'th' ? 'ภาพรวมระบบ' : 'Overview' 
    },
    { 
      path: '/admin/users', 
      icon: <FaUsers />, 
      label: lang === 'th' ? 'จัดการผู้ใช้' : 'Users' 
    },
    { 
      path: '/admin/courses', 
      icon: <FaBook />, 
      label: lang === 'th' ? 'จัดการคอร์ส' : 'Courses' 
    },
    { 
      path: '/admin/settings', 
      icon: <FaCog />, 
      label: lang === 'th' ? 'ตั้งค่าระบบ' : 'Settings' 
    },
  ];

  return (
    <div className={`admin-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={npuLogo} alt="NPU Logo" className="sidebar-logo" />
            <span className="logo-text">PROMETHEUS <br/><small>ADMIN PORTAL</small></span>
          </div>
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-label">{lang === 'th' ? 'เมนูหลัก' : 'MAIN MENU'}</p>
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

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-top-nav">
          <div className="top-nav-left">
            <button className="desktop-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <h2 className="page-title">
              {menuItems.find(item => location.pathname.includes(item.path))?.label || (lang === 'th' ? 'แผงควบคุม' : 'Dashboard')}
            </h2>
          </div>

          <div className="top-nav-right">
            <button className="lang-toggle-btn" onClick={toggleLanguage}>
              <FaGlobe />
              <span>{lang === 'th' ? 'EN' : 'ไทย'}</span>
            </button>
            <div className="admin-profile-badge">
              <div className="badge-info">
                <span className="badge-name">{user.firstName} {user.lastName}</span>
                <span className="badge-role"><FaUserShield /> ADMIN</span>
              </div>
              <div className="badge-avatar">
                {user.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content-scroll">
          <div className="admin-content-container">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
