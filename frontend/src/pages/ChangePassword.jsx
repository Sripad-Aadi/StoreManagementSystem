import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function ChangePassword() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.patch('/auth/password', form);
      setMessage('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const backPath = user?.role === 'admin' ? '/owner' : '/stores';

  return (
    <div className="container">
      <div className="header">
        <h1>Change Password</h1>
        <div>
          <button onClick={() => navigate(backPath)} style={{ marginRight: '8px' }}>Back</button>
          <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <div style={{ marginBottom: '12px' }}>
          <label>Current Password</label>
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>New Password</label>
          <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>Password must be 8-16 characters with one uppercase and one special character.</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
