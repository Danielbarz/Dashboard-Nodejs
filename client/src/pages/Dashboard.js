import React, { useState, useEffect, useMemo } from 'react'
import { FiChevronDown, FiRefreshCw, FiDollarSign, FiActivity, FiShoppingCart, FiCheckCircle } from 'react-icons/fi'
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

const DashboardPage = () => {
  // --- 1. STATE INITIALIZATION ---
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  // Filters
  const [selectedWitels, setSelectedWitels] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  // Dropdown States (Matching JSX names)
  const [isWitelDropdownOpen, setIsWitelDropdownOpen] = useState(false)
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false)
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)

  // Options
  const [filterOptions, setFilterOptions] = useState({
    witels: [],
    products: [],
    branchMap: {}
  })

  // Dashboard Data
  const [data, setData] = useState({
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

  // --- 2. DATA FETCHING ---

  // Fetch Filter Options on Mount
  useEffect(() => {
    api.get('/dashboard/digital-product/filters')
      .then(res => {
        if (res.data.success) setFilterOptions(res.data.data)
      })
      .catch(err => console.error('Filter fetch error:', err))
  }, [])

  // Derived Branches (Matching JSX name)
  const availableBranchOptions = useMemo(() => {
    if (selectedWitels.length === 0) return Object.values(filterOptions.branchMap || {}).flat().sort()
    return selectedWitels.flatMap(w => filterOptions.branchMap[w] || []).sort()
  }, [selectedWitels, filterOptions.branchMap])

  // Fetch Stats
  const fetchData = async () => {
    setLoading(true)
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        witel: selectedWitels.join(','),
        branch: selectedBranches.join(','),
        product: selectedProducts.join(',')
      }
      const res = await api.get('/dashboard/digital-product/stats', { params })
      if (res.data.success) {
        setData(res.data.data)
      }
    } catch (err) {
      console.error('Stats fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedWitels, selectedBranches, selectedProducts])

  // --- 3. HANDLERS ---

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) setList(list.filter(i => i !== item))
    else setList([...list, item])
  }

  const resetFilters = () => {
    setSelectedWitels([])
    setSelectedBranches([])
    setSelectedProducts([])
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(now.toISOString().split('T')[0])
  }

  // --- 4. RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Digital Product</h1>
            <p className="text-gray-500 text-sm">Performance Monitoring & Analytics</p>
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

            {/* Product Filter */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
              <div className="flex flex-col justify-center px-2 h-full w-40">
                <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Product</span>
                <div
                  className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                >
                  <span className="truncate">{selectedProducts.length > 0 ? `${selectedProducts.length} Selected` : 'Semua Produk'}</span>
                  <FiChevronDown className={`ml-1 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isProductDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filterOptions.products?.map(option => (
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
                  {filterOptions.witels?.map(option => (
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

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold uppercase hover:bg-gray-200 h-10"
            >
              Reset
            </button>
          </div>
        </div>

        {/* SECTION 1: KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            title="TOTAL REVENUE (Completed)" 
            value={`Rp ${data.kpi.totalRevenue.toLocaleString('id-ID')}`} 
            icon={<FiDollarSign />} 
            color="green" 
          />
          <KPICard 
            title="PIPELINE REVENUE (In Progress)" 
            value={`Rp ${data.kpi.pipelineRevenue.toLocaleString('id-ID')}`} 
            icon={<FiActivity />} 
            color="orange" 
          />
          <KPICard 
            title="TOTAL ORDER" 
            value={data.kpi.totalOrder} 
            icon={<FiShoppingCart />} 
            color="blue" 
          />
          <KPICard 
            title="COMPLETION RATE" 
            value={`${data.kpi.completionRate}%`} 
            icon={<FiCheckCircle />} 
            color="green" 
          />
        </div>

        {/* SECTION 2: PERFORMANCE MONITORING */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3">Performance Monitoring</h2>
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Order by Status (Donut) */}
            <OrderByStatusChart data={data.charts.orderByStatus} />
            {/* Chart 2: Revenue by Witel (Horizontal Stacked Product) */}
            <RevenueByWitelChart data={data.charts.revenueByWitel} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Order by Witel (Vertical Stacked Status) */}
            <OrderByWitelChart data={data.charts.orderByWitel} />
            {/* Chart 4: Revenue Trend (Multi-Line Product) */}
            <RevenueTrendChart data={data.charts.revenueTrend} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 5: Order Trend (Multi-Line Product) */}
            <OrderTrendChart data={data.charts.orderTrend} />
            {/* Chart 6: Product Share (Donut) */}
            <ProductShareChart data={data.charts.productShare} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage
