import React, { useState, useEffect, useMemo } from 'react'
import { FiDownload } from 'react-icons/fi'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'

const ReportsHSI = () => {
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
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const witelList = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

  // --- Helpers from PHP Version ---
  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  const getPsReColor = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num >= 80 ? 'bg-[#24c55f] text-white font-bold' : 'bg-[#e65253] text-white font-bold';
  };

  const colors = {
    blue: 'bg-[#3e81f4]',
    red: 'bg-[#e65253]',
    green: 'bg-[#24c55f]',
    gray: 'bg-[#6b717f]',
  };

  const totalRowStyle = "bg-[#cccccc] text-[#464647] font-bold border-slate-400";

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/hsi`,
        {
          params: { start_date: startDate, end_date: endDate },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data?.data?.tableData) {
        setData(response.data.data.tableData)
      }
    } catch (error) {
      console.error('Failed to fetch HSI report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  const filteredData = useMemo(() => {
    if (!selectedWitel) return data
    return data.filter(row => row.witel === selectedWitel)
  }, [data, selectedWitel])

  // Calculate Totals
  const totals = useMemo(() => {
    const initial = {
      registered: 0, pre_pi: 0, inpro_sc: 0, qc1: 0, fcc: 0, rjct_fcc: 0, survey_manja: 0, un_sc: 0,
      pi_under_24: 0, pi_24_72: 0, pi_over_72: 0, total_pi: 0,
      fo_wfm_plgn: 0, fo_wfm_teknis: 0, fo_wfm_system: 0, fo_wfm_others: 0,
      fo_uim: 0, fo_asp: 0, fo_osm: 0, total_fallout: 0,
      act_comp: 0, ps: 0,
      cancel_plgn: 0, cancel_teknis: 0, cancel_system: 0, cancel_others: 0, total_cancel: 0,
      revoke: 0
    }

    const sum = filteredData.reduce((acc, row) => {
      Object.keys(initial).forEach(key => {
        acc[key] += (row[key] || 0)
      })
      return acc
    }, initial)

    // Calculate Percentage Totals
    const numeratorPiRe = sum.total_pi + sum.total_fallout + sum.act_comp + sum.ps + sum.total_cancel
    sum.pi_re_percent = sum.registered > 0 ? ((numeratorPiRe / sum.registered) * 100).toFixed(2) : 0

    const denominatorPsRe = sum.registered - sum.rjct_fcc - sum.un_sc - sum.revoke
    sum.ps_re_percent = denominatorPsRe > 0 ? ((sum.ps / denominatorPsRe) * 100).toFixed(2) : 0

    const denominatorPsPi = sum.total_pi + sum.total_fallout + sum.act_comp + sum.ps
    sum.ps_pi_percent = denominatorPsPi > 0 ? ((sum.ps / denominatorPsPi) * 100).toFixed(2) : 0

    return sum
  }, [filteredData])

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

          <button onClick={fetchData} className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 whitespace-nowrap h-10">
            Refresh
          </button>

          <button onClick={handleExport} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 whitespace-nowrap h-10">
            <FiDownload className="mr-2" size={16} />
            Ekspor Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4">
            Performance Report HSI Per Witel
        </h3>
        <div className="overflow-x-auto max-h-[80vh]">
          <table className="w-full text-[10px] border-collapse border border-slate-400 text-center font-sans">
            
            {/* TABLE HEAD */}
            <thead className="text-white font-bold uppercase tracking-wider sticky top-0 z-20 shadow-sm">
                <tr>
                    <th className={`border border-slate-300 p-2 min-w-[150px] sticky left-0 z-30 ${colors.blue}`} rowSpan={4}>Witel</th>
                    <th className={`border border-slate-300 p-1 ${colors.blue}`} rowSpan={4}>PRE PI</th>
                    <th className={`border border-slate-300 p-1 ${colors.blue}`} rowSpan={4}>Registered (RE)</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={4}>Inpro SC</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={4}>QC 1</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={4}>FCC</th>
                    <th className={`border border-slate-300 p-1 ${colors.red}`} rowSpan={4}>RJCT FCC</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={4}>Survey Manja</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={4}>UN-SC</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} colSpan={13}>OGP</th>
                    <th className={`border border-slate-300 p-1 ${colors.green}`} rowSpan={4}>JML COMP (PS)</th>
                    <th className={`border border-slate-300 p-1 ${colors.red}`} colSpan={5}>CANCEL</th>
                    <th className={`border border-slate-300 p-1 ${colors.red}`} rowSpan={4}>REVOKE</th>
                    <th className={`border border-slate-300 p-1 ${colors.blue}`} colSpan={3}>PERFORMANCE</th>
                </tr>
                <tr>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} colSpan={3}>PI</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={3}>TOTAL PI</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} colSpan={7}>FALLOUT</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={3}>TOTAL FALLOUT</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={3}>ACT COMP (QC2)</th>
                    
                    <th className={`border border-slate-300 p-1 ${colors.red}`} rowSpan={3}>KNDL Plgn</th>
                    <th className={`border border-slate-300 p-1 ${colors.red}`} rowSpan={3}>KNDL Teknis</th>
                    <th className={`border border-slate-300 p-1 ${colors.red}`} rowSpan={3}>KNDL System</th>
                    <th className={`border border-slate-300 p-1 ${colors.red}`} rowSpan={3}>KNDL Others</th>
                    <th className={`border border-slate-300 p-1 ${colors.red}`} rowSpan={3}>TOTAL CANCEL</th>

                    <th className={`border border-slate-300 p-1 ${colors.blue}`} rowSpan={3}>PI/RE</th>
                    <th className={`border border-slate-300 p-1 ${colors.blue}`} rowSpan={3}>PS/RE</th>
                    <th className={`border border-slate-300 p-1 ${colors.blue}`} rowSpan={3}>PS/PI</th>
                </tr>
                <tr>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={2}>&lt; 1 Hari</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={2}>1-3 Hari</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={2}>&gt; 3 Hari</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} colSpan={4}>WFM</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={2}>UIM</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={2}>ASP</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`} rowSpan={2}>OSM</th>
                </tr>
                <tr>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`}>KNDL Plgn</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`}>KNDL Teknis</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`}>KNDL System</th>
                    <th className={`border border-slate-300 p-1 ${colors.gray}`}>KNDL Others</th>
                </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="bg-white text-gray-700">
                {loading ? (
                    <tr><td colSpan="30" className="py-4 text-sm text-gray-500">Loading data...</td></tr>
                ) : filteredData.length === 0 ? (
                    <tr><td colSpan="30" className="py-4 text-sm text-gray-500">Tidak ada data untuk periode ini.</td></tr>
                ) : (
                    filteredData.map((row, index) => (
                    <tr 
                        key={index} 
                        className="bg-white hover:bg-blue-50 transition-colors"
                    >
                        <td className="border border-slate-300 p-1 text-left sticky left-0 z-10 px-2 bg-inherit font-semibold">
                            {row.witel}
                        </td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.pre_pi)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.registered)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.inpro_sc)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.qc1)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fcc)}</td>
                        <td className="border border-slate-300 p-1 text-red-600 font-bold">{formatNumber(row.rjct_fcc)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.survey_manja)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.un_sc)}</td>

                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_under_24)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_24_72)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_over_72)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50 font-bold">{formatNumber(row.total_pi)}</td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_plgn)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_teknis)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_system)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_others)}</td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_uim)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_asp)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_osm)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50 font-bold">{formatNumber(row.total_fallout)}</td>
                        
                        <td className="border border-slate-300 p-1 bg-green-50 font-bold">{formatNumber(row.act_comp)}</td>
                        <td className="border border-slate-300 p-1 bg-green-100 font-bold">{formatNumber(row.ps)}</td>

                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_plgn)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_teknis)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_system)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_others)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50 font-bold">{formatNumber(row.total_cancel)}</td>

                        <td className="border border-slate-300 p-1 bg-red-50 font-bold">{formatNumber(row.revoke)}</td>

                        <td className="border border-slate-300 p-1 bg-blue-50 font-bold">{row.perf_pi_re}%</td>
                        <td className={`border border-slate-300 p-1 ${getPsReColor(row.perf_ps_re)}`}>
                            {row.perf_ps_re}%
                        </td>
                        <td className="border border-slate-300 p-1 bg-green-50 font-bold">{row.perf_ps_pi}%</td>
                    </tr>
                )))}
            </tbody>

            {/* TABLE FOOTER (TOTALS) */}
            <tfoot className="sticky bottom-0 z-20">
                <tr className={totalRowStyle}>
                    <td className="border border-slate-400 p-2 sticky left-0 z-30 bg-[#cccccc]">TOTAL</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.pre_pi)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.registered)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.inpro_sc)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.qc1)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fcc)}</td>
                    <td className="border border-slate-400 p-1 text-red-600">{formatNumber(totals.rjct_fcc)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.survey_manja)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.un_sc)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.pi_under_24)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.pi_24_72)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.pi_over_72)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.total_pi)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_plgn)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_teknis)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_system)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_others)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_uim)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_asp)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_osm)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.total_fallout)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.act_comp)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.ps)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_plgn)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_teknis)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_system)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_others)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.total_cancel)}</td>

                    <td className="border border-slate-400 p-1 text-red-600">{formatNumber(totals.revoke)}</td>

                    <td className="border border-slate-400 p-1">{totals.pi_re_percent}%</td>
                    <td className={`border border-slate-400 p-1 ${getPsReColor(totals.ps_re_percent)}`}>
                        {totals.ps_re_percent}%
                    </td>
                    <td className="border border-slate-400 p-1">{totals.ps_pi_percent}%</td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data HSI</h2>
        <FileUploadForm type="hsi" onSuccess={() => fetchData()} />
      </div>
    </>
  )
}

export default ReportsHSI