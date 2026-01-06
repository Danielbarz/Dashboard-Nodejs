import React, { useState, useMemo, useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'

const ReportsTambahan = () => {
  const { user } = useAuth()
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'superadmin'].includes(currentRole)
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
  const [selectedWitel, setSelectedWitel] = useState('')
  const [tableDataFromAPI, setTableDataFromAPI] = useState([])
  const [projectDataFromAPI, setProjectDataFromAPI] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

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
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
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

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-tambahan?${params.toString()}`
  }

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

      {/* Table 1: Data Report Jaringan Tambahan */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Report Jaringan Tambahan</h2>
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
                <th className="px-2 py-2 text-center font-bold text-white border">NAMA PROJECT</th>
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
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">Tidak ada data "On Progress" yang ditemukan.</td>
              </tr>
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
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">Tidak ada data "On Progress" yang ditemukan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isAdminMode && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data Tambahan</h2>
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
