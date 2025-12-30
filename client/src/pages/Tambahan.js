import React, { useState, useEffect } from 'react'
import { analysisService } from '../services/analysisService'
import api from '../services/dashboardService'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts'

const Tambahan = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  
  // Filters
  const [startDate, setStartDate] = useState('01/01/2025')
  const [endDate, setEndDate] = useState('13/11/2025')
  const [witel, setWitel] = useState('Pan Witel Jawa')
  const [poName, setPoName] = useState('Pan PO / Distributor Umum')

  const witels = ['Pan Witel Jawa', 'WITEL_JABAR', 'WITEL_JATIM', 'WITEL_JATENG']
  const poNames = ['Pan PO / Distributor Umum', 'PO_1', 'PO_2', 'PO_3']

  // Mock data for charts
  const ringkasanData = [
    { name: 'CCUA', value: 40, fill: '#22c55e' },
    { name: 'SLN DDCUA-DTET', value: 30, fill: '#eab308' },
    { name: 'LPAT', value: 20, fill: '#ef4444' },
    { name: 'Lainnya', value: 10, fill: '#94a3b8' }
  ]

  const statusPerWitelData = [
    { witel: 'WITEL_Jkl', ccua: 120, sln: 90, lpat: 40 },
    { witel: 'WITEL_Jbr', ccua: 100, sln: 75, lpat: 35 },
    { witel: 'WITEL_Jtm', ccua: 110, sln: 85, lpat: 45 },
    { witel: 'WITEL_Jti', ccua: 95, sln: 70, lpat: 30 },
    { witel: 'WITEL_Jtr', ccua: 108, sln: 80, lpat: 42 }
  ]

  const topWitelData = [
    { witel: 'WITEL_Jkl', value: 250 },
    { witel: 'WITEL_Jbr', value: 210 },
    { witel: 'WITEL_Jtm', value: 240 }
  ]

  const topPoData = [
    { po: 'JAKARTA PERMATA UTAMA', value: 180 },
    { po: 'LUQMAN KUMANDALA', value: 160 },
    { po: 'HARIO FRANGESKA', value: 150 }
  ]

  const progressData = [
    { witel: 'WITEL_Jkl', progress: 60 },
    { witel: 'WITEL_Jbr', progress: 55 },
    { witel: 'WITEL_Jtm', progress: 70 },
    { witel: 'WITEL_Jti', progress: 50 },
    { witel: 'WITEL_Jtr', progress: 65 }
  ]

  const previewData = [
    { noUlap: 2221483, noDusSprint: 'NO DUS SPRI', uraian: 'JABAR TERALIS / JLAN-LV-TOKO JUWARA', slo: 'DIS', poName: 'A DJAP KERATANG', witelBaru: 'WITEL_JATIN TARUH', witelLama: 'WITEL_JATIN' },
    { noUlap: 7744098, noDusSprint: 'NO DUS SPRI', uraian: 'JKI-DBKR JTAH-LV-TOKO WANTU', slo: 'DIS', poName: 'LUQMAN KUMANDALA', witelBaru: 'WITEL_JATIN SABAHAT', witelLama: 'WITEL_JATIN' },
    { noUlap: 1124797, noDusSprint: 'NO DUS SPRI', uraian: 'JMT-DRGC4-PTL-JUR-FJ-52-SAMAT NGAGELO', slo: 'DIS', poName: 'HARIO FRANGESKA', witelBaru: 'WITEL_TAJA TENGGARA', witelLama: 'WITEL_NTT' },
    { noUlap: 5238349, noDusSprint: 'NO DUS SPRI', uraian: 'JMT-DRSCKP-PTL-JUR-FJ-UFTD Samut TTE', slo: 'DIS', poName: 'HARIO FRANGESKA', witelBaru: 'WITEL_TAJA TENGGARA', witelLama: 'WITEL_NTT' },
    { noUlap: 1648310, noDusSprint: 'NO DUS SPRI', uraian: 'JMT-DRKCA-PTL-JTG-FJ-UFTD Samuil SKI', slo: 'D21', poName: 'HARIO FRANGESKA', witelBaru: 'WITEL_TAJA TENGGARA', witelLama: 'WITEL_NTT' },
    { noUlap: 5241778, noDusSprint: 'NO DUS SPRI', uraian: 'JING-CRJ1CT-PTK-JING-CB-HEKT HUJAN', slo: 'DLC2', poName: 'EKA SARI', witelBaru: 'WITEL_SUMASWAGU', witelLama: 'WITEL_SUMASWAGU' },
    { noUlap: 5422512, noDusSprint: 'NO DUS SPRI', uraian: 'JINU-DRSC8-PTJ-JQL-PP-THA Casimir', slo: 'DMI', poName: 'PERDIKA PARAMITHA', witelBaru: 'WITEL_SUMASWAGU', witelLama: 'WITEL_SUMASWAGU' },
    { noUlap: 1362108, noDusSprint: 'NO DUS SPRI', uraian: 'JMT-DRCCK-PTL-LED-FY-GAPE STUDIO', slo: 'D3D', poName: 'HARIO FRANGESKA', witelBaru: 'WITEL_TAJA TENGGARA', witelLama: 'WITEL_NTT' }
  ]

  useEffect(() => {
    // Simulate data fetch
    setData(previewData)
  }, [startDate, endDate, witel, poName])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Jaringan Tambahan</h1>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Tanggal Dan Distributor Tgs. HSI</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Witel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Witel</label>
            <select
              value={witel}
              onChange={(e) => setWitel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
            >
              {witels.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* PO Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PO Name</label>
            <select
              value={poName}
              onChange={(e) => setPoName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500"
            >
              {poNames.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Reset Filter</button>
            <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Transaksi Filter</button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ringkasan Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Status Total LOP</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ringkasanData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {ringkasanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status LOP per Witel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status LOP per Witel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={statusPerWitelData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="witel" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ccua" fill="#22c55e" />
              <Bar dataKey="sln" fill="#eab308" />
              <Bar dataKey="lpat" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Witel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Ulai Order Terbinggu per Witel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={topWitelData} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="witel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
              <Line type="monotone" dataKey="value" stroke="#ef4444" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500"></div><span>Part 1</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500"></div><span>Part 2</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500"></div><span>Ulang</span></div>
          </div>
        </div>

        {/* Top PO */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Ulai Order Terbinggu per PO</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={topPoData}
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="po" type="category" width={200} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Display */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Perbandingan Progress Display per Witel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={progressData} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="witel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="progress" fill="#8b5cf6" stroke="#8b5cf6" name="Realisasi Progress" />
              <Area type="monotone" dataKey="progress" fill="#ec4899" stroke="#ec4899" name="Target Progress" opacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex gap-6 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500"></div><span>Realisasi Progress</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-500"></div><span>Target Progress</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500"></div><span>WITEL_JKT</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500"></div><span>WITEL_JATIM</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500"></div><span>WITEL_JATENG</span></div>
          </div>
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Preview (Distribuban Berdasarkan Ulai Terbinggu)</h2>
        
        {/* Filter Row */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Call ID, NO, Keterangan PO"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
          />
          <input
            type="text"
            placeholder="Tampilkan"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-20"
            defaultValue="10"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">NO ULAP</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">NO DUS SPRI</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">URAIAN KEGAIAN</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SLO MEN</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">PO NAME</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">WITEL BARU</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">WITEL LAMA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{row.noUlap}</td>
                  <td className="px-4 py-3 text-gray-600">{row.noDusSprint}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{row.uraian}</td>
                  <td className="px-4 py-3 text-gray-600">{row.slo}</td>
                  <td className="px-4 py-3 text-blue-600 cursor-pointer hover:underline">{row.poName}</td>
                  <td className="px-4 py-3 text-gray-600">{row.witelBaru}</td>
                  <td className="px-4 py-3 text-gray-600">{row.witelLama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Tambahan
