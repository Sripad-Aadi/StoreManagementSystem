// src/pages/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storesRes = await api.get("/stores");
        const ownedStore = storesRes.data.stores.find((s) => s.owner_id === user.id);
        if (!ownedStore) return;
        setStore(ownedStore);
        const [ratingsRes, avgRes] = await Promise.all([
          api.get(`/ratings/store/${ownedStore.id}`),
          api.get(`/ratings/store/${ownedStore.id}/average`),
        ]);
        setRatings(ratingsRes.data.ratings || []);
        setAverage(avgRes.data.average);
      } catch (err) {
        console.error("OwnerDashboard fetch error", err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!store)
    return (
      <div className="container">
        <div className="header">
          <h2>No store assigned to this owner.</h2>
          <button onClick={handleLogout} style={{ background: "#dc3545" }}>Logout</button>
        </div>
      </div>
    );

  return (
    <div className="container">
      <div className="header">
        <h1>Store Owner Dashboard</h1>
        <div>
          <button onClick={() => navigate("/change-password")} style={{ marginRight: "8px" }}>Change Password</button>
          <button onClick={handleLogout} style={{ background: "#dc3545" }}>Logout</button>
        </div>
      </div>
      <h2>{store.name}</h2>
      <p><strong>Address:</strong> {store.address}</p>
      <div className="card" style={{ textAlign: "center" }}>
        <h3>Average Rating</h3>
        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-primary)" }}>
          {average !== null ? average.toFixed(2) : "--"} / 5
        </p>
      </div>
      <h3>Users Who Rated This Store</h3>
      {ratings.length === 0 && <p style={{ color: "#888" }}>No ratings yet.</p>}
      {ratings.map((r) => (
        <div key={r.id} className="card">
          <p><strong>User:</strong> {r.user_name}</p>
          <p><strong>Rating:</strong> {"★".repeat(r.value)}{"☆".repeat(5 - r.value)} ({r.value}/5)</p>
        </div>
      ))}
    </div>
  );
}
