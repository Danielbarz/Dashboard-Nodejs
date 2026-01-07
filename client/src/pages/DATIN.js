import React, { useMemo, useState, useEffect } from 'react'
import { useCurrentRole } from '../hooks/useCurrentRole'
import api from '../services/api'

const DATIN = () => {
  const currentRole = useCurrentRole()
  const isAdmin = ['admin', 'superadmin'].includes(currentRole)

  const [dateRange, setDateRange] = useState({ start: '01/01/2024', end: '31/12/2025' })
  const [selectedWitel, setSelectedWitel] = useState('Pilih Witel (5/5)')
  const [selectedSegmen, setSelectedSegmen] = useState('Pilih Segmen (4/4)')
  const [selectedKategori, setSelectedKategori] = useState('Pilih Kategori (4/4)')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 })

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = {
        start_date: dateRange.start,
        end_date: dateRange.end,
        witel: selectedWitel,
        segment: selectedSegmen,
        kategori: selectedKategori,
        search: search,
        page: currentPage,
        limit: pageSize
      }
      
      const response = await api.get('/report/datin-details', { params })
      if (response.data?.data) {
        setTableData(response.data.data.data)
        setPagination(response.data.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch Datin data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize])

  const handleApplyFilter = () => {
    setCurrentPage(1)
    fetchData()
  }

  const handleResetFilter = () => {
    setSelectedWitel('Pilih Witel (5/5)')
    setSelectedSegmen('Pilih Segmen (4/4)')
    setSelectedKategori('Pilih Kategori (4/4)')
    setSearch('')
    setDateRange({ start: '01/01/2024', end: '31/12/2025' })
    setCurrentPage(1)
    // We can trigger fetch immediately or let user click Apply
    // Let's trigger it
    setTimeout(() => fetchData(), 0)
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">DATIN</h1>
        <p className="text-gray-600 mt-1">Dashboard Datin - Mode {isAdmin ? 'Admin' : 'User'}</p>
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
                placeholder="DD/MM/YYYY"
              />
              <span className="text-gray-500">-</span>
              <input
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                placeholder="DD/MM/YYYY"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Witel</label>
              <select
                value={selectedWitel}
                onChange={(e) => setSelectedWitel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option>Pilih Witel (5/5)</option>
                <option value="BALI">BALI</option>
                <option value="JATIM BARAT">JATIM BARAT</option>
                <option value="JATIM TIMUR">JATIM TIMUR</option>
                <option value="NUSA TENGGARA">NUSA TENGGARA</option>
                <option value="SURAMADU">SURAMADU</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segmen</label>
              <select
                value={selectedSegmen}
                onChange={(e) => setSelectedSegmen(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option>Pilih Segmen (4/4)</option>
                <option value="DGS">DGS</option>
                <option value="DBS">DBS</option>
                <option value="DES">DES</option>
                <option value="DCS">DCS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option>Pilih Kategori (4/4)</option>
                <option value="HI">HI</option>
                <option value="DATIN">DATIN</option>
                <option value="INTERNET">INTERNET</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetFilter}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
          >
            Reset
          </button>
          <button 
            onClick={handleApplyFilter}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium"
          >
            Terapkan
          </button>
        </div>
      </div>

      {/* Cards placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[ 'Jumlah Order by Kategori', 'Estimasi Revenue by Kategori (Juta)', 'Distribusi Order by Witel', 'Distribusi Order by Segmen' ].map((title) => (
          <div key={title} className="bg-white rounded-lg shadow p-4 h-48 flex items-center justify-center text-gray-500 text-sm">
            {title}
          </div>
        ))}
      </div>

      {/* Data Preview */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Preview</label>
            <div className="flex gap-2">
              <input
                placeholder="Cari Nama/ID/Produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button 
                onClick={handleApplyFilter}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                Cari
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Tampilkan:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="min-w-[1200px] w-full text-xs md:text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Order ID', 'Order Date', 'NIPNAS', 'Standard Name (PO)', 'Produk', 'Revenue', 'Segmen', 'Sub Segmen', 'Kategori', 'Kategori Umur', 'Umur Order', 'Bill Witel', 'Cust Witel', 'Service Witel', 'Status', 'Milestone', 'Biaya Pasang', 'Harga Bulanan', 'Lama Kontrak (Hari)', 'Bill City', 'Tipe Order', 'Witel Baru'].map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={22} className="px-3 py-6 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : tableData.length > 0 ? (
                tableData.map((row) => (
                  <tr key={row.orderId} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">{row.orderId}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.orderDate}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.nipnas}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.produk}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.revenue?.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.segmen}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.subSegmen}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.kategori}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.kategoriUmur}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.umurOrder}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.billWitel}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.custWitel}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.serviceWitel}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.status}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.milestone || '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.biayaPasang?.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.hargaBulanan?.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.lamaKontrak}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.billCity}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.tipeOrder}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.witelBaru}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={22} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
          <span>
            Menampilkan {(currentPage - 1) * pageSize + 1} sampai {Math.min(currentPage * pageSize, pagination.total)} dari {pagination.total} hasil
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-gray-700 bg-gray-50 disabled:opacity-50"
            >
              « Previous
            </button>
            <div className="flex items-center gap-1">
              <span className="px-2">Page {currentPage} of {pagination.totalPages || 1}</span>
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
              className="px-3 py-1 border rounded-md text-gray-700 bg-gray-50 disabled:opacity-50"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DATIN
