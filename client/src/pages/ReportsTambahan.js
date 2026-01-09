import React, { useState, useMemo, useEffect, useRef } from 'react'
import { FiDownload, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'

const ReportsTambahan = () => {
  const { user } = useAuth()
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'superadmin'].includes(currentRole)
  const now = new Date()
  const startOfYear2025 = new Date(2025, 0, 1) // 1 Jan 2025

  const formatDateLocal = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [startDate, setStartDate] = useState(formatDateLocal(startOfYear2025))
  const [endDate, setEndDate] = useState(formatDateLocal(now))
  const [selectedWitel, setSelectedWitel] = useState('')
  const [tableDataFromAPI, setTableDataFromAPI] = useState([])
  const [projectDataFromAPI, setProjectDataFromAPI] = useState([])
  const [top3WitelFromAPI, setTop3WitelFromAPI] = useState([])
  const [top3PoFromAPI, setTop3PoFromAPI] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [previewData, setPreviewData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const itemsPerPage = 10

  // Sorting & Filtering State
  const [sortConfig, setSortConfig] = useState({ key: 'usia', direction: 'desc' })
  const [filters, setFilters] = useState({
    poName: [],
    witelBaru: [],
    witelLama: [],
    statusProyek: [],
    goLive: []
  })
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null)
  const filterRef = useRef(null)

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveFilterDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const witelHierarchy = {
    'BALI': ['BALI', 'DENPASAR', 'SINGARAJA'],
    'JATIM BARAT': ['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG'],
    'JATIM TIMUR': ['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO'],
    'NUSA TENGGARA': ['NUSA TENGGARA', 'NTT', 'NTB'],
    'SURAMADU': ['SURAMADU', 'SURABAYA UTARA', 'SURABAYA SELATAN', 'MADURA']
  }

  const witelList = Object.keys(witelHierarchy)

  // Fetch data from API
  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/dashboard/report-tambahan`,
        {
          params: { start_date: startDate, end_date: endDate },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data?.data) {
        setTableDataFromAPI(response.data.data.tableData || [])
        setProjectDataFromAPI(response.data.data.projectData || [])
        setTop3WitelFromAPI(response.data.data.top3Witel || [])
        setTop3PoFromAPI(response.data.data.top3Po || [])
      }

      // Fetch preview data (raw project rows) for detailed view
      const previewResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/tambahan`,
        {
          params: { start_date: startDate, end_date: endDate },
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const rawProjects = previewResponse.data?.data?.rawProjectRows || []
      // Default sort by usia desc initially
      // const sortedProjects = [...rawProjects].sort((a, b) => (b.usia || 0) - (a.usia || 0))
      // setPreviewData(sortedProjects)
      setPreviewData(rawProjects)
      setCurrentPage(1)
      setPageInput(1)
    } catch (error) {
      console.error('Failed to fetch report data:', error)
      setPreviewData([])
    }
  }

  useEffect(() => {
    fetchReportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, refreshKey])

  // Table 1: Data Report JT
  const tableData = useMemo(() => {
    return tableDataFromAPI
  }, [tableDataFromAPI])

  // Table 2: Project Belum GO LIVE
  const projectBelumGoLive = useMemo(() => {
    return projectDataFromAPI
  }, [projectDataFromAPI])

  // Process Top 3 Data
  const groupedTop3Witel = useMemo(() => {
    const groups = {}
    top3WitelFromAPI.forEach(row => {
      if (!groups[row.region]) groups[row.region] = []
      groups[row.region].push(row)
    })
    return groups
  }, [top3WitelFromAPI])

  const groupedTop3Po = useMemo(() => {
    const groups = {}
    top3PoFromAPI.forEach(row => {
      if (!groups[row.po_name]) groups[row.po_name] = []
      groups[row.po_name].push(row)
    })
    return groups
  }, [top3PoFromAPI])

  const filteredTableData = useMemo(() => {
    let result = tableData
    if (selectedWitel) {
      const parentWitel = witelList.find(w => witelHierarchy[w].includes(selectedWitel))
      result = result.filter(row => row.parentWitel === parentWitel || row.witel === selectedWitel || row.isParent)
    }
    return result
  }, [tableData, selectedWitel])

  const filteredProjectData = useMemo(() => {
    let result = projectBelumGoLive
    if (selectedWitel) {
      const parentWitel = witelList.find(w => witelHierarchy[w].includes(selectedWitel))
      result = result.filter(row => row.parentWitel === parentWitel || row.witel === selectedWitel || row.isParent)
    }
    return result
  }, [projectBelumGoLive, selectedWitel])

  // --- Filtering & Sorting Logic for Preview Data ---

  const uniqueValues = useMemo(() => {
    const getUnique = (key) => [...new Set(previewData.map(item => item[key] || '-'))].sort()
    return {
      poName: getUnique('poName'),
      witelBaru: getUnique('witelBaru'),
      witelLama: getUnique('witelLama'),
      statusProyek: getUnique('statusProyek'),
      goLive: getUnique('goLive'),
    }
  }, [previewData])

  const processedData = useMemo(() => {
    let data = [...previewData]

    // 1. Filter
    Object.keys(filters).forEach(key => {
      if (filters[key].length > 0) {
        data = data.filter(item => filters[key].includes(item[key] || '-'))
      }
    })

    // 2. Sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        let valA = a[sortConfig.key]
        let valB = b[sortConfig.key]

        // Handle numeric/currency strings or dates if necessary
        if (sortConfig.key === 'revenuePlan' || sortConfig.key === 'usia') {
           valA = Number(valA || 0)
           valB = Number(valB || 0)
        } else {
           valA = (valA || '').toString().toLowerCase()
           valB = (valB || '').toString().toLowerCase()
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return data
  }, [previewData, filters, sortConfig])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(processedData.length / itemsPerPage)), [processedData.length])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
      setPageInput(1)
    }
  }, [processedData.length, totalPages, currentPage]) // reset to page 1 on filter change usually best UX

  const paginatedPreviewData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedData.slice(start, start + itemsPerPage)
  }, [processedData, currentPage])

  const handlePageChange = (page) => {
    if (!Number.isFinite(page)) return
    const nextPage = Math.min(Math.max(1, page), totalPages)
    setCurrentPage(nextPage)
    setPageInput(nextPage)
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const toggleFilter = (column) => {
    if (activeFilterDropdown === column) {
      setActiveFilterDropdown(null)
    } else {
      setActiveFilterDropdown(column)
    }
  }

  const handleFilterChange = (column, value) => {
    setFilters(prev => {
      const current = prev[column]
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [column]: next }
    })
  }

  const handleSelectAllFilters = (column) => {
    setFilters(prev => {
      const allSelected = prev[column].length === uniqueValues[column].length
      return { ...prev, [column]: allSelected ? [] : uniqueValues[column] }
    })
  }

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-tambahan?${params.toString()}`
  }

  const formatNumber = (n) => (n || 0).toLocaleString('id-ID')
  const formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '-')

  // Component for Filter Dropdown
  const FilterDropdown = ({ column, title }) => {
    const options = uniqueValues[column] || []
    const selected = filters[column] || []

    if (activeFilterDropdown !== column) return null

    return (
      <div ref={filterRef} className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg z-50 text-gray-800 font-normal">
        <div className="p-2 border-b">
          <label className="flex items-center space-x-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={selected.length === options.length && options.length > 0}
              onChange={() => handleSelectAllFilters(column)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold">Select All</span>
          </label>
        </div>
        <div className="max-h-48 overflow-y-auto p-1">
          {options.map(opt => (
            <label key={opt} className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => handleFilterChange(column, opt)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="truncate" title={opt}>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  const SortableHeader = ({ label, sortKey, align = "left" }) => (
    <th
      className={`px-2 py-2 text-${align} cursor-pointer hover:bg-gray-700 transition-colors`}
      onClick={() => handleSort(sortKey)}
    >
      <div className={`flex items-center ${align === "right" ? "justify-end" : "justify-start"} gap-1`}>
        {label}
        <div className="flex flex-col">
          <FiArrowUp size={10} className={sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-white' : 'text-gray-500'} />
          <FiArrowDown size={10} className={sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-white' : 'text-gray-500'} />
        </div>
      </div>
    </th>
  )

  const FilterableHeader = ({ label, filterKey }) => (
    <th className="px-2 py-2 text-left relative">
      <div className="flex items-center justify-between gap-1">
        <span>{label}</span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFilter(filterKey); }}
          className={`p-1 rounded ${filters[filterKey].length > 0 ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <FiFilter size={12} />
        </button>
      </div>
      <FilterDropdown column={filterKey} title={label} />
    </th>
  )

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Data</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <select value={selectedWitel} onChange={(e) => setSelectedWitel(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2 border">
            <option value="">Semua Witel</option>
            {witelList.map(parentWitel => (
              <optgroup key={parentWitel} label={`WITEL ${parentWitel}`}>
                {witelHierarchy[parentWitel].map(witel => (
                  <option key={witel} value={witel}>
                    {witel === parentWitel ? `WITEL ${witel}` : witel}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

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

          <button onClick={handleExport} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 whitespace-nowrap h-10">
            <FiDownload className="mr-2" size={16} />
            Ekspor Report
          </button>
        </div>
      </div>

      {/* Table 1: Data Report JT */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Report JT</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[8px]">
            <thead>
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border border-gray-500 bg-gray-800">WITEL</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border border-gray-500 bg-gray-800">JUMLAH LOP (EXC DROP)</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border border-gray-500 bg-gray-800">REV ALL LOP</th>
                <th colSpan="5" className="px-2 py-1 text-center font-bold text-white border border-gray-500 bg-blue-600">PROGRESS DEPLOY</th>
                <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border border-gray-500 bg-green-700">GOLIVE (EXC DROP)</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border border-gray-500 bg-red-600">DROP</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border border-gray-500 bg-gray-600">%CLOSE</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-bold text-white border border-gray-500 text-[7px] bg-blue-400">INITIAL</th>
                <th className="px-2 py-1 text-center font-bold text-white border border-gray-500 text-[7px] bg-blue-400">SURVEY & DRM</th>
                <th className="px-2 py-1 text-center font-bold text-white border border-gray-500 text-[7px] bg-blue-400">PERIZINAN & MOS</th>
                <th className="px-2 py-1 text-center font-bold text-white border border-gray-500 text-[7px] bg-blue-400">INSTALASI</th>
                <th className="px-2 py-1 text-center font-bold text-white border border-gray-500 text-[7px] bg-blue-400">FI-OGP LIVE</th>
                <th className="px-2 py-1 text-center font-bold text-white border border-gray-500 text-[7px] bg-green-500">JML LOP</th>
                <th className="px-2 py-1 text-center font-bold text-white border border-gray-500 text-[7px] bg-green-500">REV LOP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center text-[8px]">
              {filteredTableData.map((row) => (
                <tr key={row.id} className={row.isParent ? 'bg-gray-700 font-bold text-white' : 'hover:bg-gray-50'}>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 text-left font-semibold ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>
                    {row.isParent ? `WITEL ${row.witel}` : row.witel}
                  </td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.jumlahLop}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.revAll ? row.revAll.toLocaleString('id-ID') : 0}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.initial}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.survey}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.perizinan}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.instalasi}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.piOgp}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 font-bold ${row.isParent ? 'bg-green-600 text-white' : 'bg-green-100'}`}>{row.golive_jml}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 font-bold ${row.isParent ? 'bg-green-600 text-white' : 'bg-green-100'}`}>{row.golive_rev ? row.golive_rev.toLocaleString('id-ID') : 0}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 font-bold ${row.isParent ? 'bg-red-600 text-white' : 'bg-red-100'}`}>{row.drop}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border border-gray-300 font-semibold ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.persen_close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Project Belum GO LIVE */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Project Belum GO LIVE</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[8px]">
            <thead className="bg-blue-600">
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">WITEL LAMA</th>
                <th colSpan="2" className="px-2 py-1 text-center font-bold text-white border bg-red-600">TOC LOP BELUM GOLIVE</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">JUMLAH LOP ON PROGRESS</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">% DALAM TOC</th>
              </tr>
              <tr className="bg-blue-600">
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px] bg-blue-600">DALAM TOC</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px] bg-blue-600">LEWAT TOC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center text-[8px]">
              {filteredProjectData.map((row) => (
                <tr key={row.id} className={row.isParent ? 'bg-gray-700 font-bold text-white' : 'hover:bg-gray-50'}>
                  <td className={`px-2 py-1 whitespace-nowrap border text-left font-semibold ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>
                    {row.isParent ? `WITEL ${row.witel}` : row.witel}
                  </td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.dalam_toc}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.lewat_toc}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.jumlah_lop_progress}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isParent ? 'bg-gray-700 text-white' : ''}`}>{row.persen_dalam_toc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 3: Top 3 Usia Project - By Witel Induk */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top 3 Usia Project Terbaru (On Progress) - By Witel Induk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[8px]">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-2 py-2 text-center font-bold text-white border">WITEL INDUK</th>
                <th colSpan="5" className="px-2 py-1 text-center font-bold text-white border">TOP 3 USIA PROJECT ON PROGRESS</th>
              </tr>
              <tr className="bg-blue-600">
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]"></th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">IHLD</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">TGL MOM</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">REVENUE</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">STATUS TOMPS</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">USIA (HARI)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {Object.keys(groupedTop3Witel).length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">Tidak ada data "On Progress" yang ditemukan.</td>
                </tr>
              ) : (
                Object.entries(groupedTop3Witel).map(([region, rows]) => (
                  rows.map((row, idx) => (
                    <tr key={`${region}-${idx}`} className="hover:bg-gray-50">
                      {idx === 0 && (
                        <td rowSpan={rows.length} className="px-2 py-1 border align-middle font-bold bg-gray-50">{region}</td>
                      )}
                      <td className="px-2 py-1 border">{row.id_i_hld}</td>
                      <td className="px-2 py-1 border">{formatDate(row.tanggal_mom)}</td>
                      <td className="px-2 py-1 border">{formatNumber(row.revenue_plan)}</td>
                      <td className="px-2 py-1 border">{row.status_tomps_new}</td>
                      <td className="px-2 py-1 border font-bold text-red-600">{row.usia}</td>
                    </tr>
                  ))
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 4: Top 3 Usia Project - By PO */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top 3 Usia Project Terbaru (On Progress) - By PO</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[8px]">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-2 py-2 text-center font-bold text-white border">NAMA PO</th>
                <th className="px-2 py-2 text-center font-bold text-white border">NAMA PROJECT</th>
                <th colSpan="5" className="px-2 py-1 text-center font-bold text-white border">TOP 3 USIA PROJECT ON PROGRESS</th>
              </tr>
              <tr className="bg-blue-600">
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]"></th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]"></th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">IHLD</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">TGL MOM</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">REVENUE</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">STATUS TOMPS</th>
                <th className="px-2 py-1 text-center font-bold text-white border text-[7px]">USIA (HARI)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {Object.keys(groupedTop3Po).length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">Tidak ada data "On Progress" yang ditemukan.</td>
                </tr>
              ) : (
                Object.entries(groupedTop3Po).map(([poName, rows]) => (
                  rows.map((row, idx) => (
                    <tr key={`${poName}-${idx}`} className="hover:bg-gray-50">
                      {idx === 0 && (
                        <td rowSpan={rows.length} className="px-2 py-1 border align-middle font-bold bg-gray-50">{poName}</td>
                      )}
                      <td className="px-2 py-1 border text-left truncate max-w-[150px]" title={row.uraian_kegiatan}>{row.uraian_kegiatan}</td>
                      <td className="px-2 py-1 border">{row.id_i_hld}</td>
                      <td className="px-2 py-1 border">{formatDate(row.tanggal_mom)}</td>
                      <td className="px-2 py-1 border">{formatNumber(row.revenue_plan)}</td>
                      <td className="px-2 py-1 border">{row.status_tomps_new}</td>
                      <td className="px-2 py-1 border font-bold text-red-600">{row.usia}</td>
                    </tr>
                  ))
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Preview Jaringan Tambahan */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Data Preview Jaringan Tambahan (Usia Tertinggi)</h2>
          <div className="text-xs text-gray-500">
            {processedData.length !== previewData.length && (
              <span>Filtered: {processedData.length} of {previewData.length} rows</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full border text-[10px]">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-2 py-2 text-left">ID i-HLD</th>
                <FilterableHeader label="PO Name" filterKey="poName" />
                <FilterableHeader label="Witel Baru" filterKey="witelBaru" />
                <FilterableHeader label="Witel Lama" filterKey="witelLama" />
                <FilterableHeader label="Status Proyek" filterKey="statusProyek" />
                <FilterableHeader label="Go Live" filterKey="goLive" />
                <SortableHeader label="Usia (Hari)" sortKey="usia" />
                <SortableHeader label="Revenue Plan" sortKey="revenuePlan" />
                <th className="px-2 py-2 text-left">Tomps Last Activity</th>
                <th className="px-2 py-2 text-left">Tgl MOM</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPreviewData.map((row, idx) => (
                <tr key={`${row.id || row.idIHld || idx}`} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                  <td className="px-2 py-2 border">{row.idIHld || '-'}</td>
                  <td className="px-2 py-2 border">{row.poName || '-'}</td>
                  <td className="px-2 py-2 border">{row.witelBaru || '-'}</td>
                  <td className="px-2 py-2 border">{row.witelLama || '-'}</td>
                  <td className="px-2 py-2 border">{row.statusProyek || '-'}</td>
                  <td className="px-2 py-2 border text-center">{row.goLive || '-'}</td>
                  <td className="px-2 py-2 border text-red-700 font-semibold">{row.usia ?? '-'}</td>
                  <td className="px-2 py-2 border">{formatNumber(row.revenuePlan)}</td>
                  <td className="px-2 py-2 border">{row.statusTompsLastActivity || '-'}</td>
                  <td className="px-2 py-2 border">{formatDate(row.tanggalMom)}</td>
                </tr>
              ))}
              {paginatedPreviewData.length === 0 && (
                <tr><td className="px-3 py-8 text-center text-gray-500" colSpan={10}>Tidak ada data yang sesuai filter</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {processedData.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 border-t pt-4 text-sm">
            <div className="text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length} entries
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white border hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                <span>Page</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(Number(e.target.value))}
                  onBlur={() => handlePageChange(pageInput)}
                  className="w-16 border rounded px-2 py-1 text-center"
                />
                <span>of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(pageInput)}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Go
                </button>
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white border hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isAdminMode && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Unggah Data Tambahan</h2>
            <button
               onClick={async () => {
                 if (window.confirm('Apakah Anda yakin ingin menghapus SEMUA data JT? Tindakan ini tidak dapat dibatalkan.')) {
                   try {
                     const token = localStorage.getItem('accessToken')
                     await axios.post(
                       `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/truncate/jt`,
                       {},
                       { headers: { Authorization: `Bearer ${token}` } }
                     )
                     alert('Data JT berhasil dihapus')
                     setRefreshKey(prev => prev + 1)
                   } catch (err) {
                     alert('Gagal menghapus dataset: ' + (err.response?.data?.message || err.message))
                   }
                 }
               }}
               className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition duration-200 text-sm font-semibold"
            >
              Hapus Data JT
            </button>
          </div>
          <FileUploadForm
            type="jt"
            onSuccess={() => {
              // Refresh data after successful upload
              setRefreshKey(prev => prev + 1)
            }}
          />
        </div>
      )}
    </>
  )
}

export default ReportsTambahan
