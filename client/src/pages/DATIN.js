import React, { useState, useEffect } from 'react'
import FileUploadForm from '../components/FileUploadForm'
import { useAuth } from '../context/AuthContext'
import { roleService } from '../services/dashboardService'

const DATIN = () => {
  const [timeRange, setTimeRange] = useState('monthly')
  const { user } = useAuth()
  const [activeRole, setActiveRole] = useState(user?.role || 'user')

  useEffect(() => {
    roleService.getCurrentRole().then(res => {
      setActiveRole(res.data?.data?.activeRole || activeRole)
    }).catch(() => {})
  }, [])

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DATIN</h1>
          <p className="text-gray-600 mt-1">Data Intelligence dan Reporting Telkom HSI</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-4">Periode</label>
          <div className="flex gap-4 flex-wrap">
            {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeRange === range
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow">
            <p className="text-gray-700 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">Rp 8.5B</p>
            <p className="text-xs text-gray-600 mt-2">↑ 15% vs periode sebelumnya</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow">
            <p className="text-gray-700 text-sm font-medium">Growth Rate</p>
            <p className="text-3xl font-bold text-green-600 mt-2">23%</p>
            <p className="text-xs text-gray-600 mt-2">Year over year</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow">
            <p className="text-gray-700 text-sm font-medium">Customer Count</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">2,345</p>
            <p className="text-xs text-gray-600 mt-2">↑ 87 baru bulan ini</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow">
            <p className="text-gray-700 text-sm font-medium">Avg Order Value</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">3.6M</p>
            <p className="text-xs text-gray-600 mt-2">Per transaksi</p>
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Intelligence - {timeRange.toUpperCase()}</h2>
          <div className="bg-gray-50 rounded-lg h-96 flex items-center justify-center text-gray-500">
            Dashboard dan visualisasi data akan ditampilkan di sini
          </div>
        </div>

        {/* Upload Section (Admin/Super Admin) */}
        {['admin', 'super_admin'].includes(activeRole) && (
          <FileUploadForm type="datin" onSuccess={() => { /* hook up when charts added */ }} />
        )}
      </div>
  )
}

export default DATIN
