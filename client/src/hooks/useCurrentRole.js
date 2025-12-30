import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { roleService } from '../services/dashboardService'

/**
 * Custom hook to get the current active role of the user
 * Automatically fetches and syncs with the server
 * @returns {string} The current active role (user, admin, super_admin)
 */
export const useCurrentRole = () => {
  const { user } = useAuth()
  const [currentRole, setCurrentRole] = useState(user?.currentRoleAs || user?.role || 'user')

  useEffect(() => {
    if (!user) return

    // Fetch current role from server
    const fetchCurrentRole = async () => {
      try {
        const response = await roleService.getCurrentRole()
        const role = response.data?.data?.activeRole
        if (role) {
          setCurrentRole(role)
          console.log('Current active role:', role)
        }
      } catch (error) {
        console.error('Failed to get current role:', error)
        // Fallback to user's currentRoleAs or role
        setCurrentRole(user?.currentRoleAs || user?.role || 'user')
      }
    }

    fetchCurrentRole()

    // Refresh role every 3 seconds to keep in sync
    const interval = setInterval(fetchCurrentRole, 3000)
    return () => clearInterval(interval)
  }, [user])

  return currentRole
}
