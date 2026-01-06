import React, { useState, useEffect, useMemo } from 'react'
import { FiDownload, FiRefreshCw } from 'react-icons/fi'
import axios from 'axios'

const ReportsJT = () => {
  const [reportData, setReportData] = useState([])
  const [filters, setFilters] = useState({})
  const [selectedWitel, setSelectedWitel] = useState('')
  const [selectedPO, setSelectedPO] = useState('')
  const [loading, setLoading] = useState(false)
  const [witelList, setWitelList] = useState([])
  const [poList, setPoList] = useState([])

  // Fetch filters (witel & PO options)
  const fetchFilters = async () => {
    try {
      const response = await axios.get('/api/dashboard/jt/filters', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      if (response?.data?.data) {
        setFilters(response.data.data)
        setWitelList(response.data.data.witel || [])
        setPoList(response.data.data.po || [])
      }
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedWitel) params.witel = selectedWitel
      if (selectedPO) params.po = selectedPO

      const response = await axios.get('/api/dashboard/jt/report', {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      if (response?.data?.data?.summary) {
        setReportData(response.data.data.summary)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchFilters()
  }, [])

  // Fetch data when filters change
  useEffect(() => {
    fetchReportData()
  }, [selectedWitel, selectedPO])

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedWitel) params.append('witel', selectedWitel)
      if (selectedPO) params.append('po', selectedPO)

      window.location.href = `/api/dashboard/export/report-jt?${params.toString()}`
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const handleRefresh = () => {
    fetchReportData()
  }

  return (
    <div className="p-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Data</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <select
            value={selectedWitel}
            onChange={(e) => setSelectedWitel(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2"
          >
            <option value="">Semua Witel</option>
            {witelList.map(witel => (
              <option key={witel} value={witel}>{witel}</option>
            ))}
          </select>

          <select
            value={selectedPO}
            onChange={(e) => setSelectedPO(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2"
          >
            <option value="">Semua PO</option>
            {poList.map(po => (
              <option key={po} value={po}>{po}</option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 h-10"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 whitespace-nowrap h-10"
          >
            <FiDownload className="mr-2" size={16} />
            Ekspor Report
          </button>
        </div>
      </div>

      {/* Report Summary Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ringkasan Report JT per WITEL</h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading data...
          </div>
        ) : reportData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data untuk filter yang dipilih
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border text-sm">
              <thead>
                <tr className="bg-blue-600">
                  <th className="px-4 py-3 text-left font-semibold text-white border">WITEL</th>
                  <th className="px-4 py-3 text-center font-semibold text-white border">TOTAL</th>
                  <th className="px-4 py-3 text-center font-semibold text-white border bg-green-700">GO LIVE</th>
                  <th className="px-4 py-3 text-center font-semibold text-white border bg-red-600">DROP/BATAL</th>
                  <th className="px-4 py-3 text-center font-semibold text-white border">CLOSE RATE (%)</th>
                  <th className="px-4 py-3 text-right font-semibold text-white border">REVENUE PLAN</th>
                  <th className="px-4 py-3 text-right font-semibold text-white border">RAB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium text-gray-900 border">{row.witel || '-'}</td>
                    <td className="px-4 py-3 text-center text-gray-700 border">{row.total || 0}</td>
                    <td className="px-4 py-3 text-center text-white bg-green-100 border font-semibold">
                      {row.golive || 0}
                    </td>
                    <td className="px-4 py-3 text-center text-white bg-red-100 border font-semibold">
                      {row.drop || 0}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 border font-semibold">
                      {row.closeRate ? row.closeRate.toFixed(2) : '0.00'}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 border">
                      Rp {(row.revenue || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 border">
                      Rp {(row.rab || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsJT
