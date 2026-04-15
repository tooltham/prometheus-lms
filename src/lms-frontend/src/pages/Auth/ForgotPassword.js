import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import API from '../../utils/api';
import { useLanguage } from '../../store/LanguageContext';
import { NPUButton } from '../../components/UI/UIComponents';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate API call for forgot password since endpoints vary
      await API.post('/users/forgot-password', { email });
      setSuccess(lang === 'th' ? 'เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว' : 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'th' ? 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง' : 'Failed to process request. Please try again.'));
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
            src="https://upload.wikimedia.org/wikipedia/th/a/a3/Nakhon_Phanom_University_Logo.svg" 
            alt="NPU Logo" 
            className="auth-logo-img" 
          />
          <h2>PROMETHEUS LMS</h2>
          <p>{lang === 'th' ? 'กู้คืนรหัสผ่านของคุณ' : 'Recover your password'}</p>
        </div>

        {success ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--status-success)', fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
            <p style={{ color: 'white', marginBottom: '2rem' }}>{success}</p>
            <NPUButton onClick={() => navigate('/login')} variant="accent" style={{ width: '100%' }}>
              <FaArrowLeft /> {lang === 'th' ? 'กลับไปหน้าเข้าสู่ระบบ' : 'Back to Login'}
            </NPUButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '1rem', textAlign: 'left' }}>
              {lang === 'th' ? 'กรุณากรอกอีเมลที่ใช้สมัครบัญชี เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้คุณ' : 'Enter the email address associated with your account and we\'ll send you a link to reset your password.'}
            </p>

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

            <NPUButton 
              type="submit" 
              variant="accent" 
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (lang === 'th' ? 'กำลังดำเนินการ...' : 'Processing...') : (lang === 'th' ? 'ส่งลิงก์รีเซ็ตรหัสผ่าน' : 'Send Reset Link')} <FaArrowRight />
            </NPUButton>
          </form>
        )}

        {!success && (
          <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FaArrowLeft /> {lang === 'th' ? 'กลับไปหน้าเข้าสู่ระบบ' : 'Back to Login'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
