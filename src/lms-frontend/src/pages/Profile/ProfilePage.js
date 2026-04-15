import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaShieldAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import { NPUButton, NPUCard } from '../../components/UI/UIComponents';
import API from '../../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    setFormData({
      firstName: storedUser.firstName || '',
      lastName: storedUser.lastName || '',
      email: storedUser.email || '',
    });

    // Fetch fresh user data from API
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setUser(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const { data } = await API.put('/users/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setUser(data);
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, firstName: data.firstName, lastName: data.lastName }));
      setEditing(false);
      setMessage(lang === 'th' ? '✅ บันทึกข้อมูลสำเร็จ' : '✅ Profile updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'badge-admin';
    if (role === 'instructor') return 'badge-instructor';
    return 'badge-student';
  };

  const getRoleLabel = (role) => {
    if (lang === 'th') {
      if (role === 'admin') return 'ผู้ดูแลระบบ';
      if (role === 'instructor') return 'ผู้สอน';
      return 'นักศึกษา';
    }
    return role?.charAt(0).toUpperCase() + role?.slice(1);
  };

  return (
    <div className="profile-page fade-in">
      <div className="profile-header-section">
        <h1>{lang === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile'}</h1>
        <p>{lang === 'th' ? 'จัดการข้อมูลส่วนตัวของคุณ' : 'Manage your personal information'}</p>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <NPUCard className="profile-card-main">
          <div className="profile-avatar-section">
            <div className="avatar-circle npu-gradient">
              <span className="avatar-initials">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="profile-name-section">
              <h2>{user?.firstName} {user?.lastName}</h2>
              <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
                <FaShieldAlt /> {getRoleLabel(user?.role)}
              </span>
            </div>
          </div>

          {message && (
            <div className={`profile-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>{lang === 'th' ? 'ชื่อ' : 'First Name'}</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="profile-input"
                  />
                ) : (
                  <div className="profile-field-value">{user?.firstName || '—'}</div>
                )}
              </div>
              <div className="form-group">
                <label>{lang === 'th' ? 'นามสกุล' : 'Last Name'}</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="profile-input"
                  />
                ) : (
                  <div className="profile-field-value">{user?.lastName || '—'}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label><FaEnvelope /> {lang === 'th' ? 'อีเมล' : 'Email'}</label>
              <div className="profile-field-value email-field">
                {user?.email}
                <span className="email-lock">{lang === 'th' ? '(เปลี่ยนไม่ได้)' : '(Cannot change)'}</span>
              </div>
            </div>

            <div className="form-group">
              <label><FaUser /> {lang === 'th' ? 'บทบาท' : 'Role'}</label>
              <div className="profile-field-value">
                <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
                  {getRoleLabel(user?.role)}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <NPUButton variant="primary" onClick={handleSave} disabled={saving}>
                  <FaSave /> {saving ? (lang === 'th' ? 'กำลังบันทึก...' : 'Saving...') : (lang === 'th' ? 'บันทึก' : 'Save Changes')}
                </NPUButton>
                <NPUButton variant="outline" onClick={() => setEditing(false)}>
                  <FaTimes /> {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                </NPUButton>
              </>
            ) : (
              <NPUButton variant="accent" onClick={() => setEditing(true)}>
                <FaEdit /> {lang === 'th' ? 'แก้ไขข้อมูล' : 'Edit Profile'}
              </NPUButton>
            )}
          </div>
        </NPUCard>

        {/* Account Info Card */}
        <NPUCard title={lang === 'th' ? 'ข้อมูลบัญชี' : 'Account Information'} className="profile-card-info">
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">{lang === 'th' ? 'สถานะบัญชี' : 'Account Status'}</span>
              <span className="info-value status-active">
                ● {lang === 'th' ? 'ใช้งานได้' : 'Active'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">{lang === 'th' ? 'เข้าสู่ระบบล่าสุด' : 'Last Login'}</span>
              <span className="info-value">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">{lang === 'th' ? 'สมัครสมาชิกเมื่อ' : 'Member Since'}</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </NPUCard>
      </div>
    </div>
  );
};

export default ProfilePage;
