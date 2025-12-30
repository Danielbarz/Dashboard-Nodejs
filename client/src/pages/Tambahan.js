import React, { useState, useEffect } from 'react'
import AdminReportJT from '../components/AdminReportJT'
import { useCurrentRole } from '../hooks/useCurrentRole'

const Tambahan = () => {
  const currentRole = useCurrentRole()
  const [data, setData] = useState([])

  // Filters
  const [startDate, setStartDate] = useState('01/01/2025')
  const [endDate, setEndDate] = useState('13/11/2025')
  const [witel, setWitel] = useState('Pan Witel Jawa')
  const [poName, setPoName] = useState('Pan PO / Distributor Umum')

  const witels = ['Pan Witel Jawa', 'WITEL_JABAR', 'WITEL_JATIM', 'WITEL_JATENG']
  const poNames = ['Pan PO / Distributor Umum', 'PO_1', 'PO_2', 'PO_3']

  useEffect(() => {
    setData([])
  }, [startDate, endDate, witel, poName])

  const isAdmin = currentRole === 'admin' || currentRole === 'super_admin'

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Jaringan Tambahan</h1>
          <p className="text-sm text-gray-600">Mode Admin</p>
        </div>
        <AdminReportJT />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Jaringan Tambahan</h1>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Tanggal Dan Distributor Tgs. HSI</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Witel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Witel</label>
            <select
              value={witel}
              onChange={(e) => setWitel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
            >
              {witels.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* PO Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PO Name</label>
            <select
              value={poName}
              onChange={(e) => setPoName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
            >
              {poNames.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Reset Filter</button>
            <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Transaksi Filter</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Belum ada data untuk ditampilkan.
      </div>
    </div>
  )
}

export default Tambahan
