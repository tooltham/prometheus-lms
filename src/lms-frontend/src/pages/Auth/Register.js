import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import API from '../../utils/api';
import { useLanguage } from '../../store/LanguageContext';
import { NPUButton } from '../../components/UI/UIComponents';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    educationLevel: 'ประกาศนียบัตรวิชาชีพ',
    department: 'ช่างไฟฟ้า'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError(lang === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
    }

    setLoading(true);

    try {
      await API.post('/users/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        educationLevel: formData.educationLevel,
        department: formData.department
      });
      navigate('/waiting-approval');
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'th' ? 'การสมัครสมาชิกล้มเหลว โปรดลองอีกครั้ง' : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const eduLevels = ['ประกาศนียบัตรวิชาชีพ', 'ประกาศนียบัตรวิชาชีพชั้นสูง', 'ปริญญาตรี'];
  const depts = [
    'ช่างไฟฟ้า', 'ช่างอิเล็กทรอนิกส์', 'ช่างยนต์', 'การบัญชี', 'การตลาด', 
    'เทคโนโลยีธุรกิจดิจิทัล', 'เทคนิคเครื่องกล', 'วิศวกรรมหุ่นยนต์และระบบอัตโนมัติ', 
    'วิศวกรรมซ่อมบำรุงอุตสาหกรรมและระบบอัตโนมัติ'
  ];

  return (
    <div className="auth-page npu-gradient flex-center">
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', zIndex: 100 }}>
        <button 
          onClick={() => setLang('th')} 
          style={{ background: lang === 'th' ? 'var(--npu-gold)' : 'transparent', color: lang === 'th' ? '#0d2750' : 'white', border: '1px solid var(--npu-gold)', padding: '0.4rem 0.8rem', borderRadius: '4px 0 0 4px', cursor: 'pointer', fontWeight: 'bold' }}
        >TH</button>
        <button 
          onClick={() => setLang('en')} 
          style={{ background: lang === 'en' ? 'var(--npu-gold)' : 'transparent', color: lang === 'en' ? '#0d2750' : 'white', border: '1px solid var(--npu-gold)', padding: '0.4rem 0.8rem', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold' }}
        >EN</button>
      </div>
      <div className="auth-card glass fade-in" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <FaGraduationCap className="auth-logo-icon" />
          <h2>PROMETHEUS LMS</h2>
          <p>{lang === 'th' ? 'สร้างบัญชีผู้ใช้ใหม่' : 'Create your NPU account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="input-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group">
              <input 
                name="firstName"
                placeholder={lang === 'th' ? 'ชื่อ' : 'First Name'} 
                value={formData.firstName} 
                onChange={handleChange}
                required 
              />
            </div>
            <div className="input-group">
              <input 
                name="lastName"
                placeholder={lang === 'th' ? 'นามสกุล' : 'Last Name'} 
                value={formData.lastName} 
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <input 
              name="studentId"
              placeholder={lang === 'th' ? 'รหัสนักศึกษา (Student ID)' : 'Student ID'} 
              value={formData.studentId} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <select 
              name="educationLevel" 
              value={formData.educationLevel} 
              onChange={handleChange}
              className="npu-select"
              required
            >
              <option value="" disabled>{lang === 'th' ? '-- เลือกระดับการศึกษา --' : '-- Select Education Level --'}</option>
              {eduLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>

          <div className="input-group">
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange}
              className="npu-select"
              required
            >
              <option value="" disabled>{lang === 'th' ? '-- เลือกสาขาวิชา --' : '-- Select Department --'}</option>
              {depts.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>

          <div className="input-group has-icon">
            <FaEnvelope className="input-icon" />
            <input 
              name="email"
              type="email" 
              placeholder={lang === 'th' ? 'อีเมลแอดเดรส' : 'Email Address'} 
              value={formData.email} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group has-icon">
            <FaLock className="input-icon" />
            <input 
              name="password"
              type="password" 
              placeholder={lang === 'th' ? 'รหัสผ่าน' : 'Password'} 
              value={formData.password} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group has-icon">
            <FaLock className="input-icon" />
            <input 
              name="confirmPassword"
              type="password" 
              placeholder={lang === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm Password'} 
              value={formData.confirmPassword} 
              onChange={handleChange}
              required 
            />
          </div>

          <NPUButton 
            type="submit" 
            variant="accent" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (lang === 'th' ? 'กำลังดำเนินการ...' : 'Processing...') : (lang === 'th' ? 'สมัครสมาชิก' : 'Register Now')} <FaUserPlus />
          </NPUButton>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          <p>{lang === 'th' ? 'มีบัญชีอยู่แล้ว?' : 'Already have an account?'} <Link to="/login">{lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
