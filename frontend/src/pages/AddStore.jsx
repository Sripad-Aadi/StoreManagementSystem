import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function AddStore() {
  const { logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/stores', { ...form, owner_id: parseInt(form.owner_id) });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Add New Store</h1>
        <div>
          <button onClick={() => navigate('/admin')} style={{ marginRight: '8px' }}>Dashboard</button>
          <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="card">
        <div style={{ marginBottom: '12px' }}>
          <label>Store Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Owner ID (Store Owner user ID)</label>
          <input type="number" name="owner_id" value={form.owner_id} onChange={handleChange} required />
        </div>
        <button type="submit">Create Store</button>
      </form>
    </div>
  );
}
