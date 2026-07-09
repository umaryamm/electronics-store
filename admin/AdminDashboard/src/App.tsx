// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProductsList } from './pages/ProductsList';
import { ProductForm } from './pages/ProductForm';
import { OrdersList } from './pages/OrdersList';
import { ClientQueries } from './pages/ClientQueries'; 
import { ProjectsList } from './pages/ProjectsList';
import { ProjectForm } from './pages/ProjectForm';
import { BlogsManager } from './pages/BlogsManager';
import { BlogForm } from './pages/BlogForm';
import { CategoriesManager } from './pages/CategoriesManager'; // Cleaned up import positioning

// High-Order Component to protect pages from unauthenticated access
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();

  // If user isn't logged in, redirect them immediately to admin login page
  if (!auth.isAuthenticated || auth.user?.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  // If authorized, inject the custom navigational Admin Shell Layout
  return <AdminLayout>{children}</AdminLayout>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Publicly accessible Admin Authentication Entry Gate */}
          <Route path="/admin/login" element={<Login />} />

          {/* Secure Admin Dashboard Ecosystem Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedAdminRoute>
                <ProductsList />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/products/new" 
            element={
              <ProtectedAdminRoute>
                <ProductForm />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/products/edit/:id" 
            element={
              <ProtectedAdminRoute>
                <ProductForm />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/blogs" 
            element={
              <ProtectedAdminRoute>
                <BlogsManager />
              </ProtectedAdminRoute>
            } 
          />
          <Route
            path="/admin/blogs/new"
            element={
              <ProtectedAdminRoute>
                <BlogForm />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/blogs/edit/:id"
            element={
              <ProtectedAdminRoute>
                <BlogForm />
              </ProtectedAdminRoute>
            }
          />
          {/* Secure Route configuration for Category Management Interface */}
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedAdminRoute>
                <CategoriesManager />
              </ProtectedAdminRoute>
            } 
          />

          <Route 
            path="/admin/orders" 
            element={
              <ProtectedAdminRoute>
                <OrdersList />
              </ProtectedAdminRoute>
            } 
          />

          {/* Secure Route configuration for Client Queries Interface */}
          <Route 
            path="/admin/queries" 
            element={
              <ProtectedAdminRoute>
                <ClientQueries />
              </ProtectedAdminRoute>
            } 
          />

          {/* Project Portfolio Management Routes */}
          <Route
            path="/admin/projects"
            element={
              <ProtectedAdminRoute>
                <ProjectsList />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/projects/new"
            element={
              <ProtectedAdminRoute>
                <ProjectForm />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/projects/edit/:id"
            element={
              <ProtectedAdminRoute>
                <ProjectForm />
              </ProtectedAdminRoute>
            }
          />

          {/* Dynamic Fallback Redirection Wildcard Route */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}