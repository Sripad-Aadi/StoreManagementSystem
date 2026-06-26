import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function StoreListAdmin() {
  const { logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      const res = await api.get('/stores', { params });
      setStores(res.data.stores || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Stores</h1>
        <div>
          <button onClick={() => navigate('/admin')} style={{ marginRight: '8px' }}>Dashboard</button>
          <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
        </div>
      </div>
      <form onSubmit={handleSearch} className="card" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label>Search (Name/Address)</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
        </div>
        <button type="submit">Filter</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-primary)', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Email</th>
            <th style={{ padding: '8px' }}>Address</th>
            <th style={{ padding: '8px' }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{s.name}</td>
              <td style={{ padding: '8px' }}>{s.email}</td>
              <td style={{ padding: '8px' }}>{s.address}</td>
              <td style={{ padding: '8px' }}>{s.overall_rating > 0 ? s.overall_rating.toFixed(1) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {stores.length === 0 && <p style={{ textAlign: 'center', marginTop: '16px', color: '#888' }}>No stores found.</p>}
    </div>
  );
}
