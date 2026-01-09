import React, { useState, useEffect } from 'react'
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
  const [tableData, setTableData] = useState([])
  const [totals, setTotals] = useState({})
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
      if (response.data?.data) {
        setTableData(response.data.data.tableData || [])
        setTotals(response.data.data.totals || {})
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

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-hsi?${params.toString()}`
  }

  // Filter is done on backend for RSO, but frontend filter for specific view
  // Note: Since backend returns hierarchical flat list (Parent -> Children), 
  // simple filter might break the hierarchy visual if not careful.
  // Ideally, if user selects "BALI", we should show BALI parent and its children.
  // But for now, let's keep it simple: if selectedWitel, filter by witel (parent) AND its children (witel_old logic not needed if backend grouped nicely, but here we have flat list).
  // The current backend returns a flat list where children follow their parent.
  // Row structure: { witel_display, row_type: 'main'|'sub', ... }
  
  // Actually, filtering a flat hierarchical list is tricky. 
  // Let's rely on the fact that if a parent matches, we probably want its children too.
  // Or, since the backend sends EVERYTHING, we can filter.
  // Since 'witel' property exists on all rows (parent has it, child has it as parent reference), we can filter by that.
  
  const displayData = React.useMemo(() => {
    if (!selectedWitel) return tableData
    return tableData.filter(row => row.witel === selectedWitel)
  }, [tableData, selectedWitel])

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
                ) : displayData.length === 0 ? (
                    <tr><td colSpan="30" className="py-4 text-sm text-gray-500">Tidak ada data untuk periode ini.</td></tr>
                ) : (
                    displayData.map((row, index) => (
                    <tr 
                        key={index} 
                        className={`transition-colors ${
                            row.row_type === 'main' ? 'bg-blue-50/50 hover:bg-blue-100 font-bold' : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                        <td className={`border border-slate-300 p-1 text-left sticky left-0 z-10 px-2 bg-inherit ${
                            row.row_type === 'sub' ? 'pl-6 text-gray-500 italic' : 'text-blue-800'
                        }`}>
                            {row.witel_display}
                        </td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.pre_pi)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.registered)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.inpro_sc)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.qc1)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fcc)}</td>
                        <td className="border border-slate-300 p-1 text-red-600 font-bold">{formatNumber(row.cancel_by_fcc || row.rjct_fcc)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.survey_new_manja || row.survey_manja)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.unsc || row.un_sc)}</td>

                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_under_1_hari || row.pi_under_24)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_1_3_hari || row.pi_24_72)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.pi_over_3_hari || row.pi_over_72)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50 font-bold">{formatNumber(row.total_pi)}</td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_kndl_plgn || row.fo_wfm_plgn)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_kndl_teknis || row.fo_wfm_teknis)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_kndl_sys || row.fo_wfm_system)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_wfm_others)}</td>
                        
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_uim)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_asp)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.fo_osm)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50 font-bold">{formatNumber(row.total_fallout)}</td>
                        
                        <td className="border border-slate-300 p-1 bg-green-50 font-bold">{formatNumber(row.act_comp)}</td>
                        <td className="border border-slate-300 p-1 bg-green-100 font-bold">{formatNumber(row.jml_comp_ps || row.ps)}</td>

                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_kndl_plgn || row.cancel_plgn)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_kndl_teknis || row.cancel_teknis)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_kndl_sys || row.cancel_system)}</td>
                        <td className="border border-slate-300 p-1">{formatNumber(row.cancel_others)}</td>
                        <td className="border border-slate-300 p-1 bg-slate-50 font-bold">{formatNumber(row.total_cancel)}</td>

                        <td className="border border-slate-300 p-1 bg-red-50 font-bold">{formatNumber(row.revoke)}</td>

                        <td className="border border-slate-300 p-1 bg-blue-50 font-bold">{row.pi_re_percent}%</td>
                        <td className={`border border-slate-300 p-1 ${getPsReColor(row.ps_re_percent)}`}>
                            {row.ps_re_percent}%
                        </td>
                        <td className="border border-slate-300 p-1 bg-green-50 font-bold">{row.ps_pi_percent}%</td>
                    </tr>
                )))}
            </tbody>

            {/* TABLE FOOTER (TOTALS) */}
            <tfoot className="sticky bottom-0 z-20">
                <tr className={totalRowStyle}>
                    <td className="border border-slate-400 p-2 sticky left-0 z-30 bg-[#cccccc]">GRAND TOTAL</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.pre_pi)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.registered)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.inprogress_sc)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.qc1)}</td>
                    <td className="border border-slate-400 p-1">{formatNumber(totals.fcc)}</td>
                    <td className="border border-slate-400 p-1 text-red-600">{formatNumber(totals.cancel_by_fcc)}</td>
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