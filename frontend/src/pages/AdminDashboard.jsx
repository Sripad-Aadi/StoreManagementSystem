// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, storesRes, ratingsRes] = await Promise.all([
          api.get('/users'),
          api.get('/stores'),
          api.get('/ratings'),
        ]);
        setStats({
          users: Array.isArray(usersRes.data.user) ? usersRes.data.user.length : 0,
          stores: Array.isArray(storesRes.data.stores) ? storesRes.data.stores.length : 0,
          ratings: Array.isArray(ratingsRes.data.ratings) ? ratingsRes.data.ratings.length : 0,
        });
      } catch (e) {
        console.error('Failed to load admin stats', e);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>System Administrator Dashboard</h1>
        <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Total Users</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.users}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Total Stores</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.stores}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Total Ratings</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.ratings}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <button onClick={() => navigate('/admin/users')}>View Users</button>
        <button onClick={() => navigate('/admin/stores')}>View Stores</button>
        <button onClick={() => navigate('/admin/add-user')}>Add User</button>
        <button onClick={() => navigate('/admin/add-store')}>Add Store</button>
      </div>
    </div>
  );
}
