import React, { createContext, useContext, useState } from 'react';
import api, { STORAGE_KEY } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; }
  });

  const persist = (data) => {
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/api/auth/register', { name, email, password, phone });
    persist(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: !!user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
