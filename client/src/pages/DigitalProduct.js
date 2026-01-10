import React, { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import api from '../services/api'
import {
  RevenueByWitelChart,
  AmountByWitelChart,
  ProductBySegmentChart,
  ProductByChannelChart,
  ProductShareChart
} from '../components/DigitalProductCharts'

// ===================================================================
// KOMPONEN REUSABLE
// ===================================================================
const MultiSelectDropdown = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false)
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
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {options.map((option) => (
            <div key={option} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => toggleOption(option)}>
              <input type="checkbox" checked={selected.includes(option)} readOnly className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded pointer-events-none" />
              <span className="text-sm text-gray-700 select-none">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const CollapsibleCard = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100" onClick={onToggle}>
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isExpanded && <div className="p-6 space-y-6 border-t border-gray-200">{children}</div>}
    </div>
  )
}

const DetailsCard = ({ totals, segment, period }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="font-semibold text-lg text-gray-800 mb-4">Details</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span>Total</span><span>{totals.total}</span></div>
      <div className="flex justify-between"><span>OGP</span><span>{totals.ogp}</span></div>
      <div className="flex justify-between"><span>Closed</span><span>{totals.closed}</span></div>
      <div className="flex justify-between"><span>Segment</span><span className="font-bold">{segment}</span></div>
      <div className="flex justify-between"><span>Period</span><span className="font-bold">{period}</span></div>
    </div>
  </div>
)

const ProgressBar = ({ progress, text }) => (
  <div className="mt-4">
    <p className="text-sm font-semibold text-gray-700 mb-1">{text} {progress}%</p>
    <div className="w-full bg-gray-200 rounded-full">
      <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
)

// ===================================================================
// TABEL COMPONENTS
// ===================================================================
const SmeReportTable = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>Tidak ada data untuk ditampilkan</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto text-xs">
      <table className="w-full border-collapse text-center">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border p-2">WILAYAH TELKOM</th>
            <th colSpan="4" className="border p-2 bg-blue-600">In Progress</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.nama_witel} className="bg-white hover:bg-gray-50">
              <td className="border p-2 font-semibold text-left">{item.nama_witel}</td>
              <td className="border p-2">-</td>
              <td className="border p-2">-</td>
              <td className="border p-2">-</td>
              <td className="border p-2">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const InProgressTable = ({ data = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="overflow-x-auto text-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left font-semibold text-gray-600">
            <th className="p-3">No.</th>
            <th className="p-3">Milestone</th>
            <th className="p-3">Segment</th>
            <th className="p-3">Status Order</th>
            <th className="p-3">Product Name</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">Witel</th>
            <th className="p-3">Customer Name</th>
            <th className="p-3">Order Created Date</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.order_id} className="text-gray-700 hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.milestone || '-'}</td>
                <td className="p-3">{item.segment || '-'}</td>
                <td className="p-3">
                  <span className="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full text-xs">
                    In Progress
                  </span>
                </td>
                <td className="p-3">{item.product_name || '-'}</td>
                <td className="p-3 font-mono">{item.order_id}</td>
                <td className="p-3">{item.witel || '-'}</td>
                <td className="p-3">{item.customer_name || '-'}</td>
                <td className="p-3">{formatDate(item.order_created_date)}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-md hover:bg-green-600">
                      COMPLETE
                    </button>
                    <button className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600">
                      CANCEL
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="p-4 text-center text-gray-500">
                Tidak ada data yang sesuai dengan filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const HistoryTable = ({ data = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const StatusChip = ({ text }) => {
    const lowerText = text?.toLowerCase() || ''
    let colorClasses = 'bg-gray-100 text-gray-800'

    if (lowerText.includes('progress')) {
      colorClasses = 'bg-blue-100 text-blue-800'
    } else if (lowerText.includes('bima')) {
      colorClasses = 'bg-green-100 text-green-800'
    } else if (lowerText.includes('cancel')) {
      colorClasses = 'bg-red-100 text-red-800'
    }

    return <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${colorClasses}`}>{text}</span>
  }

  return (
    <div className="overflow-x-auto text-sm">
      <p className="text-gray-500 mb-2">Menampilkan 10 data terbaru yang statusnya diubah melalui proses sinkronisasi.</p>
      <table className="w-full whitespace-nowrap">
        <thead className="bg-gray-50">
          <tr className="text-left font-semibold text-gray-600">
            <th className="p-3">Waktu Update</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Witel</th>
            <th className="p-3">Status Lama</th>
            <th className="p-3">Status Baru</th>
            <th className="p-3">Sumber</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="text-gray-700 hover:bg-gray-50">
                <td className="p-3 font-semibold">{formatDate(item.created_at)}</td>
                <td className="p-3 font-mono">{item.order_id}</td>
                <td className="p-3">{item.customer_name}</td>
                <td className="p-3">{item.witel}</td>
                <td className="p-3">
                  <StatusChip text={item.status_lama} />
                </td>
                <td className="p-3">
                  <StatusChip text={item.status_baru} />
                </td>
                <td className="p-3 font-medium text-gray-600">{item.sumber_update}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">
                Belum ada histori update yang tercatat.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const QcTable = ({ data = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="overflow-x-auto text-sm">
      <p className="text-gray-500 mb-2">Menampilkan data order yang sedang dalam proses Quality Control (QC).</p>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left font-semibold text-gray-600">
            <th className="p-3">No.</th>
            <th className="p-3">Milestone</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">Product Name</th>
            <th className="p-3">Witel</th>
            <th className="p-3">Customer Name</th>
            <th className="p-3">Update Time</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.order_id} className="text-gray-700 hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.milestone || '-'}</td>
                <td className="p-3 font-mono">{item.order_id}</td>
                <td className="p-3">{item.product || '-'}</td>
                <td className="p-3">{item.witel || '-'}</td>
                <td className="p-3">{item.customer_name || '-'}</td>
                <td className="p-3">{formatDate(item.updated_at)}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button className="px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
                      In Progress
                    </button>
                    <button className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-md hover:bg-green-600">
                      Done Close Bima
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-4 text-center text-gray-500">
                Tidak ada data QC saat ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const KpiTable = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto text-sm">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th rowSpan="2" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-green-600">
              NAMA PO
            </th>
            <th rowSpan="2" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-green-600">
              WITEL
            </th>
            <th colSpan="2" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-orange-500">
              PRODIGI DONE
            </th>
            <th colSpan="2" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-blue-500">
              PRODIGI OGP
            </th>
            <th rowSpan="2" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-green-600">
              TOTAL
            </th>
            <th colSpan="2" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-yellow-400">
              ACH
            </th>
            <th rowSpan="2" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-gray-600">
              AKSI
            </th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-orange-400">NCX</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-orange-400">SCONE</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-blue-400">NCX</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-blue-400">SCONE</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-yellow-300">YTD</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border bg-yellow-300">Q3</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((po) => (
              <tr key={po.nama_po} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap border font-medium">{po.nama_po}</td>
                <td className="px-4 py-2 whitespace-nowrap border">{po.witel}</td>
                <td className="px-4 py-2 whitespace-nowrap border text-center">-</td>
                <td className="px-4 py-2 whitespace-nowrap border text-center">-</td>
                <td className="px-4 py-2 whitespace-nowrap border text-center">-</td>
                <td className="px-4 py-2 whitespace-nowrap border text-center">-</td>
                <td className="px-4 py-2 whitespace-nowrap border text-center font-bold">-</td>
                <td className="px-4 py-2 whitespace-nowrap border text-center font-bold bg-yellow-200">-</td>
                <td className="px-4 py-2 whitespace-nowrap border text-center font-bold bg-yellow-200">-</td>
                <td className="px-4 py-2 whitespace-nowrap border">
                  <button className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold">Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="p-4 text-center text-gray-500">
                Tidak ada data KPI.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ===================================================================
// KOMPONEN UTAMA DIGITAL PRODUCT
// ===================================================================
const DigitalProduct = () => {
  const [activeDetailView, setActiveDetailView] = useState('inprogress')
  const [currentSegment, setCurrentSegment] = useState('SME')
  const [period, setPeriod] = useState('2024-01')
  const [decimalPlaces, setDecimalPlaces] = useState(5)
  const [witelFilter, setWitelFilter] = useState('ALL')
  const [isCompleteSectionExpanded, setIsCompleteSectionExpanded] = useState(false)
  const [isCancelSectionExpanded, setIsCancelSectionExpanded] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  // Chart state
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const [chartStartDate, setChartStartDate] = useState(firstDay.toISOString().split('T')[0])
  const [chartEndDate, setChartEndDate] = useState(now.toISOString().split('T')[0])
  const [chartWitel, setChartWitel] = useState('ALL')
  const [chartLoading, setChartLoading] = useState(false)
  const [chartData, setChartData] = useState({
    revenueByWitel: [],
    amountByWitel: [],
    productBySegment: [],
    productByChannel: [],
    productShare: [],
    products: [],
    segments: [],
    channels: []
  })

  // Fetch chart data
  const fetchChartData = async () => {
    setChartLoading(true)
    try {
      const params = { start_date: chartStartDate, end_date: chartEndDate }
      if (chartWitel !== 'ALL') params.witel = chartWitel
      const response = await api.get('/dashboard/digital-product/charts', { params })
      if (response.data.success) {
        setChartData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setChartLoading(false)
    }
  }

  useEffect(() => {
    fetchChartData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartStartDate, chartEndDate, chartWitel])

  // Mock data - all empty
  const reportData = []
  const inProgressData = []
  const historyData = []
  const qcData = []
  const kpiData = []

  // Witel options for chart filter
  const witelOptions = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

  const detailsTotals = useMemo(
    () => ({
      ogp: 0,
      closed: 0,
      total: 0,
    }),
    []
  )

  const generatePeriodOptions = () => {
    const options = []
    let date = new Date()
    for (let i = 0; i < 12; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const value = `${year}-${month}`
      const label = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
      options.push(
        <option key={value} value={value}>
          {label}
        </option>
      )
      date.setMonth(date.getMonth() - 1)
    }
    return options
  }

  const generateYearOptions = () => {
    const options = []
    const currentYear = new Date().getFullYear()
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i
      options.push(
        <option key={year} value={year}>
          {year}
        </option>
      )
    }
    return options
  }

  const DetailTabButton = ({ viewName, currentView, setView, children }) => (
    <button
      onClick={() => setView(viewName)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        currentView === viewName
          ? 'bg-blue-600 text-white shadow'
          : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )

  const periodDisplay = new Date(period + '-02').toLocaleString('id-ID', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Digital Product Analysis</h1>
          <p className="text-gray-600 mt-2">Dashboard untuk analisis produk digital dan tracking order</p>
        </div>

        {/* ============================================= */}
        {/* SECTION: CHARTS */}
        {/* ============================================= */}
        <div className="mb-8">
          {/* Chart Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Witel</label>
                <select
                  value={chartWitel}
                  onChange={(e) => setChartWitel(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="ALL">Semua Witel</option>
                  {witelOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                <div className="flex flex-col">
                  <label className="text-[10px] font-medium text-gray-400 uppercase">Dari</label>
                  <input
                    type="date"
                    value={chartStartDate}
                    onChange={(e) => setChartStartDate(e.target.value)}
                    className="border-none p-0 text-sm font-medium text-gray-700 bg-transparent focus:ring-0"
                  />
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex flex-col">
                  <label className="text-[10px] font-medium text-gray-400 uppercase">Sampai</label>
                  <input
                    type="date"
                    value={chartEndDate}
                    onChange={(e) => setChartEndDate(e.target.value)}
                    className="border-none p-0 text-sm font-medium text-gray-700 bg-transparent focus:ring-0"
                  />
                </div>
              </div>
              <button
                onClick={fetchChartData}
                disabled={chartLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {chartLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
            {/* Row 1: Revenue & Amount by Witel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueByWitelChart data={chartData.revenueByWitel} products={chartData.products} />
              <AmountByWitelChart data={chartData.amountByWitel} products={chartData.products} />
            </div>

            {/* Row 2: Product by Segment, Channel, Share */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProductBySegmentChart data={chartData.productBySegment} segments={chartData.segments} />
              <ProductByChannelChart data={chartData.productByChannel} channels={chartData.channels} />
              <ProductShareChart data={chartData.productShare} />
            </div>
          </div>
        </div>
        {/* END CHARTS SECTION */}

        {/* MAIN GRID: 3 kolom kiri, 1 kolom kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* KOLOM KIRI (3/4) */}
          <div className="lg:col-span-3 space-y-6">
            {/* BAGIAN 1: DATA REPORT */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h3 className="font-semibold text-lg text-gray-800">Data Report</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="decimal_places" className="text-sm font-medium text-gray-600">
                      Desimal:
                    </label>
                    <input
                      id="decimal_places"
                      type="number"
                      min="0"
                      max="10"
                      value={decimalPlaces}
                      onChange={(e) => setDecimalPlaces(Number(e.target.value))}
                      className="border border-gray-300 rounded-md text-sm p-2 w-20"
                    />
                  </div>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="border border-gray-300 rounded-md text-sm p-2"
                  >
                    {generatePeriodOptions()}
                  </select>
                  <select
                    value={currentSegment}
                    onChange={(e) => setCurrentSegment(e.target.value)}
                    className="border border-gray-300 rounded-md text-sm p-2"
                  >
                    <option value="LEGS">LEGS</option>
                    <option value="SME">SME</option>
                  </select>
                </div>
              </div>
              <SmeReportTable data={reportData} />
            </div>

            {/* BAGIAN 2: TABEL DETAIL */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-2 border p-1 rounded-lg bg-gray-50 w-fit">
                  <DetailTabButton viewName="inprogress" currentView={activeDetailView} setView={setActiveDetailView}>
                    Data In Progress ({inProgressData.length})
                  </DetailTabButton>
                  <DetailTabButton viewName="history" currentView={activeDetailView} setView={setActiveDetailView}>
                    Update History ({historyData.length > 10 ? '10+' : historyData.length})
                  </DetailTabButton>
                  <DetailTabButton viewName="qc" currentView={activeDetailView} setView={setActiveDetailView}>
                    Data QC ({qcData.length})
                  </DetailTabButton>
                  <DetailTabButton viewName="kpi" currentView={activeDetailView} setView={setActiveDetailView}>
                    KPI PO
                  </DetailTabButton>
                </div>
                {activeDetailView === 'inprogress' && (
                  <div className="flex items-center gap-4">
                    <select
                      onChange={(e) => {}}
                      className="border border-gray-300 rounded-md text-sm p-2"
                    >
                      {generateYearOptions()}
                    </select>
                    <select
                      value={witelFilter}
                      onChange={(e) => setWitelFilter(e.target.value)}
                      className="border border-gray-300 rounded-md text-sm p-2"
                    >
                      <option value="ALL">Semua Witel</option>
                    </select>
                    <button className="px-3 py-1 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 text-sm">
                      Export Excel
                    </button>
                  </div>
                )}
              </div>

              {activeDetailView === 'inprogress' && <InProgressTable data={inProgressData} />}
              {activeDetailView === 'history' && <HistoryTable data={historyData.slice(0, 10)} />}
              {activeDetailView === 'qc' && <QcTable data={qcData} />}
              {activeDetailView === 'kpi' && <KpiTable data={kpiData} />}
            </div>
          </div>

          {/* KOLOM KANAN (1/4) */}
          <div className="lg:col-span-1 space-y-6">
            <DetailsCard totals={detailsTotals} segment={currentSegment} period={periodDisplay} />

            {/* UNGGAH DATA MENTAH */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg text-gray-800">Unggah Data Mentah</h3>
              <p className="text-gray-500 mt-1 text-sm">Unggah Dokumen (xlsx, xls, csv) untuk memperbarui data.</p>
              <form className="mt-4 space-y-4">
                <div>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {uploadProgress !== null && <ProgressBar progress={uploadProgress} text="Memproses file..." />}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                >
                  Unggah Dokumen
                </button>
              </form>
            </div>

            {/* PROSES ORDER COMPLETE */}
            <CollapsibleCard
              title="Proses Order Complete"
              isExpanded={isCompleteSectionExpanded}
              onToggle={() => setIsCompleteSectionExpanded(!isCompleteSectionExpanded)}
            >
              <div className="bg-gray-50 p-4 rounded-md space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Unggah Order Complete</h3>
                  <p className="text-gray-500 mt-1 text-sm">Unggah file excel untuk dimasukkan ke tabel sementara.</p>
                  <form className="mt-4 space-y-4">
                    <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                    >
                      Proses File Complete
                    </button>
                  </form>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Sinkronisasi Data</h3>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">
                    Jalankan Sinkronisasi Order Complete
                  </button>
                </div>
              </div>
            </CollapsibleCard>

            {/* PROSES ORDER CANCEL */}
            <CollapsibleCard
              title="Proses Order Cancel"
              isExpanded={isCancelSectionExpanded}
              onToggle={() => setIsCancelSectionExpanded(!isCancelSectionExpanded)}
            >
              <div className="bg-gray-50 p-4 rounded-md space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Unggah Order Cancel</h3>
                  <p className="text-gray-500 mt-1 text-sm">Unggah file excel berisi order yang akan di-cancel.</p>
                  <form className="mt-4 space-y-4">
                    <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                    >
                      Proses File Cancel
                    </button>
                  </form>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Sinkronisasi Data Cancel</h3>
                  <p className="text-gray-500 text-sm mb-4">Jalankan proses update status pada data "In Progress" menjadi "Cancel".</p>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700">
                    Jalankan Sinkronisasi Order Cancel
                  </button>
                </div>
              </div>
            </CollapsibleCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalProduct
