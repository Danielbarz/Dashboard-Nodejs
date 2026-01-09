import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '../services/api';
import HsiMap from '../components/HsiMap';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// --- KOMPONEN DROPDOWN ---
const MultiSelectDropdown = ({ options, selected, onChange, placeholder, isMapControl = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value) => {
        const newSelected = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
        onChange(newSelected);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer flex justify-between items-center text-sm shadow-sm" onClick={() => setIsOpen(!isOpen)}>
                <span className="truncate text-gray-700 select-none">{selected.length > 0 ? `${selected.length} Dipilih` : placeholder}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {isOpen && (
                <div className={`absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${isMapControl ? 'z-[1001]' : 'z-50'}`}>
                    {options.map((option) => (
                        <div key={option} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => toggleOption(option)}>
                            <input type="checkbox" checked={selected.includes(option)} readOnly className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded pointer-events-none" />
                            <span className="text-sm text-gray-700 select-none">{option || 'Null'}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function DashboardHSI() {
    // STATE
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
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

    // OPTIONS (Fixed Filter Witel)
    const witels = ['JATIM TIMUR', 'JATIM BARAT', 'BALI', 'NUSA TENGGARA', 'SURAMADU'];
    const mapStatusOptions = ['Completed', 'Open', 'Cancel', 'ODP JAUH', 'ODP FULL', 'DOUBLE INPUT', 'BATAL', 'TIDAK ADA ODP', 'PENDING'];

    // DYNAMIC BRANCH OPTIONS
    const branchOptions = useMemo(() => {
        if (!branchMap || Object.keys(branchMap).length === 0) return [];
        if (selectedWitels.length === 0) return Object.values(branchMap).flat();
        return selectedWitels.flatMap(w => branchMap[w] || []);
    }, [selectedWitels, branchMap]);

    // FILTER CHART KEYS
    const chart6Keys = useMemo(() => {
        if (!chartData.chart6Data) return [];
        const keys = new Set();
        chartData.chart6Data.forEach(item => Object.keys(item).forEach(k => { if(k !== 'name') keys.add(k) }));
        return Array.from(keys);
    }, [chartData.chart6Data]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage, limit: 10, search: searchQuery,
                start_date: startDate ? startDate.toISOString() : undefined,
                end_date: endDate ? endDate.toISOString() : undefined,
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

    useEffect(() => { fetchData(); }, [startDate, endDate, selectedWitels, selectedBranches, selectedMapStatus, currentPage]);

    const handleSearch = (e) => { if (e.key === 'Enter') { setCurrentPage(1); fetchData(); } };
    const resetFilter = () => { setDateRange([null, null]); setSelectedWitels([]); setSelectedBranches([]); setSelectedMapStatus([]); setSearchQuery(''); setCurrentPage(1); };
    const dimensionLabel = selectedBranches.length > 0 || selectedWitels.length > 0 ? 'Distrik (Branch)' : 'Regional (Witel)';

    return (
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* FILTER */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="relative z-50"><label className="block text-sm font-bold text-gray-700 mb-2">Periode</label><DatePicker selectsRange startDate={startDate} endDate={endDate} onChange={(u) => setDateRange(u)} isClearable placeholderText="Pilih Rentang" className="w-full border-gray-300 rounded-md text-sm p-2" /></div>
                            <div className="relative z-40"><label className="block text-sm font-bold text-gray-700 mb-2">Witel</label><MultiSelectDropdown options={witels} selected={selectedWitels} onChange={setSelectedWitels} placeholder="Semua Witel" /></div>
                            <div className="relative z-40"><label className="block text-sm font-bold text-gray-700 mb-2">Branch</label><MultiSelectDropdown options={branchOptions} selected={selectedBranches} onChange={setSelectedBranches} placeholder="Semua Branch" /></div>
                            <div className="flex gap-2"><button onClick={fetchData} className="bg-blue-600 text-white w-full py-2 rounded shadow hover:bg-blue-700">Terapkan</button><button onClick={resetFilter} className="bg-gray-100 text-gray-700 w-full py-2 rounded shadow hover:bg-gray-200">Reset</button></div>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600"><p className="text-gray-500 text-xs font-bold uppercase">Total Order</p><p className="text-2xl font-bold">{stats.total.toLocaleString()}</p></div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500"><p className="text-green-600 text-xs font-bold uppercase">Completed / PS</p><p className="text-2xl font-bold text-green-700">{stats.completed.toLocaleString()}</p></div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500"><p className="text-yellow-600 text-xs font-bold uppercase">Open / Progress</p><p className="text-2xl font-bold text-yellow-700">{stats.open.toLocaleString()}</p></div>
                    </div>

                    {/* CHART ROW 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow border h-96 flex flex-col">
                            <h3 className="text-md font-bold mb-4 text-center">Total Order per {dimensionLabel}</h3>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={chartData.chart1} 
                                            dataKey="value" 
                                            nameKey="product" 
                                            cx="50%" cy="50%" 
                                            outerRadius={80} 
                                            fill="#8884d8" 
                                            label 
                                            isAnimationActive={false} // MATIKAN ANIMASI (Fix Double)
                                        >
                                            {chartData.chart1?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border h-96 flex flex-col">
                            <h3 className="text-md font-bold mb-4 text-center">Sebaran PS per {dimensionLabel}</h3>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData.chart4}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="product" fontSize={10} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#82ca9d" name="PS" isAnimationActive={false} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* CHART ROW 2: CANCEL */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow border h-96 flex flex-col">
                            <h3 className="text-md font-bold mb-4 text-center">CANCEL BY FCC</h3>
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
                        <div className="bg-white p-4 rounded-lg shadow border h-96 flex flex-col">
                            <h3 className="text-md font-bold mb-4 text-center">CANCEL NON-FCC</h3>
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
                    </div>

                    {/* CHART ROW 3: STATUS & LAYANAN (DITAMBAHKAN AGAR SESUAI PERMINTAAN "SEMUANYA KELUAR") */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow border h-96 flex flex-col">
                            <h3 className="text-md font-bold mb-4 text-center">Komposisi Status</h3>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={chartData.chart2} 
                                            dataKey="value" 
                                            nameKey="product" 
                                            cx="50%" cy="50%" 
                                            outerRadius={80} 
                                            fill="#8884d8" 
                                            label 
                                            isAnimationActive={false} 
                                        >
                                            {chartData.chart2?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border h-96 flex flex-col">
                            <h3 className="text-md font-bold mb-4 text-center">Tren Jenis Layanan</h3>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={chartData.chart3} margin={{left: 40}}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="sub_type" type="category" width={100} fontSize={10} />
                                        <Tooltip />
                                        <Bar dataKey="total_amount" fill="#ffc658" name="Jumlah" isAnimationActive={false} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* TREND CHART */}
                    <div className="bg-white p-6 rounded-lg shadow border h-96 flex flex-col">
                        <h3 className="text-lg font-bold mb-4">Trend Penjualan Harian</h3>
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

                    {/* MAP SECTION - FIXED */}
                    <div className="bg-white p-4 rounded-lg shadow border h-[500px] flex flex-col relative z-0">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-md font-bold">Peta Sebaran Order HSI</h3>
                            <div className="w-48 z-[1002]"><MultiSelectDropdown options={mapStatusOptions} selected={selectedMapStatus} onChange={setSelectedMapStatus} placeholder="Semua Status" isMapControl={true} /></div>
                        </div>
                        <div className="flex-1 w-full relative z-0">
                            {mapData && mapData.length > 0 ? (
                                <HsiMap data={mapData} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 border border-dashed rounded">Data koordinat tidak tersedia / Filter kosong.</div>
                            )}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white p-6 rounded-lg shadow border mt-8">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Data Preview</h3><input type="text" className="border rounded p-2 text-sm" placeholder="Cari..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} onKeyDown={handleSearch} /></div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50"><tr>{['Order ID', 'Date', 'Customer', 'Witel', 'STO', 'Layanan', 'Status', 'Detail'].map(h => <th key={h} className="px-6 py-3 text-left font-bold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tableData.data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-blue-600 font-medium">{row.order_id}</td>
                                            <td className="px-6 py-4 text-gray-500">{row.order_date ? new Date(row.order_date).toLocaleDateString() : '-'}</td>
                                            <td className="px-6 py-4 font-bold">{row.customer_name}</td>
                                            <td className="px-6 py-4">{row.witel}</td>
                                            <td className="px-6 py-4">{row.sto}</td>
                                            <td className="px-6 py-4">{row.type_layanan}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs text-white ${row.kelompok_status === 'PS' ? 'bg-green-500' : 'bg-yellow-500'}`}>{row.kelompok_status}</span></td>
                                            <td className="px-6 py-4 truncate max-w-xs" title={row.status_resume}>{row.status_resume}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded disabled:opacity-50">Prev</button>
                            <span>Page {currentPage} of {tableData.meta?.totalPages || 1}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(tableData.meta?.totalPages || 1, p + 1))} disabled={currentPage === (tableData.meta?.totalPages || 1)} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}