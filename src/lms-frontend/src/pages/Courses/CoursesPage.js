import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaBook, FaPlayCircle, FaCheckCircle,
  FaClock, FaUsers, FaStar, FaFilter
} from 'react-icons/fa';
import { NPUButton } from '../../components/UI/UIComponents';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './CoursesPage.css';

const CoursesPage = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState('enrolled');

  const categories = ['Technology', 'Business', 'Design', 'Marketing', 'Health', 'Science', 'Other'];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const [enrolledRes, allRes] = await Promise.all([
          API.get('/courses/my-courses'),
          API.get('/courses')
        ]);
        setEnrolledCourses(enrolledRes.data);
        setAllCourses(allRes.data?.courses || allRes.data || []);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await API.post(`/courses/${courseId}/enroll`);
      // Refresh enrolled courses
      const res = await API.get('/courses/my-courses');
      setEnrolledCourses(res.data);
      alert(lang === 'th' ? 'ลงทะเบียนสำเร็จ!' : 'Enrolled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    }
  };

  const enrolledIds = new Set(enrolledCourses.map(e => e.course?._id));

  const filteredAll = allCourses.filter(c => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || c.category === category;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="courses-loading flex-center">
        <div className="loading-spinner"></div>
        <p>{lang === 'th' ? 'กำลังโหลด...' : 'Loading courses...'}</p>
      </div>
    );
  }

  return (
    <div className="courses-page fade-in">
      {/* Tab Navigation */}
      <div className="courses-tabs">
        <button
          className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
          onClick={() => setActiveTab('enrolled')}
        >
          <FaBook /> {lang === 'th' ? `คอร์สของฉัน (${enrolledCourses.length})` : `My Courses (${enrolledCourses.length})`}
        </button>
        <button
          className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          <FaSearch /> {lang === 'th' ? 'ค้นหาคอร์ส' : 'Browse Courses'}
        </button>
      </div>

      {/* ======= TAB: MY ENROLLED COURSES ======= */}
      {activeTab === 'enrolled' && (
        <div className="enrolled-section">
          <h2>{lang === 'th' ? 'คอร์สที่ลงทะเบียน' : 'Enrolled Courses'}</h2>

          {enrolledCourses.length === 0 ? (
            <div className="empty-state-card glass">
              <FaBook className="empty-icon" />
              <h3>{lang === 'th' ? 'ยังไม่มีคอร์สที่ลงทะเบียน' : 'No enrolled courses yet'}</h3>
              <p>{lang === 'th' ? 'ไปหาคอร์สที่คุณสนใจแล้วลงทะเบียนเรียนเลย!' : 'Browse courses and start learning!'}</p>
              <NPUButton variant="accent" onClick={() => setActiveTab('browse')}>
                {lang === 'th' ? 'ค้นหาคอร์ส' : 'Browse Courses'}
              </NPUButton>
            </div>
          ) : (
            <div className="course-cards-grid">
              {enrolledCourses.map(enrollment => (
                <div key={enrollment._id} className="course-card glass">
                  <div className="course-card-thumb npu-gradient">
                    <FaPlayCircle className="play-overlay-icon" />
                  </div>
                  <div className="course-card-body">
                    <h4>{enrollment.course?.title || 'Unknown Course'}</h4>
                    <p className="course-instructor">
                      {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                    </p>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${enrollment.progress}%` }}></div>
                      </div>
                      <span className="progress-label">{enrollment.progress}%</span>
                    </div>
                    <div className="course-card-status">
                      {enrollment.progress === 100
                        ? <span className="status-badge completed"><FaCheckCircle /> {lang === 'th' ? 'เรียนจบแล้ว' : 'Completed'}</span>
                        : <span className="status-badge in-progress">{lang === 'th' ? 'กำลังเรียน' : 'In Progress'}</span>
                      }
                    </div>
                  </div>
                  <div className="course-card-footer">
                    <NPUButton
                      variant="primary"
                      className="full-width"
                      onClick={() => navigate(`/courses/${enrollment.course?._id}`)}
                    >
                      {enrollment.progress === 100
                        ? (lang === 'th' ? 'ทบทวนบทเรียน' : 'Review')
                        : (lang === 'th' ? 'เรียนต่อ' : 'Continue')}
                    </NPUButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======= TAB: BROWSE ALL COURSES ======= */}
      {activeTab === 'browse' && (
        <div className="browse-section">
          {/* Search & Filter */}
          <div className="browse-filters glass">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={lang === 'th' ? 'ค้นหาคอร์ส...' : 'Search courses...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-bar">
              <FaFilter />
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">{lang === 'th' ? 'ทุกประเภท' : 'All Categories'}</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {filteredAll.length === 0 ? (
            <div className="empty-state-card glass">
              <FaSearch className="empty-icon" />
              <h3>{lang === 'th' ? 'ไม่พบคอร์สที่ค้นหา' : 'No courses found'}</h3>
              <p>{lang === 'th' ? 'ลองค้นหาด้วยคำอื่น หรือล้าง Filter' : 'Try different keywords or clear filters'}</p>
            </div>
          ) : (
            <div className="course-cards-grid">
              {filteredAll.map(course => {
                const isEnrolled = enrolledIds.has(course._id);
                return (
                  <div key={course._id} className="course-card glass">
                    <div className="course-card-thumb npu-gradient">
                      <FaPlayCircle className="play-overlay-icon" />
                      <span className="level-badge">{course.level}</span>
                    </div>
                    <div className="course-card-body">
                      <span className="course-category-tag">{course.category}</span>
                      <h4>{course.title}</h4>
                      <p className="course-description">{course.description?.slice(0, 80)}...</p>
                      <p className="course-instructor">
                        {lang === 'th' ? 'สอนโดย' : 'By'}: {course.instructor?.firstName} {course.instructor?.lastName}
                      </p>
                      <div className="course-meta-row">
                        <span><FaClock /> {course.duration} {lang === 'th' ? 'ชม.' : 'hrs'}</span>
                        <span><FaUsers /> {course.totalEnrolled}</span>
                        {course.rating > 0 && <span><FaStar /> {course.rating.toFixed(1)}</span>}
                      </div>
                    </div>
                    <div className="course-card-footer">
                      {isEnrolled ? (
                        <NPUButton
                          variant="outline"
                          className="full-width"
                          onClick={() => navigate(`/courses/${course._id}`)}
                        >
                          {lang === 'th' ? '✅ ลงทะเบียนแล้ว' : '✅ Enrolled'}
                        </NPUButton>
                      ) : (
                        <NPUButton
                          variant="accent"
                          className="full-width"
                          onClick={() => handleEnroll(course._id)}
                        >
                          {lang === 'th' ? 'ลงทะเบียนเรียน' : 'Enroll Now'}
                        </NPUButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
