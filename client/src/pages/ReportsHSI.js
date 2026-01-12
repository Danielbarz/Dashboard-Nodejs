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

    // Styles & Helpers
    const headerStyle = "bg-[#333333] text-white text-[10px] leading-tight font-semibold tracking-wider uppercase";
    const subHeaderStyle = "bg-slate-100 text-slate-700 text-[9px] font-bold uppercase tracking-wider";
    const totalRowStyle = "bg-slate-200 font-bold text-[10px] text-slate-800 border-t-2 border-slate-400";

    const colors = {
        blue: "bg-blue-100 text-blue-900",
        gray: "bg-slate-100 text-slate-700",
        orange: "bg-orange-100 text-orange-900",
        green: "bg-green-100 text-green-900",
        red: "bg-red-100 text-red-900"
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined || num === '') return '-';
        return Number(num).toLocaleString('id-ID');
    };

    const getPsReColor = (val) => {
        const v = parseFloat(val);
        if (isNaN(v)) return '';
        if (v >= 100) return 'bg-green-200 text-green-800 font-bold';
        if (v >= 90) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-slate-800">Laporan HSI</h1>
                   <p className="text-sm text-slate-500">Monitoring Performance & Fallout</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex flex-col px-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Start</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border-none p-0 text-sm font-semibold text-slate-700 focus:ring-0" />
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="flex flex-col px-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">End</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border-none p-0 text-sm font-semibold text-slate-700 focus:ring-0" />
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <button onClick={fetchData} className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group">
                        <FiRefreshCw className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <a
                        href={`http://localhost:5000/api/report/export-hsi?start_date=${startDate}&end_date=${endDate}`}
                        target="_blank" rel="noreferrer"
                        className="ml-2 flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        <FiDownload className="mr-2" /> Export
                    </a>
                </div>
            </div>            {/* TABLE CONTAINER */}
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
        </div>
    );
};

export default ReportsHSI;
