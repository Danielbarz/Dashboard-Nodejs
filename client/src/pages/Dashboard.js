import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import KPICard from '../components/KPICard'
import StackedBarChart from '../components/StackedBarChart'
import PieDonutChart from '../components/PieDonutChart'
import FileUploadForm from '../components/FileUploadForm'
import { dashboardService, roleService } from '../services/dashboardService'
import { MdTrendingUp, MdCheckCircle, MdSchedule } from 'react-icons/md'
import { FiRefreshCw } from 'react-icons/fi'

const DashboardPage = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  })

  // Chart data
  const [revenueByWitel, setRevenueByWitel] = useState([])
  const [amountByWitel, setAmountByWitel] = useState([])
  const [kpiData, setKpiData] = useState(null)
  const [totalOrderRegional, setTotalOrderRegional] = useState([])
  const [sebaranDataPS, setSebaranDataPS] = useState([])
  const [cancelByFCC, setCancelByFCC] = useState([])

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    products: [],
    branches: [],
    witels: []
  })

  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedWitel, setSelectedWitel] = useState('')
  const [selectedSubType, setSelectedSubType] = useState('')
  const [activeRole, setActiveRole] = useState(user?.role || 'user')
  const [adminMode, setAdminMode] = useState(false)

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const queryParams = {
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(selectedProduct && { product: selectedProduct }),
        ...(selectedWitel && { witel: selectedWitel }),
        ...(selectedSubType && { subType: selectedSubType })
      }

      const [
        revenueRes,
        amountRes,
        kpiRes,
        regionalRes,
        psRes,
        fccRes,
        optionsRes
      ] = await Promise.all([
        dashboardService.getRevenueByWitel(queryParams),
        dashboardService.getAmountByWitel(queryParams),
        dashboardService.getKPIData(queryParams),
        dashboardService.getTotalOrderByRegional(queryParams),
        dashboardService.getSebaranDataPS(queryParams),
        dashboardService.getCancelByFCC(queryParams),
        dashboardService.getFilterOptions()
      ])

      setRevenueByWitel(revenueRes.data.data)
      setAmountByWitel(amountRes.data.data)
      setKpiData(kpiRes.data.data)
      setTotalOrderRegional(regionalRes.data.data)
      setSebaranDataPS(psRes.data.data)
      setCancelByFCC(fccRes.data.data)
      setFilterOptions(optionsRes.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [filters, selectedProduct, selectedWitel, selectedSubType])

  useEffect(() => {
    // fetch active role to control UI permissions
    roleService.getCurrentRole().then(res => {
      setActiveRole(res.data?.data?.activeRole || activeRole)
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: ''
    })
    setSelectedProduct('')
    setSelectedWitel('')
    setSelectedSubType('')
  }

  const handleApplyFilters = () => {
    fetchDashboardData()
  }

  if (loading && !revenueByWitel.length) {
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
        <button
          onClick={fetchDashboardData}
          className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          title="Refresh Data"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Modern Filter Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Start Date */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Dari Tanggal</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleDateChange}
              className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Sampai Tanggal</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleDateChange}
              className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Product Dropdown */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Produk</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Semua Produk</option>
              {filterOptions.products?.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          {/* Witel Dropdown */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Witel</label>
            <select
              value={selectedWitel}
              onChange={(e) => setSelectedWitel(e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Semua Witel</option>
              {filterOptions.witels?.map(witel => (
                <option key={witel} value={witel}>{witel}</option>
              ))}
            </select>
          </div>

          {/* Reset & Apply */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              Apply
            </button>
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

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {revenueByWitel.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            <StackedBarChart
              title="Revenue by Witel"
              data={revenueByWitel}
              colors={['#FFA500', '#4F46E5', '#10B981', '#EF4444']}
            />
          </div>
        )}

        {amountByWitel.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            <StackedBarChart
              title="Amount by Witel"
              data={amountByWitel}
              colors={['#FFA500', '#4F46E5', '#10B981', '#EF4444']}
            />
          </div>
        )}
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {totalOrderRegional.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            <PieDonutChart
              title="Product by Segment"
              data={totalOrderRegional}
              type="pie"
            />
          </div>
        )}
        {sebaranDataPS.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            <PieDonutChart
              title="Product by Channel"
              data={sebaranDataPS}
              type="pie"
            />
          </div>
        )}

        {cancelByFCC.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            <PieDonutChart
              title="Product Share"
              data={cancelByFCC}
              type="pie"
            />
          </div>
        )}
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
