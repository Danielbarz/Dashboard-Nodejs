import React, { useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const ReportsAnalysis = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [witel, setWitel] = useState('')

  const handleExport = () => {
    console.log('Exporting report...')
  }

  return (
    <AppLayout pageTitle="Report Digital Product">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Digital Product</h1>
          <p className="text-gray-600 mt-1">Generate dan download laporan data digital product</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Witel</label>
              <select
                value={witel}
                onChange={(e) => setWitel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Witel</option>
                <option value="WITEL_JABAR">WITEL JABAR</option>
                <option value="WITEL_JATIM">WITEL JATIM</option>
                <option value="WITEL_JATENG">WITEL JATENG</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Records</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-2">Rp 8.5B</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">987</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">247</p>
          </div>
        </div>

        {/* Preview Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preview Data</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-12">
              Pilih filter dan klik "Export Excel" untuk generate report
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default ReportsAnalysis
