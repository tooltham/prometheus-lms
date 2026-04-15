import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import API from '../../utils/api';
import { useLanguage } from '../../store/LanguageContext';
import { NPUButton } from '../../components/UI/UIComponents';
import npuLogo from '../../assets/images/npu_logo.png';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/users/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'th' ? 'การเข้าสู่ระบบล้มเหลว โปรดตรวจสอบข้อมูลของคุณ' : 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page npu-gradient flex-center">
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex' }}>
        <button 
          onClick={() => setLang('th')} 
          style={{ background: lang === 'th' ? 'var(--npu-gold)' : 'transparent', color: lang === 'th' ? '#0d2750' : 'white', border: '1px solid var(--npu-gold)', padding: '0.4rem 0.8rem', borderRadius: '4px 0 0 4px', cursor: 'pointer', fontWeight: 'bold' }}
        >TH</button>
        <button 
          onClick={() => setLang('en')} 
          style={{ background: lang === 'en' ? 'var(--npu-gold)' : 'transparent', color: lang === 'en' ? '#0d2750' : 'white', border: '1px solid var(--npu-gold)', padding: '0.4rem 0.8rem', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold' }}
        >EN</button>
      </div>
      <div className="auth-card glass fade-in">
        <div className="auth-header">
          <img 
            src={npuLogo} 
            alt="NPU Logo" 
            className="auth-logo-img" 
          />
          <h2>PROMETHEUS LMS</h2>
          <p>{t('welcome')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="input-group has-icon">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              placeholder={lang === 'th' ? 'อีเมลแอดเดรส' : 'Email Address'} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group has-icon">
            <FaLock className="input-icon" />
            <input 
              type="password" 
              placeholder={lang === 'th' ? 'รหัสผ่าน' : 'Password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <NPUButton 
            type="submit" 
            variant="accent" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (lang === 'th' ? 'กำลังเข้าสู่ระบบ...' : 'Logging in...') : (lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign In')} <FaArrowRight />
          </NPUButton>
        </form>

        <div className="auth-footer">
          <p>{lang === 'th' ? 'ยังไม่มีบัญชีผู้ใช้?' : "Don't have an account?"} <Link to="/register">{lang === 'th' ? 'สมัครสมาชิกที่นี่' : 'Register here'}</Link></p>
          <Link to="/forgot-password">{lang === 'th' ? 'ลืมรหัสผ่าน?' : 'Forgot password?'}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
