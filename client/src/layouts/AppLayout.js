import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roleService } from '../services/dashboardService'
import {
  MdDashboard,
  MdAssessment,
  MdExitToApp,
  MdBarChart
} from 'react-icons/md'
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const AppLayout = ({ children, pageTitle }) => {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)
  const [canSwitchRole, setCanSwitchRole] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  
  // Menu expansion states
  const [isDashboardOpen, setIsDashboardOpen] = useState(true)
  const [isDashboardConnectivityOpen, setIsDashboardConnectivityOpen] = useState(false)
  const [isReportsOpen, setIsReportsOpen] = useState(false)
  const [isReportConnectivityOpen, setIsReportConnectivityOpen] = useState(false)
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(true)

  useEffect(() => {
    // Get current role info
    if (user) {
      fetchCurrentRole()
    }
  }, [user])

  // Refetch role periodically to keep it in sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchCurrentRole()
      }
    }, 60000)
    
    return () => clearInterval(interval)
  }, [user])

  const fetchCurrentRole = async () => {
    if (switching) return

    const fallbackRole = user?.role || 'user'
    const fallbackCanSwitch = ['admin', 'super_admin'].includes(user?.role)

    try {
      const response = await roleService.getCurrentRole()
      const data = response?.data?.data || {}
      const nextRole = data.activeRole || fallbackRole
      const nextCanSwitch = data.canSwitchRole !== undefined ? data.canSwitchRole : fallbackCanSwitch

      console.log('Current role response:', data)
      setCurrentRole(nextRole)
      setCanSwitchRole(nextCanSwitch)
      console.log('Updated currentRole to:', nextRole, 'canSwitch:', nextCanSwitch)
    } catch (error) {
      console.error('Failed to get current role:', error)
      // Fallback so the switch button stays available for admins even when rate-limited
      setCurrentRole(fallbackRole)
      setCanSwitchRole(fallbackCanSwitch)
    }
  }

  const handleRoleSwitch = async () => {
    const now = Date.now()
    if (now < cooldownUntil) {
      alert('Tunggu beberapa detik sebelum mencoba lagi (rate limit)')
      return
    }

    try {
      setSwitching(true)
      console.log('Starting role switch from:', currentRole)
      
      // If currently in user mode, switch to admin (if available)
      // If currently in admin mode, switch to user
      const targetRole = currentRole === 'user' ? 'admin' : 'user'
      console.log('Target role:', targetRole)
      
      try {
        const doSwitch = async () => roleService.switchRole(targetRole)

        let response
        try {
          response = await doSwitch()
        } catch (error) {
          const isRateLimited = error?.response?.status === 429
          if (isRateLimited) {
            // Stop spamming the endpoint and give user-friendly feedback
            setCooldownUntil(Date.now() + 15000)
            // Optimistically exit admin mode so UI is not stuck
            if (targetRole === 'user') {
              setCurrentRole('user')
              setCanSwitchRole(['admin', 'super_admin'].includes(user?.role))
            }
            console.warn('Role switch rate-limited; cooling down for 15s')
            alert('Terlalu banyak percobaan. Tunggu 15 detik lalu coba lagi. Anda sudah dialihkan ke mode user secara lokal.')
            return
          }
          throw error
        }

        if (!response) {
          throw new Error('Switch role failed (no response)')
        }

        console.log('Switch role response:', response.data)
        
        // Use targetRole as we just switched to it
        setCurrentRole(targetRole)
        console.log('Role switched to:', targetRole)
        
        // Refresh user from localStorage (already updated by switchRole)
        refreshUser()

        // Navigate based on target role
        if (targetRole === 'user') {
          // Keluar dari mode admin, redirect ke dashboard user
          console.log('Exiting admin mode, navigating to /analysis')
          navigate('/analysis')
        } else if (targetRole === 'admin' || targetRole === 'super_admin') {
          // Masuk mode admin, redirect ke halaman admin
          console.log('Entering admin mode, navigating to /admin/users')
          navigate('/admin/users')
        }
      } catch (error) {
        console.error('Failed to switch role:', error)
        // If target was user, optimistically fall back to user mode to avoid trapping in admin UI during failures
        if (targetRole === 'user') {
          setCurrentRole('user')
          setCanSwitchRole(['admin', 'super_admin'].includes(user?.role))
          // Force navigate to user dashboard
          navigate('/analysis')
          setTimeout(() => fetchCurrentRole(), 2000)
        }
        alert('Failed to switch role: ' + (error.response?.data?.message || error.message))
      }
    } finally {
      setSwitching(false)
    }
  }

  // Auto-detect page title from route
  const getPageTitle = () => {
    if (pageTitle) return pageTitle
    
    const pathMap = {
      '/analysis': 'Dashboard Digital Product',
      '/connectivity': 'Dashboard Connectivity',
      '/tambahan': 'Dashboard Jaringan Tambahan',
      '/datin': 'Dashboard Datin',
      '/hsi': 'Dashboard HSI',
      '/flow-process-hsi': 'Flow Process HSI',
      '/reports': 'Reports',
      '/reports-analysis': 'Report Digital Product',
      '/reports-connectivity': 'Report Connectivity',
      '/reports-tambahan': 'Report Jaringan Tambahan',
      '/reports-datin': 'Report Datin',
      '/reports-hsi': 'Report HSI',
      '/admin/users': 'User Management',
      '/admin/rollback': 'Rollback Batch'
    }
    
    return pathMap[location.pathname] || 'Dashboard'
  }

  const currentPageTitle = getPageTitle()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const activeRole = currentRole || user?.role
  const isAdminMode = ['admin', 'super_admin'].includes(activeRole)
  const isSuperAdmin = activeRole === 'super_admin'
  const switchLabel = switching ? 'Switching...' : isAdminMode ? 'Keluar dari Mode Admin' : 'Masuk Mode Admin'
  const switchIcon = !switching && isAdminMode ? (
    <MdExitToApp size={16} className="text-white bg-red-600 rounded-full p-0.5" />
  ) : null

  // Build menu structure dynamically based on current role
  const getMenuStructure = () => {
    const actualRole = user?.role
    const isAdminMode = ['admin', 'super_admin'].includes(activeRole)
    const userCanSwitchRole = ['admin', 'super_admin'].includes(actualRole)
    
    console.log('Building menu - actualRole:', actualRole, 'activeRole:', activeRole, 'isAdminMode:', isAdminMode, 'canSwitchRole:', userCanSwitchRole)
    
    const menu = []

    // Dashboard only for user mode
    if (!isAdminMode) {
      menu.push({
        id: 'dashboard',
        label: 'Dashboard',
        icon: MdDashboard,
        isOpen: isDashboardOpen,
        setIsOpen: setIsDashboardOpen,
        children: [
          { path: '/analysis', label: 'Dashboard Digital Product' },
          {
            id: 'dashboard-connectivity',
            label: 'Dashboard Connectivity',
            isOpen: isDashboardConnectivityOpen,
            setIsOpen: setIsDashboardConnectivityOpen,
            children: [
              { path: '/tambahan', label: 'Dashboard Jaringan Tambahan' },
              { path: '/datin', label: 'Dashboard Datin' },
              { path: '/hsi', label: 'Dashboard HSI' }
            ]
          },
          { path: '/flow-process-hsi', label: 'Flow Process HSI' }
        ]
      })
    }

    // Reports available in both modes
    menu.push({
      id: 'reports',
      label: 'Reports',
      icon: MdBarChart,
      isOpen: isReportsOpen,
      setIsOpen: setIsReportsOpen,
      children: [
        { path: '/reports-analysis', label: 'Report Digital Product' },
        {
          id: 'report-connectivity',
          label: 'Report Connectivity',
          isOpen: isReportConnectivityOpen,
          setIsOpen: setIsReportConnectivityOpen,
          children: [
            { path: '/reports-tambahan', label: 'Report Jaringan Tambahan' },
            { path: '/reports-datin', label: 'Report Datin' },
            { path: '/reports-hsi', label: 'Report HSI' }
          ]
        }
      ]
    })

    // Admin menu only when in admin mode
    if (isSuperAdmin) {
      menu.push({
        id: 'admin-menu',
        label: 'Admin',
        icon: MdAssessment,
        isOpen: isAdminMenuOpen,
        setIsOpen: setIsAdminMenuOpen,
        children: [
          { path: '/admin/users', label: 'User Management' },
          { path: '/admin/rollback', label: 'Rollback Batch' }
        ]
      })
    }

    return menu
  }

  const menuStructure = getMenuStructure()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 flex flex-col fixed h-full z-30`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          {isSidebarOpen ? (
            <h1 className="text-2xl font-bold text-red-600">
              Telkom<span className="text-gray-800">Indonesia</span>
            </h1>
          ) : (
            <img src="/images/logo.png" alt="Telkom" className="h-8" />
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuStructure.map((menu) => (
            <div key={menu.id}>
              <button
                onClick={() => menu.setIsOpen(!menu.isOpen)}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <menu.icon size={20} />
                  {isSidebarOpen && <span className="ml-4 font-semibold">{menu.label}</span>}
                </div>
                {isSidebarOpen && (
                  menu.isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                )}
              </button>

              {/* Children Menu */}
              {menu.isOpen && isSidebarOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {menu.children.map((child) => (
                    child.path ? (
                      // Direct link
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block py-2 px-4 rounded-lg transition-colors text-sm ${
                          isActive(child.path)
                            ? 'bg-blue-100 text-blue-600 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ) : (
                      // Nested submenu
                      <div key={child.id} className="space-y-1">
                        <button
                          onClick={() => child.setIsOpen(!child.isOpen)}
                          className="w-full flex items-center justify-between py-2 px-4 rounded-lg transition-colors text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span>{child.label}</span>
                          {child.isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        </button>
                        
                        {/* Nested children */}
                        {child.isOpen && (
                          <div className="ml-4 space-y-1">
                            {child.children.map((nestedChild) => (
                              <Link
                                key={nestedChild.path}
                                to={nestedChild.path}
                                className={`block py-2 px-4 rounded-lg transition-colors text-sm ${
                                  isActive(nestedChild.path)
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {nestedChild.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* USER PROFILE */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 relative"
          >
            <div className={`flex items-center space-x-3 ${isSidebarOpen ? '' : 'hidden'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentRole || user?.role}</p>
              </div>
            </div>
            {isSidebarOpen && <FiChevronDown size={16} />}

            {/* PROFILE DROPDOWN */}
            {isProfileOpen && (
              <div className={`absolute bottom-full mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 ${
                isSidebarOpen ? 'left-0 right-0 mx-2 w-auto' : 'left-full ml-2 w-48'
              }`}>
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Current: <span className="capitalize font-semibold">{currentRole || user?.role}</span></p>
                </div>
                
                {canSwitchRole && (
                  <button
                    onClick={handleRoleSwitch}
                    disabled={switching}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm border-b border-gray-200 disabled:opacity-50 ${
                      isAdminMode ? 'text-red-600 hover:bg-red-50' : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {switchIcon}
                    <span>{switchLabel}</span>
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <MdExitToApp size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        {/* HEADER */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{currentPageTitle}</h2>
            </div>
            <div className="flex items-center space-x-4">
              {canSwitchRole && (
                <button
                  onClick={handleRoleSwitch}
                  disabled={switching}
                  className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 text-sm font-medium flex items-center gap-2 ${
                    isAdminMode ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {switchIcon}
                  <span>{switchLabel}</span>
                </button>
              )}
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
