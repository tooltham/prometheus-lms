import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaEye, 
  FaEdit, 
  FaTrashAlt,
  FaSearch,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import API from '../../utils/api';
import { useLanguage } from '../../store/LanguageContext';
import { NPUButton } from '../../components/UI/UIComponents';
import './AdminCourseManagement.css';

const AdminCourseManagement = () => {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/courses');
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      const endpoint = currentStatus ? `/courses/${courseId}` : `/courses/${courseId}/publish`;
      // If updating (unpublishing), we'd need a general update endpoint on the backend.
      // For now, let's just use the publish endpoint for simplicity.
      await API.put(endpoint, { isPublished: !currentStatus });
      fetchCourses();
    } catch (err) {
      alert('Failed to update course status');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm(lang === 'th' ? 'ต้องการลบคอร์สนี้ใช่หรือไม่?' : 'Delete this course?')) return;
    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-course-mgmt fade-in">
      <div className="mgmt-header">
        <div className="header-title">
          <h2>{lang === 'th' ? 'จัดการหลักสูตร' : 'Course Management'}</h2>
          <p>{lang === 'th' ? `พบทั้งหมด ${filteredCourses.length} รายวิชา` : `Total ${filteredCourses.length} courses found`}</p>
        </div>
        <NPUButton variant="accent">
          <FaPlus style={{ marginRight: '8px' }} />
          {lang === 'th' ? 'สร้างคอร์สใหม่' : 'Create New Course'}
        </NPUButton>
      </div>

      <div className="control-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder={lang === 'th' ? 'ค้นหาชื่อคอร์ส หรือชื่อผู้สอน...' : 'Search by course title or instructor...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <button className="filter-pill active">{lang === 'th' ? 'ทั้งหมด' : 'All'}</button>
          <button className="filter-pill">{lang === 'th' ? 'เผยแพร่แล้ว' : 'Published'}</button>
          <button className="filter-pill">{lang === 'th' ? 'ฉบับร่าง' : 'Drafts'}</button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading courses...</div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map(course => (
            <div key={course._id} className="admin-course-card shadow-premium">
              <div className="course-card-image">
                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'} alt={course.title} />
                <div className={`course-status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                  {course.isPublished ? (lang === 'th' ? 'เผยแพร่แล้ว' : 'Published') : (lang === 'th' ? 'ฉบับร่าง' : 'Draft')}
                </div>
              </div>
              <div className="course-card-content">
                <span className="course-category">{course.category || 'General'}</span>
                <h3 className="course-title">{course.title}</h3>
                <div className="course-meta">
                  <div className="meta-item">
                    <FaChalkboardTeacher />
                    <span>{course.instructor?.firstName} {course.instructor?.lastName}</span>
                  </div>
                  <div className="meta-item">
                    <FaUsers />
                    <span>{course.totalEnrolled || 0} {lang === 'th' ? 'นักเรียน' : 'Students'}</span>
                  </div>
                </div>
              </div>
              <div className="course-card-actions">
                <button className="card-btn btn-view" title="Preview"><FaEye /></button>
                <button className="card-btn btn-edit" title="Edit"><FaEdit /></button>
                <button 
                  className={`card-btn btn-status ${course.isPublished ? 'active' : ''}`} 
                  onClick={() => handleTogglePublish(course._id, course.isPublished)}
                  title={course.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {course.isPublished ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button className="card-btn btn-delete" onClick={() => handleDelete(course._id)} title="Delete"><FaTrashAlt /></button>
              </div>
            </div>
          ))}

          {/* Add New Placeholder Card */}
          <div className="add-course-card" onClick={() => {}}>
            <div className="add-inner">
              <FaPlus />
              <span>{lang === 'th' ? 'เพิ่มคอร์สใหม่' : 'Add New Course'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManagement;
