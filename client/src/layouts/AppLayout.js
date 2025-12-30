import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roleService } from '../services/dashboardService'
import {
  MdDashboard,
  MdAssessment,
  MdExitToApp,
  MdBarChart,
  MdAdminPanelSettings,
  MdKeyboardArrowDown
} from 'react-icons/md'
import { FiMenu, FiX, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// ==================== HELPER COMPONENTS ====================

const Logo = ({ isSidebarOpen }) => (
  <div className="flex items-center justify-center h-20 border-b border-gray-200 relative overflow-hidden">
    <div className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-2xl font-bold text-red-600">
        Telkom<span className="text-gray-800">Indonesia</span>
      </h1>
    </div>
    <div className={`absolute transition-opacity duration-200 ${!isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
      <img src="/images/logo.png" alt="Telkom" className="h-8" onError={(e) => e.target.style.display = 'none'} />
    </div>
  </div>
)

const NavLink = ({ href, active, icon: Icon, isSidebarOpen, children }) => (
  <div className="relative group">
    <Link
      to={href}
      className={`flex items-center py-4 text-gray-600 hover:bg-gray-100 transition-colors duration-200 ${
        isSidebarOpen ? 'px-6' : 'justify-center'
      } ${active ? 'bg-gray-200 text-gray-800 font-bold' : ''}`}
    >
      <Icon size={22} />
      <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </span>
    </Link>
    {!isSidebarOpen && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {children}
      </div>
    )}
  </div>
)

const UserProfile = ({ user, isSidebarOpen, currentRole, canSwitchRole, switching, isAdminMode, onSwitch, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const switchLabel = switching ? 'Switching...' : isAdminMode ? 'Keluar Mode Admin' : 'Masuk Mode Admin'
  const switchIcon = isAdminMode ? <MdExitToApp size={16} /> : <MdAdminPanelSettings size={16} />

  return (
    <div className="mt-auto p-2 border-t border-gray-200 relative" ref={profileRef}>
      {isProfileOpen && (
        <div className={`absolute bottom-full mb-2 bg-white rounded-md shadow-lg border py-2 z-20 ${
          isSidebarOpen ? 'w-[calc(100%-1rem)]' : 'left-full ml-2 w-56'
        }`}>
          <div className="px-4 py-3 border-b">
            <p className="font-bold text-gray-800 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">Current: <span className="capitalize font-semibold">{currentRole}</span></p>
          </div>
          <div className="mt-2">
            {canSwitchRole && (
              <button
                onClick={() => {
                  onSwitch()
                  setIsProfileOpen(false)
                }}
                disabled={switching}
                className={`flex items-center w-full px-4 py-2 text-sm space-x-2 disabled:opacity-50 ${
                  isAdminMode ? 'text-red-600 hover:bg-red-50' : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                {switchIcon}
                <span>{switchLabel}</span>
              </button>
            )}
            <button
              onClick={() => {
                onLogout()
                setIsProfileOpen(false)
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-100 space-x-2"
            >
              <MdExitToApp size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
      <div
        className={`flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 ${!isSidebarOpen && 'justify-center'}`}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      >
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {user.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className={`ml-3 flex-grow overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN LAYOUT ====================

const AppLayout = ({ children, pageTitle }) => {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
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

  // Close sidebar on mobile resize
  useEffect(() => {
    const isDesktop = () => window.innerWidth >= 1024
    const handleResize = () => {
      if (isDesktop()) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch current role
  useEffect(() => {
    if (user) {
      const userRole = user.role || 'user'
      const activeRole = user.currentRoleAs || userRole
      const canSwitch = ['admin', 'super_admin'].includes(userRole)
      
      setCurrentRole(activeRole)
      setCanSwitchRole(canSwitch)
      fetchCurrentRole()
    }
  }, [user])

  // Refetch role periodically
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

      setCurrentRole(nextRole)
      localStorage.setItem('currentRole', nextRole)
      setCanSwitchRole(nextCanSwitch)
    } catch (error) {
      console.error('Failed to get current role:', error)
      setCurrentRole(fallbackRole)
      localStorage.setItem('currentRole', fallbackRole)
      setCanSwitchRole(fallbackCanSwitch)
    }
  }

  const handleRoleSwitch = async () => {
    const now = Date.now()
    if (now < cooldownUntil) {
      alert('Tunggu beberapa detik sebelum mencoba lagi (rate limit)')
      return
    }

    let targetRole
    try {
      setSwitching(true)
      targetRole = currentRole === 'user' ? 'admin' : 'user'

      let response
      let attempt = 0
      while (attempt < 3) {
        try {
          response = await roleService.switchRole(targetRole)
          break
        } catch (error) {
          const isRateLimited = error?.response?.status === 429
          if (isRateLimited && attempt < 2) {
            const delay = 2000 * Math.pow(2, attempt)
            await new Promise((res) => setTimeout(res, delay))
            attempt += 1
            continue
          }
          if (isRateLimited) {
            setCooldownUntil(Date.now() + 15000)
          }
          throw error
        }
      }

      if (!response) {
        throw new Error('Switch role failed after retries')
      }

      setCurrentRole(targetRole)
      localStorage.setItem('currentRole', targetRole)
      refreshUser()
    } catch (error) {
      console.error('Failed to switch role:', error)
      if (targetRole === 'user') {
        setCurrentRole('user')
        setCanSwitchRole(['admin', 'super_admin'].includes(user?.role))
        setTimeout(() => fetchCurrentRole(), 2000)
      }
      if (error?.response?.status === 429) {
        setCooldownUntil(Date.now() + 15000)
      }
      alert('Failed to switch role: ' + (error.response?.data?.message || error.message))
    } finally {
      setSwitching(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getPageTitle = () => {
    if (pageTitle) return pageTitle
    
    const pathMap = {
      '/analysis': 'Dashboard Digital Product',
      '/tambahan': 'Dashboard Jaringan Tambahan',
      '/datin': 'Dashboard Datin',
      '/hsi': 'Dashboard HSI',
      '/flow-process-hsi': 'Flow Process HSI',
      '/reports-analysis': 'Report Digital Product',
      '/reports-tambahan': 'Report Jaringan Tambahan',
      '/reports-datin': 'Report Datin',
      '/reports-hsi': 'Report HSI',
      '/admin/users': 'User Management',
      '/admin/rollback': 'Rollback Batch'
    }
    return pathMap[location.pathname] || 'Dashboard'
  }

  const isActive = (path) => location.pathname === path
  const activeRole = currentRole || user?.role
  const isAdminMode = ['admin', 'super_admin'].includes(activeRole)
  const isSuperAdmin = activeRole === 'super_admin'

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <div
        className={`flex flex-col bg-white h-screen fixed shadow-lg z-30 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 lg:w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Sidebar toggle button for desktop */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:block absolute -right-3 top-6 z-40 bg-white p-1 rounded-full shadow-md border hover:bg-gray-100 transition-colors"
        >
          {isSidebarOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
        </button>

        <Logo isSidebarOpen={isSidebarOpen} />

        {/* Navigation */}
        <nav className="flex-grow pt-4 overflow-y-auto overflow-x-hidden">
          {/* Dashboard Section - Only in user mode */}
          {!isAdminMode && (
            <div className="relative">
              <button
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                className={`w-full flex items-center py-4 text-gray-600 hover:bg-gray-100 transition duration-300 text-left ${
                  isSidebarOpen ? 'px-6' : 'justify-center'
                }`}
              >
                <MdDashboard size={22} />
                <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  isSidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}>
                  Dashboard
                </span>
                {isSidebarOpen && (
                  <MdKeyboardArrowDown
                    size={20}
                    className={`ml-auto transition-transform duration-300 ${isDashboardOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {isSidebarOpen && isDashboardOpen && (
                <div className="pl-12 pr-4 py-2 flex flex-col space-y-1 bg-gray-50 border-t border-b">
                  <Link
                    to="/analysis"
                    className={`block px-4 py-2 text-sm rounded-md text-left ${
                      isActive('/analysis') ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    Dashboard Digital Product
                  </Link>

                  {/* Dashboard Connectivity Submenu */}
                  <div>
                    <button
                      onClick={() => setIsDashboardConnectivityOpen(!isDashboardConnectivityOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-gray-200 text-left"
                    >
                      <span>Dashboard Connectivity</span>
                      <MdKeyboardArrowDown
                        size={18}
                        className={`transition-transform duration-300 ${isDashboardConnectivityOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isDashboardConnectivityOpen && (
                      <div className="pl-6 mt-1 space-y-1">
                        <Link
                          to="/tambahan"
                          className={`block px-4 py-2 text-sm rounded-md text-left ${
                            isActive('/tambahan') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Dashboard Jaringan Tambahan
                        </Link>
                        <Link
                          to="/datin"
                          className={`block px-4 py-2 text-sm rounded-md text-left ${
                            isActive('/datin') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Dashboard Datin
                        </Link>
                        <Link
                          to="/hsi"
                          className={`block px-4 py-2 text-sm rounded-md text-left ${
                            isActive('/hsi') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Dashboard HSI
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/flow-process-hsi"
                    className={`block px-4 py-2 text-sm rounded-md text-left ${
                      isActive('/flow-process-hsi') ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    Flow Process HSI
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Reports Section */}
          <div className="relative">
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className={`w-full flex items-center py-4 text-gray-600 hover:bg-gray-100 transition duration-300 text-left ${
                isSidebarOpen ? 'px-6' : 'justify-center'
              }`}
            >
              <MdAssessment size={22} />
              <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                Reports
              </span>
              {isSidebarOpen && (
                <MdKeyboardArrowDown
                  size={20}
                  className={`ml-auto transition-transform duration-300 ${isReportsOpen ? 'rotate-180' : ''}`}
                />
              )}
            </button>

            {isSidebarOpen && isReportsOpen && (
              <div className="pl-8 pr-4 py-2 flex flex-col space-y-1 bg-gray-50 border-t border-b">
                <Link
                  to="/reports-analysis"
                  className={`block px-4 py-2 text-sm rounded-md text-left ${
                    isActive('/reports-analysis') ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  Report Digital Product
                </Link>

                {/* Report Connectivity Submenu */}
                <div>
                  <button
                    onClick={() => setIsReportConnectivityOpen(!isReportConnectivityOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200 text-left"
                  >
                    <span>Report Connectivity</span>
                    <MdKeyboardArrowDown
                      size={18}
                      className={`transition-transform duration-300 ${isReportConnectivityOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isReportConnectivityOpen && (
                    <div className="pl-6 mt-1 space-y-1">
                      <Link
                        to="/reports-tambahan"
                        className={`block px-4 py-2 text-sm rounded-md text-left ${
                          isActive('/reports-tambahan') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Report Jaringan Tambahan
                      </Link>
                      <Link
                        to="/reports-datin"
                        className={`block px-4 py-2 text-sm rounded-md text-left ${
                          isActive('/reports-datin') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Report Datin
                      </Link>
                      <Link
                        to="/reports-hsi"
                        className={`block px-4 py-2 text-sm rounded-md text-left ${
                          isActive('/reports-hsi') ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Report HSI
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Section - Only for super_admin */}
          {isSuperAdmin && (
            <div className="relative">
              <button
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                className={`w-full flex items-center py-4 text-gray-600 hover:bg-gray-100 transition duration-300 text-left ${
                  isSidebarOpen ? 'px-6' : 'justify-center'
                }`}
              >
                <MdBarChart size={22} />
                <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  isSidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}>
                  Admin
                </span>
                {isSidebarOpen && (
                  <MdKeyboardArrowDown
                    size={20}
                    className={`ml-auto transition-transform duration-300 ${isAdminMenuOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {isSidebarOpen && isAdminMenuOpen && (
                <div className="pl-12 pr-4 py-2 flex flex-col space-y-1 bg-gray-50 border-t border-b">
                  <Link
                    to="/admin/users"
                    className={`block px-4 py-2 text-sm rounded-md text-left ${
                      isActive('/admin/users') ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    User Management
                  </Link>
                  <Link
                    to="/admin/rollback"
                    className={`block px-4 py-2 text-sm rounded-md text-left ${
                      isActive('/admin/rollback') ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    Rollback Batch
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User Profile */}
        <UserProfile
          user={user}
          isSidebarOpen={isSidebarOpen}
          currentRole={currentRole}
          canSwitchRole={canSwitchRole}
          switching={switching}
          isAdminMode={isAdminMode}
          onSwitch={handleRoleSwitch}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
            </div>

            <div className="flex items-center space-x-4 ml-4">
              {canSwitchRole && (
                <button
                  onClick={handleRoleSwitch}
                  disabled={switching}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                    isAdminMode
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isAdminMode ? <MdExitToApp size={18} /> : <MdAdminPanelSettings size={18} />}
                  <span className="hidden sm:inline">
                    {switching ? 'Switching...' : isAdminMode ? 'Keluar Mode Admin' : 'Masuk Mode Admin'}
                  </span>
                </button>
              )}
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
