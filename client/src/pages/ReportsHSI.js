import React from 'react'
import AppLayout from '../layouts/AppLayout'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const ReportsHSI = () => {
  return (
    <AppLayout pageTitle="Report HSI">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report HSI</h1>
          <p className="text-gray-600 mt-1">Generate laporan data High Speed Internet</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filter Report HSI</h2>
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
              <ArrowDownTrayIcon className="w-5 h-5" />
              Export Excel
            </button>
          </div>
          <div className="text-center text-gray-500 py-12">
            Report HSI - Coming Soon
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default ReportsHSI
