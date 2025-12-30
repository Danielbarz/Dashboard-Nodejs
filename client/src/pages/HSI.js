import React, { useState, useEffect } from 'react'
import FileUploadForm from '../components/FileUploadForm'
import { useAuth } from '../context/AuthContext'
import { roleService } from '../services/dashboardService'

const HSI = () => {
  const [selectedWitel, setSelectedWitel] = useState('all')
  const { user } = useAuth()
  const [activeRole, setActiveRole] = useState(user?.role || 'user')

  useEffect(() => {
    roleService.getCurrentRole().then(res => {
      setActiveRole(res.data?.data?.activeRole || activeRole)
    }).catch(() => {})
  }, [])

  const witels = ['all', 'WITEL_JABAR', 'WITEL_JATIM', 'WITEL_JATENG']

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HSI - High Speed Internet</h1>
          <p className="text-gray-600 mt-1">Monitoring dan manajemen layanan HSI Telkom</p>
        </div>

        {/* Witel Filter */}
        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-4">Pilih Witel</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {witels.map((witel) => (
              <button
                key={witel}
                onClick={() => setSelectedWitel(witel)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedWitel === witel
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {witel === 'all' ? 'Semua Witel' : witel}
              </button>
            ))}
          </div>
        </div>

        {/* HSI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Subscribers</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">45,230</p>
            <div className="mt-4 bg-blue-100 rounded-lg p-2">
              <div className="bg-blue-500 h-2 rounded" style={{ width: '78%' }}></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">78% coverage</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
            <p className="text-gray-600 text-sm">Active Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">38,450</p>
            <p className="text-xs text-gray-500 mt-4">85% aktif hari ini</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-orange-500">
            <p className="text-gray-600 text-sm">Avg Download Speed</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">87 Mbps</p>
            <p className="text-xs text-gray-500 mt-4">↑ 5% minggu lalu</p>
          </div>
        </div>

        {/* Package Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Paket Populer</h2>
            <div className="space-y-3">
              {[
                { name: '10 Mbps', count: 12450, percent: 27 },
                { name: '25 Mbps', count: 18900, percent: 42 },
                { name: '50 Mbps', count: 9250, percent: 20 },
                { name: '100+ Mbps', count: 4630, percent: 10 },
              ].map((pkg, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{pkg.name}</span>
                    <span className="text-sm text-gray-600">{pkg.count.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${pkg.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Quality</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Uptime</span>
                <span className="text-2xl font-bold text-green-600">99.8%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Avg Latency</span>
                <span className="text-2xl font-bold text-green-600">32ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Packet Loss</span>
                <span className="text-2xl font-bold text-green-600">0.2%</span>
              </div>
            </div>
          </div>
        </div>

          {/* Upload Section (Admin/Super Admin) */}
          {['admin', 'super_admin'].includes(activeRole) && (
            <FileUploadForm type="hsi" onSuccess={() => { /* optionally refetch metrics */ }} />
          )}
      </div>
  )
}

export default HSI
