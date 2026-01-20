import React, { useState, useEffect, useMemo, memo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCurrentRole } from '../hooks/useCurrentRole'
import api from '../services/api'
import KPICard from '../components/KPICard'
import SkeletonLoader from '../components/SkeletonLoader'
import {
  OrderByStatusChart,
  RevenueByStatusChart,
  StatusPerWitelChart,
  RevenueTrendChart,
  RevenuePerWitelChart,
  OrderPerWitelChart,
  RevenuePerProductChart
} from '../components/DatinCharts'
import { FiChevronDown, FiDollarSign, FiActivity, FiShoppingCart, FiCheckCircle, FiTarget } from 'react-icons/fi'

const DATIN = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentRole = useCurrentRole()
  const isAdmin = ['admin', 'superadmin'].includes(currentRole)

  // --- 1. STATE INITIALIZATION ---
  const now = new Date()
  const defaultStart = '2020-01-01'
  
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || defaultStart)
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || now.toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  // Filters
  const [selectedWitels, setSelectedWitels] = useState(searchParams.get('witels')?.split(',').filter(Boolean) || [])
  const [selectedSegments, setSelectedSegments] = useState(searchParams.get('segments')?.split(',').filter(Boolean) || [])
  const [selectedCategories, setSelectedCategories] = useState(searchParams.get('categories')?.split(',').filter(Boolean) || [])

  // Dropdown States
  const [isWitelDropdownOpen, setIsWitelDropdownOpen] = useState(false)
  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

  // Options from API
  const [filterOptions, setFilterOptions] = useState({ witels: [], segments: [], categories: [] })

  // Dashboard Data
  const [stats, setStats] = useState({
    kpi: { realizedRevenue: 0, revTarget: 0, revAchievement: 0, pipelineRevenue: 0, totalOrder: 0, orderTarget: 0, orderAchievement: 0 },
    section2: { orderByStatus: [], revenueByStatus: [], statusPerWitel: [] },
    section3: { revenueTrend: [], revenuePerWitel: [], orderPerWitel: [], revenuePerProduct: [] }
  })

  // --- 2. DATA FETCHING ---

  const fetchFilterOptions = async () => {
    try {
      const res = await api.get('/dashboard/sos-datin/filters')
      if (res.data?.data) setFilterOptions(res.data.data)
    } catch (error) { console.error('Failed to fetch filters:', error) }
  }

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        witels: selectedWitels.join(','),
        segments: selectedSegments.join(','),
        categories: selectedCategories.join(',')
      }
      const res = await api.get('/dashboard/sos-datin/stats', { params })
      if (res.data?.data) setStats(res.data.data)
    } catch (error) { console.error('Failed to fetch stats:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    fetchDashboardStats()
    const p = {}
    if (startDate) p.start_date = startDate
    if (endDate) p.end_date = endDate
    if (selectedWitels.length) p.witels = selectedWitels.join(',')
    if (selectedSegments.length) p.segments = selectedSegments.join(',')
    if (selectedCategories.length) p.categories = selectedCategories.join(',')
    setSearchParams(p, { replace: true })
  }, [startDate, endDate, selectedWitels, selectedSegments, selectedCategories])

  const toggleSelection = (option, selectedList, setter) => {
    if (selectedList.includes(option)) setter(selectedList.filter(item => item !== option))
    else setter([...selectedList, option])
  }

  const handleResetFilter = () => {
    setStartDate(defaultStart)
    setEndDate(now.toISOString().split('T')[0])
    setSelectedWitels([])
    setSelectedSegments([])
    setSelectedCategories([])
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard DATIN</h1>
          <p className="text-gray-500 text-sm">Monitoring & Performance Analysis</p>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-0 z-10 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10">
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Dari</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700" />
            </div>
            <span className="text-gray-400 font-light">|</span>
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Sampai</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700" />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
            <div className="flex flex-col justify-center px-2 h-full w-40">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Witel</span>
              <div className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between" onClick={() => setIsWitelDropdownOpen(!isWitelDropdownOpen)}>
                <span className="truncate">{selectedWitels.length > 0 ? `${selectedWitels.length} Selected` : 'Semua Witel'}</span>
                <FiChevronDown className={`ml-1 transition-transform ${isWitelDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {isWitelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filterOptions.witels.map(opt => (
                  <div key={opt} className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => toggleSelection(opt, selectedWitels, setSelectedWitels)}>
                    <input type="checkbox" checked={selectedWitels.includes(opt)} readOnly className="rounded text-blue-600 h-4 w-4 pointer-events-none" />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Segmen Dropdown */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
            <div className="flex flex-col justify-center px-2 h-full w-40">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Segmen</span>
              <div className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between" onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}>
                <span className="truncate">{selectedSegments.length > 0 ? `${selectedSegments.length} Selected` : 'Semua Segmen'}</span>
                <FiChevronDown className={`ml-1 transition-transform ${isSegmentDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {isSegmentDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filterOptions.segments.map(opt => (
                  <div key={opt} className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => toggleSelection(opt, selectedSegments, setSelectedSegments)}>
                    <input type="checkbox" checked={selectedSegments.includes(opt)} readOnly className="rounded text-blue-600 h-4 w-4 pointer-events-none" />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button onClick={handleResetFilter} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold uppercase hover:bg-gray-200 h-10">Reset</button>

          {isAdmin && (
            <button
              onClick={() => navigate('/dashboard/manage-targets?type=DATIN')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold uppercase hover:bg-blue-700 h-10 flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <FiTarget />
              Atur Target
            </button>
          )}
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <>
            <KPICard
              title="REALIZED REVENUE"
              value={`Rp ${(stats.kpi?.realizedRevenue || 0).toLocaleString('id-ID')}`}
              target={`Rp ${(stats.kpi?.revTarget || 0).toLocaleString('id-ID')}`}
              achievement={stats.kpi?.revAchievement}
              icon={<FiDollarSign />}
              color="green"
            />
            <KPICard
              title="PIPELINE REVENUE"
              value={`Rp ${(stats.kpi?.pipelineRevenue || 0).toLocaleString('id-ID')}`}
              icon={<FiActivity />}
              color="orange"
            />
            <KPICard
              title="TOTAL ORDER"
              value={stats.kpi?.totalOrder || 0}
              target={stats.kpi?.orderTarget || 0}
              achievement={stats.kpi?.orderAchievement}
              icon={<FiShoppingCart />}
              color="blue"
            />
            <KPICard
              title="DELIVERY RATE"
              value={`${((stats.kpi?.realizedRevenue / (stats.kpi?.realizedRevenue + stats.kpi?.pipelineRevenue)) * 100 || 0).toFixed(1)}%`}
              icon={<FiCheckCircle />}
              color="blue"
            />
          </>
        )}
      </div>

      {/* --- SECTIONS --- */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3">Status & Delivery Monitoring</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <SkeletonLoader type="chart" />
              <SkeletonLoader type="chart" />
            </>
          ) : (
            <>
              <OrderByStatusChart data={stats.section2?.orderByStatus || []} />
              <RevenueByStatusChart data={stats.section2?.revenueByStatus || []} />
            </>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <SkeletonLoader type="chart" />
          ) : (
            <StatusPerWitelChart data={stats.section2?.statusPerWitel || []} />
          )}
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <h2 className="text-lg font-bold text-gray-800 border-l-4 border-purple-600 pl-3">Performance Monitoring</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {loading ? (
            <>
              <SkeletonLoader type="chart" />
              <SkeletonLoader type="chart" />
            </>
          ) : (
            <>
              <RevenueTrendChart data={stats.section3?.revenueTrend || []} />
              <RevenuePerWitelChart data={stats.section3?.revenuePerWitel || []} />
            </>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <SkeletonLoader type="chart" />
              <SkeletonLoader type="chart" />
            </>
          ) : (
            <>
              <OrderPerWitelChart data={stats.section3?.orderPerWitel || []} />
              <RevenuePerProductChart data={stats.section3?.revenuePerProduct || []} />
            </>
          )}
        </div>
      </div>

    </div>
  )
}

export default DATIN
