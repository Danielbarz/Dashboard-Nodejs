import React, { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const FlowProcessHSI = () => {
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [selectedWitel, setSelectedWitel] = useState('all')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('Valid PI')

  const witels = ['all', 'WITEL_JABAR', 'WITEL_JATIM', 'WITEL_JATENG']
  const branches = ['all', 'Branch A', 'Branch B', 'Branch C']
  const categories = ['RE', 'Valid RE', 'Valid WO', 'Valid PI', 'PS (COMPLETED)']

  const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Pengawalan PSB HSI</h1>
            <p className="text-sm text-gray-600 mt-1">Last Update: {currentDate}</p>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Periode Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Rentang</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                {witels.map((witel) => (
                  <option key={witel} value={witel}>
                    {witel === 'all' ? 'Semua Witel' : witel}
                  </option>
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
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch === 'all' ? 'Semua Branch' : branch}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {/* Process Flow Stages */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center">
            <div className="flex-1 bg-gray-800 text-white py-4 px-4 font-semibold text-center text-sm">
              OFFERING
            </div>
            <div className="flex-1 bg-gray-800 text-white py-4 px-4 font-semibold text-center text-sm">
              VERIFICATION & VALID
            </div>
            <div className="flex-1 bg-gray-800 text-white py-4 px-4 font-semibold text-center text-sm">
              FEASIBILITY
            </div>
            <div className="flex-1 bg-gray-800 text-white py-4 px-4 font-semibold text-center text-sm">
              INSTALASI & AKTIVASI
            </div>
            <div className="flex-1 bg-green-600 text-white py-4 px-4 font-semibold text-center text-sm">
              PS
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Column 1: RE */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">RE</h3>
              <p className="text-4xl font-bold text-gray-900">0</p>
            </div>
          </div>

          {/* Column 2: Valid RE + Fallout Points */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">VALID RE</h3>
              <p className="text-4xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-gray-600 mb-3">FALLOUT POINTS</h4>
              <div className="space-y-2">
                <div className="bg-blue-100 rounded p-2">
                  <p className="text-xs text-gray-600">OGP VERIF & VALID</p>
                  <p className="text-xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-red-100 rounded p-2">
                  <p className="text-xs text-gray-600">CANCEL QC 1</p>
                  <p className="text-xl font-bold text-red-600">0</p>
                </div>
                <div className="bg-red-100 rounded p-2">
                  <p className="text-xs text-gray-600">CANCEL FCC</p>
                  <p className="text-xl font-bold text-red-600">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Valid WO + Process */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">VALID WO</h3>
              <p className="text-4xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-gray-600 mb-3">PROCESS</h4>
              <div className="space-y-2">
                <div className="bg-red-100 rounded p-2">
                  <p className="text-xs text-gray-600">CANCEL WO</p>
                  <p className="text-xl font-bold text-red-600">0</p>
                </div>
                <div className="bg-blue-100 rounded p-2">
                  <p className="text-xs text-gray-600">UNSC</p>
                  <p className="text-xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-blue-100 rounded p-2">
                  <p className="text-xs text-gray-600">OGP SURVEY</p>
                  <p className="text-xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Valid PI + Technician */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">VALID PI</h3>
              <p className="text-4xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-gray-600 mb-3">TECHNICIAN</h4>
              <div className="space-y-2">
                <div className="bg-red-100 rounded p-2">
                  <p className="text-xs text-gray-600">CANCEL INSTALASI</p>
                  <p className="text-xl font-bold text-red-600">0</p>
                </div>
                <div className="bg-red-100 rounded p-2">
                  <p className="text-xs text-gray-600">FALLOUT</p>
                  <p className="text-xl font-bold text-red-600">0</p>
                </div>
                <div className="bg-red-100 rounded p-2">
                  <p className="text-xs text-gray-600">REVOKE</p>
                  <p className="text-xl font-bold text-red-600">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 5: PS + Provisioning + Conversion */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 border-2 border-green-500">
              <h3 className="text-sm font-medium text-gray-600 mb-2">PS (COMPLETED)</h3>
              <p className="text-4xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-gray-600 mb-3">PROVISIONING</h4>
              <div className="bg-blue-100 rounded p-2">
                <p className="text-xs text-gray-600">OGP PROVISIONING</p>
                <p className="text-xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="bg-blue-600 rounded-lg p-4 text-white">
              <div className="space-y-3">
                <div>
                  <p className="text-xs">CONVERSION PS/RE</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <div>
                  <p className="text-xs">CONVERSION PS/PI</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <div>
                  <p className="text-xs">COMPLY</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analisis Revoke & Fallout */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-l-4 border-red-500 pl-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Analisis Revoke & Fallout</h2>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {/* Total Revoke */}
            <div className="bg-red-100 rounded-lg p-6 w-64 text-center">
              <p className="text-sm font-medium text-red-600 mb-2">TOTAL REVOKE</p>
              <p className="text-4xl font-bold text-red-600">0</p>
            </div>

            {/* Connector */}
            <div className="h-8 w-1 bg-gray-300"></div>

            {/* Three Main Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {/* Follow Up Completed */}
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-blue-100 rounded-lg p-4 w-full text-center border-2 border-blue-300">
                  <p className="text-sm font-medium text-gray-700 mb-2">FOLLOW UP COMPLETED</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="h-6 w-1 bg-gray-300"></div>
                <div className="bg-green-100 rounded-lg p-3 w-full text-center">
                  <p className="text-xs text-gray-600">PS</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>

              {/* Revoke Completed */}
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-white rounded-lg p-4 w-full text-center border-2 border-gray-300">
                  <p className="text-sm font-medium text-gray-700 mb-2">REVOKE COMPLETED</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="h-6 w-1 bg-gray-300"></div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="bg-yellow-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">OGP PROVI</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">FALLOUT</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              {/* Revoke Order */}
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-white rounded-lg p-4 w-full text-center border-2 border-gray-300">
                  <p className="text-sm font-medium text-gray-700 mb-2">REVOKE ORDER</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="h-6 w-1 bg-gray-300"></div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="bg-red-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">CANCEL</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">LAIN-LAIN</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Data Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="border-l-4 border-blue-600 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Detail Data: <span className="text-blue-600">{selectedCategory}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">Menampilkan daftar order untuk kategori terpilih.</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export Excel
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TGL ORDER</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA CUSTOMER</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WITEL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAYANAN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS GROUP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RESUME STATUS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">
                      Tidak ada data detail untuk kategori ini.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}

export default FlowProcessHSI
