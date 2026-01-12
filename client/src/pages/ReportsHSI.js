import React, { useState, useEffect, useMemo } from 'react'
import { FiDownload } from 'react-icons/fi'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReportsHSI = () => {
  // State tanggal akan di-set setelah fetch date range dari backend
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedWitel, setSelectedWitel] = useState('')
  const [reportData, setReportData] = useState([])
  const [totals, setTotals] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingDates, setLoadingDates] = useState(true)

  const witelList = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

  // --- Helpers ---
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

  // Fetch date range dari backend
  const fetchDateRange = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/hsi/date-range`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data?.data) {
        setStartDate(new Date(response.data.data.min_date))
        setEndDate(new Date(response.data.data.max_date))
      }
    } catch (error) {
      console.error('Failed to fetch date range:', error)
      // Fallback ke default jika error
      setStartDate(new Date('2000-01-01'))
      setEndDate(new Date())
    } finally {
      setLoadingDates(false)
    }
  }

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert('Silakan pilih tanggal mulai dan tanggal akhir terlebih dahulu')
      return
    }
    
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/hsi`,
        {
          params: { 
            start_date: startDate.toISOString(), 
            end_date: endDate.toISOString() 
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (response.data?.data) {
        setReportData(response.data.data.reportData || response.data.data.tableData || [])
        setTotals(response.data.data.totals || {})
      }
    } catch (error) {
      console.error('Failed to fetch HSI report:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-load date range dan data saat pertama kali buka halaman
  useEffect(() => {
    fetchDateRange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch data setelah dates ter-set
  useEffect(() => {
    if (startDate && endDate && !loadingDates) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, loadingDates])

  const filteredData = useMemo(() => {
    if (!selectedWitel) return reportData
    return reportData.filter(row => row.witel === selectedWitel)
  }, [reportData, selectedWitel])

  const handleExport = () => {
    if (!startDate || !endDate) {
      alert('Silakan pilih tanggal mulai dan tanggal akhir terlebih dahulu')
      return
    }
    
    const params = new URLSearchParams({ 
        start_date: startDate.toISOString(), 
        end_date: endDate.toISOString() 
    })
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/export/report-hsi?${params.toString()}`
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Data</h2>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <select value={selectedWitel} onChange={(e) => setSelectedWitel(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2 border">
            <option value="">Semua Witel</option>
            {witelList.map(witel => <option key={witel} value={witel}>{witel}</option>)}
          </select>

          <div className="flex gap-2 items-center relative z-50"> 
            <div className="relative z-50">
                <DatePicker 
                    selected={startDate} 
                    onChange={(date) => setStartDate(date)} 
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="border border-gray-300 rounded text-xs p-1.5 w-28 cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative z-50">
                <DatePicker 
                    selected={endDate} 
                    onChange={(date) => setEndDate(date)} 
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                    className="border border-gray-300 rounded text-xs p-1.5 w-28 cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            <button onClick={fetchData} className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded hover:bg-blue-700 font-bold shadow transition">
                Go
            </button>
            
            <button 
                onClick={handleExport} 
                className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700 flex items-center gap-1 font-bold shadow transition ml-2"
            >
                <FiDownload size={16}/> Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4">
            Performance Report HSI Per Witel
        </h3>
        <div className="overflow-x-auto max-h-[80vh] relative z-0">
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
                ) : reportData.length === 0 ? (
                    <tr><td colSpan="30" className="py-4 text-sm text-gray-500">
                        {startDate && endDate ? 'Tidak ada data untuk periode ini.' : 'Silakan pilih tanggal dan klik Go untuk menampilkan data'}
                    </td></tr>
                ) : (
                    filteredData.map((row, index) => (
                    <tr 
                        key={index} 
                        className={`
                            transition-colors 
                            ${row.row_type === 'main' ? 'bg-slate-100' : 'bg-white hover:bg-blue-50'}
                            ${row.row_type === 'main' ? 'font-bold text-black border-t-2 border-slate-300' : ''}
                        `}
                    >
                        <td className={`border border-slate-300 p-1 text-left sticky left-0 z-10 px-2 
                            ${row.row_type === 'main' ? 'bg-slate-100 font-extrabold uppercase' : 'bg-inherit pl-6'}
                        `}>
                            {row.witel_display || row.witel}
                        </td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.pre_pi)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.registered)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.inprogress_sc)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.qc1)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fcc)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_by_fcc)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.survey_new_manja)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.unsc)}</td>

                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_under_1_hari)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_1_3_hari)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_over_3_hari)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50">{formatNumber(row.total_pi)}</td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_kndl_plgn)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_kndl_teknis)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_kndl_sys)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_others)}</td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_uim)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_asp)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_osm)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50">{formatNumber(row.total_fallout)}</td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.act_comp)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50">{formatNumber(row.jml_comp_ps)}</td>

                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_kndl_plgn)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_kndl_teknis)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_kndl_sys)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_others)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50">{formatNumber(row.total_cancel)}</td>

                        <td className="border border-slate-300 p-1">{formatNumber(row.revoke)}</td>

                        <td className="border border-slate-300 p-1">{row.pi_re_percent}%</td>
                        <td className={`border border-slate-300 p-1 ${getPsReColor(row.ps_re_percent)}`}>
                            {row.ps_re_percent}%
                        </td>
                        <td className="border border-slate-300 p-1">{row.ps_pi_percent}%</td>
                    </tr>
                )))}
            </tbody>

            {/* TABLE FOOTER (TOTALS) */}
            <tfoot className="sticky bottom-0 z-20">
                <tr className={totalRowStyle}>
                    <td className="border border-slate-400 p-2 sticky left-0 z-30 bg-[#cccccc]">TOTAL</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.pre_pi)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.registered)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.inprogress_sc)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.qc1)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fcc)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_by_fcc)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.survey_new_manja)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.unsc)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.pi_under_1_hari)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.pi_1_3_hari)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.pi_over_3_hari)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.total_pi)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_kndl_plgn)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_kndl_teknis)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_kndl_sys)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_wfm_others)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_uim)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_asp)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fo_osm)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.total_fallout)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.act_comp)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.jml_comp_ps)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_kndl_plgn)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_kndl_teknis)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_kndl_sys)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.cancel_others)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.total_cancel)}</td>

                    <td className="border border-slate-400 p-1">{formatNumber(totals.revoke)}</td>

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