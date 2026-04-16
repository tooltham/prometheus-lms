import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaDownload, 
  FaStar,
  FaSearch,
  FaAward
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './StudentGrades.css';

const StudentGrades = () => {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data } = await API.get('/courses/my-courses');
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch grades', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  if (loading) return <div className="student-loading">Loading Results...</div>;

  return (
    <div className="student-grades fade-in">
      <div className="page-header-row">
        <div className="header-text">
          <h1>{lang === 'th' ? 'ผลการเรียนและคะแนน' : 'Academic Results'}</h1>
          <p>{lang === 'th' ? 'ตรวจสอบคะแนนสะสมและคำแนะนำจากผู้สอน' : 'View your cumulative grades and feedback from instructors.'}</p>
        </div>
        <button className="download-btn">
          <FaDownload /> {lang === 'th' ? 'ดาวน์โหลดใบรายงานผล' : 'Download Transcript'}
        </button>
      </div>

      <div className="gpa-banner">
        <div className="gpa-card">
          <FaGraduationCap className="gpa-icon" />
          <div className="gpa-info">
            <span className="label">{lang === 'th' ? 'เกรดเฉลี่ยสะสม' : 'Main GPA'}</span>
            <span className="value">3.85 / 4.00</span>
          </div>
        </div>
        <div className="gpa-card secondary">
          <FaAward className="gpa-icon" />
          <div className="gpa-info">
            <span className="label">{lang === 'th' ? 'หน่วยกิตที่ได้' : 'Credits Earned'}</span>
            <span className="value">42 / 120</span>
          </div>
        </div>
      </div>

      <div className="grades-table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>{lang === 'th' ? 'ชื่อวิชา' : 'Course Name'}</th>
              <th>{lang === 'th' ? 'คะแนนเก็บ' : 'Assignments'}</th>
              <th>{lang === 'th' ? 'คะแนนสอบ' : 'Exams'}</th>
              <th>{lang === 'th' ? 'เกรด' : 'Grade'}</th>
              <th>{lang === 'th' ? 'สถานะ' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(enrollment => (
              <tr key={enrollment._id}>
                <td>
                  <div className="course-cell">
                    <strong>{enrollment.course.title}</strong>
                    <span>{enrollment.course.instructor?.firstName || 'Staff'}</span>
                  </div>
                </td>
                <td>85/100</td>
                <td>92/100</td>
                <td><span className="grade-badge gold">A</span></td>
                <td>
                  <span className="status-pill success">{lang === 'th' ? 'สำเร็จ' : 'Completed'}</span>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-cell">
                  <FaSearch />
                  <p>{lang === 'th' ? 'ยังไม่มีข้อมูลผลการเรียน' : 'No academic records found.'}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="feedback-section">
        <h3>{lang === 'th' ? 'คำแนะนำล่าสุดจากผู้สอน' : 'Latest Instructor Feedback'}</h3>
        <div className="feedback-grid">
          <div className="feedback-card">
            <div className="card-top">
              <FaStar className="star-active" />
              <FaStar className="star-active" />
              <FaStar className="star-active" />
              <FaStar className="star-active" />
              <FaStar />
            </div>
            <p>"ทำผลงานได้ยอดเยี่ยมในส่วนของ React Hooks ครับ พยายามรักษามาตรฐานนี้ต่อไปนะครับ"</p>
            <div className="card-footer">
              <span>- Dr. Somchai (React Development)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
