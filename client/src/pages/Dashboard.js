import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import KPICard from '../components/KPICard'
import StackedBarChart from '../components/StackedBarChart'
import PieDonutChart from '../components/PieDonutChart'
import FileUploadForm from '../components/FileUploadForm'
import { dashboardService, roleService } from '../services/dashboardService'
import { MdTrendingUp, MdCheckCircle, MdSchedule } from 'react-icons/md'

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
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Digital Product</h1>
        <p className="text-gray-600 mt-1">Overview & Analytics</p>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white rounded-lg shadow p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Rentang Tanggal</h3>
          {/* Admin Mode Button */}
          {user?.role === 'admin' && !adminMode && (
            <button
              onClick={() => setAdminMode(true)}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition shadow-sm"
            >
              Masuk Mode Admin
            </button>
          )}
          {user?.role === 'admin' && adminMode && (
            <button
              onClick={() => setAdminMode(false)}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition shadow-sm"
            >
              Keluar Mode Admin
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dari</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sampai</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Product Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Produk</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Produk</option>
              {filterOptions.products?.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          {/* Witel Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Witel</label>
            <select
              value={selectedWitel}
              onChange={(e) => setSelectedWitel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Witel</option>
              {filterOptions.witels?.map(witel => (
                <option key={witel} value={witel}>{witel}</option>
              ))}
            </select>
          </div>

          {/* Branch Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch (Telda)</label>
            <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm">
              Pilih Branch (Filtered)
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleResetFilters}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Reset Filter
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Terapkan Filter
          </button>
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
          <StackedBarChart
            title="Revenue by Witel"
            data={revenueByWitel}
            colors={['#FFA500', '#4F46E5', '#10B981', '#EF4444']}
          />
        )}
        
        {amountByWitel.length > 0 && (
          <StackedBarChart
            title="Amount by Witel"
            data={amountByWitel}
            colors={['#FFA500', '#4F46E5', '#10B981', '#EF4444']}
          />
        )}
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {totalOrderRegional.length > 0 && (
          <PieDonutChart
            title="Product by Segment"
            data={totalOrderRegional}
            type="pie"
          />
        )}
       (activeRole === 'superadmin' || (activeRole === 'admin' && adminMode)
        {sebaranDataPS.length > 0 && (
          <PieDonutChart
            title="Product by Channel"
            data={sebaranDataPS}
            type="pie"
          />
        )}
        
        {cancelByFCC.length > 0 && (
          <PieDonutChart
            title="Product Share"
            data={cancelByFCC}
            type="pie"
          />
        )}
      </div>

      {/* FILE UPLOAD - Only for active admin/superadmin */}
      {['admin', 'superadmin'].includes(activeRole) && (
        <FileUploadForm type="digital_product" onSuccess={fetchDashboardData} />
      )}
    </div>
  )
}

export default DashboardPage
