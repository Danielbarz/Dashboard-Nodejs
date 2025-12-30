import React, { useState } from 'react'

const HSI = () => {
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [selectedWitel, setSelectedWitel] = useState('all')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [search, setSearch] = useState('')

  const witels = ['all', 'WITEL_JABAR', 'WITEL_JATIM', 'WITEL_JATENG']
  const branches = ['all', 'Branch A', 'Branch B', 'Branch C']

  const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard HSI</h1>
        <p className="text-gray-600 mt-1">High Speed Internet - Monitoring & Analytics</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Periode Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Rentang</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Witel</label>
            <select
              value={selectedWitel}
              onChange={(e) => setSelectedWitel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {witels.map((w) => (
                <option key={w} value={w}>{w === 'all' ? 'Semua Witel' : w}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {branches.map((b) => (
                <option key={b} value={b}>{b === 'all' ? 'Semua Branch' : b}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Terapkan
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Order</p>
          <p className="text-4xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Completed / PS</p>
          <p className="text-4xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-sm text-gray-600 mb-1">Open / Progress</p>
          <p className="text-4xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Order per Regional (Witel)</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">No Data</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sebaran PS per Regional (Witel)</h2>
          <div className="h-64 flex flex-col items-center justify-center text-gray-500 space-y-2">
            <p>Data PS Kosong</p>
            <p className="text-sm">Tidak ada data Cancel FCC</p>
            <p className="text-sm">Tidak ada data Cancel Biasa</p>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Komposisi Status</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">No Data</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tren Jenis Layanan</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">No Data</div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trend Penjualan Harian</h2>
        <h3 className="text-sm text-gray-600 mb-2">Perbandingan Total Order Masuk vs Completed (PS)</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">Data Trend Tidak Tersedia</div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Peta Sebaran Order HSI</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completed (PS)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Open/Proses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Cancel</span>
            </div>
          </div>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Filter Map</button>
        </div>
        <div className="h-80 bg-gray-100 rounded flex items-center justify-center text-gray-500">
          Data koordinat tidak tersedia dengan filter ini.
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Data Preview</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Cari Order ID / Nama / Layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Order Date', 'Customer Name', 'Witel', 'STO', 'Layanan', 'Status Group', 'Detail Status'].map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-gray-500">Tidak ada data ditemukan.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing to of 0 results</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">« Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-indigo-600 text-white">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next »</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HSI
