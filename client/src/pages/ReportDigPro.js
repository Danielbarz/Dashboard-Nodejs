    import React, { useState, useEffect, useMemo, useRef } from 'react'
import { FiDownload, FiChevronDown, FiSearch, FiFilter } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'

const DetailTable = ({ 
  title, 
  data, 
  searchQuery, 
  setSearchQuery, 
  activeFilters, 
  setActiveFilters, 
  openFilter, 
  setOpenFilter, 
  filterOptions 
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          item.batch_id?.toString().toLowerCase().includes(query) ||
          item.order_id?.toString().toLowerCase().includes(query) ||
          item.customer_name?.toLowerCase().includes(query)
        
        if (!matchesSearch) return false
      }

      // Active Filters
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values && values.length > 0) {
          if (!values.includes(item[key])) {
            return false
          }
        }
      }

      return true
    })
  }, [data, searchQuery, activeFilters])

  useEffect(() => {
    setCurrentPage(1)
  }, [filteredData.length])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const FilterHeader = ({ title, columnKey, bgClass }) => (
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
            <span className="text-[10px] font-normal text-yellow-300 max-w-[120px] truncate">
              {activeFilters[columnKey][0]}
            </span>
          )}
        </div>
        <FiChevronDown className={`flex-shrink-0 transition-transform ${openFilter === columnKey ? 'rotate-180' : ''}`} />
      </div>
      
      {openFilter === columnKey && (
        <div 
          className="absolute left-0 top-full mt-1 w-56 bg-white text-gray-800 rounded-md shadow-xl z-50 border border-gray-200 max-h-60 overflow-y-auto text-left"
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
          {filterOptions[columnKey]?.map((option, idx) => (
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

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Cari Batch ID / Order ID / Customer..."
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
              <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Batch ID</th>
              <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Order ID</th>
              
              <FilterHeader title="Segment" columnKey="segment" bgClass="bg-gray-600" />
              <FilterHeader title="Channel" columnKey="channel" bgClass="bg-gray-600" />
              <FilterHeader title="Product" columnKey="product_name" bgClass="bg-blue-600" />
              
              <th className="bg-blue-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Layanan</th>
              <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Customer Name</th>
              
              <FilterHeader title="Order Status" columnKey="order_status" bgClass="bg-orange-600" />
              
              <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Sub Type</th>
              <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Milestone</th>
              <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Week</th>
              <th className="bg-orange-600 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Order Date</th>
              <th className="bg-green-700 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Net Price</th>
              
              <FilterHeader title="Witel" columnKey="witel" bgClass="bg-green-700" />
              
              <th className="bg-green-700 border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Branch</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.batch_id}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.order_id}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.segment}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.channel}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.product_name}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.layanan}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.customer_name}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.order_status}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.order_subtype}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.milestone}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.week}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">
                    {new Date(item.order_created_date).toLocaleString('id-ID', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-right whitespace-nowrap">
                    {item.net_price?.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.witel}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.branch}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} entries
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
                let p = i + 1;
                if (totalPages > 5) {
                    if (currentPage > 3) p = currentPage - 2 + i;
                    if (p > totalPages) p = totalPages - (4 - i);
                    if (p < 1) p = i + 1;
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
  )
}

const ReportDigPro = () => {
  const { user } = useAuth()
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'superadmin'].includes(currentRole)
  const now = new Date()
  // Default to 2025 for demo data if current year is 2026
  const defaultYear = now.getFullYear() === 2026 ? 2025 : now.getFullYear()
  const startOfMonth = new Date(defaultYear, 0, 1)
  const endOfData = new Date(defaultYear, 11, 31)

  const formatDateLocal = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [startDate, setStartDate] = useState(formatDateLocal(startOfMonth))
  const [endDate, setEndDate] = useState(formatDateLocal(endOfData))
  const [selectedSegment, setSelectedSegment] = useState(['SME'])
  const segmentOptions = ['SME', 'LEGS']
  const [selectedWitel, setSelectedWitel] = useState([])
  const witelList = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
  const [witelOptions, setWitelOptions] = useState(witelList)
  const [reportData, setReportData] = useState({ legs: [], sme: [], detailsLegs: {}, detailsSme: {} })
  const [detailData, setDetailData] = useState([])
  const [kpiData, setKpiData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isWitelDropdownOpen, setIsWitelDropdownOpen] = useState(false)
  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [activeFilters, setActiveFilters] = useState({
    segment: [],
    channel: [],
    product_name: [],
    order_status: [],
    witel: []
  })
  
  const [filterOptions, setFilterOptions] = useState({
    segment: [],
    channel: [],
    product_name: [],
    order_status: [],
    witel: []
  })

  const [openFilter, setOpenFilter] = useState(null)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const uniqueSegments = detailData.length > 0 
      ? [...new Set(detailData.map(item => item.segment).filter(Boolean))].sort() 
      : []
    
    const uniqueOrderStatus = detailData.length > 0
      ? [...new Set(detailData.map(item => item.order_status).filter(Boolean))].sort()
      : []

    const uniqueChannels = detailData.length > 0
      ? [...new Set(detailData.map(item => item.channel).filter(Boolean))].sort()
      : ['SC-ONE', 'NCX']

    const uniqueProducts = detailData.length > 0
      ? [...new Set(detailData.map(item => item.product_name).filter(Boolean))].sort()
      : ['Antares', 'Netmonk', 'OCA', 'Pijar']

    const options = {
      segment: uniqueSegments,
      channel: uniqueChannels,
      product_name: uniqueProducts,
      order_status: uniqueOrderStatus,
      witel: ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
    }
    setFilterOptions(options)
  }, [detailData])

  const toggleFilter = (column, value) => {
    setActiveFilters(prev => {
      const current = prev[column]
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      return { ...prev, [column]: updated }
    })
  }

  const toggleSegment = (option) => {
    if (selectedSegment.includes(option)) {
      setSelectedSegment(selectedSegment.filter(item => item !== option))
    } else {
      setSelectedSegment([...selectedSegment, option])
    }
  }

  const toggleWitel = (option) => {
    if (selectedWitel.includes(option)) {
      setSelectedWitel(selectedWitel.filter(item => item !== option))
    } else {
      setSelectedWitel([...selectedWitel, option])
    }
  }

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/dashboard/filter-options`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data?.data?.filters) {
          if (response.data.data.filters.witels && response.data.data.filters.witels.length > 0) {
            setWitelOptions(response.data.data.filters.witels)
          }
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error)
      }
    }
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    console.log('Detail Data Length:', detailData.length)
    console.log('Active Filters:', activeFilters)
  }, [detailData, activeFilters])

  const tableConfig = [
    {
      groupTitle: 'In Progress',
      groupClass: 'bg-blue-600',
      columnClass: 'bg-blue-400',
      columns: [
        { key: 'in_progress_n', title: 'N' },
        { key: 'in_progress_o', title: 'O' },
        { key: 'in_progress_ae', title: 'AE' },
        { key: 'in_progress_ps', title: 'PS' },
      ]
    },
    {
      groupTitle: 'Prov Comp',
      groupClass: 'bg-orange-600',
      columnClass: 'bg-orange-400',
      columns: [
        { key: 'prov_comp_n_realisasi', title: 'N' },
        { key: 'prov_comp_o_realisasi', title: 'O' },
        { key: 'prov_comp_ae_realisasi', title: 'AE' },
        { key: 'prov_comp_ps_realisasi', title: 'PS' },
      ]
    },
    {
      groupTitle: 'REVENUE (Rp Juta)',
      groupClass: 'bg-green-700',
      columnClass: 'bg-green-500',
      subColumnClass: 'bg-green-300',
      columns: [
        { key: 'revenue_n', title: 'N', subColumns: [{ key: '_ach', title: 'ACH' }, { key: '_target', title: 'T' }] },
        { key: 'revenue_o', title: 'O', subColumns: [{ key: '_ach', title: 'ACH' }, { key: '_target', title: 'T' }] },
        { key: 'revenue_ae', title: 'AE', subColumns: [{ key: '_ach', title: 'ACH' }, { key: '_target', title: 'T' }] },
        { key: 'revenue_ps', title: 'PS', subColumns: [{ key: '_ach', title: 'ACH' }, { key: '_target', title: 'T' }] },
      ]
    },
    {
      groupTitle: 'Grand Total',
      groupClass: 'bg-gray-600',
      columnClass: 'bg-gray-500',
      columns: [
        { 
          key: 'grand_total_realisasi', 
          title: 'Total',
          isCalculation: true,
          operands: ['prov_comp_n_realisasi', 'prov_comp_o_realisasi', 'prov_comp_ae_realisasi', 'prov_comp_ps_realisasi']
        }
      ]
    }
  ]

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const [analysisRes, detailRes, kpiRes] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/analysis`,
          {
            params: { 
              start_date: startDate, 
              end_date: endDate,
              witel: selectedWitel.join(',') 
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/details`,
          {
            params: { 
              start_date: startDate, 
              end_date: endDate, 
              segment: selectedSegment.join(','),
              witel: selectedWitel.join(',')
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        ),
        axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/kpi-po`,
          {
            params: { 
              start_date: startDate, 
              end_date: endDate,
              witel: selectedWitel.join(',') 
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      ])

      if (analysisRes.data?.data) {
        const data = analysisRes.data.data
        if (Array.isArray(data)) {
             setReportData({ legs: [], sme: [], detailsLegs: {}, detailsSme: {} })
        } else {
             setReportData(data)
        }
      }

      if (detailRes.data?.data) {
        console.log('API Response detailData:', detailRes.data.data);
        setDetailData(detailRes.data.data)
      }

      if (kpiRes.data?.data) {
        setKpiData(kpiRes.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedSegment, selectedWitel, refreshKey])

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-analysis?${params.toString()}`
  }

  const getCellValue = (item, col, parentCol = null) => {
    if (col.isCalculation) {
      const sum = col.operands.reduce((acc, key) => acc + (parseFloat(item[key]) || 0), 0)
      return sum
    }
    
    const fullKey = parentCol ? `${parentCol.key}${col.key}` : col.key
    const value = item[fullKey]
    
    if (fullKey.startsWith('revenue_') && typeof value === 'number') {
      return value.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    }
    
    return value !== undefined && value !== null ? value : 0
  }

  const calculateGrandTotals = (data) => {
    const totals = {}
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'number') {
          totals[key] = (totals[key] || 0) + item[key]
        }
      })
    })
    return totals
  }

  const renderTable = (title, data, details) => {
    const grandTotals = calculateGrandTotals(data)

    return (
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <table className="w-64 text-sm">
            <tbody>
              <tr>
                <td className="font-bold py-1">Total</td>
                <td className="py-1">{details?.total || 0}</td>
              </tr>
              <tr>
                <td className="font-bold py-1">OGP</td>
                <td className="py-1">{details?.ogp || 0}</td>
              </tr>
              <tr>
                <td className="font-bold py-1">Closed</td>
                <td className="py-1">{details?.closed || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr>
                <th rowSpan="3" className="bg-gray-800 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider">
                  {selectedWitel.length === 1 ? 'Branch/Telda' : 'WILAYAH TELKOM'}
                </th>
                {tableConfig.map((group, idx) => (
                  <th 
                    key={idx} 
                    colSpan={group.columns.reduce((acc, col) => acc + (col.subColumns ? col.subColumns.length : 1), 0)}
                    className={`${group.groupClass} text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider`}
                  >
                    {group.groupTitle}
                  </th>
                ))}
              </tr>
              <tr>
                {tableConfig.map(group => (
                  group.columns.map((col, idx) => (
                    <th 
                      key={idx}
                      colSpan={col.subColumns ? col.subColumns.length : 1}
                      rowSpan={col.subColumns ? 1 : 2}
                      className={`${group.columnClass} text-white border border-gray-400 px-2 py-1 font-medium`}
                    >
                      {col.title}
                    </th>
                  ))
                ))}
              </tr>
              <tr>
                {tableConfig.map(group => (
                  group.columns.map(col => (
                    col.subColumns && col.subColumns.map((subCol, idx) => (
                      <th 
                        key={idx}
                        className={`${group.subColumnClass} text-gray-900 border border-gray-400 px-2 py-1 font-medium`}
                      >
                        {subCol.title}
                      </th>
                    ))
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">{item.nama_witel}</td>
                  {tableConfig.map(group => (
                    group.columns.map(col => {
                      if (col.subColumns) {
                        return col.subColumns.map((subCol, subIdx) => (
                          <td key={subIdx} className="border border-gray-300 px-2 py-1 text-right text-gray-700">
                            {getCellValue(item, subCol, col)}
                          </td>
                        ))
                      } else {
                        return (
                          <td key={col.key} className="border border-gray-300 px-2 py-1 text-right text-gray-700">
                            {getCellValue(item, col)}
                          </td>
                        )
                      }
                    })
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td className="bg-gray-800 text-white border border-gray-400 px-3 py-2">GRAND TOTAL</td>
                {tableConfig.map(group => (
                  group.columns.map(col => {
                    if (col.subColumns) {
                      return col.subColumns.map((subCol, subIdx) => (
                        <td key={subIdx} className={`${group.groupClass} text-white border border-gray-400 px-2 py-1 text-right`}>
                          {getCellValue(grandTotals, subCol, col)}
                        </td>
                      ))
                    } else {
                      return (
                        <td key={col.key} className={`${group.groupClass} text-white border border-gray-400 px-2 py-1 text-right`}>
                          {getCellValue(grandTotals, col)}
                        </td>
                      )
                    }
                  })
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }

  const renderKpiTable = (data) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-4 text-center">KPI PO</h3>
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full border-collapse border border-gray-300 text-xs">
          <thead>
            <tr>
              <th rowSpan="2" className="bg-gray-800 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">NAMA PO</th>
              <th rowSpan="2" className="bg-gray-800 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">WITEL</th>
              <th colSpan="2" className="bg-orange-500 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">PRODIGI DONE</th>
              <th colSpan="2" className="bg-blue-500 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">PRODIGI OGP</th>
              <th rowSpan="2" className="bg-green-600 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">TOTAL</th>
              <th colSpan="2" className="bg-gray-600 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">ACH</th>
            </tr>
            <tr>
              <th className="bg-orange-400 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">NCX</th>
              <th className="bg-orange-400 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">SCONE</th>
              <th className="bg-blue-400 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">NCX</th>
              <th className="bg-blue-400 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">SCONE</th>
              <th className="bg-gray-600 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">YTD</th>
              <th className="bg-gray-600 text-white border border-gray-400 px-3 py-2 font-semibold tracking-wider whitespace-nowrap">Q3</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 font-medium whitespace-nowrap">{item.nama_po}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 whitespace-nowrap">{item.witel}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-center whitespace-nowrap">{item.done_ncx}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-center whitespace-nowrap">{item.done_scone}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-center whitespace-nowrap">{item.ogp_ncx}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-center whitespace-nowrap">{item.ogp_scone}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-center font-bold whitespace-nowrap">{item.total}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-center font-bold whitespace-nowrap">{item.ach_ytd}%</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-800 text-center font-bold whitespace-nowrap">{item.ach_q3}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

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
            <div className="flex flex-col justify-center px-2 h-full w-24">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Segment</span>
              <div 
                className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between"
                onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}
              >
                <span className="truncate">{selectedSegment.length > 0 ? selectedSegment.join(', ') : 'Semua'}</span>
                <FiChevronDown className={`ml-1 transition-transform ${isSegmentDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {isSegmentDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {segmentOptions.map(option => (
                  <div 
                    key={option} 
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => toggleSegment(option)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedSegment.includes(option)} 
                      readOnly
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </div>
                ))}
              </div>
            )}
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
                {witelOptions.map(option => (
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

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            {selectedSegment.includes('LEGS') && renderTable(`Progress WFM Digital Product MTD ${startDate} - ${endDate} Segmen LEGS`, reportData.legs || [], reportData.detailsLegs)}
            {selectedSegment.includes('SME') && renderTable(`Progress WFM Digital Product MTD ${startDate} - ${endDate} Segmen SME`, reportData.sme || [], reportData.detailsSme)}

            <div className="mt-8">
              {selectedSegment.includes('LEGS') && (
                <DetailTable
                  title={`Report Digital Order Details LEGS Witel ${selectedWitel.length > 0 ? selectedWitel.join(', ') : 'Semua Witel'}`}
                  data={detailData.filter(item => {
                    const legsSegments = ['LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG'];
                    const matchesSegment = item.segment && legsSegments.some(s => item.segment.toUpperCase().includes(s));
                    const matchesSearch = searchQuery === '' || 
                      (item.batch_id && item.batch_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (item.order_id && item.order_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (item.customer_name && item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()));
                    
                    const matchesFilters = 
                      (activeFilters.segment.length === 0 || activeFilters.segment.includes(item.segment)) &&
                      (activeFilters.channel.length === 0 || activeFilters.channel.some(f => f.toLowerCase() === (item.channel || '').toLowerCase())) &&
                      (activeFilters.product_name.length === 0 || activeFilters.product_name.some(f => {
                        const pName = (item.product_name || '').toLowerCase();
                        const fValue = f.toLowerCase();
                        if (fValue === 'antares') {
                          return pName.includes('antares') || pName.includes('camera') || pName.includes('cctv') || pName.includes('iot') || pName.includes('recording');
                        }
                        return pName.includes(fValue);
                      })) &&
                      (activeFilters.order_status.length === 0 || activeFilters.order_status.includes(item.order_status)) &&
                      (activeFilters.witel.length === 0 || activeFilters.witel.some(f => f.toLowerCase() === (item.witel || '').toLowerCase()));

                    return matchesSegment && matchesSearch && matchesFilters;
                  })}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  openFilter={openFilter}
                  setOpenFilter={setOpenFilter}
                  filterOptions={filterOptions}
                />
              )}

              {selectedSegment.includes('SME') && (
                <DetailTable
                  title={`Report Digital Order Details`}
                  data={detailData.filter(item => {
                    // Removed segment filtering to show all data as requested
                    const matchesSearch = searchQuery === '' || 
                      (item.batch_id && item.batch_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (item.order_id && item.order_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (item.customer_name && item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()));
                    
                    const matchesFilters = 
                      (activeFilters.segment.length === 0 || activeFilters.segment.includes(item.segment)) &&
                      (activeFilters.channel.length === 0 || activeFilters.channel.some(f => f.toLowerCase() === (item.channel || '').toLowerCase())) &&
                      (activeFilters.product_name.length === 0 || activeFilters.product_name.some(f => {
                        const pName = (item.product_name || '').toLowerCase();
                        const fValue = f.toLowerCase();
                        if (fValue === 'antares') {
                          return pName.includes('antares') || pName.includes('camera') || pName.includes('cctv') || pName.includes('iot') || pName.includes('recording');
                        }
                        return pName.includes(fValue);
                      })) &&
                      (activeFilters.order_status.length === 0 || activeFilters.order_status.includes(item.order_status)) &&
                      (activeFilters.witel.length === 0 || activeFilters.witel.some(f => f.toLowerCase() === (item.witel || '').toLowerCase()));

                    return matchesSearch && matchesFilters;
                  })}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  openFilter={openFilter}
                  setOpenFilter={setOpenFilter}
                  filterOptions={filterOptions}
                />
              )}
            </div>

            <div className="mt-8">
              {renderKpiTable(kpiData)}
            </div>
          </>
        )}
      </div>

      {isAdminMode && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data</h2>
          <FileUploadForm 
            type="analysis"
            onSuccess={() => {
              setRefreshKey(prev => prev + 1)
            }}
          />
        </div>
      )}
    </>
  )
}

export default ReportDigPro
