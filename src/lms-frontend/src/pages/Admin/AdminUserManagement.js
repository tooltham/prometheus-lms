import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaUserPlus, 
  FaCheck, 
  FaEdit, 
  FaTrashAlt,
  FaShieldAlt,
  FaCircle
} from 'react-icons/fa';
import API from '../../utils/api';
import { useLanguage } from '../../store/LanguageContext';
import { NPUButton } from '../../components/UI/UIComponents';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
  const { lang } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm(lang === 'th' ? 'คุณแน่ใจหรือไม่ว่าต้องการอนุมัติผู้ใช้นี้?' : 'Are you sure you want to approve this user?')) return;
    try {
      await API.put(`/users/approve/${userId}`);
      setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(lang === 'th' ? 'ต้องการลบผู้ใช้นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้' : 'Delete this user? This action cannot be undone.')) return;
    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesPending = !showPendingOnly || !user.isApproved;

    return matchesSearch && matchesRole && matchesPending;
  });

  return (
    <div className="admin-user-mgmt fade-in">
      <div className="mgmt-header">
        <div className="header-title">
          <h2>{lang === 'th' ? 'จัดการผู้ใช้งาน' : 'User Management'}</h2>
          <p>{lang === 'th' ? `พบทั้งหมด ${filteredUsers.length} บัญชี` : `Total ${filteredUsers.length} accounts found`}</p>
        </div>
        <NPUButton variant="accent">
          <FaUserPlus style={{ marginRight: '8px' }} />
          {lang === 'th' ? 'เพิ่มผู้ใช้ใหม่' : 'Add New User'}
        </NPUButton>
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder={lang === 'th' ? 'ค้นหาชื่อ, รหัส หรืออีเมล...' : 'Search by name, ID or email...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <select 
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">{lang === 'th' ? 'ทุกบทบาท' : 'All Roles'}</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>

          <button 
            className={`pending-toggle ${showPendingOnly ? 'active' : ''}`}
            onClick={() => setShowPendingOnly(!showPendingOnly)}
          >
            <FaFilter />
            {lang === 'th' ? 'รออนุมัติเท่านั้น' : 'Pending Only'}
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="table-container shadow-premium">
        <table className="pro-table">
          <thead>
            <tr>
              <th>{lang === 'th' ? 'ข้อมูลผู้ใช้' : 'User Info'}</th>
              <th>{lang === 'th' ? 'บทบาท' : 'Role'}</th>
              <th>{lang === 'th' ? 'สาขา / ระดับ' : 'Dept / Level'}</th>
              <th>{lang === 'th' ? 'สถานะ' : 'Status'}</th>
              <th>{lang === 'th' ? 'การจัดการ' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-5">Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-5">No users found</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className={`avatar-circle ${user.role}`}>
                        {user.firstName.charAt(0)}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{user.firstName} {user.lastName}</span>
                        <span className="user-email">{user.email}</span>
                        {user.studentId && <span className="user-id-tag">{user.studentId}</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`role-badge ${user.role}`}>
                      {user.role === 'admin' && <FaShieldAlt />}
                      {user.role.toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <div className="dept-cell">
                      <span className="dept-name">{user.department || '-'}</span>
                      <span className="edu-level">{user.educationLevel || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`status-indicator ${user.isApproved ? 'approved' : 'pending'}`}>
                      <FaCircle className="dot" />
                      {user.isApproved ? (lang === 'th' ? 'ปกติ' : 'Active') : (lang === 'th' ? 'รออนุมัติ' : 'Pending')}
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      {!user.isApproved && (
                        <button className="btn-approve" onClick={() => handleApprove(user._id)} title="Approve">
                          <FaCheck />
                        </button>
                      )}
                      <button className="btn-edit" title="Edit"><FaEdit /></button>
                      <button className="btn-delete" onClick={() => handleDelete(user._id)} title="Delete">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
