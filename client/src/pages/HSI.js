import React, { useState, useRef, useEffect, useMemo } from 'react'
import { fetchHSIDashboard } from '../services/dashboardService'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'

// Warna untuk Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// --- KOMPONEN DROPDOWN (Reusable) ---
const MultiSelectDropdown = ({ options, selected, onChange, placeholder, isMapControl = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer flex justify-between items-center text-sm shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-gray-700 select-none">
          {selected.length > 0 ? `${selected.length} Dipilih` : placeholder}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {isOpen && (
        <div className={`absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${isMapControl ? 'z-[1001]' : 'z-50'}`}>
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                readOnly
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
              />
              <span className="text-sm text-gray-700 select-none">
                {option === null ? 'Null / Kosong' : option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const HSI = () => {
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange

  // State Filter
  const [selectedWitels, setSelectedWitels] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedMapStatus, setSelectedMapStatus] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // DATA STATE (Real Data)
  const [stats, setStats] = useState({ total: 0, completed: 0, open: 0 })
  const [tableData, setTableData] = useState([])
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [chartData, setChartData] = useState({
    orderByWitel: [],
    psByWitel: [],
    statusComposition: [],
    trendLayanan: [],
    trendDaily: []
  })

  // Options
  const witels = ['JABAR', 'JATIM', 'JATENG', 'BALI', 'NUSRA', 'KALIMANTAN', 'SULAWESI']
  const branches = ['Branch A', 'Branch B', 'Branch C']
  const mapStatusOptions = [
    'Completed', 'Open', 'Cancel', 'ODP JAUH', 'ODP FULL', 
    'DOUBLE INPUT', 'BATAL', 'TIDAK ADA ODP', 'PENDING', 
    'LAINNYA', 'KENDALA JALUR/RUTE TARIKAN', 'GANTI PAKET'
  ]

  const branchOptions = useMemo(() => {
    if (selectedWitels.length === 0) return branches
    return branches
  }, [selectedWitels])

  useEffect(() => {
    if (selectedWitels.length > 0) {
      setSelectedBranches(prev => prev.filter(branch => branchOptions.includes(branch)))
    }
  }, [selectedWitels, branchOptions])

  // --- LOAD DATA FROM API ---
  const loadData = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery,
        witel: selectedWitels.join(','),
        branch: selectedBranches.join(','),
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined
      }

      const result = await fetchHSIDashboard(params)
      
      if (result.data) {
        setStats(result.data.stats)
        setTableData(result.data.table)
        setPagination(result.data.pagination)
        setChartData(result.data.charts || {})
      }
    } catch (error) {
      console.error("Error loading HSI data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [startDate, endDate, selectedWitels, selectedBranches, currentPage])

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      loadData()
    }
  }

  const applyFilter = () => {
    setCurrentPage(1)
    loadData()
  }

  const applyMapFilter = () => { applyFilter() }

  const resetFilter = () => {
    setDateRange([null, null])
    setSelectedWitels([])
    setSelectedBranches([])
    setSelectedMapStatus([])
    setSearchQuery('')
    setCurrentPage(1)
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard HSI - Overview</h1>
          <p className="text-gray-600 mt-1">High Speed Internet - Monitoring & Analytics</p>
        </div>

        {/* SECTION 1: GLOBAL FILTER */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Periode Data</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  onChange={(e) => setDateRange([e.target.value ? new Date(e.target.value) : null, endDate])}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="date"
                  onChange={(e) => setDateRange([startDate, e.target.value ? new Date(e.target.value) : null])}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Filter Witel</label>
              <MultiSelectDropdown options={witels} selected={selectedWitels} onChange={setSelectedWitels} placeholder="Semua Witel" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Filter Branch</label>
              <MultiSelectDropdown options={branchOptions} selected={selectedBranches} onChange={setSelectedBranches} placeholder="Semua Branch" />
            </div>
            <div className="flex gap-2">
              <button onClick={applyFilter} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-4 rounded shadow w-full">
                {loading ? 'Loading...' : 'Terapkan'}
              </button>
              <button onClick={resetFilter} className="bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2.5 px-4 rounded shadow">Reset</button>
            </div>
          </div>
        </div>

        {/* SECTION 2: STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
            <div className="text-gray-500 text-xs font-bold uppercase">Total Order</div>
            <div className="text-2xl font-bold text-gray-800">{stats.total.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-green-600 text-xs font-bold uppercase">Completed / PS</div>
            <div className="text-2xl font-bold text-green-700">{stats.completed.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-yellow-600 text-xs font-bold uppercase">Open / Progress</div>
            <div className="text-2xl font-bold text-yellow-700">{stats.open.toLocaleString()}</div>
          </div>
        </div>

        {/* CHART ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">Total Order per Regional (Witel)</h3>
            <div className="h-80 w-full">
              {chartData.orderByWitel.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.orderByWitel} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Jumlah Order" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No Data</div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">Sebaran PS per Regional (Witel)</h3>
            <div className="h-80 w-full">
              {chartData.psByWitel.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.psByWitel} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Completed (PS)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Data PS Kosong</div>
              )}
            </div>
          </div>
        </div>

        {/* CHART ROW 2: Status & Layanan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">Komposisi Status</h3>
            <div className="h-80 w-full">
              {chartData.statusComposition.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.statusComposition}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.statusComposition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No Data</div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">Tren Jenis Layanan</h3>
            <div className="h-80 w-full">
              {chartData.trendLayanan.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={chartData.trendLayanan} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                    <Tooltip />
                    <Bar dataKey="value" name="Jumlah" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No Data</div>
              )}
            </div>
          </div>
        </div>

        {/* TREND CHART */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Trend Penjualan Harian</h3>
              <p className="text-sm text-gray-500">Pergerakan Total Order Masuk (Harian)</p>
            </div>
          </div>
          <div className="h-80 w-full">
            {chartData.trendDaily.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.trendDaily} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Data Trend Tidak Tersedia</div>
            )}
          </div>
        </div>

        {/* PETA SEBARAN (Placeholder) */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6 mb-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-md font-bold text-gray-700">Peta Sebaran Order HSI</h3>
            <div className="flex gap-2 items-center mt-2 md:mt-0 relative z-[1002]">
              <div className="w-48">
                <MultiSelectDropdown options={mapStatusOptions} selected={selectedMapStatus} onChange={setSelectedMapStatus} placeholder="Semua Status" isMapControl={true} />
              </div>
              <button onClick={applyMapFilter} className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition">Filter Map</button>
            </div>
          </div>
          <div className="h-96 w-full z-0 relative bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            <p className="text-center">Data koordinat tidak tersedia dengan filter ini.</p>
          </div>
        </div>

        {/* DATA PREVIEW TABLE */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-800">Data Preview</h3>
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Cari Order ID / Nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchEnter}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Order Date', 'Customer Name', 'Witel', 'STO', 'Layanan', 'Status Group', 'Detail Status'].map((head) => (
                    <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="8" className="px-6 py-10 text-center">Loading data...</td></tr>
                ) : tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.order_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.order_date ? new Date(row.order_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{row.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.witel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.type_layanan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${row.kelompok_status === 'PS' ? 'bg-green-100 text-green-800' :
                            (row.kelompok_status && (row.kelompok_status.includes('CANCEL') || row.kelompok_status.includes('REJECT'))) ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {row.kelompok_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 max-w-xs truncate" title={row.status_resume}>
                        {row.status_resume}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500 bg-gray-50">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
             <div className="flex flex-1 justify-between sm:hidden">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
                <button disabled={currentPage === pagination.totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
             </div>
             <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                   <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
                   </p>
                </div>
                <div>
                   <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                         <span className="sr-only">Previous</span>
                         <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                      </button>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))} disabled={currentPage === pagination.totalPages} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                         <span className="sr-only">Next</span>
                         <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                      </button>
                   </nav>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HSI