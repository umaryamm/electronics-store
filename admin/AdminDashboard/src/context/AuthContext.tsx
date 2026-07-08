// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from '../types';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, token: null, user: null };
  });

  const login = (email: string, password: string): boolean => {
    // Exact validation match for FLOW 1 Step 2
    if (email === 'admin@example.com' && password === 'admin123') {
      const successfulAuth: AuthState = {
        isAuthenticated: true,
        token: 'simulated-jwt-admin-token-xyz123',
        user: { email, role: 'admin' }
      };
      setAuth(successfulAuth);
      localStorage.setItem('admin_auth', JSON.stringify(successfulAuth));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, token: null, user: null });
    localStorage.removeItem('admin_auth');
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