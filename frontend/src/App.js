import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FAQ from './pages/FAQ';

// User pages
import Services from './pages/user/Services';
import ServiceDetail from './pages/user/ServiceDetail';
import UserDashboard from './pages/user/Dashboard';
import AIChat from './pages/user/AIChat';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

import './styles/global.css';

// Protected route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { isLoggedIn, isAdmin } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/faq" element={<FAQ />} />

        {/* User protected */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute><UserDashboard defaultTab="bookings" /></ProtectedRoute>} />
        <Route path="/dashboard/saved" element={<ProtectedRoute><UserDashboard defaultTab="saved" /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><UserDashboard defaultTab="profile" /></ProtectedRoute>} />
        <Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />

        {/* Admin protected */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminDashboard defaultTab="bookings" /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminDashboard defaultTab="users" /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute adminOnly><AdminDashboard defaultTab="services" /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 70 }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>🏚️</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 12 }}>Page Not Found</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This page doesn't exist or has moved.</p>
            <a href="/" className="btn btn-primary">Go Home →</a>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              borderRadius: 12,
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#22C55E', secondary: 'white' } },
            error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
