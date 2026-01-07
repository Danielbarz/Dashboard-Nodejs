import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Radar, Pie, Doughnut } from 'react-chartjs-2';
import { useSearchParams } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler
);

const formatRupiah = (value) => {
  if (value === null || value === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const DashboardDigitalProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // -- State --
  const [data, setData] = useState({
    charts: {
      revenueByWitel: [],
      amountByWitel: [],
      productBySegment: [],
      productByChannel: [],
      productShare: [],
      isSingleWitel: false
    },
    table: {
      rows: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
    }
  });

  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    witels: [],
    branches: []
  });

  // Local Filter State
  const [filters, setFilters] = useState(() => {
    // Default to last 3 months to ensure data visibility (Data ends Dec 2025)
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - 3);
    startDate.setDate(1);

    // Adjust to local timezone string YYYY-MM-DD
    const formatDate = (d) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    };

    return {
        startDate: searchParams.get('startDate') || formatDate(startDate),
        endDate: searchParams.get('endDate') || formatDate(today),
        witels: searchParams.getAll('witels') || [],
        products: searchParams.getAll('products') || [],
        subTypes: searchParams.getAll('subTypes') || [],
        branches: searchParams.getAll('branches') || []
    };
  });

  // Table State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // -- Fetch Options (Witels, Branches) --
  useEffect(() => {
    fetchFilterOptions();
  }, [filters.witels]); // Refetch branches when Witel changes

  const fetchFilterOptions = async () => {
    try {
      const params = {};
      if (filters.witels.length > 0) params.witel = filters.witels;

      const res = await api.get('/dashboard/digital-product/filters', { params });
      if (res.data.success) {
        setFilterOptions(prev => ({
          ...prev,
          witels: res.data.data.witels, // Allow keeping witels if already loaded? or just update
          branches: res.data.data.branches
        }));
      }
    } catch (err) {
      console.error('Failed to fetch options', err);
    }
  };

  // -- Fetch Dashboard Data --
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: 10,
        search
      };

      const res = await api.get('/dashboard/digital-product', { params });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on Apply or Page/Search change
  useEffect(() => {
    fetchData();
  }, [page, search]); // Re-fetch on table interaction

  const handleApplyFilter = () => {
    setPage(1); // Reset to page 1
    fetchData();
  };

  // -- Handlers --
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelectChange = (key, value, checked) => {
    setFilters(prev => {
      const current = prev[key];
      if (checked) return { ...prev, [key]: [...current, value] };
      return { ...prev, [key]: current.filter(item => item !== value) };
    });
  };

  // -- Chart Config Helper --
  const getChartColors = (opacity = 1) => ({
    Netmonk: `rgba(54, 162, 235, ${opacity})`,
    OCA: `rgba(255, 99, 132, ${opacity})`,
    Antares: `rgba(255, 206, 86, ${opacity})`,
    Pijar: `rgba(75, 192, 192, ${opacity})`,
    Unknown: `rgba(201, 203, 207, ${opacity})`
  });

  // Prepare Chart Data
  const chartConfigs = useMemo(() => {
    if (!data.charts) return {};
    const colors = getChartColors(0.8);
    const borderColors = getChartColors(1);

    // Common logic for Stacked Bar (Rev & Amount)
    const processStacked = (items, valueKey, labelKey = 'group_name') => {
      // Get unique labels (X-Axis)
      const labels = [...new Set(items.map(i => i[labelKey]))];
      // Get unique products
      const products = ['Netmonk', 'OCA', 'Antares', 'Pijar'];

      const datasets = products.map(prod => ({
        label: prod,
        data: labels.map(lbl => {
          const found = items.find(i => i[labelKey] === lbl && i.product_category === prod);
          return found ? Number(found[valueKey]) : 0;
        }),
        backgroundColor: colors[prod] || colors.Unknown,
        borderColor: borderColors[prod] || borderColors.Unknown,
        borderWidth: 1
      }));

      return { labels, datasets };
    };

    return {
      revenue: processStacked(data.charts.revenueByWitel, 'total_revenue'),
      amount: processStacked(data.charts.amountByWitel, 'total_order'),
      segment: processStacked(data.charts.productBySegment, 'total_order', 'segment'),
      channel: (() => {
         const items = data.charts.productByChannel || [];
         const labels = [...new Set(items.map(i => i.channel_group))];
         const products = ['Netmonk', 'OCA', 'Antares', 'Pijar'];
         return {
            labels,
            datasets: products.map(prod => ({
                label: prod,
                data: labels.map(l => {
                    const f = items.find(i => i.channel_group === l && i.product_category === prod);
                    return f ? Number(f.total_order) : 0;
                }),
                fill: true,
                backgroundColor: colors[prod],
                borderColor: borderColors[prod],
            }))
         };
      })(),
      share: (() => {
          const items = data.charts.productShare || [];
          return {
              labels: items.map(i => i.product_category),
              datasets: [{
                  data: items.map(i => Number(i.total_order)),
                  backgroundColor: items.map(i => colors[i.product_category] || colors.Unknown),
                  borderColor: '#ffffff',
                  borderWidth: 2
              }]
          };
      })()
    };
  }, [data.charts]);


  return (
    <AppLayout title="Dashboard Digital Product">
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* Dates */}
            <div className="flex flex-col space-y-2">
               <label className="text-sm font-medium text-gray-600">Start Date</label>
               <input type="date" className="border rounded p-2"
                      value={filters.startDate}
                      onChange={e => handleFilterChange('startDate', e.target.value)} />
            </div>
            <div className="flex flex-col space-y-2">
               <label className="text-sm font-medium text-gray-600">End Date</label>
               <input type="date" className="border rounded p-2"
                      value={filters.endDate}
                      onChange={e => handleFilterChange('endDate', e.target.value)} />
            </div>

            {/* Products */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">Products</label>
                <div className="flex flex-wrap gap-2">
                    {['Netmonk', 'OCA', 'Antares', 'Pijar'].map(p => (
                        <label key={p} className="inline-flex items-center space-x-1 text-sm bg-gray-100 px-2 py-1 rounded">
                            <input type="checkbox"
                                checked={filters.products.includes(p)}
                                onChange={e => handleMultiSelectChange('products', p, e.target.checked)}
                            />
                            <span>{p}</span>
                        </label>
                    ))}
                </div>
            </div>

             {/* Sub Types */}
             <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">Sub Types</label>
                <div className="flex flex-wrap gap-2">
                    {['AO', 'MO', 'SO', 'DO', 'RO'].map(t => (
                        <label key={t} className="inline-flex items-center space-x-1 text-sm bg-gray-100 px-2 py-1 rounded">
                            <input type="checkbox"
                                checked={filters.subTypes.includes(t)}
                                onChange={e => handleMultiSelectChange('subTypes', t, e.target.checked)}
                            />
                            <span>{t}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Witels MultiSelect (Native/Simple) */}
             <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Witels</label>
                <select multiple className="border rounded p-2 h-24 text-sm"
                    value={filters.witels}
                    onChange={e => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        handleFilterChange('witels', selected);
                    }}
                >
                    {filterOptions.witels.map(w => (
                        <option key={w} value={w}>{w}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-400">Hold Ctrl to select multiple</p>
            </div>

            {/* Branches MultiSelect */}
            <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Branches (Telda)</label>
                <select multiple className="border rounded p-2 h-24 text-sm"
                    value={filters.branches}
                    onChange={e => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        handleFilterChange('branches', selected);
                    }}
                >
                    {filterOptions.branches.map(b => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>
            </div>

          </div>
          <div className="mt-4 flex justify-end">
               <button
                  onClick={handleApplyFilter}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                  disabled={loading}
               >
                   {loading ? 'Loading...' : 'Apply Filters'}
               </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Witel */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold mb-4">Revenue by {data.charts.isSingleWitel ? 'Branch' : 'Witel'}</h3>
                <Bar data={chartConfigs.revenue} options={{
                    responsive: true,
                    scales: { x: { stacked: true }, y: { stacked: true } },
                    plugins: { tooltip: { callbacks: { label: (ctx) => formatRupiah(ctx.raw) } } }
                }} />
            </div>

            {/* Amount by Witel */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold mb-4">Amount by {data.charts.isSingleWitel ? 'Branch' : 'Witel'}</h3>
                <Bar data={chartConfigs.amount} options={{
                    responsive: true,
                    scales: { x: { stacked: true }, y: { stacked: true } }
                }} />
            </div>

             {/* Product by Segment */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold mb-4">Product by Segment</h3>
                <Bar data={chartConfigs.segment} options={{
                    responsive: true,
                    scales: { x: { stacked: true }, y: { stacked: true } }
                }} />
            </div>

            {/* Product by Channel */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold mb-4">Product by Channel</h3>
                <Radar data={chartConfigs.channel} options={{
                    responsive: true,
                    elements: { line: { borderWidth: 3 } }
                }} />
                {/* Fallback to Bar if Radar is messy? Radar requested. */}
            </div>

            {/* Product Share */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="text-md font-bold mb-4 w-full text-left">Product Share</h3>
                <div className="w-64 h-64">
                    <Pie data={chartConfigs.share} />
                </div>
            </div>
        </div>

        {/* Detail Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Data Preview</h3>
                <div className="flex space-x-2">
                    <input type="text" placeholder="Search order, customer..."
                        className="border rounded px-3 py-1 text-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-3 border-b">Order ID</th>
                            <th className="p-3 border-b">Date</th>
                            <th className="p-3 border-b">Customer</th>
                            <th className="p-3 border-b">Product</th>
                            <th className="p-3 border-b">Type</th>
                            <th className="p-3 border-b">Revenue</th>
                            <th className="p-3 border-b">Witel</th>
                            <th className="p-3 border-b">Branch</th>
                            <th className="p-3 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.table.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-3 border-b font-mono text-xs">{row.order_id}</td>
                                <td className="p-3 border-b">{row.order_date ? new Date(row.order_date).toLocaleDateString('id-ID') : '-'}</td>
                                <td className="p-3 border-b">{row.customer_name}</td>
                                <td className="p-3 border-b">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        row.product_category === 'Netmonk' ? 'bg-blue-100 text-blue-800' :
                                        row.product_category === 'OCA' ? 'bg-pink-100 text-pink-800' :
                                        row.product_category === 'Antares' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-teal-100 text-teal-800'
                                    }`}>{row.product_category}</span>
                                </td>
                                <td className="p-3 border-b">{row.subtype_category}</td>
                                <td className="p-3 border-b text-right">{formatRupiah(row.net_price)}</td>
                                <td className="p-3 border-b">{row.nama_witel}</td>
                                <td className="p-3 border-b">{row.branch_group}</td>
                                <td className="p-3 border-b">{row.status_wfm}</td>
                            </tr>
                        ))}
                         {data.table.rows.length === 0 && (
                            <tr><td colSpan="9" className="p-4 text-center text-gray-400">No data found</td></tr>
                         )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-gray-500">
                    Page {data.table.pagination.page} of {data.table.pagination.totalPages} ({data.table.pagination.total} rows)
                </span>
                <div className="flex space-x-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >Previous</button>
                    <button
                        disabled={page >= data.table.pagination.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >Next</button>
                </div>
            </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default DashboardDigitalProduct;
