import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdDashboard,
  MdBarChart,
  MdTimeline,
  MdNetworkCheck,
  MdDescription,
  MdAdminPanelSettings,
  MdHistory,
  MdPeople,
  MdMerge
} from 'react-icons/md'
import { FiActivity, FiMonitor, FiDatabase, FiFileText } from 'react-icons/fi'

const Home = () => {
  const { user } = useAuth()
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isSuperAdmin = ['superadmin'].includes(currentRole)

  const sections = useMemo(() => {
    const dashboardItems = [
      {
        title: "Digital Product Dashboard",
        path: "/dashboard",
        icon: <FiMonitor />,
        color: "from-blue-400 to-cyan-300",
        shadow: "shadow-blue-200",
        category: "Main"
      },
      {
        title: "Jaringan Tambahan",
        path: "/tambahan",
        icon: <MdNetworkCheck />,
        color: "from-emerald-400 to-teal-300",
        shadow: "shadow-emerald-200",
        category: "Connectivity"
      },
      {
        title: "Datin Dashboard",
        path: "/datin",
        icon: <FiDatabase />,
        color: "from-violet-400 to-purple-300",
        shadow: "shadow-violet-200",
        category: "Connectivity"
      },
      {
        title: "HSI Dashboard",
        path: "/hsi",
        icon: <FiActivity />,
        color: "from-amber-400 to-orange-300",
        shadow: "shadow-amber-200",
        category: "Connectivity"
      },
      {
        title: "Flow Process HSI",
        path: "/flow-process-hsi",
        icon: <MdTimeline />,
        color: "from-rose-400 to-pink-300",
        shadow: "shadow-rose-200",
        category: "Connectivity"
      },
    ]

    const reportItems = [
      {
        title: "Report Digital Product",
        path: "/report-digpro",
        icon: <MdDescription />,
        color: "from-indigo-400 to-blue-300",
        shadow: "shadow-indigo-200",
        category: "Main"
      },
      {
        title: "Report Jaringan Tambahan",
        path: "/reports-tambahan",
        icon: <FiFileText />,
        color: "from-cyan-400 to-sky-300",
        shadow: "shadow-cyan-200",
        category: "Connectivity"
      },
      {
        title: "Report Datin",
        path: "/reports-datin",
        icon: <MdBarChart />,
        color: "from-fuchsia-400 to-magenta-300",
        shadow: "shadow-fuchsia-200",
        category: "Connectivity"
      },
      {
        title: "Report HSI",
        path: "/reports-hsi",
        icon: <MdDashboard />,
        color: "from-lime-400 to-green-300",
        shadow: "shadow-lime-200",
        category: "Connectivity"
      },
    ]

    const groups = [
      {
        title: "Dashboards",
        description: "Monitoring & Analytics",
        items: dashboardItems
      },
      {
        title: "Reports",
        description: "Detailed Data Reporting",
        items: reportItems
      }
    ]

    if (isSuperAdmin) {
      groups.push({
        title: "Administration",
        description: "System & User Management",
        items: [
          {
            title: "User Management",
            path: "/admin/users",
            icon: <MdPeople />,
            color: "from-red-500 to-rose-400",
            shadow: "shadow-red-200",
            category: "Main"
          },
          {
            title: "Rollback Batch",
            path: "/admin/rollback",
            icon: <MdHistory />,
            color: "from-orange-500 to-amber-400",
            shadow: "shadow-orange-200",
            category: "Main"
          },
          {
            title: "Merge Files",
            path: "/admin/merge-files",
            icon: <MdMerge />,
            color: "from-gray-600 to-gray-400",
            shadow: "shadow-gray-300",
            category: "Main"
          },
        ]
      })
    }

    return groups
  }, [isSuperAdmin])

  const renderTiles = (items) => {
    const mainItems = items.filter(i => i.category === "Main")
    const connectivityItems = items.filter(i => i.category === "Connectivity")

    return (
      <div className="space-y-6">
        {/* Main Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mainItems.map((item, idx) => (
            <Tile key={idx} item={item} />
          ))}
        </div>

        {/* Connectivity Sub-Group */}
        {connectivityItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="h-4 w-1 bg-blue-500 rounded-full"></div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Connectivity Group</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {connectivityItems.map((item, idx) => (
                <Tile key={idx} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const Tile = ({ item }) => (
    <Link
      to={item.path}
      className={`group relative flex items-center p-4 rounded-2xl transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        bg-white/70 backdrop-blur-lg border border-white/80
        shadow-sm hover:shadow-lg ${item.shadow}
      `}
    >
      <div className={`
        w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-2xl shadow-md
        bg-gradient-to-br ${item.color} group-hover:scale-110 transition-transform duration-300
      `}>
        {item.icon}
      </div>
      <div className="ml-4 overflow-hidden">
        <h3 className="text-base font-bold text-gray-800 group-hover:text-gray-900 transition-colors truncate">
          {item.title}
        </h3>
        <div className="w-6 h-1 mt-1 rounded-full bg-gray-200 group-hover:bg-current group-hover:w-full transition-all duration-500 opacity-40"></div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Link>
  )

  return (
      <div className="min-h-[80vh] flex flex-col justify-start pb-10">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">{user?.name || 'User'}</span>
          </h1>
          <p className="text-gray-500 text-base font-medium">Select a module to get started.</p>
        </div>

        <div className="space-y-10">
          {sections.map((group, groupIdx) => (
            <div key={groupIdx} className="animate-fade-in-up" style={{ animationDelay: `${groupIdx * 150}ms` }}>
              <div className="flex items-baseline mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{group.title}</h2>
                <span className="ml-3 text-sm text-gray-400 font-medium italic">{group.description}</span>
              </div>
              {renderTiles(group.items)}
            </div>
          ))}
        </div>
      </div>
  )
}

export default Home
