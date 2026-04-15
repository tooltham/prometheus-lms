import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaCheckCircle, FaChevronLeft, FaQuestionCircle } from 'react-icons/fa';
import API from '../../utils/api';
import { NPUButton, NPUCard } from '../../components/UI/UIComponents';
import { useLanguage } from '../../store/LanguageContext';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await API.get(`/courses/${id}`);
        setCourse(data);
      } catch (err) {
        console.error('Failed to fetch course detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="flex-center" style={{ height: '100vh', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'กำลังโหลด...' : 'Loading...'}</div>;

  return (
    <div className="course-detail-page fade-in">
      <div className="course-detail-header">
        <Link to="/courses" className="back-link"><FaChevronLeft /> {lang === 'th' ? 'กลับไปหน้าคอร์ส' : 'Back to Courses'}</Link>
        <h1>{course?.title || (lang === 'th' ? 'รายละเอียดคอร์ส' : 'Course Details')}</h1>
        <p>{course?.description || (lang === 'th' ? 'เรียนรู้พื้นฐานของคอร์สนี้กับผู้สอนผู้เชี่ยวชาญจาก มหาวิทยาลัยนครพนม' : 'Learn the fundamentals of this course with NPU expert instructors.')}</p>
      </div>

      <div className="course-grid">
        <div className="course-main">
          <div className="video-player-container npu-gradient flex-center">
            <FaPlay className="play-icon" />
            <p>{lang === 'th' ? 'ตัวเล่นวิดีโอ (กำลังพัฒนา)' : 'Video Player Placeholder'}</p>
          </div>
          
          <div className="course-info-tabs">
            <NPUCard title={lang === 'th' ? 'เกี่ยวกับคอร์สนี้' : 'About this course'}>
              <p>{course?.description}</p>
              <div className="course-meta">
                <span><strong>{lang === 'th' ? 'ผู้สอน:' : 'Instructor:'}</strong> {course?.instructor?.firstName} {course?.instructor?.lastName}</span>
                <span><strong>{lang === 'th' ? 'หมวดหมู่:' : 'Category:'}</strong> {course?.category}</span>
                <span><strong>{lang === 'th' ? 'อัปเดตล่าสุด:' : 'Last Updated:'}</strong> {new Date(course?.updatedAt).toLocaleDateString()}</span>
              </div>
            </NPUCard>
          </div>
        </div>

        <div className="course-sidebar">
          <NPUCard title={lang === 'th' ? 'เนื้อหาคอร์ส' : 'Course Content'}>
            <div className="content-list">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className={`content-item ${idx === 1 ? 'active' : ''}`}>
                  <div className="item-icon">
                    {idx === 1 ? <FaPlay /> : <FaCheckCircle className="completed" />}
                  </div>
                  <div className="item-info">
                    <span className="item-title">{lang === 'th' ? `บทเรียนที่ ${idx}: เริ่มต้นกันเลย` : `Lesson ${idx}: Getting Started`}</span>
                    <span className="item-duration">15:00</span>
                  </div>
                </div>
              ))}
            </div>
            <NPUButton variant="primary" className="full-width" style={{ marginTop: '1.5rem' }}>
              {lang === 'th' ? 'ทำแบบทดสอบ' : 'Final Quiz'} <FaQuestionCircle />
            </NPUButton>
          </NPUCard>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
