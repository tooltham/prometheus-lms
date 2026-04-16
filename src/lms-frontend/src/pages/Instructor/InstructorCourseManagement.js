import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaEdit, 
  FaTrashAlt,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaBookReader
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './InstructorCourseManagement.css';

const InstructorCourseManagement = () => {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { data } = await API.get('/courses?limit=100');
        const myCourses = data.courses.filter(c => c.instructor?._id === user._id);
        setCourses(myCourses);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      await API.put(`/courses/${courseId}`, { isPublished: !currentStatus });
      setCourses(courses.map(c => c._id === courseId ? { ...c, isPublished: !currentStatus } : c));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="instructor-courses fade-in">
      <div className="courses-header">
        <div className="header-info">
          <h1>{lang === 'th' ? 'การจัดการบทเรียน' : 'Course Management'}</h1>
          <p>{lang === 'th' ? 'สร้างและจัดการเนื้อหาการเรียนการสอนของคุณ' : 'Build and manage your teaching content'}</p>
        </div>
        <button className="create-course-btn">
          <FaPlus /> {lang === 'th' ? 'สร้างคอร์สใหม่' : 'Create New Course'}
        </button>
      </div>

      <div className="courses-controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder={lang === 'th' ? 'ค้นหาคอร์ส...' : 'Search courses...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button className="filter-pill active">{lang === 'th' ? 'ทั้งหมด' : 'All'}</button>
          <button className="filter-pill">{lang === 'th' ? 'เผยแพร่แล้ว' : 'Published'}</button>
          <button className="filter-pill">{lang === 'th' ? 'แบบร่าง' : 'Draft'}</button>
        </div>
      </div>

      {loading ? (
        <div className="inst-loading">Loading your courses...</div>
      ) : (
        <div className="instructor-course-grid">
          {filteredCourses.map(course => (
            <div key={course._id} className="inst-course-card">
              <div className="card-image">
                <img src={course.thumbnail} alt={course.title} />
                <div className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                  {course.isPublished ? (lang === 'th' ? 'เผยแพร่' : 'Published') : (lang === 'th' ? 'แบบร่าง' : 'Draft')}
                </div>
              </div>
              
              <div className="card-body">
                <div className="card-category">{course.category || (lang === 'th' ? 'ยังไม่ได้ระบุ' : 'Uncategorized')}</div>
                <h3 className="card-title">{course.title}</h3>
                
                <div className="card-stats">
                  <div className="stat-item">
                    <FaUsers />
                    <span>{course.totalEnrolled || 0} {lang === 'th' ? 'นักเรียน' : 'Students'}</span>
                  </div>
                  <div className="stat-item">
                    <FaBookReader />
                    <span>12 {lang === 'th' ? 'บทเรียน' : 'Modules'}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="footer-actions">
                    <button className="action-btn edit" title="Edit"><FaEdit /></button>
                    <button className="action-btn view" title="View Students"><FaUsers /></button>
                    <button 
                      className={`action-btn toggle ${course.isPublished ? 'active' : ''}`} 
                      onClick={() => handleTogglePublish(course._id, course.isPublished)}
                      title={course.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {course.isPublished ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button className="action-btn delete" title="Delete"><FaTrashAlt /></button>
                  </div>
                  <button className="manage-btn">
                    {lang === 'th' ? 'จัดการเนื้อหา' : 'Manage Content'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="no-data-card">
               <FaChalkboardTeacher />
               <p>{lang === 'th' ? 'ไม่พบคอร์สที่ค้นหา' : 'No courses found'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorCourseManagement;
