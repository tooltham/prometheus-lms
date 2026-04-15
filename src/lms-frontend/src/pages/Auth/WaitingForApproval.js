import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { NPUButton } from '../../components/UI/UIComponents';
import { useLanguage } from '../../store/LanguageContext';
import npuLogo from '../../assets/images/npu_logo.png';
import './Auth.css';

const WaitingForApproval = () => {
    const { lang } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="auth-page npu-gradient flex-center">
            <div className="auth-card glass fade-in" style={{ maxWidth: '600px' }}>
                <div className="auth-header">
                    <img 
                        src={npuLogo} 
                        alt="NPU Logo" 
                        className="auth-logo-img" 
                    />
                    <h2 style={{ fontSize: '2rem' }}>
                        {lang === 'th' ? 'สมัครสมาชิกสำเร็จ!' : 'Registration Successful!'}
                    </h2>
                </div>

                <div style={{ color: 'white', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        {lang === 'th' 
                            ? 'บัญชีของคุณกำลังอยู่ระหว่างการตรวจสอบโดยผู้สอนหรือแอดมิน' 
                            : 'Your account is currently being reviewed by an instructor or administrator.'}
                    </p>
                    <p style={{ opacity: 0.8 }}>
                        {lang === 'th'
                            ? 'ระบบจะส่งการแจ้งเตือนเมื่อบัญชีของคุณได้รับการอนุมัติ และคุณจะสามารถเข้าสู่ระบบเพื่อเริ่มเรียนได้ทันที'
                            : 'You will receive a notification once your account is approved, and you can then log in to start learning.'}
                    </p>
                </div>

                <NPUButton 
                    variant="accent" 
                    onClick={() => navigate('/login')}
                    style={{ width: '100%', padding: '1rem' }}
                >
                    <FaArrowLeft style={{ marginRight: '0.5rem' }} />
                    {lang === 'th' ? 'กลับไปหน้าเข้าสู่ระบบ' : 'Return to Login'}
                </NPUButton>
            </div>
        </div>
    );
};

export default WaitingForApproval;
