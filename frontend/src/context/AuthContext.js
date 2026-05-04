import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('hs_token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hs_token');
      const savedUser = localStorage.getItem('hs_user');
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          const { data } = await authAPI.getMe();
          setUser(data.user);
          localStorage.setItem('hs_user', JSON.stringify(data.user));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('hs_token', data.token);
    localStorage.setItem('hs_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('hs_token', data.token);
    localStorage.setItem('hs_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('hs_token');
    localStorage.removeItem('hs_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('hs_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, isLoggedIn, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
