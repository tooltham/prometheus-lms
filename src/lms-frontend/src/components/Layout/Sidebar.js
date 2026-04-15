import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaLayout, 
  FaBook, 
  FaUser, 
  FaCog, 
  FaSignOutAlt
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import './Sidebar.css';

const Sidebar = () => {
  const { t } = useLanguage();
  const logoUrl = 'https://upload.wikimedia.org/wikipedia/th/a/a3/Nakhon_Phanom_University_Logo.svg';

  return (
    <aside className="sidebar npu-gradient">
      <div className="sidebar-brand">
        <img src={logoUrl} alt="NPU Logo" className="brand-logo" />
        <div className="brand-text">
          <span className="brand-name">PROMETHEUS</span>
          <span className="brand-sub">NPU LMS</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaLayout className="nav-icon" />
          <span>{t('dashboard')}</span>
        </NavLink>
        
        <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaBook className="nav-icon" />
          <span>{t('myCourses')}</span>
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaUser className="nav-icon" />
          <span>{t('profile')}</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaCog className="nav-icon" />
          <span>{t('settings')}</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn">
          <FaSignOutAlt className="nav-icon" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
