import React, { useState, useEffect } from 'react'

const Tambahan = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [witelFilter, setWitelFilter] = useState([])
  const [poNameFilter, setPoNameFilter] = useState([])

  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const handleWitelChange = (witel) => {
    setWitelFilter(prev =>
      prev.includes(witel) ? prev.filter(w => w !== witel) : [...prev, witel]
    )
  }

  const handlePoNameChange = (po) => {
    setPoNameFilter(prev =>
      prev.includes(po) ? prev.filter(p => p !== po) : [...prev, po]
    )
  }

  return (
    <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Witel
              </label>
              <select
                multiple
                value={witelFilter}
                onChange={(e) => setWitelFilter(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              >
                <option value="JT">Jaringan Tambahan</option>
                <option value="Regional">Regional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO Name
              </label>
              <input
                type="text"
                placeholder="Filter by PO Name"
                onChange={(e) => setPoNameFilter(e.target.value ? [e.target.value] : [])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
            <div className="text-center py-8 text-gray-500">
              Chart will be rendered here
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
            <div className="text-center py-8 text-gray-500">
              Chart will be rendered here
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Witel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

export default Tambahan
