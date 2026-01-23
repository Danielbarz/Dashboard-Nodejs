import React, { useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdDashboard,
  MdBarChart,
  MdTimeline,
  MdNetworkCheck,
  MdDescription,
  MdHistory,
  MdPeople,
  MdMerge,
  MdChevronRight
} from 'react-icons/md'
import { FiActivity, FiMonitor, FiDatabase, FiFileText } from 'react-icons/fi'

const Home = () => {
  const { user } = useAuth()
  
  // 1. All Hooks must be at the top level
  const dashboardItems = useMemo(() => [
    { title: "Digital Product", desc: "Monitoring & Analytics", path: "/dashboard", icon: <FiMonitor />, colorClass: "bg-blue-50 text-blue-600", category: "Main" },
    { title: "Jaringan Tambahan", desc: "JT Progress Monitoring", path: "/tambahan", icon: <MdNetworkCheck />, colorClass: "bg-emerald-50 text-emerald-600", category: "Connectivity" },
    { title: "Datin Dashboard", desc: "Datin Network Performance", path: "/datin", icon: <FiDatabase />, colorClass: "bg-purple-50 text-purple-600", category: "Connectivity" },
    { title: "HSI Dashboard", desc: "High Speed Internet Stats", path: "/hsi", icon: <FiActivity />, colorClass: "bg-orange-50 text-orange-600", category: "Connectivity" },
    { title: "Flow Process HSI", desc: "End-to-End Order Flow", path: "/flow-process-hsi", icon: <MdTimeline />, colorClass: "bg-rose-50 text-rose-600", category: "Connectivity" }
  ], [])

  const reportItems = useMemo(() => [
    { title: "Report Digital Product", desc: "Detailed Logs & Exports", path: "/report-digpro", icon: <MdDescription />, colorClass: "bg-indigo-50 text-indigo-600", category: "Main" },
    { title: "Report JT", desc: "Jaringan Tambahan Details", path: "/reports-tambahan", icon: <FiFileText />, colorClass: "bg-cyan-50 text-cyan-600", category: "Connectivity" },
    { title: "Report Datin", desc: "Datin Order Logs", path: "/reports-datin", icon: <MdBarChart />, colorClass: "bg-fuchsia-50 text-fuchsia-600", category: "Connectivity" },
    { title: "Report HSI", desc: "HSI Raw Data", path: "/reports-hsi", icon: <MdDashboard />, colorClass: "bg-lime-50 text-lime-600", category: "Connectivity" }
  ], [])

  // 2. Logic calculation after hooks
  const isSuperAdmin = user?.email === 'superadmin@telkom.co.id' || user?.role === 'superadmin'

  // 3. Conditional returns after hooks
  if (isSuperAdmin) {
    return <Navigate to="/admin/users" replace />
  }

  // Helper Tile component
  const Tile = ({ item }) => (
    <Link to={item.path} className="group relative flex flex-col p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.colorClass} transition-transform duration-300 group-hover:scale-110`}>
          {item.icon}
        </div>
        <MdChevronRight className="text-gray-300 group-hover:text-gray-500 transition-colors" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{item.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
      </div>
    </Link>
  )

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 pb-10 min-h-[80vh]">
      <div className="py-8 mb-4 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, <span className="text-blue-600">{user?.name || 'User'}</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Central Dashboard Hub & Analytics Center</p>
      </div>

      <div className="space-y-12">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Executive Dashboards</h2>
            <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
            <span className="text-sm text-gray-500 font-medium">Visualisasi data dan performansi utama</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardItems.map((item, idx) => <Tile key={idx} item={item} />)}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Data Reports</h2>
            <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
            <span className="text-sm text-gray-500 font-medium">Laporan detail dan export data</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportItems.map((item, idx) => <Tile key={idx} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home