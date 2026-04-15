import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { NPUCard } from '../../components/UI/UIComponents';
import { useLanguage } from '../../store/LanguageContext';
import API from '../../utils/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const { lang } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/users');
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
        setError('Unauthorized or error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await API.put(`/users/approve/${userId}`);
      setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  return (
    <div className="admin-panel fade-in">
      <div className="portal-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--npu-navy)' }}>{lang === 'th' ? 'การจัดการระบบ (Admin)' : 'Admin Panel'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{lang === 'th' ? 'การจัดการผู้ใช้งานทั้งหมดในระบบ' : 'System Wide User Management'}</p>
      </div>

      {error ? (
        <div style={{ color: 'var(--status-danger)', padding: '1rem', background: '#ffebee', borderRadius: '8px' }}>
          {error}
        </div>
      ) : loading ? (
        <div className="flex-center" style={{ height: '200px' }}>Loading...</div>
      ) : (
        <NPUCard title={lang === 'th' ? 'รายชื่อผู้ใช้งานทั้งหมด' : 'All Registered Users'}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'รหัสนักศึกษา' : 'Student ID'}</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'ชื่อ - นามสกุล' : 'Name'}</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'ระดับ' : 'Level'}</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'สาขา' : 'Department'}</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'บทบาท' : 'Role'}</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{lang === 'th' ? 'การกระทำ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace' }}>{user.studentId || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{user.firstName} {user.lastName}</td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>{user.educationLevel || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>{user.department || '-'}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: user.role === 'admin' ? '#ffebee' : user.role === 'instructor' ? '#fff3e0' : '#e3f2fd',
                        color: user.role === 'admin' ? '#c62828' : user.role === 'instructor' ? '#ef6c00' : '#1565c0'
                      }}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: user.isApproved ? '#e8f5e9' : '#fff3e0',
                        color: user.isApproved ? '#2e7d32' : '#ef6c00'
                      }}>
                        {user.isApproved ? (lang === 'th' ? 'อนุมัติแล้ว' : 'Approved') : (lang === 'th' ? 'รออนุมัติ' : 'Pending')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', display: 'flex', gap: '0.5rem' }}>
                      {!user.isApproved && (
                        <button 
                          onClick={() => handleApprove(user._id)}
                          style={{ background: 'var(--status-success)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Approve
                        </button>
                      )}
                      <button style={{ background: 'none', border: 'none', color: 'var(--npu-gold)', cursor: 'pointer', padding: '0.5rem' }} title="Edit"><FaEdit /></button>
                      <button style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '0.5rem' }} title="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NPUCard>
      )}
    </div>
  );
};

export default AdminPanel;
