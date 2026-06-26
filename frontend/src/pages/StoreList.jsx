// src/pages/StoreList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import RatingStars from "../components/RatingStars.jsx";
import { useAuth } from "../AuthContext.jsx";

export default function StoreList() {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchStores = async (query = "") => {
    try {
      const params = {};
      if (query) params.search = query;
      const res = await api.get("/stores", { params });
      setStores(res.data.stores || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const res = await api.get("/ratings/user");
      const ratings = res.data.ratings || [];
      const map = {};
      ratings.forEach((r) => {
        map[r.store_id] = { ratingId: r.id, value: r.value };
      });
      setUserRatings(map);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(search);
  };

  const handleRate = async (storeId, value) => {
    const existing = userRatings[storeId];
    try {
      if (existing) {
        await api.patch("/ratings", { rating_id: existing.ratingId, value });
        setUserRatings((prev) => ({ ...prev, [storeId]: { ...prev[storeId], value } }));
      } else {
        const res = await api.post("/ratings", { store_id: storeId, value });
        const newRating = res.data.rating;
        setUserRatings((prev) => ({ ...prev, [storeId]: { ratingId: newRating.id, value: newRating.value } }));
      }
      // Refresh stores to update overall rating
      fetchStores(search);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Stores</h1>
        <div>
          <button onClick={() => navigate("/change-password")} style={{ marginRight: "8px" }}>Change Password</button>
          <button onClick={handleLogout} style={{ background: "#dc3545" }}>Logout</button>
        </div>
      </div>
      <form onSubmit={handleSearch} className="card" style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label>Search by Name or Address</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stores..." />
        </div>
        <button type="submit">Search</button>
      </form>
      {stores.length === 0 && <p style={{ textAlign: "center", marginTop: "16px", color: "#888" }}>No stores found.</p>}
      {stores.map((store) => (
        <div key={store.id} className="card">
          <h2>{store.name}</h2>
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Overall Rating:</strong> {store.overall_rating > 0 ? `${store.overall_rating.toFixed(1)} / 5` : "No ratings yet"}</p>
          <div>
            <strong>Your rating:</strong>
            <RatingStars
              initial={userRatings[store.id]?.value || 0}
              onChange={(val) => handleRate(store.id, val)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
