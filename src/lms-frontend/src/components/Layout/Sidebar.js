import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaThLarge,
  FaBook,
  FaUser,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import './Sidebar.css';

const Sidebar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const logoUrl = 'https://upload.wikimedia.org/wikipedia/th/a/a3/Nakhon_Phanom_University_Logo.svg';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/dashboard', icon: <FaThLarge />, label: t('dashboard'), roles: ['student', 'instructor', 'admin'] },
    { path: '/courses',   icon: <FaBook />,    label: t('myCourses'), roles: ['student', 'instructor', 'admin'] },
    { path: '/instructor', icon: <FaThLarge />, label: 'Instructor Portal', roles: ['instructor', 'admin'] },
    { path: '/admin', icon: <FaUser />, label: 'Admin Panel', roles: ['admin'] },
    { path: '/profile',   icon: <FaUser />,    label: t('profile'), roles: ['student', 'instructor', 'admin'] },
    { path: '/settings',  icon: <FaCog />,     label: t('settings'), roles: ['student', 'instructor', 'admin'] },
  ];

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = storedUser.role || 'student';

  const visibleNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="sidebar npu-gradient">
      <div className="sidebar-brand">
        <img src={logoUrl} alt="NPU Logo" className="brand-logo" onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
        <div className="brand-text">
          <span className="brand-name">PROMETHEUS</span>
          <span className="brand-sub">NPU LMS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {visibleNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
