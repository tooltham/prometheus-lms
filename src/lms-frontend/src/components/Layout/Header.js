import React from 'react';
import { FaSearch, FaBell, FaUserCircle, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import './Header.css';

const Header = () => {
  const { lang, setLang, t } = useLanguage();

  const toggleLanguage = () => {
    setLang(lang === 'th' ? 'en' : 'th');
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

        <button className="action-btn">
          <FaBell />
          <span className="badge-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">อภิรักษ์ Tooltham</span>
            <span className="user-role">{t('role')}</span>
          </div>
          <FaUserCircle className="user-avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;
