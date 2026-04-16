import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaSearch, 
  FaFilter, 
  FaGraduationCap,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './StudentMyLearning.css';

const StudentMyLearning = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await API.get('/courses/my-courses');
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch enrolled courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="student-loading">Loading My Learning...</div>;

  return (
    <div className="student-my-learning fade-in">
      <div className="page-header-row">
        <div className="header-text">
          <h1>{lang === 'th' ? 'คอร์สของฉัน' : 'My Learning'}</h1>
          <p>{lang === 'th' ? 'ติดตามความกืบหน้าและเรียนต่อจากที่คุณค้างไว้' : 'Track your progress and continue where you left off.'}</p>
        </div>
        <button className="browse-btn" onClick={() => navigate('/courses')}>
          <FaSearch /> {lang === 'th' ? 'ค้นหาบทเรียนใหม่' : 'Browse All Courses'}
        </button>
      </div>

      <div className="learning-controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder={lang === 'th' ? 'ค้นหาคอร์สของคุณ...' : 'Search your courses...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button className="filter-pill active">{lang === 'th' ? 'ทั้งหมด' : 'All'}</button>
          <button className="filter-pill">{lang === 'th' ? 'กำลังเรียน' : 'In Progress'}</button>
          <button className="filter-pill">{lang === 'th' ? 'จบแล้ว' : 'Completed'}</button>
          <button className="filter-icon-btn"><FaFilter /></button>
        </div>
      </div>

      <div className="my-learning-grid">
        {filteredCourses.map(enrollment => (
          <div key={enrollment._id} className="student-course-card">
            <div className="course-card-banner">
              <span className="course-tag">{enrollment.course.category || 'General'}</span>
            </div>
            <div className="course-card-body">
              <h3>{enrollment.course.title}</h3>
              <p className="instructor-name">By {enrollment.course.instructor?.firstName || 'Staff'}</p>
              
              <div className="course-meta">
                <span><FaClock /> 12h total</span>
                <span><FaGraduationCap /> 8 Mod.</span>
              </div>

              <div className="card-progress-section">
                <div className="progress-labels">
                  <span>Progress</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <div className="pro-progress-bar">
                  <div className="fill" style={{ width: `${enrollment.progress}%` }}></div>
                </div>
              </div>

              <button className="continue-learning-btn" onClick={() => navigate(`/courses/${enrollment.course._id}`)}>
                {lang === 'th' ? 'เข้าเรียนต่อ' : 'Continue Learning'} <FaArrowRight />
              </button>
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && !loading && (
          <div className="not-found-state">
            <FaBookOpen />
            <p>{lang === 'th' ? 'ไม่พบคอร์สที่ค้นหา' : 'No courses found.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMyLearning;
