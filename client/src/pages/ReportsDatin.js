import React, { useState, useEffect, useMemo } from 'react'
import { FiDownload, FiChevronDown, FiSearch } from 'react-icons/fi'
import FileUploadForm from '../components/FileUploadForm'
import api from '../services/api'

// Filter Report DATIN
const FilterHeaderDatin = ({ title, columnKey, bgClass, activeFilters, setActiveFilters, openFilter, setOpenFilter, filterOptions }) => (
  <th className={`${bgClass} border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap relative`}>
    <div
      className="flex items-center justify-between gap-2 cursor-pointer hover:bg-white/10 rounded px-1 -mx-1"
      onClick={(e) => {
        e.stopPropagation()
        setOpenFilter(openFilter === columnKey ? null : columnKey)
      }}
    >
      <div className="flex flex-col items-start">
        <span>{title}</span>
        {activeFilters[columnKey]?.length > 0 && (
          <span className="text-[10px] font-normal text-yellow-300 max-w-[100px] truncate">
            {activeFilters[columnKey][0]}
          </span>
        )}
      </div>
      <FiChevronDown className={`flex-shrink-0 transition-transform ${openFilter === columnKey ? 'rotate-180' : ''}`} />
    </div>

    {openFilter === columnKey && (
      <div
        className="absolute left-0 top-full mt-1 w-48 bg-white text-gray-800 rounded-md shadow-xl z-50 border border-gray-200 max-h-60 overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`px-4 py-2 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-100 ${!activeFilters[columnKey]?.length ? 'bg-blue-50 font-semibold text-blue-600' : ''}`}
          onClick={() => {
            setActiveFilters(prev => ({ ...prev, [columnKey]: [] }))
            setOpenFilter(null)
          }}
        >
          All
        </div>
        {filterOptions.map((option, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer text-xs ${activeFilters[columnKey]?.includes(option) ? 'bg-blue-50 font-semibold text-blue-600' : ''}`}
            onClick={() => {
              setActiveFilters(prev => ({ ...prev, [columnKey]: [option] }))
              setOpenFilter(null)
            }}
          >
            {option}
          </div>
        ))}
      </div>
    )}
  </th>
)

const ReportsDatin = () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const formatDateLocal = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [startDate, setStartDate] = useState(formatDateLocal(startOfMonth))
  const [endDate, setEndDate] = useState(formatDateLocal(now))
  const [selectedWitel, setSelectedWitel] = useState([])
  const [isWitelDropdownOpen, setIsWitelDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState({ table1Data: [], table2Data: [], galaksiData: [], detailData: [] })
  const [detailData, setDetailData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: 'order_date', direction: 'desc' })
  const [activeFilters, setActiveFilters] = useState({
    produk: [],
    segmen: [],
    sub_segmen: [],
    kategori: [],
    kategori_umur: [],
    status: []
  })
  const [openFilter, setOpenFilter] = useState(null)
  const [filterOptions, setFilterOptions] = useState({
    produk: [],
    segmen: [],
    sub_segmen: [],
    kategori: [],
    kategori_umur: [],
    status: []
  })

  const witelList = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
  const itemsPerPage = 10

  const toggleWitel = (option) => {
    if (selectedWitel.includes(option)) {
      setSelectedWitel(selectedWitel.filter(item => item !== option))
    } else {
      setSelectedWitel([...selectedWitel, option])
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const summaryParams = {
        start_date: startDate,
        end_date: endDate,
        witel: selectedWitel.join(',')
      }

      const detailsParams = {
        start_date: startDate,
        end_date: endDate,
        witel: selectedWitel.join(','),
        search: searchQuery,
        page: currentPage,
        limit: 100 // Fetch more initially or use pagination state
      }

      const [summaryRes, detailsRes] = await Promise.all([
        api.get('/report/datin-summary', { params: summaryParams }),
        api.get('/report/datin-details', { params: detailsParams })
      ])

      if (summaryRes.data?.data) {
        setApiData(prev => ({ ...prev, ...summaryRes.data.data }))
      }

      if (detailsRes.data?.data?.data) {
        console.log('DETAILS DATA:', detailsRes.data.data.data)
        setDetailData(detailsRes.data.data.data)
        // Update pagination info if needed, e.g. setTotalPages(detailsRes.data.data.pagination.totalPages)
      } else {
        setDetailData([])
      }

    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedWitel])

  // Update filter options based on detailData
  useEffect(() => {
    if (detailData.length > 0) {
      setFilterOptions({
        produk: [...new Set(detailData.map(item => item.produk).filter(Boolean))].sort(),
        segmen: [...new Set(detailData.map(item => item.segmen).filter(Boolean))].sort(),
        sub_segmen: [...new Set(detailData.map(item => item.sub_segmen).filter(Boolean))].sort(),
        kategori: [...new Set(detailData.map(item => item.kategori).filter(Boolean))].sort(),
        kategori_umur: [...new Set(detailData.map(item => item.kategori_umur).filter(Boolean))].sort(),
        status: [...new Set(detailData.map(item => item.status).filter(Boolean))].sort()
      })
    }
  }, [detailData])

  const table1Data = useMemo(() => {
    if (!apiData.table1Data.length) return []
    return apiData.table1Data
  }, [apiData.table1Data])

  const table2Data = useMemo(() => {
    if (!apiData.table2Data.length) return []
    return apiData.table2Data
  }, [apiData.table2Data])

  const galaksiData = useMemo(() => {
    return apiData.galaksiData.length ? apiData.galaksiData : []
  }, [apiData.galaksiData])

  // Filter and sort detail data
  const filteredDetailData = useMemo(() => {
    let filtered = detailData

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.order_id?.toString().toLowerCase().includes(query) ||
        item.nipnas?.toString().toLowerCase().includes(query) ||
        item.standard_name?.toLowerCase().includes(query)
      )
    }

    // Active filters
    for (const [key, values] of Object.entries(activeFilters)) {
      if (values && values.length > 0) {
        filtered = filtered.filter(item => values.includes(item[key]))
      }
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue
    })

    return filtered
  }, [detailData, searchQuery, activeFilters, sortConfig])

  // Pagination
  const totalPages = Math.ceil(filteredDetailData.length / itemsPerPage)
  const currentDetailData = useMemo(() => {
    return filteredDetailData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredDetailData, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilters])


  const [activeTab, setActiveTab] = useState('revenue') // 'revenue' or 'status'

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-datin?${params.toString()}`
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Data</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10">
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Dari</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700" />
            </div>
            <span className="text-gray-400 font-light">|</span>
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Sampai</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700" />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 relative">
            <div className="flex flex-col justify-center px-2 h-full w-40">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Witel</span>
              <div
                className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                onClick={() => setIsWitelDropdownOpen(!isWitelDropdownOpen)}
              >
                <span className="truncate">{selectedWitel.length > 0 ? selectedWitel.join(', ') : 'Semua Witel'}</span>
                <FiChevronDown className={`ml-1 transition-transform ${isWitelDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {isWitelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {witelList.map(option => (
                  <div
                    key={option}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => toggleWitel(option)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedWitel.includes(option)}
                      readOnly
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleExport} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 whitespace-nowrap h-10">
            <FiDownload className="mr-2" size={16} />
            Ekspor Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Report Jenis Order & Revenue
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'status' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Report Status Progress Order
        </button>
      </div>

      {activeTab === 'revenue' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Report Jenis Order & Revenue</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border text-[10px]">
              <thead className="bg-blue-600">
                <tr>
                  <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">WITEL</th>

                  {/* < 3 Bulan */}
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-700">AO</th>
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-700">DO</th>
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-700">MO</th>
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-800">ORDER &lt;3BLN TOTAL</th>

                  {/* > 3 Bulan */}
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-700">AO</th>
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-700">DO</th>
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-700">MO</th>
                  <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px] bg-blue-800">ORDER &gt;3BLN TOTAL</th>

                  <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">GRAND<br/>TOTAL<br/>ORDER</th>
                </tr>
                <tr>
                  {/* < 3 Bulan Subheaders */}
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>

                   {/* > 3 Bulan Subheaders */}
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">JML</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-blue-600 border text-[9px]">EST (JT)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {table1Data.map((row) => (
                  <tr key={row.id} className={row.isCategoryHeader ? 'bg-blue-700 font-bold text-white' : 'hover:bg-gray-50'}>
                    <td className={`px-2 py-1 whitespace-nowrap border text-left ${row.isCategoryHeader ? 'font-bold text-white bg-blue-700' : ''}`}>{row.isCategoryHeader ? row.category : row.witel}</td>

                    {/* < 3 Bulan */}
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.ao_3bln}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_ao_3bln}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.do_3bln}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_do_3bln}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.mo_3bln}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_mo_3bln}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.total_3bln}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_3bln}</td>

                    {/* > 3 Bulan */}
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.ao_3bln2}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_ao_3bln2}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.do_3bln2}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_do_3bln2}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.mo_3bln2}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_mo_3bln2}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.total_3bln2}</td>
                    <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_3bln2}</td>

                    <td className={`px-2 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.grand_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Report Status Progress Order</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border text-[10px]">
              <thead className="bg-red-900">
                <tr>
                  <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">WITEL</th>
                  <th colSpan="3" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&lt;3BLN</th>
                  <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&lt;3BLN<br/>TOTAL</th>
                  <th colSpan="3" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&gt;3BLN</th>
                  <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&gt;3BLN<br/>TOTAL</th>
                  <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">GRAND<br/>TOTAL<br/>ORDER</th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">PROVIDE<br/>ORDER</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">IN<br/>PROCESS</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">READY<br/>TO BILL</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">PROVIDE<br/>ORDER</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">IN<br/>PROCESS</th>
                  <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">READY<br/>TO BILL</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {table2Data.map((row) => (
                  <tr key={row.id} className={`hover:bg-gray-50 ${['SME', 'GOV', 'PRIVATE', 'SOE'].includes(row.witel) ? 'bg-red-900 font-bold text-white' : ''}`}>
                    <td className="px-2 py-1 whitespace-nowrap border text-left">{row.witel}</td>
                    <td className="px-2 py-1 whitespace-nowrap border">{row.provide_order}</td>
                    <td className="px-2 py-1 whitespace-nowrap border">{row.in_process}</td>
                    <td className="px-2 py-1 whitespace-nowrap border">{row.ready_bill}</td>
                    <td className="px-2 py-1 whitespace-nowrap border font-semibold">{row.total_3bln}</td>
                    <td className="px-2 py-1 whitespace-nowrap border">{row.provide_order2}</td>
                    <td className="px-2 py-1 whitespace-nowrap border">{row.in_process2}</td>
                    <td className="px-2 py-1 whitespace-nowrap border">{row.ready_bill2}</td>
                    <td className="px-2 py-1 whitespace-nowrap border font-semibold">{row.total_3bln2}</td>
                    <td className="px-2 py-1 whitespace-nowrap border font-bold">{row.grand_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Posisi Galaksi (Order In Progress)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[10px]">
            <thead className="bg-gray-700">
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">PO</th>
                <th colSpan="6" className="px-2 py-2 text-center font-bold text-white border bg-blue-600 text-[9px]">&lt; 3 BLN</th>
                <th colSpan="6" className="px-2 py-2 text-center font-bold text-white border bg-blue-600 text-[9px]">&gt; 3 BLN</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">Achievement<br/>&gt;3bln</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">AO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">SO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">DO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">MO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">RO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">&lt; 3 BLN Total</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">AO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">SO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">DO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">MO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">RO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">&gt; 3 BLN Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {galaksiData.map((row, idx) => (
                <tr key={row.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 text-gray-700`}>
                  <td className="px-2 py-1 whitespace-nowrap border text-left font-medium">{row.po}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ao_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.so_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.do_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.mo_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ro_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border font-bold bg-blue-50">{row.total_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ao_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.so_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.do_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.mo_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ro_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border font-bold bg-blue-50">{row.total_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.achievement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report DATIN Details Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-lg font-bold text-gray-800">Report DATIN Details</h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari Order ID / NIPNAS / Standard Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm pb-4">
          <table className="min-w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="text-white">
                <th
                  className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap cursor-pointer hover:bg-blue-700"
                  onClick={() => setSortConfig({ key: 'order_id', direction: sortConfig.key === 'order_id' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                >
                  Order ID
                </th>
                <th
                  className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap cursor-pointer hover:bg-blue-700"
                  onClick={() => setSortConfig({ key: 'order_date', direction: sortConfig.key === 'order_date' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                >
                  Order Date {sortConfig.key === 'order_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">NIPNAS</th>
                <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Standard Name (PO)</th>

                {/* Filterable columns */}
                <FilterHeaderDatin title="Produk" columnKey="produk" bgClass="bg-blue-600" activeFilters={activeFilters} setActiveFilters={setActiveFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} filterOptions={filterOptions.produk} />

                <th className="bg-gray-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Revenue</th>

                <FilterHeaderDatin title="Segmen" columnKey="segmen" bgClass="bg-gray-600" activeFilters={activeFilters} setActiveFilters={setActiveFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} filterOptions={filterOptions.segmen} />
                <FilterHeaderDatin title="Sub Segmen" columnKey="sub_segmen" bgClass="bg-gray-600" activeFilters={activeFilters} setActiveFilters={setActiveFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} filterOptions={filterOptions.sub_segmen} />
                <FilterHeaderDatin title="Kategori" columnKey="kategori" bgClass="bg-gray-600" activeFilters={activeFilters} setActiveFilters={setActiveFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} filterOptions={filterOptions.kategori} />
                <FilterHeaderDatin title="Kategori Umur" columnKey="kategori_umur" bgClass="bg-gray-600" activeFilters={activeFilters} setActiveFilters={setActiveFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} filterOptions={filterOptions.kategori_umur} />

                <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Umur Order</th>
                <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Bill Witel</th>
                <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Cust Witel</th>
                <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Service Witel</th>

                <FilterHeaderDatin title="Status" columnKey="status" bgClass="bg-orange-600" activeFilters={activeFilters} setActiveFilters={setActiveFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} filterOptions={filterOptions.status} />

                <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Milestone</th>
                <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Biaya Pasang</th>
                <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Harga Bulanan</th>
                <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Lama Kontrak (Hari)</th>
                <th className="bg-green-700 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Bill City</th>
                <th className="bg-green-700 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Tipe Order</th>
                <th className="bg-green-700 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Witel Baru</th>
              </tr>
            </thead>
            <tbody>
              {currentDetailData.length > 0 ? (
                currentDetailData.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.orderId}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">
                      {item.orderDate ? new Date(item.orderDate).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.nipnas || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.name || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.produk || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 text-right whitespace-nowrap">
                      {item.revenue !== null && item.revenue !== undefined && item.revenue !== 0 ? item.revenue.toLocaleString('id-ID') : (item.revenue === 0 ? '0' : '-')}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.segmen || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.subSegmen || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.kategori || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.kategoriUmur || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.umurOrder || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.billWitel || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.custWitel || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.serviceWitel || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.status || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.milestone || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 text-right whitespace-nowrap">
                      {item.biayaPasang !== null && item.biayaPasang !== undefined && item.biayaPasang !== 0 ? item.biayaPasang.toLocaleString('id-ID') : (item.biayaPasang === 0 ? '0' : '-')}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 text-right whitespace-nowrap">
                      {item.hargaBulanan !== null && item.hargaBulanan !== undefined && item.hargaBulanan !== 0 ? item.hargaBulanan.toLocaleString('id-ID') : (item.hargaBulanan === 0 ? '0' : '-')}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 text-right whitespace-nowrap">
                      {item.lamaKontrak !== null && item.lamaKontrak !== undefined && item.lamaKontrak !== 0
                        ? item.lamaKontrak.toLocaleString('id-ID')
                        : (item.lamaKontrak === 0 ? '0' : '-')}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.billCity || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.tipeOrder || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.witelBaru || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="22" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDetailData.length)} of {filteredDetailData.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3) p = currentPage - 2 + i
                  if (p > totalPages) p = totalPages - (4 - i)
                  if (p < 1) p = i + 1
                }
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 border rounded ${currentPage === p ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data Datin</h2>
        <FileUploadForm type="datin" />
      </div>
    </>
  )
}

export default ReportsDatin
