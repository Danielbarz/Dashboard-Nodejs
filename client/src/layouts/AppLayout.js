import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdHome,
  MdDashboard,
  MdExitToApp,
  MdPeople,
  MdHistory,
  MdMerge,
  MdStorage,
  MdAssessment,
  MdKeyboardArrowDown,
  MdTimeline,
  MdNetworkCheck,
  MdDescription
} from 'react-icons/md'
import { FiMenu, FiX, FiMonitor, FiDatabase, FiActivity, FiFileText } from 'react-icons/fi'
import ChatBot from '../components/ChatBot'

// ==================== HELPER COMPONENTS ====================

const Logo = ({ isSidebarOpen }) => (
  <div className="flex items-center justify-center h-24 border-b border-gray-200 transition-all duration-300 px-2 overflow-hidden bg-white">
    {isSidebarOpen ? (
      <img
        src="/images/logotelkom_full.png"
        alt="Telkom Indonesia"
        className="h-16 w-auto object-contain transition-all duration-300 scale-125"
      />
    ) : (
      <img
        src="/images/logotelkom.png"
        alt="Telkom"
        className="h-12 w-12 object-contain transition-all duration-300"
      />
    )}
  </div>
)

const NavLink = ({ href, active, icon: Icon, isSidebarOpen, children }) => (
  <div className="relative group">
    <Link
      to={href}
      className={`flex items-center py-4 text-gray-600 hover:bg-gray-100 transition-colors duration-200 ${
        isSidebarOpen ? 'px-6' : 'justify-center'
      } ${active ? 'bg-gray-200 text-gray-800 font-bold border-r-4 border-red-600' : ''}`}
    >
      <Icon size={isSidebarOpen ? 22 : 26} />
      <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
        isSidebarOpen ? 'opacity-100' : 'opacity-0 absolute'
      }`}>
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

const SubNavLink = ({ href, active, icon: Icon, isSidebarOpen, children }) => (
  <Link
    to={href}
    className={`flex items-center py-3 pl-12 pr-6 text-sm transition-colors duration-200 ${
      active 
        ? 'bg-blue-50 text-blue-700 font-bold' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
    } ${!isSidebarOpen && 'hidden'}`}
  >
    {Icon && <Icon className="mr-3" size={16} />}
    <span className="truncate">{children}</span>
  </Link>
)

const UserProfile = ({ user, isSidebarOpen, currentRole, onLogout }) => {
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

  return (
    <div className="mt-auto p-2 border-t border-gray-200 relative bg-white" ref={profileRef}>
      {isProfileOpen && (
        <div className={`absolute bottom-full mb-2 bg-white rounded-md shadow-lg border py-2 z-50 ${
          isSidebarOpen ? 'w-[calc(100%-1rem)]' : 'left-full ml-2 w-56'
        }`}>
          <div className="px-4 py-3 border-b">
            <p className="font-bold text-gray-800 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest">Role: {currentRole}</p>
          </div>
          <div className="mt-2">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-100 space-x-2 font-bold"
            >
              <MdExitToApp size={16} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      )}
      <div
        className={`flex items-center cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-300 ${isSidebarOpen ? 'p-2 justify-start' : 'p-0 justify-center h-14'}`}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      >
        <div className={`rounded-full bg-red-600 flex items-center justify-center text-white font-bold flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-xl'}`}>
          {user.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className={`ml-3 flex-grow overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>
          <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN LAYOUT ====================

const AppLayout = ({ children, pageTitle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isExpanded = isSidebarOpen || isHovered

  // Dropdown states
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const [isReportsOpen, setIsReportsOpen] = useState(false)

  const isSuperAdminAccount = user?.email === 'superadmin@telkom.co.id' || user?.role === 'superadmin'
  const currentRole = isSuperAdminAccount ? 'superadmin' : (user?.currentRoleAs || user?.role || 'user')
  const isCurrentlySuperAdmin = currentRole === 'superadmin'

  const isActive = (path) => location.pathname === path

  const getPageTitle = () => {
    if (pageTitle) return pageTitle
    const pathMap = {
      '/': 'Home',
      '/home': 'Home',
      '/dashboard': 'Dashboard Digital Product',
      '/tambahan': 'Dashboard Jaringan Tambahan',
      '/datin': 'Dashboard Datin',
      '/hsi': 'Dashboard HSI',
      '/flow-process-hsi': 'Flow Process HSI',
      '/report-digpro': 'Report Digital Product',
      '/reports-tambahan': 'Report JT',
      '/reports-datin': 'Report Datin',
      '/reports-hsi': 'Report HSI',
      '/admin/users': 'User Management',
      '/admin/rollback': 'Rollback Batch',
      '/admin/merge-files': 'Merge Utility',
      '/admin/master-data-po': 'Master Data PO'
    }
    return pathMap[location.pathname] || 'Dashboard'
  }

  // Effect to keep dropdowns open if child is active
  useEffect(() => {
    const dashboardPaths = ['/dashboard', '/tambahan', '/datin', '/hsi', '/flow-process-hsi']
    const reportPaths = ['/report-digpro', '/reports-tambahan', '/reports-datin', '/reports-hsi']
    
    if (dashboardPaths.some(p => isActive(p))) setIsDashboardOpen(true)
    if (reportPaths.some(p => isActive(p))) setIsReportsOpen(true)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex overflow-hidden">
      {/* SIDEBAR */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex flex-col bg-white h-screen fixed lg:relative shadow-xl z-40 transition-all duration-300 ease-in-out border-r border-gray-200 ${
          isExpanded ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <Logo isSidebarOpen={isExpanded} />

        <nav className="flex-grow pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Main Menu Section - SHOWN TO ALL ADMINS/SUPERADMINS */}
          <div className={`px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ${!isExpanded && 'invisible'}`}>
            Main Menu
          </div>
          <NavLink href="/" active={isActive('/') || isActive('/home')} icon={MdHome} isSidebarOpen={isExpanded}>
            Home
          </NavLink>

          {/* Dashboard Dropdown */}
          <div className="relative">
            <button
              onClick={() => isExpanded && setIsDashboardOpen(!isDashboardOpen)}
              className={`w-full flex items-center py-4 text-gray-600 hover:bg-gray-100 transition duration-300 text-left relative group ${
                isExpanded ? 'px-6' : 'justify-center'
              }`}
            >
              <MdDashboard size={isExpanded ? 22 : 26} />
              <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
                Dashboard
              </span>
              {isExpanded && (
                <MdKeyboardArrowDown size={20} className={`ml-auto transition-transform duration-300 ${isDashboardOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            
            {isExpanded && isDashboardOpen && (
              <div className="bg-gray-50/50">
                <SubNavLink href="/dashboard" active={isActive('/dashboard')} icon={FiMonitor} isSidebarOpen={isExpanded}>Digital Product</SubNavLink>
                <SubNavLink href="/tambahan" active={isActive('/tambahan')} icon={MdNetworkCheck} isSidebarOpen={isExpanded}>Jaringan Tambahan</SubNavLink>
                <SubNavLink href="/datin" active={isActive('/datin')} icon={FiDatabase} isSidebarOpen={isExpanded}>Datin Dashboard</SubNavLink>
                <SubNavLink href="/hsi" active={isActive('/hsi')} icon={FiActivity} isSidebarOpen={isExpanded}>HSI Dashboard</SubNavLink>
                <SubNavLink href="/flow-process-hsi" active={isActive('/flow-process-hsi')} icon={MdTimeline} isSidebarOpen={isExpanded}>Flow Process HSI</SubNavLink>
              </div>
            )}
          </div>

          {/* Reports Dropdown */}
          <div className="relative">
            <button
              onClick={() => isExpanded && setIsReportsOpen(!isReportsOpen)}
              className={`w-full flex items-center py-4 text-gray-600 hover:bg-gray-100 transition duration-300 text-left relative group ${
                isExpanded ? 'px-6' : 'justify-center'
              }`}
            >
              <MdAssessment size={isExpanded ? 22 : 26} />
              <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
                Reports
              </span>
              {isExpanded && (
                <MdKeyboardArrowDown size={20} className={`ml-auto transition-transform duration-300 ${isReportsOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            
            {isExpanded && isReportsOpen && (
              <div className="bg-gray-50/50">
                <SubNavLink href="/report-digpro" active={isActive('/report-digpro')} icon={MdDescription} isSidebarOpen={isExpanded}>Report Digital Product</SubNavLink>
                <SubNavLink href="/reports-tambahan" active={isActive('/reports-tambahan')} icon={FiFileText} isSidebarOpen={isExpanded}>Report JT</SubNavLink>
                <SubNavLink href="/reports-datin" active={isActive('/reports-datin')} icon={MdBarChart} isSidebarOpen={isExpanded}>Report Datin</SubNavLink>
                <SubNavLink href="/reports-hsi" active={isActive('/reports-hsi')} icon={MdDashboard} isSidebarOpen={isExpanded}>Report HSI</SubNavLink>
              </div>
            )}
          </div>

          <NavLink href="/admin/master-data-po" active={isActive('/admin/master-data-po')} icon={MdStorage} isSidebarOpen={isExpanded}>
            Master Data PO
          </NavLink>

          {/* Management Section - Only for superadmin */}
          {isCurrentlySuperAdmin && (
            <div className="mt-4">
              <div className={`px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ${!isExpanded && 'invisible'}`}>
                Management
              </div>
              <NavLink href="/admin/users" active={isActive('/admin/users')} icon={MdPeople} isSidebarOpen={isExpanded}>
                User Management
              </NavLink>
              <NavLink href="/admin/rollback" active={isActive('/admin/rollback')} icon={MdHistory} isSidebarOpen={isExpanded}>
                Rollback Batch
              </NavLink>
              <NavLink href="/admin/merge-files" active={isActive('/admin/merge-files')} icon={MdMerge} isSidebarOpen={isExpanded}>
                Merge Utility
              </NavLink>
            </div>
          )}
        </nav>

        <UserProfile
          user={user}
          isSidebarOpen={isExpanded}
          currentRole={currentRole}
          onLogout={() => { logout(); navigate('/login'); }}
        />
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-all"></div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex justify-between items-center px-8 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100">
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{getPageTitle()}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Operating as</p>
              <p className="text-sm font-black text-slate-900 uppercase">{currentRole}</p>
            </div>
          </div>
        </header>
        
        <main className="flex-grow overflow-y-auto p-4 md:p-8 bg-gray-50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      <ChatBot />
    </div>
  )
}

const MdBarChart = ({ size, className }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} className={className}>
    <path d="M4 9h4v11H4zm6-5h4v16h-4zm6 9h4v7h-4z"></path>
  </svg>
)

export default AppLayout