import React, { useState, useRef, useEffect, useMemo } from 'react'
import FileUploadForm from '../components/FileUploadForm'

// --- KOMPONEN DROPDOWN (Reusable) ---
const MultiSelectDropdown = ({ options, selected, onChange, placeholder, isMapControl = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer flex justify-between items-center text-sm shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-gray-700 select-none">
          {selected.length > 0 ? `${selected.length} Dipilih` : placeholder}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {isOpen && (
        <div className={`absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${isMapControl ? 'z-[1001]' : 'z-50'}`}>
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                readOnly
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
              />
              <span className="text-sm text-gray-700 select-none">
                {option === null ? 'Null / Kosong' : option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const HSI = () => {
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [hsiData, setHsiData] = useState([])
  const [loading, setLoading] = useState(false)

  // State Filter
  const [selectedWitels, setSelectedWitels] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedMapStatus, setSelectedMapStatus] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const witels = ['JABAR', 'JATIM', 'JATENG']
  const branches = ['Branch A', 'Branch B', 'Branch C']
  const mapStatusOptions = [
    'Completed', 'Open', 'Cancel',
    'ODP JAUH', 'ODP FULL', 'DOUBLE INPUT', 'BATAL',
    'TIDAK ADA ODP', 'PENDING', 'LAINNYA', 'KENDALA JALUR/RUTE TARIKAN', 'GANTI PAKET'
  ]

  // Fetch HSI data from backend
  const fetchHSIData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hsi')
      if (!response.ok) throw new Error('Failed to fetch HSI data')
      const result = await response.json()
      console.log('Fetched HSI data:', result)
      const data = result.data?.data || result.data || []
      setHsiData(data)
    } catch (error) {
      console.error('Error fetching HSI data:', error)
      setHsiData([])
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchHSIData()
  }, [])

  // Mock stats data
  const stats = {
    total: hsiData.length,
    completed: hsiData.filter(d => d.kelompok_status === 'PS').length,
    open: hsiData.filter(d => d.kelompok_status !== 'PS' && d.kelompok_status !== 'CANCEL').length
  }

  const branchOptions = useMemo(() => {
    if (selectedWitels.length === 0) return branches
    return branches
  }, [selectedWitels])

  useEffect(() => {
    if (selectedWitels.length > 0) {
      setSelectedBranches(prev => prev.filter(branch => branchOptions.includes(branch)))
    }
  }, [selectedWitels, branchOptions])

  const formatDate = (date) => {
    if (!date) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const applyFilter = () => {
    // Implement filter logic here
    setCurrentPage(1)
  }

  const applyMapFilter = () => {
    applyFilter()
  }

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      applyFilter()
    }
  }

  const resetFilter = () => {
    setDateRange([null, null])
    setSelectedWitels([])
    setSelectedBranches([])
    setSelectedMapStatus([])
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleUploadSuccess = (response) => {
    console.log('handleUploadSuccess received:', response)
    const count = response?.successRows || response?.totalRows || 0
    const message = `✅ Upload berhasil: ${count} baris data HSI ditambahkan`
    console.log('Setting upload message:', message)
    setUploadMessage(message)
    setUploadError('')
    setTimeout(() => setUploadMessage(''), 5000)
    // Refresh data after successful upload
    fetchHSIData()
  }

  const handleDeleteRow = async (orderId) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data dengan Order ID: ${orderId}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/hsi/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus data')
      }

      const result = await response.json()
      setUploadMessage(`✅ ${result.message}`)
      setUploadError('')
      setTimeout(() => setUploadMessage(''), 5000)
      // Refresh data after successful delete
      fetchHSIData()
    } catch (error) {
      setUploadError(`❌ Gagal menghapus data: ${error.message}`)
      setUploadMessage('')
      setTimeout(() => setUploadError(''), 5000)
    }
  }

  const handleUploadError = (error) => {
    const errorMsg = error.response?.data?.message || error.message || 'Gagal upload file'
    setUploadError(`❌ ${errorMsg}`)
    setUploadMessage('')
    setTimeout(() => setUploadError(''), 5000)
  }

  const hasData = (data) => data && data.length > 0

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard HSI - Overview</h1>
          <p className="text-gray-600 mt-1">High Speed Internet - Monitoring & Analytics</p>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Import Data HSI</h2>
          <FileUploadForm 
            type="hsi"
            onSuccess={handleUploadSuccess}
          />
          {uploadMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
              {uploadMessage}
            </div>
          )}
          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
              {uploadError}
            </div>
          )}
        </div>

        {/* SECTION 1: GLOBAL FILTER */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Periode Data</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDateRange([e.target.value ? new Date(e.target.value) : null, endDate])}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Dari"
                />
                <input
                  type="date"
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDateRange([startDate, e.target.value ? new Date(e.target.value) : null])}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Hingga"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Filter Witel</label>
              <MultiSelectDropdown options={witels} selected={selectedWitels} onChange={setSelectedWitels} placeholder="Semua Witel" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Filter Branch</label>
              <MultiSelectDropdown options={branchOptions} selected={selectedBranches} onChange={setSelectedBranches} placeholder="Semua Branch" />
            </div>
            <div className="flex gap-2">
              <button onClick={applyFilter} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-4 rounded shadow w-full">Terapkan</button>
              {(startDate || selectedWitels.length > 0 || selectedBranches.length > 0) && (
                <button onClick={resetFilter} className="bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2.5 px-4 rounded shadow">Reset</button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
            <div className="text-gray-500 text-xs font-bold uppercase">Total Order</div>
            <div className="text-2xl font-bold text-gray-800">{stats.total.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-green-600 text-xs font-bold uppercase">Completed / PS</div>
            <div className="text-2xl font-bold text-green-700">{stats.completed.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-yellow-600 text-xs font-bold uppercase">Open / Progress</div>
            <div className="text-2xl font-bold text-yellow-700">{stats.open.toLocaleString()}</div>
          </div>
        </div>

        {/* CHART ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">Total Order per Regional (Witel)</h3>
            <div className="h-80 flex justify-center items-center">
              <div className="text-gray-400">No Data</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">Sebaran PS per Regional (Witel)</h3>
            <div className="h-80 flex justify-center items-center">
              <div className="text-gray-400">Data PS Kosong</div>
            </div>
          </div>
        </div>

        {/* CHART ROW 2: CANCEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">CANCEL BY FCC</h3>
            <div className="h-96 flex items-center justify-center text-gray-400">Tidak ada data Cancel FCC</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-700 mb-4 text-center border-b pb-2">CANCEL NON-FCC</h3>
            <div className="h-96 flex items-center justify-center text-gray-400">Tidak ada data Cancel Biasa</div>
          </div>
        </div>

        {/* CHART ROW 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-md font-bold text-gray-700">Komposisi Status</h3>
            </div>
            <div className="h-80 flex justify-center items-center">
              <div className="text-gray-400">No Data</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-md font-bold text-gray-700">Tren Jenis Layanan</h3>
            </div>
            <div className="h-80 flex justify-center items-center">
              <div className="text-gray-400">No Data</div>
            </div>
          </div>
        </div>

        {/* TREND CHART */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Trend Penjualan Harian</h3>
              <p className="text-sm text-gray-500">Perbandingan Total Order Masuk vs Completed (PS)</p>
            </div>
          </div>
          <div className="h-80 w-full flex items-center justify-center text-gray-400">
            Data Trend Tidak Tersedia
          </div>
        </div>

        {/* PETA SEBARAN */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6 mb-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-md font-bold text-gray-700">Peta Sebaran Order HSI</h3>
            <div className="flex gap-2 items-center mt-2 md:mt-0 relative z-[1002]">
              <div className="w-48">
                <MultiSelectDropdown options={mapStatusOptions} selected={selectedMapStatus} onChange={setSelectedMapStatus} placeholder="Semua Status" isMapControl={true} />
              </div>
              <button onClick={applyMapFilter} className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition">Filter Map</button>
            </div>
          </div>
          <div className="h-96 w-full z-0 relative bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            <p className="text-center">Data koordinat tidak tersedia dengan filter ini.</p>
          </div>
          <div className="flex gap-4 mt-4 justify-center text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500 block"></span> Completed (PS)
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500 block"></span> Open/Proses
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500 block"></span> Cancel
            </div>
          </div>
        </div>

        {/* DATA PREVIEW TABLE */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-800">Data Preview</h3>
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Cari Order ID / Nama / Layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchEnter}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Order Date', 'Customer Name', 'Witel', 'STO', 'Layanan', 'Status Group', 'Detail Status', 'Aksi'].map((head) => (
                    <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center text-sm text-gray-500 bg-gray-50">
                      Loading data...
                    </td>
                  </tr>
                ) : hsiData && hsiData.length > 0 ? (
                  hsiData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.orderDate ? new Date(row.orderDate).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{row.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.witel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.typeLayanan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${row.kelompokStatus === 'PS' ? 'bg-green-100 text-green-800' :
                            (row.kelompokStatus === 'CANCEL' || row.kelompokStatus === 'REJECT_FCC') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {row.kelompokStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 max-w-xs truncate" title={row.statusResume}>
                        {row.statusResume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteRow(row.orderId)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center text-sm text-gray-500 bg-gray-50">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">3</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 rounded-l-md cursor-not-allowed opacity-50">
                    Previous
                  </button>
                  <button className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 rounded-r-md cursor-not-allowed opacity-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HSI
