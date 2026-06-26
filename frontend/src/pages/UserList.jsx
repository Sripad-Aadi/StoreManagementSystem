import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function UserList() {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/users', { params });
      setUsers(res.data.user || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Users</h1>
        <div>
          <button onClick={() => navigate('/admin')} style={{ marginRight: '8px' }}>Dashboard</button>
          <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
        </div>
      </div>
      <form onSubmit={handleSearch} className="card" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label>Search (Name/Email/Address)</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
        </div>
        <div style={{ minWidth: '120px' }}>
          <label>Role</label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All</option>
            <option value="user">Normal User</option>
            <option value="admin">Store Owner</option>
            <option value="owner">System Administrator</option>
          </select>
        </div>
        <button type="submit">Filter</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-primary)', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Email</th>
            <th style={{ padding: '8px' }}>Address</th>
            <th style={{ padding: '8px' }}>Role</th>
            <th style={{ padding: '8px' }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{u.name}</td>
              <td style={{ padding: '8px' }}>{u.email}</td>
              <td style={{ padding: '8px' }}>{u.address}</td>
              <td style={{ padding: '8px' }}>{u.role === 'owner' ? 'System Administrator' : u.role === 'admin' ? 'Store Owner' : 'Normal User'}</td>
              <td style={{ padding: '8px' }}>{u.role === 'admin' && u.rating !== undefined ? u.rating : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p style={{ textAlign: 'center', marginTop: '16px', color: '#888' }}>No users found.</p>}
    </div>
  );
}
