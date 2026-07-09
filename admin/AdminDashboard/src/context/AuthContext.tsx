// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { AuthState } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, token: null, user: null };
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // ============================================================
    // TEMPORARY DEV BYPASS — Neon DB is currently unreachable.
    // Remove this block once the DB is confirmed stable again.
    // This only unlocks the admin UI locally; any request that hits
    // the real backend (e.g. saving a project) will still fail auth
    // because 'dev-bypass-token' is not a real JWT.
    // ============================================================
    if (email === 'admin@example.com' && password === 'admin123') {
      const successfulAuth: AuthState = {
        isAuthenticated: true,
        token: 'dev-bypass-token',
        user: { id: 0, name: 'Dev Admin', email, role: 'ADMIN' }
      };
      setAuth(successfulAuth);
      localStorage.setItem('admin_auth', JSON.stringify(successfulAuth));
      localStorage.setItem('token', 'dev-bypass-token');
      return true;
    }
    // ============================================================
    // END TEMPORARY DEV BYPASS
    // ============================================================

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;

      if (!token || user?.role !== 'ADMIN') {
        return false;
      }

      const successfulAuth: AuthState = {
        isAuthenticated: true,
        token,
        user
      };

      setAuth(successfulAuth);
      localStorage.setItem('admin_auth', JSON.stringify(successfulAuth));
      localStorage.setItem('token', token);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, token: null, user: null });
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};