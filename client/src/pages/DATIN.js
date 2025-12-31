import React, { useMemo, useState } from 'react'
import { useCurrentRole } from '../hooks/useCurrentRole'

const DATIN = () => {
  const currentRole = useCurrentRole()
  const isAdmin = ['admin', 'superadmin'].includes(currentRole)

  const [dateRange, setDateRange] = useState({ start: '19/06/2023', end: '19/11/2025' })
  const [selectedWitel, setSelectedWitel] = useState('Pilih Witel (5/5)')
  const [selectedSegmen, setSelectedSegmen] = useState('Pilih Segmen (4/4)')
  const [selectedKategori, setSelectedKategori] = useState('Pilih Kategori (4/4)')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const tableData = useMemo(() => ([]), [])

  const filteredData = useMemo(() => {
    if (!search) return tableData
    return tableData.filter((row) => {
      const haystack = `${row.orderId} ${row.name} ${row.produk}`.toLowerCase()
      return haystack.includes(search.toLowerCase())
    })
  }, [search, tableData])

  const hasData = filteredData.length > 0
  const visibleRows = hasData ? filteredData.slice(0, pageSize) : []

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
              />
              <span className="text-gray-500">-</span>
              <input
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
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
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedWitel('Pilih Witel (5/5)')
              setSelectedSegmen('Pilih Segmen (4/4)')
              setSelectedKategori('Pilih Kategori (4/4)')
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
                {['Order ID', 'Order Date', 'NIPNAS', 'Standard Name (PO)', 'Produk', 'Revenue', 'Segmen', 'Sub Segmen', 'Kategori', 'Kategori Umur', 'Umur Order', 'Bill Witel', 'Cust Witel', 'Service Witel', 'Status', 'Milestone', 'Biaya Pasang', 'Harga Bulanan', 'Lama Kontrak (Hari)', 'Bill City', 'Tipe Order', 'Witel Baru'].map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleRows.map((row) => (
                <tr key={row.orderId} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">{row.orderId}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.orderDate}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.nipnas}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.produk}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.revenue}</td>
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
                  <td className="px-3 py-2 whitespace-nowrap">{row.biayaPasang}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.hargaBulanan}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.lamaKontrak}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.billCity}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.tipeOrder}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.witelBaru}</td>
                </tr>
              ))}
              {!hasData && (
                <tr>
                  <td colSpan={22} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
          <span>Menampilkan {hasData ? `1 sampai ${Math.min(pageSize, filteredData.length)} dari 1002 hasil` : '0 hasil'}</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-50">« Previous</button>
            <div className="flex items-center gap-1">1 2 3 ... 100 101</div>
            <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-50">Next »</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DATIN
