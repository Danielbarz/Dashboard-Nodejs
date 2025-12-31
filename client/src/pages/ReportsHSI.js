import React, { useState, useMemo, useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'

const ReportsHSI = () => {
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
  const [refreshKey, setRefreshKey] = useState(0)

  const witelList = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

  // Fetch data from API
  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/dashboard/report-hsi`,
        {
          params: { start_date: startDate, end_date: endDate },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data?.data) {
        setTableDataFromAPI(response.data.data.tableData || [])
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    }
  }

  useEffect(() => {
    fetchReportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, refreshKey])

  const tableData = useMemo(() => tableDataFromAPI, [tableDataFromAPI])

  const filteredData = useMemo(() => {
    let result = tableData
    if (selectedWitel) result = result.filter(row => row.witel === selectedWitel || row.isCategoryHeader)
    return result
  }, [tableData, selectedWitel])

  const visibleRows = filteredData

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-hsi?${params.toString()}`
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Data</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <select value={selectedWitel} onChange={(e) => setSelectedWitel(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2 border">
            <option value="">Semua Witel</option>
            {witelList.map(witel => <option key={witel} value={witel}>{witel}</option>)}
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

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Report HSI</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[7px]">
            <thead>
              <tr className="bg-blue-600">
                <th rowSpan="2" className="px-1 py-2 text-center font-bold text-white border bg-blue-600">WITEL</th>
                <th colSpan="4" className="px-1 py-1 text-center font-bold text-white border bg-gray-600">PROGRESS</th>
                <th rowSpan="2" className="px-1 py-1 text-center font-bold text-white border bg-red-600">RJCT FCC</th>
                <th colSpan="2" className="px-1 py-1 text-center font-bold text-white border bg-gray-600">SURVEY</th>
                <th colSpan="4" className="px-1 py-1 text-center font-bold text-white border bg-gray-600">OGP</th>
                <th colSpan="8" className="px-1 py-1 text-center font-bold text-white border bg-gray-600">PI FALLOUT</th>
                <th rowSpan="2" className="px-1 py-1 text-center font-bold text-white border bg-green-600">ACT COMP<br/>(QC2)</th>
                <th rowSpan="2" className="px-1 py-1 text-center font-bold text-white border bg-green-600">JML COMP<br/>(PS)</th>
                <th colSpan="5" className="px-1 py-1 text-center font-bold text-black border bg-red-600">CANCEL</th>
                <th rowSpan="2" className="px-1 py-1 text-center font-bold text-white border bg-red-600">REVOKE</th>
                <th colSpan="3" className="px-1 py-1 text-center font-bold text-white border bg-blue-600">PERFORMANCE</th>
              </tr>
              <tr className="bg-gray-700">
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">RED</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">INPRO<br/>SC</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">QC</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">FCC</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">SURVEY</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">UN-SC</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">&lt;1 HARI</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">1-3 HARI</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">&gt;3 HARI</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">TOTAL PI</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">KNDL<br/>PLGN</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">KNDL<br/>TEKNIS</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">KNDL<br/>SYSTEM</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">KNDL<br/>OTHERS</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">UIM</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">ASP</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">OSM</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-gray-600 text-[6px]">TOTAL<br/>FALLOUT</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-red-600 text-[6px]">KNDL<br/>PLGN</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-red-600 text-[6px]">KNDL<br/>TEKNIS</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-red-600 text-[6px]">KNDL<br/>SYSTEM</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-red-600 text-[6px]">KNDL<br/>OTHERS</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-red-600 text-[6px]">TOTAL<br/>CANCEL</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-blue-600 text-[6px]">PI/RE</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-blue-600 text-[6px]">PS/RE</th>
                <th className="px-1 py-1 text-center font-bold text-white border bg-blue-600 text-[6px]">PS/PI</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center text-[7px]">
              {visibleRows.map((row) => (
                <tr key={row.id} className={row.isCategoryHeader ? 'bg-gray-800 font-bold text-white' : 'hover:bg-gray-50'}>
                  <td className={`px-1 py-1 whitespace-nowrap border text-left font-semibold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.isCategoryHeader ? row.category : row.witel}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.red}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.inpro_sc}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.qc}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.fcc}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.rjct_fcc}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.survey}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.un_sc}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.h1}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.h3}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.h3plus}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.total_pi}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_plgn_f}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_teknis_f}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_system_f}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_others_f}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.uim}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.asp}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.osm}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.total_fallout}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-green-100'}`}>{row.act_comp}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-green-100'}`}>{row.jml_comp}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.kndl_plgn_c}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.kndl_teknis_c}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.kndl_system_c}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.kndl_others_c}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.total_cancel}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.revoke}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-blue-100'}`}>{row.pi_re}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100'}`}>{row.ps_re}</td>
                  <td className={`px-1 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-blue-100'}`}>{row.ps_pi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdminMode && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data HSI</h2>
          <FileUploadForm 
            type="hsi"
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

export default ReportsHSI
