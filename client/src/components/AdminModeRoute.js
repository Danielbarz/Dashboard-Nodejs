import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCurrentRole } from '../hooks/useCurrentRole'
import AppLayout from '../layouts/AppLayout'

/**
 * ProtectedRoute untuk admin-only pages
 * Hanya accessible ketika user dalam admin mode
 */
const AdminModeRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const currentRole = useCurrentRole()

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

  // Redirect to analysis if not in admin mode
  if (!['admin', 'super_admin'].includes(currentRole)) {
    return <Navigate to="/analysis" replace />
  }

  return <AppLayout>{children}</AppLayout>
}

export default AdminModeRoute
