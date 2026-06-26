// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
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
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
