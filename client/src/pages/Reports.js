import React, { useState } from 'react'

const Reports = () => {
  const [reportType, setReportType] = useState('revenue')

  const reportOptions = [
    { id: 'revenue', label: 'Revenue Report', desc: 'Laporan pendapatan per witel dan branch' },
    { id: 'products', label: 'Products Report', desc: 'Laporan status dan progress digital product' },
    { id: 'import', label: 'Import History', desc: 'Riwayat import data dan file' },
  ]

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Buat dan kelola laporan analisis data Telkom HSI</p>
        </div>

        {/* Report Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportOptions.map((report) => (
            <button
              key={report.id}
              onClick={() => setReportType(report.id)}
              className={`p-6 rounded-lg border-2 transition text-left ${
                reportType === report.id
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">{report.label}</p>
              <p className="text-sm text-gray-600 mt-2">{report.desc}</p>
            </button>
          ))}
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            <p>Selected Report: <strong>{reportType.toUpperCase()}</strong></p>
            <p className="mt-2 text-sm">Data akan ditampilkan di sini</p>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex gap-4">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
            Export as PDF
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
            Export as Excel
          </button>
        </div>
      </div>
  )
}

export default Reports
