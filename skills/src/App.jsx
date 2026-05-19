import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LandingPage from './pages/LandingPage'
import { Navbar, AppShell } from './components/layout'
import { LoginPage, RegisterPage } from './components/auth/AuthPages'

import { StudentDashboard, SearchPage, SessionsPage, TeachPage, CreditsPage, RatingsPage } from './components/student/StudentPages'
import { AdminAnalytics, AdminUsers, AdminSkills, AdminBranding, AdminBilling } from './components/admin/AdminPages'
import { SuperDashboard, SuperTenants, SuperPlans, SuperRevenue, SuperTickets } from './components/superadmin/SuperAdminPages'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  
  const allowedRoles = Array.isArray(role) ? role : [role];
  if (role && !allowedRoles.includes(user.role)) {
    if (user.role === 'teacher' && allowedRoles.includes('student')) {
        // Allow teachers to access student dashboard
    } else {
        return <Navigate to="/dashboard" />
    }
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><LandingPage /></>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Student Routes */}
      <Route path="/dashboard" element={<ProtectedRoute role="student"><AppShell><StudentDashboard /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard/search" element={<ProtectedRoute role="student"><AppShell><SearchPage /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard/sessions" element={<ProtectedRoute role="student"><AppShell><SessionsPage /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard/teach" element={<ProtectedRoute role="student"><AppShell><TeachPage /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard/ratings" element={<ProtectedRoute role="student"><AppShell><RatingsPage /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard/credits" element={<ProtectedRoute role="student"><AppShell><CreditsPage /></AppShell></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="tenant_admin"><AppShell><AdminAnalytics /></AppShell></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="tenant_admin"><AppShell><AdminUsers /></AppShell></ProtectedRoute>} />
      <Route path="/admin/skills" element={<ProtectedRoute role="tenant_admin"><AppShell><AdminSkills /></AppShell></ProtectedRoute>} />
      <Route path="/admin/branding" element={<ProtectedRoute role="tenant_admin"><AppShell><AdminBranding /></AppShell></ProtectedRoute>} />
      <Route path="/admin/billing" element={<ProtectedRoute role="tenant_admin"><AppShell><AdminBilling /></AppShell></ProtectedRoute>} />

      {/* Super Admin Routes */}
      <Route path="/super" element={<ProtectedRoute role="super_admin"><AppShell><SuperDashboard /></AppShell></ProtectedRoute>} />
      <Route path="/super/tenants" element={<ProtectedRoute role="super_admin"><AppShell><SuperTenants /></AppShell></ProtectedRoute>} />
      <Route path="/super/plans" element={<ProtectedRoute role="super_admin"><AppShell><SuperPlans /></AppShell></ProtectedRoute>} />
      <Route path="/super/revenue" element={<ProtectedRoute role="super_admin"><AppShell><SuperRevenue /></AppShell></ProtectedRoute>} />
      <Route path="/super/tickets" element={<ProtectedRoute role="super_admin"><AppShell><SuperTickets /></AppShell></ProtectedRoute>} />
    </Routes>
  )
}
