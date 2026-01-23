import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { roleService } from '../services/coreService'

/**
 * Custom hook to get the current active role of the user
 * Automatically fetches and syncs with the server
 * @returns {string} The current active role (user, admin, superadmin)
 */
export const useCurrentRole = () => {
  const { user } = useAuth()
  const [serverRole, setServerRole] = useState(null)

  useEffect(() => {
    if (!user) return

    // Fetch current role from server
    const fetchCurrentRole = async () => {
      try {
        const response = await roleService.getCurrentRole()
        const role = response.data?.data?.activeRole
        if (role) {
          setServerRole(role)
          // console.log('Current active role (server):', role)
        }
      } catch (error) {
        console.error('Failed to get current role:', error)
      }
    }

    fetchCurrentRole()

    // Refresh role every 3 seconds to keep in sync
    const interval = setInterval(fetchCurrentRole, 3000)
    return () => clearInterval(interval)
  }, [user])

  // Logic calculation:
  // 1. If we have a verified server role, use it.
  // 2. FORCE FIX: If user is superadmin and not impersonating, force 'superadmin'.
  // 3. Fallback to user object data.
  // 4. Fallback to localStorage (only if user is not loaded or data missing).
  // 5. Default to 'user'.
  
  if (serverRole) return serverRole

  // Force superadmin precedence to avoid race conditions with localStorage
  if (user?.role === 'superadmin' && !user?.currentRoleAs) {
    return 'superadmin'
  }

  return user?.currentRoleAs || user?.role || localStorage.getItem('currentRole') || 'user'
}
