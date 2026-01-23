import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../layouts/AppLayout'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // FORCE REDIRECT SUPERADMIN TO ADMIN PANEL
  // Superadmin should not access Home, Dashboard, or Reports
  if (user?.role === 'superadmin') {
    return <Navigate to="/admin/users" replace />
  }

  return <AppLayout>{children}</AppLayout>
}

export default ProtectedRoute
