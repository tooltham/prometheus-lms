import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import './Header.css';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Read real user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = storedUser.firstName && storedUser.lastName
    ? `${storedUser.firstName} ${storedUser.lastName}`
    : storedUser.email || 'User';
  const userRole = storedUser.role || 'student';

  const toggleLanguage = () => {
    setLang(lang === 'th' ? 'en' : 'th');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <header className="header glass">
      <div className="header-search">
        <FaSearch className="search-icon" />
        <input type="text" placeholder={t('search')} />
      </div>

      <div className="header-actions">
        <button
          className="lang-toggle-btn npu-btn-outline"
          onClick={toggleLanguage}
          title="Switch Language"
        >
          <FaGlobe />
          <span>{lang === 'th' ? 'EN' : 'TH'}</span>
        </button>

        <button className="action-btn" title="Notifications">
          <FaBell />
          <span className="badge-dot"></span>
        </button>

        <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role" style={{ textTransform: 'capitalize' }}>{userRole}</span>
          </div>
          <FaUserCircle className="user-avatar" />
          <FaChevronDown style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '0.25rem' }} />

          {showUserMenu && (
            <div className="user-dropdown">
              <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                {t('profile')}
              </button>
              <button onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                {t('settings')}
              </button>
              <hr />
              <button className="logout-item" onClick={handleLogout}>
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
