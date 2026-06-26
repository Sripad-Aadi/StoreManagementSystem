// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, try to load user from stored token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, decode JWT or fetch user profile; here we assume token is valid
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setUser(storedUser);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user: loggedUser } = response.data.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
