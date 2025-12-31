import React, { useState, useMemo, useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'

const ReportsAnalysis = () => {
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
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/dashboard/report-analysis`,
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
    window.location.href = `/api/export/report-analysis?${params.toString()}`
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Report Digital Product</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[10px]">
            <thead className="bg-gray-50">
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-gray-800 border">WITEL</th>
                <th colSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-orange-500 border text-[9px]">DONE</th>
                <th colSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-blue-600 border text-[9px]">OGP</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-green-600 border">TOTAL</th>
                <th colSpan="2" className="px-2 py-2 text-center font-medium text-black uppercase bg-yellow-400 border text-[9px]">ACH</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-medium text-white bg-orange-400 border text-[9px]">NCX</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-orange-400 border text-[9px]">SCONE</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[9px]">NCX</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[9px]">SCONE</th>
                <th className="px-2 py-1 text-center font-medium text-black bg-yellow-300 border text-[9px]">Range</th>
                <th className="px-2 py-1 text-center font-medium text-black bg-yellow-300 border text-[9px]">Q3</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {visibleRows.map((row) => (
                <tr key={row.id} className={row.isCategoryHeader ? 'bg-green-700 font-bold text-white' : 'hover:bg-gray-50'}>
                  <td className={`px-2 py-1 whitespace-nowrap border text-left ${row.isCategoryHeader ? 'font-bold text-white bg-green-700' : ''}`}>{row.isCategoryHeader ? row.category : row.witel}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-green-700 text-white' : ''}`}>{row.done_ncx}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-green-700 text-white' : ''}`}>{row.done_scone}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-green-700 text-white' : ''}`}>{row.ogp_ncx}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-green-700 text-white' : ''}`}>{row.ogp_scone}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-green-700 text-white' : ''}`}>{row.total}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-green-700 text-white' : 'bg-yellow-50'}`}>{row.ach_range}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-green-700 text-white' : 'bg-yellow-50'}`}>{row.ach_q3}</td>
                </tr>
              ))}
              {visibleRows.length === 0 && <tr><td colSpan="8" className="py-4 text-center text-gray-500">Tidak ada data tersedia</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isAdminMode && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data</h2>
          <FileUploadForm 
            type="analysis"
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

export default ReportsAnalysis
