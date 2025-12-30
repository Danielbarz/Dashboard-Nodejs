import React from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const ReportsHSI = () => {
  return (
    <>
      <div className="space-y-6 w-full max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report HSI</h1>
            <p className="text-gray-600 mt-1">Kelola data High Speed Internet</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded">
              <ArrowDownTrayIcon className="w-5 h-5" />
              Import Excel
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded">
              Reset Database
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Data HSI</h2>
            <span className="text-sm text-gray-500">No Order · Witel · Tgl Order · Status · Layanan · Aksi</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['No Order', 'Witel', 'Tgl Order', 'Status', 'Layanan', 'Aksi'].map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-gray-500">Belum ada data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportsHSI
