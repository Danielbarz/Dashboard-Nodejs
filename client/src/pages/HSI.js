import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import api from '../services/api';
import HsiMap from '../components/HsiMap';
import DropdownCheckbox from '../components/DropdownCheckbox';
import KPICard from '../components/KPICard';
import SkeletonLoader from '../components/SkeletonLoader';
import { FiRefreshCw, FiSearch, FiDollarSign, FiActivity, FiShoppingCart, FiCheckCircle, FiChevronDown } from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function DashboardHSI() {
    // --- 1. STATE INITIALIZATION ---
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);

    const [selectedWitels, setSelectedWitels] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedMapStatus, setSelectedMapStatus] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // DATA STATE
    const [stats, setStats] = useState({ total: 0, completed: 0, open: 0 });
    const [chartData, setChartData] = useState({});
    const [mapData, setMapData] = useState([]);
    const [tableData, setTableData] = useState({ data: [], meta: {} });
    const [branchMap, setBranchMap] = useState({});

    // OPTIONS
    const witels = ['JATIM TIMUR', 'JATIM BARAT', 'BALI', 'NUSA TENGGARA', 'SURAMADU'];
    const mapStatusOptions = ['Completed', 'Open', 'Cancel', 'ODP JAUH', 'ODP FULL', 'DOUBLE INPUT', 'BATAL', 'TIDAK ADA ODP', 'PENDING'];

    // DYNAMIC BRANCH OPTIONS
    const branchOptions = useMemo(() => {
        if (!branchMap || Object.keys(branchMap).length === 0) return [];
        if (selectedWitels.length === 0) return Object.values(branchMap).flat();
        return selectedWitels.flatMap(w => branchMap[w] || []);
    }, [selectedWitels, branchMap]);

    // FILTER CHART KEYS FOR STACKED BAR
    const chart6Keys = useMemo(() => {
        if (!chartData.chart6Data) return [];
        const keys = new Set();
        chartData.chart6Data.forEach(item => Object.keys(item).forEach(k => { if(k !== 'name' && k !== 'total') keys.add(k) }));
        return Array.from(keys);
    }, [chartData.chart6Data]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage, limit: 10, search: searchQuery,
                start_date: startDate,
                end_date: endDate,
                global_witel: selectedWitels.join(','),
                global_branch: selectedBranches.join(','),
                map_status: selectedMapStatus.join(',')
            };
            const response = await api.get('/dashboard/hsi/dashboard', { params });
            const result = response.data.data;
            if (result) {
                setStats(result.stats);
                setMapData(result.mapData);
                setChartData({
                    chart1: result.chart1, chart2: result.chart2, chart3: result.chart3,
                    chart4: result.chart4, chart5Data: result.chart5Data, chart6Data: result.chart6Data,
                    chartTrend: result.chartTrend
                });
                setBranchMap(result.branchMap);
                setTableData({ data: result.tableData, meta: result.pagination });
            }
        } catch (error) { console.error("Error:", error); }
        finally { setLoading(false); }
    };

    const handleSearch = (e) => { if (e.key === 'Enter') { setCurrentPage(1); fetchData(); } };
    
    const resetFilter = () => {
        setStartDate('2025-01-01');
        setEndDate(new Date().toISOString().split('T')[0]);
        setSelectedWitels([]);
        setSelectedBranches([]);
        setSelectedMapStatus([]);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const dimensionLabel = selectedBranches.length > 0 || selectedWitels.length > 0 ? 'Distrik (Branch)' : 'Regional (Witel)';
    const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

    return (
            <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard HSI</h1>
                        <p className="text-gray-500 text-sm">Monitoring Order & Progress HSI</p>
                    </div>
                    <button onClick={fetchData} className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors" title="Refresh Data">
                        <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* FILTER */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-0 z-10 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Date Picker */}
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

                        {/* Witel */}
                        <div className="flex flex-col w-full md:w-48">
                            <DropdownCheckbox title="Semua Witel" options={witels} selectedOptions={selectedWitels} onSelectionChange={setSelectedWitels} />
                        </div>
                        {/* Branch */}
                        <div className="flex flex-col w-full md:w-48">
                            <DropdownCheckbox title="Semua Branch" options={branchOptions} selectedOptions={selectedBranches} onSelectionChange={setSelectedBranches} />
                        </div>

                        <button onClick={resetFilter} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold uppercase hover:bg-gray-200 h-10">Reset</button>
                    </div>
                </div>

                {/* KPI CARDS (Standardized 4 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <SkeletonLoader count={4} />
                    ) : (
                        <>
                            <KPICard title="TOTAL ORDER" value={stats.total.toLocaleString()} icon={<FiShoppingCart />} color="blue" />
                            <KPICard title="COMPLETED (PS)" value={stats.completed.toLocaleString()} icon={<FiCheckCircle />} color="green" />
                            <KPICard title="OPEN (PROGRESS)" value={stats.open.toLocaleString()} icon={<FiActivity />} color="orange" />
                            <KPICard title="COMPLETION RATE" value={`${completionRate}%`} icon={<FiCheckCircle />} color="blue" />
                        </>
                    )}
                </div>

                {/* SECTION 2: CHARTS */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3">Order Statistics</h2>
                    
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {loading ? (
                            <>
                                <SkeletonLoader type="chart" />
                                <SkeletonLoader type="chart" />
                            </>
                        ) : (
                            <>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                                    <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Total Order per {dimensionLabel}</h3>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={chartData.chart1} dataKey="value" nameKey="product" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label isAnimationActive={false}>
                                                    {chartData.chart1?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                                    <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Komposisi Status</h3>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={chartData.chart2} dataKey="value" nameKey="product" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label isAnimationActive={false}>
                                                    {chartData.chart2?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Row 2: Performance */}
                    <h2 className="text-lg font-bold text-gray-800 border-l-4 border-purple-600 pl-3 mt-8">Performance & Fallout</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {loading ? (
                            <>
                                <SkeletonLoader type="chart" />
                                <SkeletonLoader type="chart" />
                            </>
                        ) : (
                            <>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                                    <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Sebaran PS per {dimensionLabel}</h3>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData.chart4}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="product" fontSize={10} />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#82ca9d" name="PS" isAnimationActive={false} radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                                    <h3 className="text-lg font-bold mb-4 text-gray-800">Trend Penjualan Harian</h3>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData.chartTrend}>
                                                <defs>
                                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient>
                                                    <linearGradient id="colorPS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" /><YAxis /><CartesianGrid strokeDasharray="3 3" /><Tooltip /><Legend />
                                                <Area type="monotone" dataKey="total" stroke="#8884d8" fill="url(#colorTotal)" name="Total Order" isAnimationActive={false} />
                                                <Area type="monotone" dataKey="ps" stroke="#82ca9d" fill="url(#colorPS)" name="Completed (PS)" isAnimationActive={false} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Row 3: Cancel Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {loading ? (
                            <>
                                <SkeletonLoader type="chart" />
                                <SkeletonLoader type="chart" />
                            </>
                        ) : (
                            <>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                                    <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">CANCEL BY FCC</h3>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData.chart5Data}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" fontSize={10} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                {chartData.chart5Data && Object.keys(chartData.chart5Data[0] || {}).filter(k=>k!=='name').map((key, idx) => (
                                                    <Bar key={key} dataKey={key} stackId="a" fill={COLORS[idx % COLORS.length]} isAnimationActive={false} />
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
                                    <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">CANCEL NON-FCC</h3>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData.chart6Data}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" fontSize={10} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                {chart6Keys.map((key, idx) => (
                                                    <Bar key={key} dataKey={key} stackId="a" fill={COLORS[(idx + 3) % COLORS.length]} isAnimationActive={false} />
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* MAP SECTION */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col relative z-0 mt-8">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Peta Sebaran Order HSI</h3>
                        <div className="w-64 z-[1002]">
                            <DropdownCheckbox title="Semua Status" options={mapStatusOptions} selectedOptions={selectedMapStatus} onSelectionChange={setSelectedMapStatus} />
                        </div>
                    </div>
                    <div className="flex-1 w-full relative z-0 rounded-xl overflow-hidden border border-gray-200">
                        {loading ? (
                            <SkeletonLoader type="chart" className="h-full border-0 shadow-none" />
                        ) : mapData && mapData.length > 0 ? (
                            <HsiMap data={mapData} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">Data koordinat tidak tersedia / Filter kosong.</div>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
                    {loading ? (
                        <SkeletonLoader type="table" />
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                <h3 className="text-lg font-bold text-gray-800">Data Preview</h3>
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Cari Order ID / Nama..."
                                        value={searchQuery}
                                        onChange={(e)=>setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-100 text-xs">
                                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                                        <tr>{['Order ID', 'Date', 'Customer', 'Witel', 'STO', 'Layanan', 'Status', 'Detail'].map(h => <th key={h} className="px-6 py-3 text-left">{h}</th>)}</tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {tableData.data.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-3 text-blue-600 font-medium">{row.order_id}</td>
                                                <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{row.order_date ? new Date(row.order_date).toLocaleDateString() : '-'}</td>
                                                <td className="px-6 py-3 font-bold text-gray-700">{row.customer_name}</td>
                                                <td className="px-6 py-3">{row.witel}</td>
                                                <td className="px-6 py-3">{row.sto}</td>
                                                <td className="px-6 py-3">{row.type_layanan}</td>
                                                <td className="px-6 py-3"><span className={`px-2 py-1 rounded-md text-[10px] font-bold text-white ${row.kelompok_status === 'PS' ? 'bg-green-500' : 'bg-amber-500'}`}>{row.kelompok_status}</span></td>
                                                <td className="px-6 py-3 truncate max-w-xs text-gray-500" title={row.status_resume}>{row.status_resume}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors">Prev</button>
                                <span>Page <b>{currentPage}</b> of <b>{tableData.meta?.totalPages || 1}</b></span>
                                <button onClick={() => setCurrentPage(p => Math.min(tableData.meta?.totalPages || 1, p + 1))} disabled={currentPage === (tableData.meta?.totalPages || 1)} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors">Next</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
    );
}
