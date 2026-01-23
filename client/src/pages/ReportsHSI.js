import React, { useState, useEffect, useMemo } from 'react'
import { FiDownload, FiRefreshCw } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api, { API_URL, SERVER_URL } from '../services/api'
import axios from 'axios'
import FileUploadForm from '../components/FileUploadForm'
import "react-datepicker/dist/react-datepicker.css";

const ReportsHSI = () => {
    const { user } = useAuth()
    const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
    const isAdminMode = ['admin', 'superadmin'].includes(currentRole)

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [totals, setTotals] = useState({});
    const [selectedWitel, setSelectedWitel] = useState('ALL');
    const [refreshKey, setRefreshKey] = useState(0);

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
    }, [startDate, endDate, refreshKey]);

    const displayData = useMemo(() => {
        if (selectedWitel === 'ALL') return tableData;
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

    const formatNumber = (num) => {
        if (num === null || num === undefined || num === '') return '-';
        return Number(num).toLocaleString('id-ID');
    };

    const getPsReColor = (val) => {
        const v = parseFloat(val);
        if (isNaN(v)) return 'bg-white';
        if (v >= 100) return 'bg-[#bbf7d0] text-green-800 font-bold'; 
        if (v >= 90) return 'bg-[#fef9c3] text-yellow-800';
        return 'bg-[#fee2e2] text-red-800';
    };

    return (
        <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center py-4">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Report HSI</h1>
                   <p className="text-gray-500 text-sm mt-1">Laporan detail performance & fallout HSI</p>
                </div>
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10">
                        <div className="flex flex-col justify-center px-1">
                            <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Start</span>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border-none p-0 text-sm font-semibold text-gray-700 focus:ring-0 bg-transparent" />
                        </div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="flex flex-col justify-center px-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">End</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border-none p-0 text-sm font-semibold text-gray-700 focus:ring-0 bg-transparent" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={fetchData} className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors h-10 w-10">
                            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <a 
                            href={`${SERVER_URL}/api/report/export-hsi?start_date=${startDate}&end_date=${endDate}`}
                            target="_blank" rel="noreferrer"
                            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 shadow-sm transition-colors h-10 min-w-[140px]"
                        >
                            <FiDownload className="mr-2" size={16} />
                            Export Excel
                        </a>
                    </div>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
                <div className="overflow-x-auto max-h-[75vh]">
                    <table className="min-w-full border-separate border-spacing-0 text-center text-[10px]">
                        <thead className="sticky top-0 z-30">
                            {/* LEVEL 1 HEADERS */}
                            <tr className="text-white bg-[#333333]">
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 sticky left-0 z-40 bg-[#333333] min-w-[140px]">WITEL / BRANCH</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#333333]">PRE PI</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#1e40af]">RE (REG)</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#333333]">INPRO SC</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#333333]">QC1</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#333333]">FCC</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#991b1b]">RJCT FCC</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#333333]">SURVEY MANJA</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#333333]">UN-SC</th>
                                <th colSpan="4" className="border-b border-r border-slate-400 p-1 bg-[#0369a1]">OGP AGING (PI)</th>
                                <th colSpan="4" className="border-b border-r border-slate-400 p-1 bg-[#475569]">FALLOUT WFM</th>
                                <th colSpan="4" className="border-b border-r border-slate-400 p-1 bg-[#c2410c]">FALLOUT OTHERS</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#15803d]">ACT COMP</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#15803d]">PS</th>
                                <th colSpan="5" className="border-b border-r border-slate-400 p-1 bg-[#b91c1c]">CANCEL</th>
                                <th rowSpan="2" className="border-b border-r border-slate-400 p-2 bg-[#b91c1c]">REVOKE</th>
                                <th colSpan="3" className="border-b border-slate-400 p-1 bg-[#3730a3]">PERFORMANCE</th>
                            </tr>
                            {/* LEVEL 2 HEADERS */}
                            <tr className="bg-[#f1f5f9] text-slate-700 font-bold">
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">&lt; 24H</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">24-72H</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">&gt; 72H</th>
                                <th className="border-b border-r border-slate-400 p-1 bg-[#0284c7] text-white">TOTAL</th>

                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">Plgn</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">Teknis</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">System</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">Others</th>

                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">UIM</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">ASP</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">OSM</th>
                                <th className="border-b border-r border-slate-400 p-1 bg-[#64748b] text-white">TOTAL</th>

                                {/* SUB-HEADERS FOR CANCEL (FIXED) */}
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">Plgn</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">Teknis</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">System</th>
                                <th className="border-b border-r border-slate-300 p-1 bg-[#f1f5f9]">Others</th>
                                <th className="border-b border-r border-slate-400 p-1 bg-[#b91c1c] text-white">TOTAL</th>

                                <th className="border-b border-r border-slate-400 p-1 bg-[#4338ca] text-white">PI/RE</th>
                                <th className="border-b border-r border-slate-400 p-1 bg-[#4338ca] text-white">PS/RE</th>
                                <th className="border-b border-slate-400 p-1 bg-[#4338ca] text-white">PS/PI</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white text-gray-700">
                            {displayData.map((row, index) => (
                                <tr key={index} className={row.row_type === 'main' ? 'bg-[#f8fafc] font-bold' : 'bg-white hover:bg-[#f1f5f9]'}>
                                    <td className={`border-b border-r border-slate-200 p-1.5 text-left sticky left-0 z-10 px-2 shadow-[1px_0_0_0_#e2e8f0] ${
                                        row.row_type === 'sub' ? 'pl-6 text-slate-500 italic bg-white' : 'text-blue-800 bg-[#f8fafc]'
                                    }`}>
                                        {row.witel_display}
                                    </td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.pre_pi)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#f0f9ff]">{formatNumber(row.registered)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.inprogress_sc || row.inpro_sc)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.qc1)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fcc)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 text-[#b91c1c] font-bold bg-[#fef2f2]">{formatNumber(row.cancel_by_fcc || row.rjct_fcc)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.survey_new_manja || row.survey_manja)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.unsc || row.un_sc)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.pi_under_1_hari || row.pi_under_24)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.pi_1_3_hari || row.pi_24_72)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.pi_over_3_hari || row.pi_over_72)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#f0f9ff] font-bold text-blue-700">{formatNumber(row.total_pi)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fo_wfm_kndl_plgn || row.fo_wfm_plgn)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fo_wfm_kndl_teknis || row.fo_wfm_teknis)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fo_wfm_kndl_sys || row.fo_wfm_system)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fo_wfm_others)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fo_uim)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fo_asp)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.fo_osm)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#f1f5f9] font-bold">{formatNumber(row.total_fallout)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#f0fdf4] font-bold">{formatNumber(row.act_comp)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#dcfce7] font-bold text-[#166534]">{formatNumber(row.jml_comp_ps || row.ps)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.cancel_kndl_plgn || row.cancel_plgn)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.cancel_kndl_teknis || row.cancel_teknis)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.cancel_kndl_sys || row.cancel_system)}</td>
                                    <td className="border-b border-r border-slate-200 p-1">{formatNumber(row.cancel_others)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#fef2f2] font-bold text-[#b91c1c]">{formatNumber(row.total_cancel)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#fee2e2] font-bold text-[#991b1b]">{formatNumber(row.revoke)}</td>
                                    <td className="border-b border-r border-slate-200 p-1 bg-[#f8fafc] font-bold text-indigo-700">{row.pi_re_percent}%</td>
                                    <td className={`border-b border-r border-slate-200 p-1 ${getPsReColor(row.ps_re_percent)}`}>{row.ps_re_percent}%</td>
                                    <td className="border-b border-slate-200 p-1 bg-[#f0fdf4] font-bold text-green-700">{row.ps_pi_percent}%</td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="sticky bottom-0 z-20 font-bold text-[10px] bg-[#cbd5e1] text-slate-900">
                            <tr>
                                <td className="border-t border-r border-slate-400 p-2 sticky left-0 z-30 bg-[#cccccc] shadow-[1px_0_0_0_#94a3b8]">GRAND TOTAL</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.pre_pi)}</td>
                                <td className="border-t border-r border-slate-400 p-1 bg-[#bae6fd]">{formatNumber(totals.registered)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.inprogress_sc)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.qc1)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fcc)}</td>
                                <td className="border-t border-r border-slate-400 p-1 text-[#991b1b] bg-[#fecaca]">{formatNumber(totals.cancel_by_fcc)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.survey_new_manja)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.unsc)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.pi_under_1_hari)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.pi_1_3_hari)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.pi_over_3_hari)}</td>
                                <td className="border-t border-r border-slate-400 p-1 bg-[#bae6fd] text-[#0369a1]">{formatNumber(totals.total_pi)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fo_wfm_kndl_plgn)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fo_wfm_kndl_teknis)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fo_wfm_kndl_sys)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fo_wfm_others)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fo_uim)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fo_asp)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.fo_osm)}</td>
                                <td className="border-t border-r border-slate-400 p-1 bg-[#94a3b8] text-white">{formatNumber(totals.total_fallout)}</td>
                                <td className="border-t border-r border-slate-400 p-1 bg-[#86efac]">{formatNumber(totals.act_comp)}</td>
                                <td className="border-t border-r border-slate-400 p-1 bg-[#4ade80] text-[#064e3b]">{formatNumber(totals.jml_comp_ps)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.cancel_kndl_plgn)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.cancel_kndl_teknis)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.cancel_kndl_sys)}</td>
                                <td className="border-t border-r border-slate-400 p-1">{formatNumber(totals.cancel_others)}</td>
                                <td className="border-t border-r border-slate-400 p-1 bg-[#fca5a5] text-[#7f1d1d]">{formatNumber(totals.total_cancel)}</td>
                                <td className="border-t border-r border-slate-400 p-1 bg-[#f87171] text-white">{formatNumber(totals.revoke)}</td>
                                <td className="border-t border-r border-slate-400 p-1 text-indigo-900">{totals.pi_re_percent}%</td>
                                <td className={`border-t border-r border-slate-400 p-1 font-bold ${getPsReColor(totals.ps_re_percent)}`}>{totals.ps_re_percent}%</td>
                                <td className="border-t border-slate-400 p-1 text-green-900">{totals.ps_pi_percent}%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* UPLOAD SECTION - ADMIN ONLY */}
            {isAdminMode && (
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Manajemen Data HSI</h2>
                            <p className="text-sm text-gray-500">Upload dataset baru atau reset data HSI.</p>
                        </div>
                        <button
                            onClick={async () => {
                                if (window.confirm('⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data HSI?')) {
                                    try {
                                        const token = localStorage.getItem('accessToken')
                                        await api.post('/admin/truncate/hsi')
                                        alert('Data HSI berhasil dihapus')
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
                        <FileUploadForm type="hsi" onSuccess={() => setRefreshKey(prev => prev + 1)} />
                        <p className="mt-2 text-[10px] text-slate-400 italic">
                            * Pastikan file Excel/CSV memiliki format kolom yang sesuai dengan sistem HSI (Order ID, Status Resume, etc.)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsHSI;