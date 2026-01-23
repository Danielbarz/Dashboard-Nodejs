import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCurrentRole } from '../hooks/useCurrentRole'
import AppLayout from '../layouts/AppLayout'

/**
 * ProtectedRoute untuk admin-only pages
 * Hanya accessible ketika user dalam admin mode
 */
const AdminModeRoute = ({ children, superOnly = false }) => {
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

  const allowedRoles = superOnly ? ['superadmin'] : ['admin', 'superadmin']
  const normalizedRole = String(currentRole).toLowerCase().trim()

  // Redirect to home if not allowed
  if (!allowedRoles.includes(normalizedRole)) {
    console.warn(`Access denied. Required: ${allowedRoles}, Current: ${normalizedRole}`)
    return <Navigate to="/home" replace />
  }

  return <AppLayout>{children}</AppLayout>
}

export default AdminModeRoute
