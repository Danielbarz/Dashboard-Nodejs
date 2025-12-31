import React, { useState, useEffect } from 'react'
import FileUploadForm from '../components/FileUploadForm'
import AdminReport from '../components/AdminReport'
import { useAuth } from '../context/AuthContext'
import { useCurrentRole } from '../hooks/useCurrentRole'
import { analysisService } from '../services/analysisService'
import { formatRupiah, formatDate } from '../utils/formatters'
import StatusBadge from '../components/StatusBadge'
import { RevenueByWitelChart, AmountByWitelChart, StatusDistributionChart, BranchRevenueChart } from '../components/Charts'

const Analysis = () => {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const { user } = useAuth()
  const currentRole = useCurrentRole()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)

  // Filters
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [product, setProduct] = useState('')
  const [witel, setWitel] = useState('')
  const [subType, setSubType] = useState('')

  // Options (biasanya dari backend API)
  const products_list = ['FBB Product (A-I)', 'Managed Service (VPN)']
  const witels = ['WITEL_JABAR', 'WITEL_JATIM', 'WITEL_JATENG']
  const subTypes = ['Network Product (STO)', 'Satelite Service (B1I)']

  // Fetch data
  const fetchData = async () => {
    setLoading(true)
    try {
      const filters = {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(product && { product }),
        ...(witel && { witel }),
        ...(subType && { subType })
      }

      const [productsRes, statsRes] = await Promise.all([
        analysisService.getDigitalProducts(page, limit, filters),
        analysisService.getDigitalProductStats(filters)
      ])

      setProducts(productsRes.data)
      setTotal(productsRes.data.length)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, limit])

  const handleResetFilters = () => {
    setStartDate('')
    setEndDate('')
    setProduct('')
    setWitel('')
    setSubType('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  // If in admin mode, show detailed report
  if (['admin', 'superadmin'].includes(currentRole)) {
    return <AdminReport />
  }

  // User mode: Show dashboard visualization
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Digital Product</h1>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            {/* Rentang Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Product Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produk</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Produk</option>
                {products_list.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Witel Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Witel</label>
              <select
                value={witel}
                onChange={(e) => setWitel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Witel</option>
                {witels.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Sub Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Type</label>
              <select
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Sub Type</option>
                {subTypes.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={fetchData}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Save Data
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Baru Buat
              </button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {stats && (
          <>
            {/* Row 1: Revenue dan Amount Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Witel</h3>
                <RevenueByWitelChart data={stats.byWitel} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount by Witel</h3>
                <AmountByWitelChart data={stats.byWitel} />
              </div>
            </div>

            {/* Row 2: Other Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product by Segment</h3>
                <StatusDistributionChart data={stats.statusCounts} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product by Channel</h3>
                <BranchRevenueChart data={stats.byBranch} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Share</h3>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <p className="text-sm">Chart placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Data Preview Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Witel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Branch</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.order_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.product_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.witel}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.branch}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatRupiah(product.revenue)}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatRupiah(product.amount)}</td>
                      <td className="px-6 py-4 text-sm">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(product.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <div>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 text-sm"
              >
                <option value={10}>10 per halaman</option>
                <option value={20}>20 per halaman</option>
                <option value={50}>50 per halaman</option>
                <option value={100}>100 per halaman</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section (Admin/Super Admin) */}
        {['admin', 'superadmin'].includes(currentRole) && (
          <div className="mt-6">
            <FileUploadForm type="digital_product" onSuccess={fetchData} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis
