import React, { useState, useEffect, useMemo, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '../services/api';
import DropdownCheckbox from '../components/DropdownCheckbox';
import { FiRefreshCw } from 'react-icons/fi';

// =================================================================================
// 1. SUB-KOMPONEN UI (Card Components)
// =================================================================================

const HeaderStep = ({ title, color = "bg-gray-800", isLast }) => (
    <div className="relative flex-1 min-w-[120px]">
        <div className={`${color} text-white font-bold h-12 flex items-center justify-center px-4 md:px-8 text-xs md:text-sm text-center relative z-10 shadow-md transition-all hover:brightness-110 rounded-r-lg md:rounded-none`}
            style={{ clipPath: isLast ? 'none' : 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 0% 50%)', marginLeft: '-5px' }}>
            {title}
        </div>
    </div>
);

const MainCard = ({ title, count, total, colorClass = "bg-slate-50 border-2 border-gray-200", onClick, loading }) => {
    // Logic persentase: Jika total ada, hitung %. Jika tidak, string kosong.
    const percent = total > 0 ? ((count / total) * 100).toFixed(2) + '%' : '';

    return (
        <div
            onClick={onClick}
            className={`${colorClass} rounded-2xl p-4 text-center shadow-sm flex flex-col justify-center min-h-[120px]
            transition-all cursor-pointer ${loading ? 'opacity-70 cursor-wait' : 'hover:shadow-md hover:scale-[1.02]'} border`}
        >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{title}</div>
            <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-gray-800 leading-none">
                    {loading ? '...' : (count?.toLocaleString() || 0)}
                </div>
                {percent && !loading && <div className="text-lg font-bold text-green-600 mt-1">{percent}</div>}
            </div>
        </div>
    );
};

const DetailCard = ({ title, count, totalForPercent, highlight = false, onClick, loading }) => {
    const percent = totalForPercent > 0 ? ((count / totalForPercent) * 100).toFixed(2) + '%' : '';
    return (
        <div
            onClick={onClick}
            className={`relative overflow-hidden rounded-xl p-3 shadow-sm border flex flex-col justify-center min-h-[80px]
            transition-all ${loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1 hover:shadow-md cursor-pointer'}
            ${highlight ? 'bg-red-50 border-red-100 hover:bg-red-100' : 'bg-blue-50 border-blue-100 hover:bg-blue-100'}`}
        >
            <div className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase leading-tight mb-1">{title}</div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                <span className={`text-xl font-bold ${highlight ? 'text-red-700' : 'text-blue-900'}`}>
                    {loading ? '...' : (count?.toLocaleString() || 0)}
                </span>
                {percent && !loading && <span className={`text-sm font-bold ${highlight ? 'text-red-500' : 'text-blue-500'}`}>({percent})</span>}
            </div>
        </div>
    );
};

const TreeCard = ({ title, count, total, color = "bg-white", borderColor = "border-gray-200", textColor = "text-gray-800", onClick, loading }) => {
    const percent = total > 0 ? ((count / total) * 100).toFixed(2) + '%' : '';
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-2xl border-2 ${borderColor} ${color} shadow-sm text-center w-full min-w-[120px] z-20 relative
            transition-all ${loading ? 'opacity-70 cursor-wait' : 'hover:shadow-md hover:-translate-y-1 cursor-pointer'}`}
        >
            <div className={`text-[10px] font-bold uppercase mb-2 ${textColor} opacity-80 tracking-wider`}>{title}</div>
            <div className="flex flex-col items-center">
                <div className={`text-2xl font-black ${textColor} leading-tight`}>
                    {loading ? '...' : (count?.toLocaleString() || 0)}
                </div>
                {percent && !loading && <div className={`text-sm font-bold ${textColor} opacity-90 mt-1`}>{percent}</div>}
            </div>
        </div>
    );
};

// =================================================================================
// 2. MAIN COMPONENT
// =================================================================================

export default function FlowProcessHSI() {

    // --- STATE INITIALIZATION ---
    // Default 1 Jan 2025
    const [startDate, setStartDate] = useState(new Date('2025-01-01'));
    const [endDate, setEndDate] = useState(new Date());

    const [selectedWitels, setSelectedWitels] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);

    // ACTIVE STATE
    const [activeCategory, setActiveCategory] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    // Data states
    const [flowStats, setFlowStats] = useState({
        re: 0, valid_re: 0, valid_wo: 0, valid_pi: 0, ps_count: 0,
        ogp_verif: 0, cancel_qc1: 0, cancel_fcc: 0, cancel_wo: 0, unsc: 0,
        ogp_survey_count: 0, cancel_instalasi: 0, fallout: 0, revoke_count: 0,
        ogp_provi: 0, ps_re_denominator: 0, ps_pi_denominator: 0,
        followup_completed: 0, revoke_completed: 0, revoke_order: 0,
        ps_revoke: 0, ogp_provi_revoke: 0, fallout_revoke: 0,
        cancel_revoke: 0, lain_lain_revoke: 0, comply_count: 0
    });
    const [detailData, setDetailData] = useState({ data: [], meta: {} });
    const [branchMap, setBranchMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    // --- OPTIONS ---
    const witels = ['JATIM TIMUR', 'JATIM BARAT', 'BALI', 'NUSA TENGGARA', 'SURAMADU'];

    // --- LOGIC BRANCH DINAMIS ---
    const branchOptions = useMemo(() => {
        if (!branchMap || Object.keys(branchMap).length === 0) return [];
        if (selectedWitels.length === 0) return Object.values(branchMap).flat();
        return selectedWitels.flatMap(witel => branchMap[witel] || []);
    }, [selectedWitels, branchMap]);

    // Reset branch jika witel berubah
    useEffect(() => {
        if (selectedBranches.length > 0) {
            const validBranches = selectedBranches.filter(b => branchOptions.includes(b));
            if (validBranches.length !== selectedBranches.length) {
                setSelectedBranches(validBranches);
            }
        }
    }, [selectedWitels, branchOptions, selectedBranches]);

    // Set Title
    useEffect(() => {
        document.title = "Flow Process HSI";
    }, []);

    // --- FETCH DATA ---
    const loadStats = async () => {
        setLoading(true);
        try {
            const params = {
                startDate: startDate ? startDate.toISOString() : undefined,
                endDate: endDate ? endDate.toISOString() : undefined,
                witel: selectedWitels.join(','),
                branch: selectedBranches.join(',')
            };
            const response = await api.get('/dashboard/hsi/flow', { params });
            if (response.data.data) {
                setFlowStats(prev => ({ ...prev, ...response.data.data }));
                if (response.data.data.branchMap) {
                    setBranchMap(response.data.data.branchMap);
                }
            }
        } catch (error) {
            console.error("Error loading flow stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDetail = async (category, page = 1) => {
        setDetailLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                startDate: startDate ? startDate.toISOString() : undefined,
                endDate: endDate ? endDate.toISOString() : undefined,
                witel: selectedWitels.join(','),
                branch: selectedBranches.join(','),
                detail_category: category
            };
            const response = await api.get('/dashboard/hsi/flow/detail', { params });
            if (response.data.data) {
                setDetailData({
                    data: response.data.data.table,
                    meta: response.data.data.pagination
                });
            }
        } catch (error) {
            console.error("Error loading detail:", error);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        // eslint-disable-next-line
    }, [startDate, endDate, selectedWitels, selectedBranches]);

    const handleCardClick = (categoryName) => {
        setActiveCategory(categoryName);
        // setActiveSection(section);
        setCurrentPage(1);
        loadDetail(categoryName, 1);

        // Scroll ke section yang relevan
        setTimeout(() => {
            const elementId = 'detail-section-main'; // Defaulting to main since section is unknown
            document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (activeCategory) {
            loadDetail(activeCategory, newPage);
        }
    };

    const handleExportDetail = async () => {
        if (!activeCategory) return;
        document.body.style.cursor = 'wait';
        try {
            const params = {
                startDate: startDate ? startDate.toISOString() : undefined,
                endDate: endDate ? endDate.toISOString() : undefined,
                witel: selectedWitels.join(','),
                branch: selectedBranches.join(','),
                detail_category: activeCategory,
                export_detail: 'true'
            };
            const response = await api.get('/dashboard/hsi/flow/detail', {
                params,
                responseType: 'blob'
            });

            if (response.data.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        alert("Gagal Export: " + (errorData.message || "Terjadi kesalahan di server"));
                    } catch (e) {
                        alert("Gagal Export: Terjadi kesalahan parsing error.");
                    }
                };
                reader.readAsText(response.data);
                return;
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `Detail_HSI_${activeCategory.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengunduh file report.");
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const psRePercent = flowStats?.ps_re_denominator > 0
        ? ((flowStats.ps_count / flowStats.ps_re_denominator) * 100).toFixed(2)
        : '0.00';
    const psPiPercent = flowStats?.ps_pi_denominator > 0
        ? ((flowStats.ps_count / flowStats.ps_pi_denominator) * 100).toFixed(2)
        : '0.00';
    const complyCount = flowStats?.comply_count || 0;
    const complyDenominator = flowStats?.ps_count || 1;
    const complyPercent = flowStats?.ps_count > 0
        ? ((complyCount / complyDenominator) * 100).toFixed(2)
        : '0.00';

    return (
        <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">

            {/* HEADER TITLE */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Data Pengawalan PSB HSI</h1>
                    <p className="text-gray-500 text-sm">Flow Process Analysis & Fallout Management</p>
                </div>
                <button
                    onClick={loadStats}
                    className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    title="Refresh Data"
                >
                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* FILTER SECTION */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1">Start Date</label>
                        <div className="relative z-40">
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} className="w-full md:w-40 text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" dateFormat="dd/MM/yyyy" />
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1">End Date</label>
                        <div className="relative z-40">
                            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} className="w-full md:w-40 text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" dateFormat="dd/MM/yyyy" />
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-48">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1">Witel</label>
                        <DropdownCheckbox options={witels} selectedOptions={selectedWitels} onSelectionChange={setSelectedWitels} title="Semua Witel" />
                    </div>
                    <div className="flex flex-col w-full md:w-48">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1">Branch</label>
                        <DropdownCheckbox options={branchOptions} selectedOptions={selectedBranches} onSelectionChange={setSelectedBranches} title="Semua Branch" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setStartDate(null); setEndDate(null); setSelectedWitels([]); setSelectedBranches([]); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">Reset</button>
                    </div>
                </div>
            </div>

            {/* MAIN WRAPPER - FLOWCHART */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

                {/* FLOW CHEVRONS */}
                <div className="flex w-full mb-8 overflow-x-auto pb-4 no-scrollbar pl-2">
                    <HeaderStep title="OFFERING" stepNumber={0} />
                    <HeaderStep title="VERIFICATION & VALID" stepNumber={1} />
                    <HeaderStep title="FEASIBILITY" stepNumber={2} />
                    <HeaderStep title="INSTALASI & AKTIVASI" stepNumber={3} />
                    <HeaderStep title="PS" color="bg-green-600" isLast={true} stepNumber={4} />
                </div>

                {/* GRID DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* COLUMN 1: RE */}
                    <div className="space-y-3">
                        <MainCard title="RE" count={flowStats?.re} onClick={() => handleCardClick('RE')} loading={loading} />
                        <div className="min-h-[300px] border-2 border-transparent"></div>
                    </div>

                    {/* COLUMN 2: Valid RE + Fallout */}
                    <div className="space-y-3">
                        <MainCard title="Valid RE" count={flowStats?.valid_re} total={flowStats?.re} onClick={() => handleCardClick('Valid RE')} loading={loading} />
                        <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 min-h-[300px] flex flex-col gap-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Fallout Points</div>
                            <DetailCard title="OGP Verif & Valid" count={flowStats?.ogp_verif} totalForPercent={flowStats?.re} onClick={() => handleCardClick('OGP Verif & Valid')} loading={loading} />
                            <DetailCard title="Cancel QC 1" count={flowStats?.cancel_qc1} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel QC 1')} loading={loading} />
                            <DetailCard title="Cancel FCC" count={flowStats?.cancel_fcc} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel FCC')} loading={loading} />
                        </div>
                    </div>

                    {/* COLUMN 3: Valid WO + Process */}
                    <div className="space-y-3">
                        <MainCard title="Valid WO" count={flowStats?.valid_wo} total={flowStats?.re} onClick={() => handleCardClick('Valid WO')} loading={loading} />
                        <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 min-h-[300px] flex flex-col gap-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Process</div>
                            <DetailCard title="Cancel WO" count={flowStats?.cancel_wo} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel WO')} loading={loading} />
                            <DetailCard title="UNSC" count={flowStats?.unsc} totalForPercent={flowStats?.re} onClick={() => handleCardClick('UNSC')} loading={loading} />
                            <DetailCard title="OGP SURVEY" count={flowStats?.ogp_survey_count} totalForPercent={flowStats?.re} onClick={() => handleCardClick('OGP SURVEY')} loading={loading} />
                        </div>
                    </div>

                    {/* COLUMN 4: Valid PI + Technician */}
                    <div className="space-y-3">
                        <MainCard title="Valid PI" count={flowStats?.valid_pi} total={flowStats?.re} onClick={() => handleCardClick('Valid PI')} loading={loading} />
                        <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 min-h-[300px] flex flex-col gap-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Technician</div>
                            <DetailCard title="Cancel Instalasi" count={flowStats?.cancel_instalasi} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel Instalasi')} loading={loading} />
                            <DetailCard title="Fallout" count={flowStats?.fallout} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Fallout')} loading={loading} />
                            <DetailCard title="Revoke" count={flowStats?.revoke_count} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Revoke')} loading={loading} />
                        </div>
                    </div>

                    {/* COLUMN 5: PS + Provisioning + RATIO BOX */}
                    <div className="space-y-3">
                        <MainCard title="PS (COMPLETED)" count={flowStats?.ps_count} total={flowStats?.re} colorClass="bg-green-50 border-2 border-green-500" onClick={() => handleCardClick('PS (COMPLETED)')} loading={loading} />

                        <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col gap-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Provisioning</div>
                            <DetailCard title="OGP Provisioning" count={flowStats?.ogp_provi} totalForPercent={flowStats?.re} onClick={() => handleCardClick('OGP Provisioning')} loading={loading} />
                        </div>

                        {/* RATIO BOX */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 text-white shadow-lg flex flex-col justify-center mt-auto gap-3">
                            <div className="text-center">
                                <div className="text-[10px] md:text-xs font-medium text-blue-200 uppercase mb-1">Conversion PS/RE</div>
                                <div className="text-2xl md:text-3xl font-bold tracking-tight">{psRePercent}<span className="text-sm md:text-lg">%</span></div>
                            </div>
                            <div className="w-full bg-blue-500/30 h-px"></div>
                            <div className="text-center">
                                <div className="text-[10px] md:text-xs font-medium text-blue-200 uppercase mb-1">Conversion PS/PI</div>
                                <div className="text-2xl md:text-3xl font-bold tracking-tight">{psPiPercent}<span className="text-sm md:text-lg">%</span></div>
                            </div>
                            <div className="w-full bg-blue-500/30 h-px"></div>
                            <div className="text-center">
                                <div className="text-[10px] md:text-xs font-medium text-blue-200 uppercase mb-1">Comply</div>
                                <div className="text-2xl md:text-3xl font-bold tracking-tight text-green-300">
                                    {complyPercent}<span className="text-sm md:text-lg">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* WRAPPER SECTION 2: REVOKE FLOW CHART (TREE DIAGRAM) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="h-8 w-1 bg-red-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-800">Analisis Revoke & Fallout</h3>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[900px] flex flex-col items-center">
                        {/* LEVEL 1 */}
                        <div className="relative z-10 mb-16">
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gray-200"></div>
                            <div
                                className={`bg-red-50 border border-red-100 p-4 rounded-3xl text-center shadow-sm min-w-[200px] cursor-pointer hover:bg-red-100 transition-colors ${loading ? 'opacity-70' : ''}`}
                                onClick={() => handleCardClick('Total Revoke')}
                            >
                                <div className="text-xs font-bold text-red-600 uppercase mb-1 tracking-wider">Total Revoke</div>
                                <div className="text-3xl font-black text-red-900">{loading ? '...' : (flowStats?.revoke_count?.toLocaleString() || 0)}</div>
                            </div>
                        </div>
                        {/* LEVEL 2 */}
                        <div className="flex justify-center gap-10 w-full relative mb-12">
                            <div className="absolute -top-6 left-[20%] right-[20%] h-10 border-t-2 border-r-2 border-l-2 border-gray-200 rounded-t-3xl"></div>
                            <div className="flex flex-col items-center w-1/3 relative">
                                <TreeCard title="Follow Up Completed" count={flowStats?.followup_completed} total={flowStats?.revoke_count} borderColor="border-blue-200" textColor="text-blue-900" color="bg-blue-50" onClick={() => handleCardClick('Follow Up Completed')} loading={loading} />
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-200"></div>
                            </div>
                            <div className="flex flex-col items-center w-1/3 z-10">
                                <TreeCard title="Revoke Completed" count={flowStats?.revoke_completed} total={flowStats?.revoke_count} onClick={() => handleCardClick('Revoke Completed')} loading={loading} />
                            </div>
                            <div className="flex flex-col items-center w-1/3 z-10">
                                <TreeCard title="Revoke Order" count={flowStats?.revoke_order} total={flowStats?.revoke_count} onClick={() => handleCardClick('Revoke Order')} loading={loading} />
                            </div>
                        </div>
                        {/* LEVEL 3 */}
                        <div className="relative w-full flex justify-start pl-[5%] pr-[20%]">
                            <div className="w-full relative pt-6">
                                <div className="absolute top-0 border-t-2 border-l-2 border-r-2 border-gray-200 rounded-t-3xl h-6" style={{ left: 'calc(10% - 1.2rem)', right: 'calc(10% - 1.2rem)' }}></div>
                                <div className="grid grid-cols-5 gap-12">
                                    <div className="relative flex flex-col items-center">
                                        <TreeCard title="PS" count={flowStats?.ps_revoke} total={flowStats?.followup_completed} color="bg-green-50" borderColor="border-green-200" textColor="text-green-800" onClick={() => handleCardClick('PS Revoke')} loading={loading} />
                                    </div>
                                    <div className="relative flex flex-col items-center">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-200"></div>
                                        <TreeCard title="OGP Provi" count={flowStats?.ogp_provi_revoke} total={flowStats?.followup_completed} color="bg-yellow-50" borderColor="border-yellow-200" textColor="text-yellow-800" onClick={() => handleCardClick('OGP Provi Revoke')} loading={loading} />
                                    </div>
                                    <div className="relative flex flex-col items-center">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-200"></div>
                                        <TreeCard title="Fallout" count={flowStats?.fallout_revoke} total={flowStats?.followup_completed} color="bg-orange-50" borderColor="border-orange-200" textColor="text-orange-800" onClick={() => handleCardClick('Fallout Revoke')} loading={loading} />
                                    </div>
                                    <div className="relative flex flex-col items-center">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-200"></div>
                                        <TreeCard title="Cancel" count={flowStats?.cancel_revoke} total={flowStats?.followup_completed} color="bg-red-50" borderColor="border-red-200" textColor="text-red-800" onClick={() => handleCardClick('Cancel Revoke')} loading={loading} />
                                    </div>
                                    <div className="relative flex flex-col items-center">
                                        <TreeCard title="Lain-Lain" count={flowStats?.lain_lain_revoke} total={flowStats?.followup_completed} onClick={() => handleCardClick('Lain-Lain Revoke')} loading={loading} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAIL DATA TABLE SECTION (SHOW ONLY IF ACTIVE) */}
            {activeCategory && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 scroll-mt-20" id="detail-section">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Detail Data: <span className="text-blue-600">{activeCategory}</span></h3>
                                <p className="text-sm text-gray-500">Menampilkan daftar order untuk kategori terpilih.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleExportDetail}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 text-sm font-bold transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Export Excel
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-100 text-xs">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Tgl Order</th>
                                    <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Nama Customer</th>
                                    <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Witel</th>
                                    <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Layanan</th>
                                    <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Status Group</th>
                                    <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Resume Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {detailLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">Loading data...</td>
                                    </tr>
                                ) : detailData && detailData.data && detailData.data.length > 0 ? (
                                    detailData.data.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{item.order_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.order_date ? new Date(item.order_date).toLocaleDateString() : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{item.customer_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.witel}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.type_layanan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                                    item.kelompok_status === 'PS' ? 'bg-green-100 text-green-800' :
                                                    (item.kelompok_status && item.kelompok_status.includes('CANCEL')) ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.kelompok_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate" title={item.status_resume}>
                                                {item.status_resume}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500 italic">Tidak ada data detail untuk kategori ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {detailData && detailData.meta && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between text-sm text-gray-500">
                                <div>
                                    <p>
                                        Showing <span className="font-medium">{(detailData.meta.page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(detailData.meta.page * 10, detailData.meta.total)}</span> of <span className="font-medium">{detailData.meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                            Page {currentPage} of {detailData.meta.totalPages || 1}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === (detailData.meta.totalPages || 1)}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
