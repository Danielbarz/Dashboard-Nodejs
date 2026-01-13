import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import KPICard from '../components/KPICard'
import FileUploadForm from '../components/FileUploadForm'
import { dashboardService, roleService } from '../services/dashboardService'
import api from '../services/api'
import { MdTrendingUp, MdCheckCircle, MdSchedule } from 'react-icons/md'
import { FiRefreshCw, FiChevronDown } from 'react-icons/fi'
import {
  RevenueByWitelChart,
  AmountByWitelChart,
  ProductBySegmentChart,
  ProductByChannelChart,
  ProductShareChart
} from '../components/DigitalProductCharts'

const DashboardPage = () => {
  const { user } = useAuth()
  
  // Date state
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0])

  // Chart data
  const [chartData, setChartData] = useState({
    revenueByWitel: [],
    amountByWitel: [],
    productBySegment: [],
    productByChannel: [],
    productShare: [],
    products: [],
    segments: [],
    channels: []
  })
  const [kpiData, setKpiData] = useState(null)

  // Filters State
  const [selectedWitels, setSelectedWitels] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  
  // Filter Dropdown Open State
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [isWitelDropdownOpen, setIsWitelDropdownOpen] = useState(false)
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false)

  const [filterOptions, setFilterOptions] = useState({
    witels: [],
    products: [],
    branchMap: {}
  })

  const [loading, setLoading] = useState(true)
  const [activeRole, setActiveRole] = useState(user?.role || 'user')

  // Derived Branch Options based on Selected Witels
  const availableBranchOptions = useMemo(() => {
    if (selectedWitels.length === 0) {
      return Object.values(filterOptions.branchMap || {}).flat().sort()
    }
    return selectedWitels.flatMap(witel => filterOptions.branchMap[witel] || []).sort()
  }, [selectedWitels, filterOptions.branchMap])

  // Reset branches if selected witel changes and selected branch is no longer valid
  useEffect(() => {
    const validBranches = selectedBranches.filter(b => availableBranchOptions.includes(b))
    if (validBranches.length !== selectedBranches.length) {
      setSelectedBranches(validBranches)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWitels])

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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const queryParams = {
        startDate,
        endDate,
        product: selectedProducts.join(','),
        witel: selectedWitels.join(','),
        branch: selectedBranches.join(',')
      }

      // Fetch chart data from new endpoint
      const chartParams = {
        start_date: startDate,
        end_date: endDate,
        witel: selectedWitels.join(','),
        branch: selectedBranches.join(','),
        product: selectedProducts.join(',')
      }

      const [chartRes, kpiRes] = await Promise.all([
        api.get('/dashboard/digital-product/charts', { params: chartParams }),
        dashboardService.getKPIData(queryParams)
      ])

      if (chartRes.data.success) {
        setChartData(chartRes.data.data)
      }
      setKpiData(kpiRes.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedWitels, selectedBranches, selectedProducts])

  useEffect(() => {
    // fetch active role to control UI permissions
    roleService.getCurrentRole().then(res => {
      setActiveRole(res.data?.data?.activeRole || activeRole)
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helpers for Filters
  const toggleSelection = (option, selectedList, setter) => {
    if (selectedList.includes(option)) {
      setter(selectedList.filter(item => item !== option))
    } else {
      setter([...selectedList, option])
    }
  }

  if (loading && !chartData.revenueByWitel.length && !kpiData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <FiRefreshCw className="animate-spin mr-2" /> Loading Dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Digital Product</h1>
          <p className="text-gray-500 text-sm">Overview & Analytics Performance</p>
        </div>
      </div>

      {/* Modern Filter Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Date Filter */}
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
        </div>
      </div>

      {/* KPI CARDS */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="TOTAL ORDER"
            value={kpiData.totalOrder}
            icon={<MdTrendingUp />}
            color="blue"
          />
          <KPICard
            title="COMPLETED / PS"
            value={kpiData.completed}
            icon={<MdCheckCircle />}
            color="green"
          />
          <KPICard
            title="OPEN / PROGRESS"
            value={kpiData.openProgress}
            icon={<MdSchedule />}
            color="orange"
          />
        </div>
      )}

      {/* CHARTS ROW 1: Revenue & Amount by Witel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueByWitelChart 
          data={chartData.revenueByWitel} 
          products={chartData.products} 
        />
        <AmountByWitelChart 
          data={chartData.amountByWitel} 
          products={chartData.products} 
        />
      </div>

      {/* CHARTS ROW 2: Product by Segment, Channel, Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductBySegmentChart 
          data={chartData.productBySegment} 
          segments={chartData.segments} 
        />
        <ProductByChannelChart 
          data={chartData.productByChannel} 
          channels={chartData.channels} 
        />
        <ProductShareChart 
          data={chartData.productShare} 
        />
      </div>

      {/* FILE UPLOAD - Only for active admin/superadmin */}
      {['admin', 'superadmin'].includes(activeRole) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
          <FileUploadForm type="digital_product" onSuccess={fetchDashboardData} />
        </div>
      )}
    </div>
  )
}

export default DashboardPage
