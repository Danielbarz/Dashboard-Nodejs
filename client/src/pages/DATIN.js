import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrentRole } from '../hooks/useCurrentRole'
import api from '../services/api'
import KPICard from '../components/KPICard'
import {
  OrderByStatusChart,
  RevenueByStatusChart,
  StatusPerWitelChart,
  RevenueTrendChart,
  RevenuePerWitelChart,
  OrderPerWitelChart,
  RevenuePerProductChart
} from '../components/DatinCharts'
import { FiChevronDown, FiDollarSign, FiActivity, FiShoppingCart } from 'react-icons/fi'

const DATIN = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentRole = useCurrentRole()
  // eslint-disable-next-line no-unused-vars
  const isAdmin = ['admin', 'superadmin'].includes(currentRole)

  // Derived states from URL
  const startDate = searchParams.get('start_date') || '2020-01-01'
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

  // Dropdown Open States
  const [isWitelDropdownOpen, setIsWitelDropdownOpen] = useState(false)
  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

  // Options from API
  const [filterOptions, setFilterOptions] = useState({ witels: [], segments: [], categories: [] })

  // Dashboard Data
  const [stats, setStats] = useState({
    kpi: { realizedRevenue: 0, pipelineRevenue: 0, totalOrder: 0 },
    section2: { orderByStatus: [], revenueByStatus: [], statusPerWitel: [] },
    section3: { revenueTrend: [], revenuePerWitel: [], orderPerWitel: [], revenuePerProduct: [] }
  })

  const [statsLoading, setStatsLoading] = useState(false)
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

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    fetchDashboardStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedWitels, selectedSegments, selectedCategories, refreshKey])

  const handleApplyFilter = () => setRefreshKey(prev => prev + 1)

  const handleResetFilter = () => {
    setStartDate('2020-01-01')
    setEndDate(new Date().toISOString().split('T')[0])
    setSelectedWitels([])
    setSelectedSegments([])
    setSelectedCategories([])
  }

  const toggleSelection = (option, selectedList, setter) => {
    if (selectedList.includes(option)) {
      setter(selectedList.filter(item => item !== option))
    } else {
      setter([...selectedList, option])
    }
  }

  const LoadingPlaceholder = ({ height = '300px' }) => (
    <div className={`bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-400`} style={{ height }}>
      Loading...
    </div>
  )

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard DATIN</h1>
          <p className="text-gray-500 text-sm">Monitoring & Performance Analysis</p>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-0 z-20 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10">
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Dari</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700"
              />
            </div>
            <span className="text-gray-400 font-light">|</span>
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Sampai</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700"
              />
            </div>
          </div>

          {/* Witel */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
            <div className="flex flex-col justify-center px-2 h-full w-40">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Witel</span>
              <div
                className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                onClick={() => setIsWitelDropdownOpen(!isWitelDropdownOpen)}
              >
                <span className="truncate">{selectedWitels.length > 0 ? `${selectedWitels.length} Selected` : 'Semua Witel'}</span>
                <FiChevronDown className={`ml-1 transition-transform ${isWitelDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {isWitelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filterOptions.witels.map(option => (
                  <div
                    key={option}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => toggleSelection(option, selectedWitels, setSelectedWitels)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedWitels.includes(option)}
                      readOnly
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 pointer-events-none"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Segmen */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
            <div className="flex flex-col justify-center px-2 h-full w-40">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Segmen</span>
              <div
                className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}
              >
                <span className="truncate">{selectedSegments.length > 0 ? `${selectedSegments.length} Selected` : 'Semua Segmen'}</span>
                <FiChevronDown className={`ml-1 transition-transform ${isSegmentDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {isSegmentDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filterOptions.segments.map(option => (
                  <div
                    key={option}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => toggleSelection(option, selectedSegments, setSelectedSegments)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSegments.includes(option)}
                      readOnly
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 pointer-events-none"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kategori */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
            <div className="flex flex-col justify-center px-2 h-full w-40">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Kategori</span>
              <div
                className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                <span className="truncate">{selectedCategories.length > 0 ? `${selectedCategories.length} Selected` : 'Semua Kategori'}</span>
                <FiChevronDown className={`ml-1 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filterOptions.categories.map(option => (
                  <div
                    key={option}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => toggleSelection(option, selectedCategories, setSelectedCategories)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(option)}
                      readOnly
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 pointer-events-none"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="flex gap-2">
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold uppercase hover:bg-gray-200 h-10"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="REALIZED REVENUE (Ready to Bill)"
          value={`Rp ${stats.kpi.realizedRevenue.toLocaleString('id-ID')}`}
          icon={<FiDollarSign />}
          color="green"
        />
        <KPICard
          title="PIPELINE REVENUE (On Progress)"
          value={`Rp ${stats.kpi.pipelineRevenue.toLocaleString('id-ID')}`}
          icon={<FiActivity />}
          color="orange"
        />
        <KPICard
          title="TOTAL ORDER"
          value={stats.kpi.totalOrder}
          icon={<FiShoppingCart />}
          color="blue"
        />
      </div>

      {/* --- SECTION 2: STATUS & DELIVERY MONITORING --- */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">Status & Delivery Monitoring</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {statsLoading ? <LoadingPlaceholder /> : <OrderByStatusChart data={stats.section2.orderByStatus} />}
          {statsLoading ? <LoadingPlaceholder /> : <RevenueByStatusChart data={stats.section2.revenueByStatus} />}
          {statsLoading ? <LoadingPlaceholder /> : <StatusPerWitelChart data={stats.section2.statusPerWitel} />}
        </div>
      </div>

      {/* --- SECTION 3: PERFORMANCE MONITORING --- */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-purple-600 pl-3">Performance Monitoring</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {statsLoading ? <LoadingPlaceholder /> : <RevenueTrendChart data={stats.section3.revenueTrend} />}
          {statsLoading ? <LoadingPlaceholder /> : <RevenuePerWitelChart data={stats.section3.revenuePerWitel} />}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {statsLoading ? <LoadingPlaceholder /> : <OrderPerWitelChart data={stats.section3.orderPerWitel} />}
          {statsLoading ? <LoadingPlaceholder /> : <RevenuePerProductChart data={stats.section3.revenuePerProduct} />}
        </div>
      </div>

    </div>
  )
}

export default DATIN
