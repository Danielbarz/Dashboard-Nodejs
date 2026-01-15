import React, { useState, useEffect, useMemo } from 'react'
import { FiChevronDown, FiDollarSign, FiActivity, FiShoppingCart, FiCheckCircle } from 'react-icons/fi'
import api from '../services/api'
import KPICard from '../components/KPICard'
import {
  OrderByStatusChart,
  RevenueByWitelChart,
  OrderByWitelChart,
  RevenueTrendChart,
  ProductShareChart,
  OrderTrendChart
} from '../components/DigitalProductCharts'

const DigitalProduct = () => {
  // Filters State
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  
  const [selectedWitels, setSelectedWitels] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [isWitelDropdownOpen, setIsWitelDropdownOpen] = useState(false)
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false)

  const [filterOptions, setFilterOptions] = useState({
    witels: [],
    products: [],
    branchMap: {}
  })

  const [dashboardData, setDashboardData] = useState({
    kpi: { totalRevenue: 0, pipelineRevenue: 0, totalOrder: 0, completionRate: 0 },
    charts: {
      orderByStatus: [],
      revenueByWitel: [],
      orderByWitel: [],
      revenueTrend: [],
      productShare: [],
      orderTrend: []
    }
  })

  // Fetch Filter Options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get('/dashboard/digital-product/filters')
        if (response.data.success) {
          setFilterOptions(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching filters:', error)
      }
    }
    fetchFilters()
  }, [])

  const availableBranchOptions = useMemo(() => {
    if (selectedWitels.length === 0) {
      return Object.values(filterOptions.branchMap).flat().sort()
    }
    return selectedWitels.flatMap(witel => filterOptions.branchMap[witel] || []).sort()
  }, [selectedWitels, filterOptions.branchMap])

  // Fetch Dashboard Data
  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { 
        start_date: startDate, 
        end_date: endDate 
      }
      
      if (selectedWitels.length > 0) params.witel = selectedWitels.join(',')
      if (selectedBranches.length > 0) params.branch = selectedBranches.join(',')
      if (selectedProducts.length > 0) params.product = selectedProducts.join(',')

      const response = await api.get('/dashboard/digital-product/stats', { params })
      if (response.data.success) {
        setDashboardData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedWitels, selectedBranches, selectedProducts])

  const toggleSelection = (option, selectedList, setter) => {
    if (selectedList.includes(option)) {
      setter(selectedList.filter(item => item !== option))
    } else {
      setter([...selectedList, option])
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Product Dashboard</h1>
          <p className="text-gray-600 mt-1">Performance Monitoring & Analytics</p>
        </div>

        {/* --- FILTERS --- */}
        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-0 z-20 border-b border-gray-200">
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

            {/* Product Filter */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
              <div className="flex flex-col justify-center px-2 h-full w-40">
                <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Product</span>
                <div
                  className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                >
                  <span className="truncate">{selectedProducts.length > 0 ? `${selectedProducts.length} Selected` : 'Semua Product'}</span>
                  <FiChevronDown className={`ml-1 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isProductDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filterOptions.products.map(option => (
                    <div
                      key={option}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => toggleSelection(option, selectedProducts, setSelectedProducts)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(option)}
                        readOnly
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 pointer-events-none"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Witel Filter */}
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

            {/* Branch Filter */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
              <div className="flex flex-col justify-center px-2 h-full w-40">
                <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Branch</span>
                <div
                  className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                >
                  <span className="truncate">{selectedBranches.length > 0 ? `${selectedBranches.length} Selected` : 'Semua Branch'}</span>
                  <FiChevronDown className={`ml-1 transition-transform ${isBranchDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isBranchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {availableBranchOptions.map(option => (
                    <div
                      key={option}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => toggleSelection(option, selectedBranches, setSelectedBranches)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(option)}
                        readOnly
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 pointer-events-none"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold uppercase hover:bg-blue-700 disabled:opacity-50 h-10"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* --- SECTION 1: KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="TOTAL REVENUE (Completed)"
            value={`Rp ${dashboardData.kpi.totalRevenue.toLocaleString('id-ID')}`}
            icon={<FiDollarSign />}
            color="green"
          />
          <KPICard
            title="PIPELINE REVENUE (In Progress)"
            value={`Rp ${dashboardData.kpi.pipelineRevenue.toLocaleString('id-ID')}`}
            icon={<FiActivity />}
            color="orange"
          />
          <KPICard
            title="TOTAL ORDER"
            value={dashboardData.kpi.totalOrder}
            icon={<FiShoppingCart />}
            color="blue"
          />
          <KPICard
            title="COMPLETION RATE"
            value={`${dashboardData.kpi.completionRate}%`}
            icon={<FiCheckCircle />}
            color="green"
          />
        </div>

        {/* --- SECTION 2: PERFORMANCE MONITORING --- */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">Performance Monitoring</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderByStatusChart data={dashboardData.charts.orderByStatus} />
            <RevenueByWitelChart data={dashboardData.charts.revenueByWitel} />
            <OrderByWitelChart data={dashboardData.charts.orderByWitel} />
            <RevenueTrendChart data={dashboardData.charts.revenueTrend} />
          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 5: Order Trend (Multi-Line Product) */}
            <OrderTrendChart data={dashboardData.charts.orderTrend} />
            {/* Chart 6: Product Share (Donut) */}
            <ProductShareChart data={dashboardData.charts.productShare} />
          </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DigitalProduct
