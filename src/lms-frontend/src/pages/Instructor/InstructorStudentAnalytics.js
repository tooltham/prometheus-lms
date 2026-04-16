import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaCheck, 
  FaTrashAlt,
  FaFileExport,
  FaEnvelope,
  FaChartBar,
  FaUserGraduate
} from 'react-icons/fa';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './InstructorStudentAnalytics.css';

const InstructorStudentAnalytics = () => {
  const { lang } = useLanguage();
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users and filter for students awaiting approval
        const { data: userData } = await API.get('/users');
        const pending = userData.filter(u => !u.isApproved && u.role === 'student');
        setPendingStudents(pending);

        // Mocking enrolled students for "All Students" view
        // In a real app, we would fetch students enrolled in the instructor's courses
        const approved = userData.filter(u => u.isApproved && u.role === 'student').slice(0, 10);
        setStudents(approved.map(s => ({
            ...s,
            progress: Math.floor(Math.random() * 100),
            lastActive: '2 days ago'
        })));
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await API.put(`/users/approve/${userId}`);
      setPendingStudents(pendingStudents.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to approve student');
    }
  };

  const displayedStudents = activeTab === 'all' ? students : pendingStudents;
  const filteredStudents = displayedStudents.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId && s.studentId.includes(searchTerm))
  );

  return (
    <div className="instructor-students fade-in">
      <div className="students-header">
        <div className="header-info">
          <h1>{lang === 'th' ? 'การจัดการนักศึกษา' : 'Student Management'}</h1>
          <p>{lang === 'th' ? 'ติดตามความคืบหน้าและประเมินผลการเรียนของนักศึกษา' : 'Track progress and evaluate student performance'}</p>
        </div>
        <button className="export-btn">
          <FaFileExport /> {lang === 'th' ? 'ส่งออกรายงาน' : 'Export Reports'}
        </button>
      </div>

      <div className="students-tabs">
        <button 
          className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {lang === 'th' ? 'นักเรียนทั้งหมด' : 'All Students'}
          <span className="count-badge">{students.length}</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          {lang === 'th' ? 'รออนุมัติ' : 'Pending Approval'}
          {pendingStudents.length > 0 && <span className="count-badge urgent">{pendingStudents.length}</span>}
        </button>
      </div>

      <div className="students-controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder={lang === 'th' ? 'ค้นหาด้วยชื่อ หรือรหัสนักศึกษา...' : 'Search by name or student ID...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn"><FaFilter /> {lang === 'th' ? 'กรองข้อมูล' : 'Filters'}</button>
      </div>

      {loading ? (
        <div className="inst-loading">Loading student data...</div>
      ) : ( activeTab === 'all' ? (
        <div className="student-table-container">
          <table className="pro-table">
            <thead>
              <tr>
                <th>{lang === 'th' ? 'ข้อมูลนักศึกษา' : 'Student'}</th>
                <th>{lang === 'th' ? 'สาขาวิชา' : 'Department'}</th>
                <th>{lang === 'th' ? 'ความคืบหน้า' : 'Progress'}</th>
                <th>{lang === 'th' ? 'สถานะล่าสุด' : 'Status'}</th>
                <th>{lang === 'th' ? 'การจัดการ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">{student.firstName.charAt(0)}</div>
                      <div>
                        <div className="student-name">{student.firstName} {student.lastName}</div>
                        <div className="student-id">{student.studentId || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td><div className="dept-tag">{student.department || 'N/A'}</div></td>
                  <td>
                    <div className="progress-cell">
                      <span>{student.progress}%</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{width: `${student.progress}%`, background: student.progress > 80 ? '#10b981' : student.progress > 40 ? '#3b82f6' : '#f59e0b'}}></div>
                      </div>
                    </div>
                  </td>
                  <td><span className="status-dot online"></span> {student.lastActive}</td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-btn" title="View Details"><FaChartBar /></button>
                      <button className="icon-btn" title="Send Message"><FaEnvelope /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pending-grid">
           {filteredStudents.map(student => (
             <div key={student._id} className="pending-card">
               <div className="pending-header">
                 <div className="avatar-large">{student.firstName.charAt(0)}</div>
                 <div className="pending-title">
                   <h3>{student.firstName} {student.lastName}</h3>
                   <p>{student.studentId}</p>
                 </div>
               </div>
               <div className="pending-info">
                 <div className="info-row"><span>{lang === 'th' ? 'ระดับ:' : 'Level:'}</span> <strong>{student.educationLevel}</strong></div>
                 <div className="info-row"><span>{lang === 'th' ? 'สาขา:' : 'Dept:'}</span> <strong>{student.department}</strong></div>
               </div>
               <div className="pending-actions">
                 <button className="btn-approve" onClick={() => handleApprove(student._id)}>
                    <FaCheck /> {lang === 'th' ? 'อนุมัติ' : 'Approve'}
                 </button>
                 <button className="btn-reject"><FaTrashAlt /></button>
               </div>
             </div>
           ))}
           {filteredStudents.length === 0 && (
             <div className="no-data-card">
               <FaUserGraduate />
               <p>{lang === 'th' ? 'ไม่มีรายการรออนุมัติ' : 'No pending registrations'}</p>
             </div>
           )}
        </div>
      )
      )}
    </div>
  );
};

export default InstructorStudentAnalytics;
