import React, { useMemo, useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useCurrentRole } from '../hooks/useCurrentRole'
import FileUploadForm from '../components/FileUploadForm'

const ReportsAnalysis = () => {
  const currentRole = useCurrentRole()
  const isAdmin = ['admin', 'super_admin'].includes(currentRole)

  const [dateRange, setDateRange] = useState({ start: '01/01/2024', end: '31/12/2024' })
  const [selectedProduct, setSelectedProduct] = useState('Semua Produk')
  const [selectedWitel, setSelectedWitel] = useState('Semua Witel')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const tableData = useMemo(() => ([]), [])

  const filteredData = useMemo(() => {
    if (!search) return tableData
    return tableData.filter((row) => {
      const haystack = `${row.orderId || ''} ${row.name || ''} ${row.product || ''}`.toLowerCase()
      return haystack.includes(search.toLowerCase())
    })
  }, [search, tableData])

  const hasData = filteredData.length > 0
  const visibleRows = hasData ? filteredData.slice(0, pageSize) : []

  return (
    <>
      <div className="space-y-6 w-full max-w-7xl mx-auto px-4 overflow-x-hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Digital Product</h1>
          <p className="text-gray-600 mt-1">Laporan Digital Product dengan filter dan unggah data</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4 overflow-hidden w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Tanggal</label>
              <div className="flex items-center gap-2">
                <input
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                />
                <span className="text-gray-500">-</span>
                <input
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produk</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>Semua Produk</option>
                  <option>ASTINet</option>
                  <option>NeuCentrIX</option>
                  <option>Wifi Managed Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Witel</label>
                <select
                  value={selectedWitel}
                  onChange={(e) => setSelectedWitel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>Semua Witel</option>
                  <option>Witel 1</option>
                  <option>Witel 2</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedProduct('Semua Produk')
                setSelectedWitel('Semua Witel')
                setSearch('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
            >
              Reset
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">Terapkan</button>
          </div>
        </div>

        {/* Cards placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[ 'Jumlah Order', 'Estimasi Revenue', 'Distribusi Order per Produk', 'Distribusi Order per Witel' ].map((title) => (
            <div key={title} className="bg-white rounded-lg shadow p-4 h-48 flex items-center justify-center text-gray-500 text-sm">
              {title}
            </div>
          ))}
        </div>

        {/* Upload + export (admin only) */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Unggah / Export</h2>
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export Excel
              </button>
            </div>
            <FileUploadForm type="analysis" onSuccess={() => {}} />
          </div>
        )}

        {/* Data Preview */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4 overflow-hidden w-full">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Preview</label>
              <input
                placeholder="Cari Nama/ID/Produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Tampilkan:</label>
              <input
                type="number"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value) || 10)}
                className="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-w-full">
            <table className="min-w-[1200px] w-full text-xs md:text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Order ID', 'Order Date', 'Customer', 'Produk', 'Revenue', 'Witel', 'Status', 'Milestone'].map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleRows.map((row) => (
                  <tr key={row.orderId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">{row.orderId}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.orderDate}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.product}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.revenue}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.witel}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.status}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.milestone || '-'}</td>
                  </tr>
                ))}
                {!hasData && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
            <span>Menampilkan {hasData ? `1 sampai ${Math.min(pageSize, filteredData.length)} dari ${filteredData.length}` : '0 hasil'}</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-50">« Previous</button>
              <div className="flex items-center gap-1">1 2 3 ...</div>
              <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-50">Next »</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportsAnalysis
