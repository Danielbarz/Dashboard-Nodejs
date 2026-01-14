import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrentRole } from '../hooks/useCurrentRole'
import api from '../services/api'
import DropdownCheckbox from '../components/DropdownCheckbox'
import StackedBarChart from '../components/StackedBarChart'
import PieDonutChart from '../components/PieDonutChart'
import { FiSearch, FiRefreshCw } from 'react-icons/fi'

const DATIN = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentRole = useCurrentRole()
  const isAdmin = ['admin', 'superadmin'].includes(currentRole)

  // Derived states from URL
  const startDate = searchParams.get('start_date') || '2025-01-01'
  const endDate = searchParams.get('end_date') || new Date().toISOString().split('T')[0]
  const selectedWitels = searchParams.get('witels')?.split(',').filter(Boolean) || []
  const selectedSegments = searchParams.get('segments')?.split(',').filter(Boolean) || []
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || []
  const search = searchParams.get('search') || ''
  const pageSize = parseInt(searchParams.get('limit') || '10')
  const currentPage = parseInt(searchParams.get('page') || '1')

  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  // Helper to update search params
  const updateFilters = (newFilters) => {
    const params = Object.fromEntries(searchParams.entries())
    setSearchParams({ ...params, ...newFilters }, { replace: true })
  }

  // Setters that update URL
  const setStartDate = (val) => updateFilters({ start_date: val, page: '1' })
  const setEndDate = (val) => updateFilters({ end_date: val, page: '1' })
  const setSelectedWitels = (val) => updateFilters({ witels: val.join(','), page: '1' })
  const setSelectedSegments = (val) => updateFilters({ segments: val.join(','), page: '1' })
  const setSelectedCategories = (val) => updateFilters({ categories: val.join(','), page: '1' })
  const setPageSize = (val) => updateFilters({ limit: val.toString(), page: '1' })
  const setCurrentPage = (val) => {
    const pageNum = typeof val === 'function' ? val(currentPage) : val
    updateFilters({ page: pageNum.toString() })
  }

  // Options from API
  const [filterOptions, setFilterOptions] = useState({ witels: [], segments: [], categories: [] })

  // Dashboard Data
  const [stats, setStats] = useState({
    ordersByCategory: [],
    revenueByCategory: [],
    witelDistribution: [],
    segmenDistribution: []
  })

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 })
  const [refreshKey, setRefreshKey] = useState(0)

  // 1. Fetch Filter Options
  const fetchFilterOptions = async () => {
    try {
      const res = await api.get('/dashboard/sos-datin/filters')
      if (res.data?.data) {
        setFilterOptions(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error)
    }
  }

  // 2. Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    setStatsLoading(true)
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        witels: selectedWitels.join(','),
        segments: selectedSegments.join(','),
        categories: selectedCategories.join(',')
      }
      const res = await api.get('/dashboard/sos-datin/stats', { params })
      if (res.data?.data) {
        setStats(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // 3. Fetch Table Data (Preview)
  const fetchTableData = async () => {
    setLoading(true)
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        witel: selectedWitels.join(','),
        segment: selectedSegments.join(','),
        kategori: selectedCategories.join(','),
        search: search,
        page: currentPage,
        limit: pageSize
      }
      // Re-using the same report details endpoint if available, otherwise adjust
      const response = await api.get('/report/sos-details', { params })
      if (response.data?.data) {
        setTableData(response.data.data.data)
        setPagination(response.data.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch table data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    fetchDashboardStats()
    fetchTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedWitels, selectedSegments, selectedCategories, refreshKey])

  useEffect(() => {
    fetchTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize])

  const handleApplyFilter = () => {
    updateFilters({ search: localSearch, page: '1' })
    setRefreshKey(prev => prev + 1)
  }

  const handleResetFilter = () => {
    setSearchParams({}, { replace: true })
    setLocalSearch('')
  }

  // --- Chart 1: Jumlah Order Data Mapping ---
  const chart1Data = useMemo(() => stats.ordersByCategory.map(i => ({
    name: i.kategori,
    '< 3 BLN': i.lt_3bln_total,
    '> 3 BLN': i.gt_3bln_total
  })), [stats.ordersByCategory])

  // --- Chart 2: Estimasi Revenue Data Mapping ---
  const chart2Data = useMemo(() => stats.revenueByCategory.map(i => ({
    name: i.kategori,
    '< 3 BLN (Juta)': i.lt_3bln_revenue,
    '> 3 BLN (Juta)': i.gt_3bln_revenue
  })), [stats.revenueByCategory])

  // --- Chart 3: Witel Distribution Mapping ---
  const chart3Data = useMemo(() => stats.witelDistribution.map(i => ({
    name: i.witel,
    'Jumlah Order': i.value
  })), [stats.witelDistribution])

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard SOS Datin</h1>
          <p className="text-gray-500 text-sm">Analisis Order dan Revenue berdasarkan Kategori & Umur</p>
        </div>
        <button
          onClick={handleApplyFilter}
          className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          title="Refresh Data"
        >
          <FiRefreshCw className={statsLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Modern Filter Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Date Picker */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Periode</label>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="text-gray-300">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Witel */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Witel</label>
            <DropdownCheckbox
              title="Semua Witel"
              options={filterOptions.witels}
              selectedOptions={selectedWitels}
              onSelectionChange={setSelectedWitels}
            />
          </div>

          {/* Segmen */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Segmen</label>
            <DropdownCheckbox
              title="Semua Segmen"
              options={filterOptions.segments}
              selectedOptions={selectedSegments}
              onSelectionChange={setSelectedSegments}
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Kategori</label>
            <DropdownCheckbox
              title="Semua Kategori"
              options={filterOptions.categories}
              selectedOptions={selectedCategories}
              onSelectionChange={setSelectedCategories}
            />
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilter}
              className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C1: Jumlah Order by Kategori */}
        <div className="h-full">
          {statsLoading ? <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex items-center justify-center text-gray-400 h-[400px]">Loading...</div> : (
            <StackedBarChart
              title="Jumlah Order by Kategori"
              data={chart1Data}
              colors={['#3b82f6', '#ef4444']}
            />
          )}
        </div>

        {/* C2: Estimasi Revenue by Kategori */}
        <div className="h-full">
          {statsLoading ? <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex items-center justify-center text-gray-400 h-[400px]">Loading...</div> : (
            <StackedBarChart
              title="Estimasi Revenue by Kategori (Juta)"
              data={chart2Data}
              colors={['#3b82f6', '#ef4444']}
            />
          )}
        </div>

        {/* C3: Distribusi Order by Witel */}
        <div className="h-full">
          {statsLoading ? <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex items-center justify-center text-gray-400 h-[400px]">Loading...</div> : (
            <StackedBarChart
              title="Distribusi Order by Witel"
              data={chart3Data}
              colors={['#f59e0b']}
            />
          )}
        </div>

        {/* C4: Distribusi Order by Segmen */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full min-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Distribusi Order by Segmen
          </h3>
          <div className="h-[320px] flex items-center justify-center">
            {statsLoading ? <div className="flex items-center justify-center h-full text-gray-400">Loading...</div> : (
              <PieDonutChart
                data={stats.segmenDistribution}
                title=""
              />
            )}
          </div>
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-gray-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FiSearch size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Data Preview Details</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                placeholder="Cari Order ID / Pelanggan..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                className="pl-4 pr-10 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-2 border border-gray-200 rounded-xl text-sm outline-none"
            >
              {[10, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider font-bold">
              <tr>
                {['Order ID', 'Order Date', 'NIPNAS', 'Standard Name', 'Produk', 'Revenue', 'Segmen', 'Kategori', 'Umur', 'Bill Witel', 'Status', 'Witel Baru'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={12} className="px-4 py-10 text-center text-gray-400">Loading table data...</td></tr>
              ) : tableData.length > 0 ? (
                tableData.map((row) => (
                  <tr key={row.orderId} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-600">{row.orderId}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.orderCreatedDate ? new Date(row.orderCreatedDate).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-4 py-3">{row.nipnas}</td>
                    <td className="px-4 py-3 font-semibold truncate max-w-[150px]" title={row.standardName}>{row.standardName}</td>
                    <td className="px-4 py-3">{row.liProductName}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">{Number(row.revenue).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">{row.segmen}</td>
                    <td className="px-4 py-3">{row.kategori}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${row.kategoriUmur === '< 3 BLN' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {row.kategoriUmur}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.billWitel}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-600">{row.liStatus}</span>
                    </td>
                    <td className="px-4 py-3 font-bold">{row.witelBaru}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={12} className="px-4 py-10 text-center text-gray-400 font-medium">Belum ada data ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4 pt-4">
          <span>Menampilkan <b>{(currentPage - 1) * pageSize + 1}</b> - <b>{Math.min(currentPage * pageSize, pagination.total)}</b> dari <b>{pagination.total}</b> hasil</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30">Previous</button>
            <div className="flex items-center px-4 font-bold text-gray-700">Page {currentPage} of {pagination.totalPages || 1}</div>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.totalPages))} disabled={currentPage === pagination.totalPages || pagination.totalPages === 0} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DATIN
