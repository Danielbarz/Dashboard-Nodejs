import React, { useState, useMemo, useEffect, useRef } from 'react'
import { FiDownload, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'
import SkeletonLoader from '../components/SkeletonLoader'

const ReportsTambahan = () => {
  const { user } = useAuth()
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'superadmin'].includes(currentRole)
  const now = new Date()
  const startOfYear2025 = new Date(2025, 0, 1)

  const formatDateLocal = (date) => {
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const [startDate, setStartDate] = useState(formatDateLocal(startOfYear2025))
  const [endDate, setEndDate] = useState(formatDateLocal(now))
  const [selectedWitel, setSelectedWitel] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // API Data States
  const [tableDataFromAPI, setTableDataFromAPI] = useState([])
  const [projectDataFromAPI, setProjectDataFromAPI] = useState([])
  const [top3WitelFromAPI, setTop3WitelFromAPI] = useState([])
  const [top3PoFromAPI, setTop3PoFromAPI] = useState([])
  const [previewData, setPreviewData] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const itemsPerPage = 10

  const witelHierarchy = {
    'BALI': ['BALI', 'DENPASAR', 'SINGARAJA'],
    'JATIM BARAT': ['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG'],
    'JATIM TIMUR': ['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO'],
    'NUSA TENGGARA': ['NUSA TENGGARA', 'NTT', 'NTB'],
    'SURAMADU': ['SURAMADU', 'SURABAYA UTARA', 'SURABAYA SELATAN', 'MADURA']
  }

  const witelList = Object.keys(witelHierarchy)

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/dashboard/report-tambahan`,
        {
          params: { start_date: startDate, end_date: endDate },
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const d = response.data?.data || {}
      setTableDataFromAPI(d.tableData || [])
      setProjectDataFromAPI(d.projectData || [])
      setTop3WitelFromAPI(d.topUsiaByWitel || [])
      setTop3PoFromAPI(d.topUsiaByPo || [])
      setPreviewData(d.rawProjectRows || [])

    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [startDate, endDate, refreshKey])

  const formatNumber = (n) => (n || 0).toLocaleString('id-ID')
  const formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '-')

  // Grouping Top 3
  const groupedTop3Witel = useMemo(() => {
    const groups = {}
    top3WitelFromAPI.forEach(row => {
      const key = row.region || 'Unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push(row)
    })
    return groups
  }, [top3WitelFromAPI])

  const groupedTop3Po = useMemo(() => {
    const groups = {}
    const excludedPOs = ['PT2', 'PT2UL', 'PT3', 'PT2S', 'PT3B', 'UNIDENTIFIED PO', 'UNMAPPED PO']
    top3PoFromAPI.forEach(row => {
      const key = (row.po_name || 'Unknown').trim()
      if (excludedPOs.includes(key) || key.toUpperCase().includes('UNIDENTIFIED')) return
      if (!groups[key]) groups[key] = []
      groups[key].push(row)
    })
    return groups
  }, [top3PoFromAPI])

  const filteredTableData = useMemo(() => {
    let result = tableDataFromAPI
    if (selectedWitel) {
      const parentWitel = witelList.find(w => witelHierarchy[w].includes(selectedWitel))
      result = result.filter(row => row.parentWitel === parentWitel || row.witel === selectedWitel || row.isParent)
    }
    return result
  }, [tableDataFromAPI, selectedWitel])

  const filteredProjectData = useMemo(() => {
    let result = projectDataFromAPI
    if (selectedWitel) {
      const parentWitel = witelList.find(w => witelHierarchy[w].includes(selectedWitel))
      result = result.filter(row => row.parentWitel === parentWitel || row.witel === selectedWitel || row.isParent)
    }
    return result
  }, [projectDataFromAPI, selectedWitel])

  const handleExport = () => {
    window.location.href = `/api/dashboard/export/report-tambahan?start_date=${startDate}&end_date=${endDate}`
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Report Jaringan Tambahan</h1>
          <p className="text-gray-500 text-sm mt-1">Laporan detail progress dan analisis TOC project JT</p>
        </div>
      </div>

      {/* Filter Card - Standarized */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col xl:flex-row gap-4 items-end xl:items-center justify-between">
          
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 w-full md:w-auto">
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

            {/* Witel Filter */}
            <select value={selectedWitel} onChange={(e) => setSelectedWitel(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2 border w-full md:w-64">
              <option value="">Semua Witel</option>
              {witelList.map(parentWitel => (
                <optgroup key={parentWitel} label={`WITEL ${parentWitel}`}>
                  {witelHierarchy[parentWitel].map(witel => (
                    <option key={witel} value={witel}>{witel}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 shadow-sm transition-colors h-10 min-w-[140px]">
              <FiDownload className="mr-2" size={16} />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table 1: Data Report JT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">Data Report JT</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-[10px]">
            <thead>
              <tr className="bg-gray-800 text-white uppercase font-bold">
                <th rowSpan="2" className="px-2 py-3 border border-gray-700 text-left">WITEL</th>
                <th rowSpan="2" className="px-2 py-3 border border-gray-700">JUMLAH LOP</th>
                <th rowSpan="2" className="px-2 py-3 border border-gray-700">REV ALL LOP</th>
                <th colSpan="5" className="px-2 py-2 border border-gray-700 bg-blue-700">PROGRESS DEPLOY</th>
                <th colSpan="2" className="px-2 py-2 border border-gray-700 bg-green-700">GOLIVE</th>
                <th rowSpan="2" className="px-2 py-3 border border-gray-700 bg-red-700">DROP</th>
                <th rowSpan="2" className="px-2 py-3 border border-gray-700 bg-gray-600">%CLOSE</th>
              </tr>
              <tr className="bg-gray-700 text-white text-[9px]">
                <th className="px-2 py-2 border border-gray-600 bg-blue-600">INIT</th>
                <th className="px-2 py-2 border border-gray-600 bg-blue-600">SURVEY</th>
                <th className="px-2 py-2 border border-gray-600 bg-blue-600">IZIN</th>
                <th className="px-2 py-2 border border-gray-600 bg-blue-600">INST</th>
                <th className="px-2 py-2 border border-gray-600 bg-blue-600">FI-OGP</th>
                <th className="px-2 py-2 border border-gray-600 bg-green-600">JML</th>
                <th className="px-2 py-2 border border-gray-600 bg-green-600">REV</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-center text-[10px]">
              {loading ? (
                <tr><td colSpan={12} className="p-10"><SkeletonLoader type="table" /></td></tr>
              ) : filteredTableData.map((row, idx) => (
                <tr key={idx} className={row.isParent ? 'bg-gray-50 font-bold text-gray-900' : 'hover:bg-blue-50/30'}>
                  <td className="px-2 py-2 border text-left font-semibold">{row.isParent ? `WITEL ${row.witel}` : row.witel}</td>
                  <td className="px-2 py-2 border">{row.jumlahLop}</td>
                  <td className="px-2 py-2 border font-medium text-blue-600">{formatNumber(row.revAll)}</td>
                  <td className="px-2 py-2 border">{row.initial}</td>
                  <td className="px-2 py-2 border">{row.survey}</td>
                  <td className="px-2 py-2 border">{row.perizinan}</td>
                  <td className="px-2 py-2 border">{row.instalasi}</td>
                  <td className="px-2 py-2 border">{row.piOgp}</td>
                  <td className="px-2 py-2 border bg-green-50 font-bold text-green-700">{row.golive_jml}</td>
                  <td className="px-2 py-2 border bg-green-50 font-bold text-green-700">{formatNumber(row.golive_rev)}</td>
                  <td className="px-2 py-2 border bg-red-50 text-red-600">{row.drop}</td>
                  <td className="px-2 py-2 border font-bold">{row.persen_close}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Project Belum GO LIVE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-orange-600 pl-3">Project Belum GO LIVE (TOC Analysis)</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-[10px] text-center">
            <thead>
              <tr className="bg-gray-800 text-white font-bold uppercase">
                <th rowSpan="2" className="px-4 py-3 border border-gray-700 text-left">WITEL LAMA</th>
                <th colSpan="2" className="px-4 py-2 border border-gray-700 bg-red-700">TOC LOP BELUM GOLIVE</th>
                <th rowSpan="2" className="px-4 py-3 border border-gray-700">JUMLAH LOP ON PROGRESS</th>
                <th rowSpan="2" className="px-4 py-3 border border-gray-700 bg-gray-600">% DALAM TOC</th>
              </tr>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-2 border border-gray-600">DALAM TOC</th>
                <th className="px-4 py-2 border border-gray-600">LEWAT TOC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-10"><SkeletonLoader type="table" /></td></tr>
              ) : filteredProjectData.filter(r => r.isParent).map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30">
                  <td className="px-4 py-3 border text-left font-bold text-gray-800 uppercase">WITEL {row.witel}</td>
                  <td className="px-4 py-3 border text-green-600 font-bold">{row.dalam_toc}</td>
                  <td className="px-4 py-3 border text-red-600 font-bold">{row.lewat_toc}</td>
                  <td className="px-4 py-3 border font-black text-gray-900">{row.jumlah_lop_progress}</td>
                  <td className="px-4 py-3 border font-bold text-blue-700">{row.persen_dalam_toc}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 3 Usia Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Top 3 Witel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden flex flex-col h-[600px]">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-purple-600 pl-3">Top 3 Usia Project Terbaru (On Progress) - By Witel Induk</h2>
          <div className="overflow-auto rounded-xl border border-gray-100 custom-scrollbar relative flex-1">
            <table className="min-w-full divide-y divide-gray-200 text-[9px] text-center border-collapse">
              <thead className="bg-purple-600 text-white font-bold uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-2 py-3 border-r border-purple-500 text-left w-24">WITEL INDUK</th>
                  <th className="px-2 py-3 border-r border-purple-500 w-24">IHLD</th>
                  <th className="px-2 py-3 border-r border-purple-500 w-24">TGL MOM</th>
                  <th className="px-2 py-3 border-r border-purple-500 text-right w-24">REVENUE</th>
                  <th className="px-2 py-3 border-r border-purple-500 w-32">STATUS TOMPS</th>
                  <th className="px-2 py-3 border-r border-purple-500 w-16">USIA (HARI)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {Object.keys(groupedTop3Witel).length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-gray-400 italic text-center">Tidak ada data ditemukan.</td></tr>
                ) : Object.entries(groupedTop3Witel).map(([region, rows]) => (
                  rows.map((row, idx) => (
                    <tr key={`${region}-${idx}`} className="hover:bg-blue-50/30">
                      {idx === 0 && <td rowSpan={rows.length} className="px-2 py-2 border font-bold bg-gray-50 text-left align-top text-purple-700 uppercase">{region}</td>}
                      <td className="px-2 py-2 border font-mono">{row.id_i_hld}</td>
                      <td className="px-2 py-2 border">{formatDate(row.tanggal_mom)}</td>
                      <td className="px-2 py-2 border text-right font-medium">{formatNumber(row.revenue_plan)}</td>
                      <td className="px-2 py-2 border truncate max-w-[100px]" title={row.status_tomps_new}>{row.status_tomps_new}</td>
                      <td className="px-2 py-2 border font-black text-red-600">{row.usia}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 3 PO */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden flex flex-col h-[600px]">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-indigo-600 pl-3">Top 3 Usia Project Terbaru (On Progress) - By PO</h2>
          <div className="overflow-auto rounded-xl border border-gray-100 custom-scrollbar relative flex-1">
            <table className="min-w-full divide-y divide-gray-200 text-[9px] text-center border-collapse">
              <thead className="bg-indigo-600 text-white font-bold uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-2 py-3 border-r border-indigo-500 text-left w-24">NAMA PO</th>
                  <th className="px-2 py-3 border-r border-indigo-500 text-left w-32">NAMA PROJECT</th>
                  <th className="px-2 py-3 border-r border-indigo-500 w-24">IHLD</th>
                  <th className="px-2 py-3 border-r border-indigo-500 w-24">TGL MOM</th>
                  <th className="px-2 py-3 border-r border-indigo-500 text-right w-24">REVENUE</th>
                  <th className="px-2 py-3 border-r border-indigo-500 w-32">STATUS TOMPS</th>
                  <th className="px-2 py-3 border-r border-indigo-500 w-16">USIA (HARI)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {Object.keys(groupedTop3Po).length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-gray-400 italic text-center">Tidak ada data ditemukan.</td></tr>
                ) : Object.entries(groupedTop3Po).map(([poName, rows]) => (
                  rows.map((row, idx) => (
                    <tr key={`${poName}-${idx}`} className="hover:bg-blue-50/30">
                      {idx === 0 && <td rowSpan={rows.length} className="px-2 py-2 border font-bold bg-gray-50 text-left align-top text-indigo-700 uppercase">{poName}</td>}
                      <td className="px-2 py-2 border text-left truncate max-w-[150px]" title={row.uraian_kegiatan}>{row.uraian_kegiatan}</td>
                      <td className="px-2 py-2 border font-mono">{row.id_i_hld}</td>
                      <td className="px-2 py-2 border">{formatDate(row.tanggal_mom)}</td>
                      <td className="px-2 py-2 border text-right font-medium">{formatNumber(row.revenue_plan)}</td>
                      <td className="px-2 py-2 border truncate max-w-[100px]" title={row.status_tomps_new}>{row.status_tomps_new}</td>
                      <td className="px-2 py-2 border font-black text-red-600">{row.usia}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admin Manajemen Data - Standarized Layout */}
      {isAdminMode && (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manajemen Data JT</h2>
              <p className="text-sm text-gray-500">Upload dataset baru atau reset data Jaringan Tambahan.</p>
            </div>
            <button
               onClick={async () => {
                 if (window.confirm('⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data JT? Tindakan ini tidak dapat dibatalkan.')) {
                   try {
                     const token = localStorage.getItem('accessToken')
                     await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/truncate/jt`, {}, { headers: { Authorization: `Bearer ${token}` } })
                     alert('Data JT berhasil dihapus')
                     setRefreshKey(prev => prev + 1)
                   } catch (err) { alert('Gagal hapus data.') }
                 }
               }}
               className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 border border-red-200 transition-all text-sm"
            >
              Hapus Semua Data (Reset)
            </button>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <FileUploadForm 
              type="jt" 
              onSuccess={() => setRefreshKey(prev => prev + 1)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsTambahan