// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'owner') navigate('/admin');
      else if (loggedUser.role === 'admin') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="card">
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
}
