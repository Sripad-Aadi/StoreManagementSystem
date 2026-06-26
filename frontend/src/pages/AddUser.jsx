import React, { useState } from 'react';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      navigate('/admin');
    } catch (err) {
      setError('Failed to add user');
    }
  };

  return (
    <div className="container">
      <h1>Add New User</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="card">
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="user">Normal User</option>
            <option value="admin">Store Owner</option>
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
