<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react'
import { FiDownload, FiRefreshCw } from 'react-icons/fi'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReportsHSI = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedWitel, setSelectedWitel] = useState('')
  const [reportData, setReportData] = useState([])
  const [totals, setTotals] = useState({})
  const [loading, setLoading] = useState(false)

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

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const params = {}
      if (startDate) params.start_date = startDate.toISOString()
      if (endDate) params.end_date = endDate.toISOString()

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/hsi`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (response.data?.data) {
        // Backend returns tableData, not reportData
        setReportData(response.data.data.tableData || response.data.data.reportData || [])
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
=======
import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';

const ReportsHSI = () => {
    // 1. STATE INITIALIZATION
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [totals, setTotals] = useState({});
    const [selectedWitel, setSelectedWitel] = useState('ALL');

    // 2. FETCH DATA
    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { start_date: startDate, end_date: endDate };
            const response = await api.get('/report/hsi', { params });
            if (response.data.success) {
                setTableData(response.data.data.tableData || []);
                setTotals(response.data.data.totals || {});
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);
>>>>>>> cb5c0841a2fee744eaf93e577203a5a7f32ea25a

    // 3. FILTERING LOGIC
    const displayData = useMemo(() => {
        if (selectedWitel === 'ALL') return tableData;
        
        // If a specific witel is selected, find the parent and its children
        // The tableData is already flat [Parent, Child, Child, Parent, Child...]
        // We find the parent row and all subsequent 'sub' rows until next 'main'
        const result = [];
        let capturing = false;
        
        for (const row of tableData) {
            if (row.row_type === 'main') {
                if (row.witel_display === selectedWitel) {
                    capturing = true;
                    result.push(row);
                } else {
                    capturing = false;
                }
            } else if (row.row_type === 'sub' && capturing) {
                result.push(row);
            }
        }
        return result;
    }, [tableData, selectedWitel]);

<<<<<<< HEAD
  const handleExport = () => {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate.toISOString())
    if (endDate) params.append('end_date', endDate.toISOString())
    
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/export/report-hsi?${params.toString()}`
  }

  // Reset all filters
  const handleResetFilter = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectedWitel('')
  }

  // Export to Excel (CSV format)
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk di-export')
      return
    }

    // Define headers
    const headers = [
      'Witel', 'PRE PI', 'Registered', 'Inpro SC', 'QC1', 'FCC', 'RJCT FCC', 'Survey Manja', 'UN-SC',
      'PI < 1 Hari', 'PI 1-3 Hari', 'PI > 3 Hari', 'Total PI',
      'FO WFM Plgn', 'FO WFM Teknis', 'FO WFM System', 'FO WFM Others',
      'FO UIM', 'FO ASP', 'FO OSM', 'Total Fallout',
      'ACT COMP', 'JML COMP (PS)',
      'Cancel Plgn', 'Cancel Teknis', 'Cancel System', 'Cancel Others', 'Total Cancel',
      'Revoke', 'PI/RE %', 'PS/RE %', 'PS/PI %'
    ]

    // Map data rows
    const rows = filteredData.map(row => [
      row.witel || row.witel_display || '',
      row.pre_pi || 0,
      row.registered || 0,
      row.inpro_sc || row.inprogress_sc || 0,
      row.qc1 || 0,
      row.fcc || 0,
      row.rjct_fcc || row.cancel_by_fcc || 0,
      row.survey_manja || row.survey_new_manja || 0,
      row.un_sc || row.unsc || 0,
      row.pi_under_24 || row.pi_under_1_hari || 0,
      row.pi_24_72 || row.pi_1_3_hari || 0,
      row.pi_over_72 || row.pi_over_3_hari || 0,
      row.total_pi || 0,
      row.fo_wfm_plgn || row.fo_wfm_kndl_plgn || 0,
      row.fo_wfm_teknis || row.fo_wfm_kndl_teknis || 0,
      row.fo_wfm_system || row.fo_wfm_kndl_sys || 0,
      row.fo_wfm_others || 0,
      row.fo_uim || 0,
      row.fo_asp || 0,
      row.fo_osm || 0,
      row.total_fallout || 0,
      row.act_comp || 0,
      row.ps || row.jml_comp_ps || 0,
      row.cancel_plgn || row.cancel_kndl_plgn || 0,
      row.cancel_teknis || row.cancel_kndl_teknis || 0,
      row.cancel_system || row.cancel_kndl_sys || 0,
      row.cancel_others || 0,
      row.total_cancel || 0,
      row.revoke || 0,
      row.perf_pi_re || row.pi_re_percent || 0,
      row.perf_ps_re || row.ps_re_percent || 0,
      row.perf_ps_pi || row.ps_pi_percent || 0
    ])

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Generate filename with date
    const dateStr = new Date().toISOString().split('T')[0]
    link.download = `Report_HSI_${dateStr}.csv`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
=======
    const witels = useMemo(() => {
        return ['ALL', ...new Set(tableData.filter(r => r.row_type === 'main').map(r => r.witel_display))];
    }, [tableData]);

    // 4. HELPERS
    const formatNumber = (num) => Number(num || 0).toLocaleString('id-ID');
    
    const getPsReColor = (val) => {
        const v = parseFloat(val);
        if (v >= 90) return 'text-green-600 font-bold';
        if (v >= 70) return 'text-yellow-600 font-bold';
        return 'text-red-600 font-bold';
    };
>>>>>>> cb5c0841a2fee744eaf93e577203a5a7f32ea25a

    const headerStyle = "bg-[#333333] text-white font-bold text-[10px] uppercase tracking-wider";
    const subHeaderStyle = "bg-[#444444] text-white font-bold text-[9px] uppercase";
    const totalRowStyle = "bg-[#cccccc] text-black font-bold text-[10px]";
    
    const colors = {
        blue: "bg-blue-600 text-white",
        red: "bg-red-600 text-white",
        green: "bg-green-700 text-white",
        orange: "bg-orange-500 text-white",
        gray: "bg-gray-600 text-white"
    };

    return (
        <div className="flex flex-col space-y-4 p-2 md:p-4 bg-slate-50 min-h-screen">
            {/* TOOLBAR */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Witel</label>
                        <select 
                            value={selectedWitel} 
                            onChange={(e) => setSelectedWitel(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                        >
                            {witels.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Periode</label>
                        <div className="flex items-center gap-2">
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-slate-50" />
                            <span className="text-slate-300">-</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-slate-50" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                        <FiRefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-green-100 transition-all">
                        <FiDownload /> Export
                    </button>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[75vh]">
                    <table className="min-w-full border-collapse text-center text-[10px]">
                        <thead className="sticky top-0 z-20">
                            {/* LEVEL 1 HEADERS */}
                            <tr className={headerStyle}>
                                <th rowSpan="2" className="border border-slate-400 p-2 sticky left-0 z-30 bg-[#333333] min-w-[120px]">WITEL / BRANCH</th>
                                <th rowSpan="2" className="border border-slate-400 p-2">PRE PI</th>
                                <th rowSpan="2" className="border border-slate-400 p-2 bg-blue-800">RE (REG)</th>
                                <th rowSpan="2" className="border border-slate-400 p-2">INPRO SC</th>
                                <th rowSpan="2" className="border border-slate-400 p-2">QC1</th>
                                <th rowSpan="2" className="border border-slate-400 p-2">FCC</th>
                                <th rowSpan="2" className="border border-slate-400 p-2 bg-red-800">RJCT FCC</th>
                                <th rowSpan="2" className="border border-slate-400 p-2">SURVEY MANJA</th>
                                <th rowSpan="2" className="border border-slate-400 p-2">UN-SC</th>
                                <th colSpan="4" className={`border border-slate-400 p-1 ${colors.blue}`}>OGP AGING (PI)</th>
                                <th colSpan="4" className={`border border-slate-400 p-1 ${colors.gray}`}>FALLOUT WFM</th>
                                <th colSpan="4" className={`border border-slate-400 p-1 ${colors.orange}`}>FALLOUT OTHERS</th>
                                <th rowSpan="2" className={`border border-slate-400 p-2 ${colors.green}`}>ACT COMP</th>
                                <th rowSpan="2" className={`border border-slate-400 p-2 ${colors.green}`}>PS</th>
                                <th colSpan="5" className={`border border-slate-400 p-1 ${colors.red}`}>CANCEL</th>
                                <th rowSpan="2" className={`border border-slate-400 p-2 ${colors.red}`}>REVOKE</th>
                                <th colSpan="3" className="border border-slate-400 p-1 bg-indigo-800">PERFORMANCE</th>
                            </tr>
                            {/* LEVEL 2 HEADERS */}
                            <tr className={subHeaderStyle}>
                                <th className="border border-slate-400 p-1 font-normal">&lt; 24H</th>
                                <th className="border border-slate-400 p-1 font-normal">24-72H</th>
                                <th className="border border-slate-400 p-1 font-normal">&gt; 72H</th>
                                <th className="border border-slate-400 p-1 bg-blue-500">TOTAL</th>

                                <th className="border border-slate-400 p-1 font-normal">Plgn</th>
                                <th className="border border-slate-400 p-1 font-normal">Teknis</th>
                                <th className="border border-slate-400 p-1 font-normal">System</th>
                                <th className="border border-slate-400 p-1 font-normal">Others</th>

                                <th className="border border-slate-400 p-1 font-normal">UIM</th>
                                <th className="border border-slate-400 p-1 font-normal">ASP</th>
                                <th className="border border-slate-400 p-1 font-normal">OSM</th>
                                <th className="border border-slate-400 p-1 bg-gray-500">TOTAL</th>

                                <th className="border border-slate-400 p-1 font-normal">Plgn</th>
                                <th className="border border-slate-400 p-1 font-normal">Teknis</th>
                                <th className="border border-slate-400 p-1 font-normal">System</th>
                                <th className="border border-slate-400 p-1 font-normal">Others</th>
                                <th className="border border-slate-400 p-1 bg-red-500">TOTAL</th>

                                <th className="border border-slate-400 p-1 bg-indigo-600">PI/RE</th>
                                <th className="border border-slate-400 p-1 bg-indigo-600">PS/RE</th>
                                <th className="border border-slate-400 p-1 bg-indigo-600">PS/PI</th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody className="bg-white text-gray-700">
                            {loading ? (
                                <tr><td colSpan="30" className="py-10 text-sm text-slate-400">Loading data report...</td></tr>
                            ) : displayData.length === 0 ? (
                                <tr><td colSpan="30" className="py-10 text-sm text-slate-400">Tidak ada data untuk periode ini.</td></tr>
                            ) : (
                                displayData.map((row, index) => (
                                <tr 
                                    key={index} 
                                    className={`transition-colors ${
                                        row.row_type === 'main' ? 'bg-blue-50/50 hover:bg-blue-100 font-bold' : 'bg-white hover:bg-slate-50'
                                    }`}
                                >
                                    <td className={`border border-slate-200 p-1 text-left sticky left-0 z-10 px-2 bg-inherit shadow-[1px_0_0_0_#e2e8f0] ${
                                        row.row_type === 'sub' ? 'pl-6 text-slate-500 italic' : 'text-blue-800'
                                    }`}>
                                        {row.witel_display}
                                    </td>

                                    <td className="border border-slate-200 p-1">{formatNumber(row.pre_pi)}</td>
                                    <td className="border border-slate-200 p-1 bg-blue-50/30">{formatNumber(row.registered)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.inprogress_sc || row.inpro_sc)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.qc1)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.fcc)}</td>
                                    <td className="border border-slate-200 p-1 text-red-600 font-bold bg-red-50/30">{formatNumber(row.cancel_by_fcc || row.rjct_fcc)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.survey_new_manja || row.survey_manja)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.unsc || row.un_sc)}</td>

                                    <td className="border border-slate-200 p-1">{formatNumber(row.pi_under_1_hari || row.pi_under_24)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.pi_1_3_hari || row.pi_24_72)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.pi_over_3_hari || row.pi_over_72)}</td>
                                    <td className="border border-slate-200 p-1 bg-blue-50 font-bold">{formatNumber(row.total_pi)}</td>
                                    
                                    <td className="border border-slate-200 p-1">{formatNumber(row.fo_wfm_kndl_plgn || row.fo_wfm_plgn)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.fo_wfm_kndl_teknis || row.fo_wfm_teknis)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.fo_wfm_kndl_sys || row.fo_wfm_system)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.fo_wfm_others)}</td>

                                    <td className="border border-slate-200 p-1">{formatNumber(row.fo_uim)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.fo_asp)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.fo_osm)}</td>
                                    <td className="border border-slate-200 p-1 bg-slate-50 font-bold">{formatNumber(row.total_fallout)}</td>

                                    <td className="border border-slate-200 p-1 bg-green-50 font-bold">{formatNumber(row.act_comp)}</td>
                                    <td className="border border-slate-200 p-1 bg-green-100 font-bold">{formatNumber(row.jml_comp_ps || row.ps)}</td>

                                    <td className="border border-slate-200 p-1">{formatNumber(row.cancel_kndl_plgn || row.cancel_plgn)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.cancel_kndl_teknis || row.cancel_teknis)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.cancel_kndl_sys || row.cancel_system)}</td>
                                    <td className="border border-slate-200 p-1">{formatNumber(row.cancel_others)}</td>
                                    <td className="border border-slate-200 p-1 bg-red-50 font-bold">{formatNumber(row.total_cancel)}</td>

                                    <td className="border border-slate-200 p-1 bg-red-100 font-bold">{formatNumber(row.revoke)}</td>

                                    <td className="border border-slate-200 p-1 bg-indigo-50 font-bold">{row.pi_re_percent}%</td>
                                    <td className={`border border-slate-200 p-1 ${getPsReColor(row.ps_re_percent)}`}>
                                        {row.ps_re_percent}%
                                    </td>
                                    <td className="border border-slate-200 p-1 bg-green-50 font-bold">{row.ps_pi_percent}%</td>
                                </tr>
                            )))}
                        </tbody>

                        {/* TABLE FOOTER (TOTALS) */}
                        <tfoot className="sticky bottom-0 z-20">
                            <tr className={totalRowStyle}>
                                <td className="border border-slate-400 p-2 sticky left-0 z-30 bg-[#cccccc] shadow-[1px_0_0_0_#94a3b8]">GRAND TOTAL</td>
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
<<<<<<< HEAD
            
            <button onClick={fetchData} className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded hover:bg-blue-700 font-bold shadow transition">
                Go
            </button>
            
            <button 
                onClick={handleResetFilter} 
                className="bg-gray-500 text-white text-xs px-3 py-1.5 rounded hover:bg-gray-600 flex items-center gap-1 font-bold shadow transition"
                title="Reset Filter"
            >
                <FiRefreshCw size={14}/> Reset
            </button>
            
            <button 
                onClick={handleExportExcel} 
                className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700 flex items-center gap-1 font-bold shadow transition"
                disabled={filteredData.length === 0}
            >
                <FiDownload size={16}/> Excel
            </button>
          </div>
=======
>>>>>>> cb5c0841a2fee744eaf93e577203a5a7f32ea25a
        </div>
    );
};

export default ReportsHSI;