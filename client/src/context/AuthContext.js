import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      // Fetch latest profile from server to sync state
      authService.getProfile()
        .then(response => {
          if (response.success && response.data) {
            console.log('Synced user profile from server:', response.data)
            setUser(response.data)
            localStorage.setItem('user', JSON.stringify(response.data))
            // Sync currentRoleAs to localStorage
            const activeRole = response.data.currentRoleAs || response.data.role
            localStorage.setItem('currentRole', activeRole)
          }
        })
        .catch(err => {
          console.error('Failed to sync user profile:', err)
          if (err.response?.status === 401) {
            logout()
          }
        })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    console.log('AuthContext.login called with:', email)
    try {
      const response = await authService.login(email, password)
      console.log('Login successful, setting user...')
      const user = authService.getCurrentUser()
      console.log('User from authService:', user)
      setUser(user)
      console.log('User state updated')
      return response
    } catch (error) {
      console.error('AuthContext.login error:', error)
      throw error
    }
  }

  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password)
    return response
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser()
    console.log('Refreshing user from localStorage:', currentUser)
    setUser(currentUser)
  }

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    loading
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
