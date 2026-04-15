import React, { useState } from 'react';
import {
  FaPalette, FaLanguage, FaBell, FaShieldAlt,
  FaCheckCircle, FaTrash
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import { NPUButton, NPUCard } from '../../components/UI/UIComponents';
import API from '../../utils/api';
import './SettingsPage.css';

const SettingsPage = () => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    courseUpdates: true,
    achievements: false,
  });
  const [saved, setSaved] = useState(false);

  const [passwordState, setPasswordState] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSaveSettings = () => {
    // Save to localStorage for persistence
    localStorage.setItem('settings', JSON.stringify({ lang, notifications }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      return setPasswordError(lang === 'th' ? 'รหัสผ่านใหม่ไม่ตรงกัน' : 'New passwords do not match');
    }

    try {
      await API.put('/users/change-password', {
        oldPassword: passwordState.oldPassword,
        newPassword: passwordState.newPassword
      });
      setPasswordSuccess(lang === 'th' ? 'เปลี่ยนรหัสผ่านสำเร็จ' : 'Password changed successfully');
      setPasswordState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(lang === 'th'
      ? 'คุณแน่ใจหรือว่าต้องการลบบัญชีนี้? ไม่สามารถย้อนกลับได้!'
      : 'Are you sure you want to delete your account? This cannot be undone!')) {
      alert(lang === 'th' ? 'ฟีเจอร์นี้ยังไม่พร้อมใช้งาน' : 'This feature is not yet available.');
    }
  };

  return (
    <div className="settings-page fade-in">
      <div className="settings-header-section">
        <h1>{t('settings')}</h1>
        <p>{lang === 'th' ? 'จัดการการตั้งค่าแอปพลิเคชัน' : 'Manage application preferences'}</p>
      </div>

      {saved && (
        <div className="settings-saved-banner">
          <FaCheckCircle /> {lang === 'th' ? 'บันทึกการตั้งค่าสำเร็จ' : 'Settings saved successfully!'}
        </div>
      )}

      <div className="settings-grid">
        {/* Language & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Language Settings */}
          <NPUCard className="settings-card">
            <div className="settings-card-header">
              <FaLanguage className="settings-icon" />
              <div>
                <h3>{lang === 'th' ? 'ภาษา' : 'Language'}</h3>
                <p>{lang === 'th' ? 'เลือกภาษาที่ต้องการแสดงผล' : 'Choose your preferred language'}</p>
              </div>
            </div>
            <div className="lang-options">
              <button
                className={`lang-option ${lang === 'th' ? 'active' : ''}`}
                onClick={() => setLang('th')}
              >
                🇹🇭 ภาษาไทย
              </button>
              <button
                className={`lang-option ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                🇺🇸 English
              </button>
            </div>
          </NPUCard>

          {/* Security / Password Settings */}
          <NPUCard className="settings-card">
            <div className="settings-card-header">
              <FaShieldAlt className="settings-icon" style={{ color: 'var(--npu-gold)' }} />
              <div>
                <h3>{lang === 'th' ? 'เปลี่ยนรหัสผ่าน' : 'Change Password'}</h3>
                <p>{lang === 'th' ? 'เพื่อความปลอดภัย กรุณายืนยันรหัสผ่านเดิม' : 'For security, please verify your old password'}</p>
              </div>
            </div>
            
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {passwordError && <div style={{ color: '#b71c1c', background: '#ffcdd2', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>{passwordError}</div>}
              {passwordSuccess && <div style={{ color: '#2e7d32', background: '#e8f5e9', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>{passwordSuccess}</div>}
              
              <div className="settings-input-group">
                <input 
                  type="password" 
                  placeholder={lang === 'th' ? 'รหัสผ่านเดิม' : 'Current Password'} 
                  value={passwordState.oldPassword}
                  onChange={(e) => setPasswordState({...passwordState, oldPassword: e.target.value})}
                  required 
                />
              </div>
              <div className="settings-input-group">
                <input 
                  type="password" 
                  placeholder={lang === 'th' ? 'รหัสผ่านใหม่' : 'New Password'} 
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({...passwordState, newPassword: e.target.value})}
                  required 
                />
              </div>
              <div className="settings-input-group">
                <input 
                  type="password" 
                  placeholder={lang === 'th' ? 'ยืนยันรหัสผ่านใหม่' : 'Confirm New Password'} 
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({...passwordState, confirmPassword: e.target.value})}
                  required 
                />
              </div>
              <NPUButton type="submit" variant="primary" style={{ width: 'fit-content' }}>
                {lang === 'th' ? 'อัปเดตรหัสผ่าน' : 'Update Password'}
              </NPUButton>
            </form>
          </NPUCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Notification Settings */}
          <NPUCard className="settings-card">
            <div className="settings-card-header">
              <FaBell className="settings-icon" />
              <div>
                <h3>{lang === 'th' ? 'การแจ้งเตือน' : 'Notifications'}</h3>
                <p>{lang === 'th' ? 'ควบคุมการแจ้งเตือนที่คุณจะได้รับ' : 'Control which notifications you receive'}</p>
              </div>
            </div>
            <div className="notification-options">
              {[
                { key: 'email', label: lang === 'th' ? 'แจ้งเตือนทางอีเมล' : 'Email Notifications' },
                { key: 'courseUpdates', label: lang === 'th' ? 'อัปเดตคอร์ส' : 'Course Updates' },
                { key: 'achievements', label: lang === 'th' ? 'ความสำเร็จ / ใบประกาศ' : 'Achievements & Certificates' },
              ].map(item => (
                <div key={item.key} className="toggle-row">
                  <span>{item.label}</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </NPUCard>

          {/* Appearance Settings */}
          <NPUCard className="settings-card">
            <div className="settings-card-header">
              <FaPalette className="settings-icon" />
              <div>
                <h3>{lang === 'th' ? 'การแสดงผล' : 'Appearance'}</h3>
                <p>{lang === 'th' ? 'ธีมสีของ NPU (Royal Navy & Gold)' : 'NPU Brand Theme (Royal Navy & Gold)'}</p>
              </div>
            </div>
            <div className="color-preview">
              <div className="color-swatch" style={{ background: '#0d2750' }} title="NPU Navy" />
              <div className="color-swatch" style={{ background: '#1a3f6f' }} title="Navy Light" />
              <div className="color-swatch" style={{ background: '#c8a415' }} title="NPU Gold" />
              <div className="color-swatch" style={{ background: '#e0c846' }} title="Gold Light" />
              <div className="color-swatch" style={{ background: '#2b6cb0' }} title="Secondary Blue" />
            </div>
            <p className="color-note">{lang === 'th' ? 'ธีมสีใช้มาตรฐาน NPU Branding ไม่สามารถเปลี่ยนได้' : 'Theme follows official NPU branding standards.'}</p>
          </NPUCard>

          {/* Danger Zone */}
          <NPUCard className="settings-card settings-danger-card">
            <div className="settings-card-header">
              <FaShieldAlt className="settings-icon danger-icon" />
              <div>
                <h3>{lang === 'th' ? 'โซนอันตราย' : 'Danger Zone'}</h3>
                <p>{lang === 'th' ? 'การกระทำเหล่านี้ไม่สามารถย้อนกลับได้' : 'These actions cannot be undone'}</p>
              </div>
            </div>
            <NPUButton variant="outline" className="danger-btn" onClick={handleDeleteAccount}>
              <FaTrash /> {lang === 'th' ? 'ลบบัญชีนี้' : 'Delete Account'}
            </NPUButton>
          </NPUCard>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-save-row">
        <NPUButton variant="accent" onClick={handleSaveSettings}>
          <FaCheckCircle /> {lang === 'th' ? 'บันทึกการตั้งค่า' : 'Save Settings'}
        </NPUButton>
        <NPUButton variant="outline" onClick={() => navigate(-1)}>
          {lang === 'th' ? 'ย้อนกลับ' : 'Go Back'}
        </NPUButton>
      </div>
    </div>
  );
};

export default SettingsPage;
