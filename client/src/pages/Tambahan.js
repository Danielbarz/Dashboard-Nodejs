import React, { useState, useEffect, useMemo } from 'react'
import api from '../services/api'
import PieChartStatusLiveJT from '../components/jt/PieChartStatusLiveJT'
import StackedBarStatusWitelJT from '../components/jt/StackedBarStatusWitelJT'
import GroupedBarProgressWitelJT from '../components/jt/GroupedBarProgressWitelJT'
import BarChartUsiaWitelJT from '../components/jt/BarChartUsiaWitelJT'
import BarChartUsiaPoJT from '../components/jt/BarChartUsiaPoJT'
import BarChartTopMitraRevenue from '../components/jt/BarChartTopMitraRevenue'
import LineChartTrendGolive from '../components/jt/LineChartTrendGolive'
import DoughnutChartBucketUsia from '../components/jt/DoughnutChartBucketUsia'
import { FiRefreshCw } from 'react-icons/fi'

const statusColors = {
  golive: 'bg-green-50 text-green-700 border border-green-100',
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  drop: 'bg-red-50 text-red-700 border border-red-100'
}

const Tambahan = () => {
  const now = new Date()
  // Default to 1 year back to show historical data immediately
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1)
  const defaultStart = oneYearAgo.toISOString().slice(0, 10)
  const defaultEnd = now.toISOString().slice(0, 10)

  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [tableData, setTableData] = useState([])
  const [projectData, setProjectData] = useState([])
  const [rawTopWitel, setRawTopWitel] = useState([])
  const [rawTopPo, setRawTopPo] = useState([])

  // New Charts State
  const [topMitraRevenue, setTopMitraRevenue] = useState([])
  const [trendGolive, setTrendGolive] = useState([])
  const [bucketUsiaData, setBucketUsiaData] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const params = { start_date: startDate, end_date: endDate }
      const response = await api.get('/dashboard/report-tambahan', { params })

      const data = response.data?.data || {}
      setTableData(data.tableData || [])
      setProjectData(data.projectData || [])
      setRawTopWitel(data.top3Witel || [])
      setRawTopPo(data.top3Po || [])

      // Set New Charts Data
      setTopMitraRevenue(data.topMitraRevenue || [])

      // Fix Trend Golive Mapping
      const trendMapped = (data.trendGolive || []).map(item => ({
        month: item.month,
        input: Number(item.total_order || 0),
        output: Number(item.total_golive || 0)
      }))
      setTrendGolive(trendMapped)

      // Fix Bucket Usia Mapping & Colors
      const bucketColors = {
        '< 30 Hari': '#22c55e', // Green
        '30 - 60 Hari': '#eab308', // Yellow
        '61 - 90 Hari': '#f97316', // Orange
        '> 90 Hari': '#ef4444' // Red
      }

      const bucketMapped = (data.bucketUsiaData || []).map(item => ({
        label: item.range,
        count: Number(item.count || 0),
        color: bucketColors[item.range] || '#cbd5e1'
      }))
      setBucketUsiaData(bucketMapped)

    } catch (err) {
      console.error('Failed to load JT dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard. Coba ulangi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  const parentRows = useMemo(() => tableData.filter((r) => r.isParent), [tableData])

  const groupedTopWitel = useMemo(() => {
    const groups = {}
    rawTopWitel.forEach(item => {
      const key = item.region || 'Unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push({
        nama_project: item.uraian_kegiatan,
        ihld: item.id_i_hld,
        usia: item.usia,
        status_tomps: item.status_tomps_new
      })
    })
    return Object.entries(groups).map(([witel, items]) => ({ witel, items }))
  }, [rawTopWitel])

  const groupedTopPo = useMemo(() => {
    const groups = {}
    rawTopPo.forEach(item => {
      const key = item.po_name || 'Unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push({
        nama_project: item.uraian_kegiatan,
        witel: item.region, // Use region as witel label
        childWitel: item.witel_norm, // Use witel_norm as child witel
        usia: item.usia,
        status_tomps: item.status_tomps_new
      })
    })
    return Object.entries(groups).map(([po, items]) => ({ po, items }))
  }, [rawTopPo])

  const summary = useMemo(() => {
    const totalLop = parentRows.reduce((a, c) => a + (c.jumlahLop || 0), 0)
    const totalGoLive = parentRows.reduce((a, c) => a + (c.golive_jml || 0), 0)
    const totalDrop = parentRows.reduce((a, c) => a + (c.drop || 0), 0)
    const pending = Math.max(totalLop - totalGoLive - totalDrop, 0)
    return { totalLop, totalGoLive, totalDrop, pending }
  }, [parentRows])

  const progressByWitel = useMemo(() => {
    return parentRows.map((row) => ({
      witel: row.witel,
      initial: Number(row.initial) || 0,
      survey: Number(row.survey) || 0,
      perizinan: Number(row.perizinan) || 0,
      instalasi: Number(row.instalasi) || 0,
      piOgp: Number(row.piOgp) || 0
    }))
  }, [parentRows])

  const statusPerWitel = useMemo(() => {
    return parentRows.map((row) => {
      const pending = Math.max((row.jumlahLop || 0) - (row.golive_jml || 0) - (row.drop || 0), 0)
      return {
        witel: row.witel,
        golive: row.golive_jml || 0,
        drop: row.drop || 0,
        pending
      }
    })
  }, [parentRows])

  const formatNumber = (n) => (n || 0).toLocaleString('id-ID')

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Jaringan Tambahan</h1>
          <p className="text-gray-500 text-sm">Monitoring Progress & Status Project</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          title="Refresh Data"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full md:w-48 text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full md:w-48 text-xs p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600 pb-2">{error}</p>}
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 shadow-sm ${statusColors.golive}`}>
          <p className="text-sm font-bold opacity-70 uppercase tracking-wider">Done GoLive</p>
          <p className="text-3xl font-black mt-1">{formatNumber(summary.totalGoLive)}</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm ${statusColors.pending}`}>
          <p className="text-sm font-bold opacity-70 uppercase tracking-wider">Belum GoLive</p>
          <p className="text-3xl font-black mt-1">{formatNumber(summary.pending)}</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm ${statusColors.drop}`}>
          <p className="text-sm font-bold opacity-70 uppercase tracking-wider">Drop</p>
          <p className="text-3xl font-black mt-1">{formatNumber(summary.totalDrop)}</p>
        </div>
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total LOP</p>
          <p className="text-3xl font-black text-gray-800 mt-1">{formatNumber(summary.totalLop)}</p>
        </div>
      </div>

      {/* Charts Row 1: Status Live & Bucket Usia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[350px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            Status Live JT
          </h3>
          <div className="h-[280px] flex items-center justify-center">
            <PieChartStatusLiveJT
              data={{
                doneGolive: summary.totalGoLive,
                blmGolive: summary.pending,
                drop: summary.totalDrop
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[350px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
            Distribusi Usia Proyek (Belum GoLive)
          </h3>
          <div className="h-[280px] flex items-center justify-center">
            <DoughnutChartBucketUsia data={bucketUsiaData} />
          </div>
        </div>
      </div>

      {/* Charts Row 2: Status & Progress Witel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
            Status LOP per Witel
          </h3>
          <div className="h-[320px]">
            <StackedBarStatusWitelJT data={statusPerWitel} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
            Progress Deploy per Witel
          </h3>
          <div className="h-[320px]">
            <GroupedBarProgressWitelJT data={progressByWitel} />
          </div>
        </div>
      </div>

      {/* Charts Row 3: Trend Go-Live & Top Mitra Revenue */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
            Trend Order Masuk vs Go-Live
          </h3>
          <div className="h-[320px]">
            <LineChartTrendGolive data={trendGolive} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            Top 10 Mitra by Revenue
          </h3>
          <div className="h-[320px]">
            <BarChartTopMitraRevenue data={topMitraRevenue} />
          </div>
        </div>
      </div>

      {/* Charts Row 4: Top Usia (Witel & PO) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
            Top 3 Usia Order per Witel
          </h3>
          <div className="h-[320px]">
            <BarChartUsiaWitelJT data={groupedTopWitel} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px]">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
            Top 3 Usia Order per PO
          </h3>
          <div className="h-[320px]">
            <BarChartUsiaPoJT data={groupedTopPo} />
          </div>
        </div>
      </div>

      {/* Status per Witel + Progress Deploy Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Status LOP per Witel</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Witel</th>
                  <th className="px-4 py-3 text-right">Done</th>
                  <th className="px-4 py-3 text-right">Blm GoLive</th>
                  <th className="px-4 py-3 text-right">Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statusPerWitel.map((row) => (
                  <tr key={row.witel} className="hover:bg-blue-50/30">
                    <td className="px-4 py-3 font-medium text-gray-700">{row.witel}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">{formatNumber(row.golive)}</td>
                    <td className="px-4 py-3 text-right text-amber-600 font-bold">{formatNumber(row.pending)}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-bold">{formatNumber(row.drop)}</td>
                  </tr>
                ))}
                {statusPerWitel.length === 0 && (
                  <tr><td className="px-4 py-6 text-center text-gray-400" colSpan={4}>Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Perbandingan Progress Deploy</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Witel</th>
                  <th className="px-4 py-3 text-right">Init</th>
                  <th className="px-4 py-3 text-right">Survey</th>
                  <th className="px-4 py-3 text-right">Izin</th>
                  <th className="px-4 py-3 text-right">Inst</th>
                  <th className="px-4 py-3 text-right">FI-OGP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {progressByWitel.map((row) => (
                  <tr key={row.witel} className="hover:bg-blue-50/30">
                    <td className="px-4 py-3 font-medium text-gray-700">{row.witel}</td>
                    <td className="px-4 py-3 text-right">{formatNumber(row.initial)}</td>
                    <td className="px-4 py-3 text-right">{formatNumber(row.survey)}</td>
                    <td className="px-4 py-3 text-right">{formatNumber(row.perizinan)}</td>
                    <td className="px-4 py-3 text-right">{formatNumber(row.instalasi)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">{formatNumber(row.piOgp)}</td>
                  </tr>
                ))}
                {progressByWitel.length === 0 && (
                  <tr><td className="px-4 py-6 text-center text-gray-400" colSpan={6}>Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Usia Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top 3 Usia Order Tertinggi per Witel</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {groupedTopWitel.map(({ witel, items }) => (
              <div key={witel} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">{witel}</div>
                <div className="divide-y divide-gray-50">
                  {items.map((item, idx) => (
                    <div key={`${witel}-${idx}`} className="px-4 py-3 text-sm flex justify-between items-start hover:bg-gray-50/50">
                      <div>
                        <div className="font-bold text-gray-800">{item.nama_project}</div>
                        <div className="text-xs text-gray-500 mt-0.5">IHLD: {item.ihld || '-'}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-lg inline-block">{item.usia} hari</div>
                        <div className="text-xs text-gray-400 mt-1">{item.status_tomps || '-'}</div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="px-4 py-3 text-gray-400 text-xs italic">Tidak ada data</div>
                  )}
                </div>
              </div>
            ))}
            {groupedTopWitel.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Tidak ada data</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top 3 Usia Order Tertinggi per PO</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {groupedTopPo.map(({ po, items }) => (
              <div key={po} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">{po}</div>
                <div className="divide-y divide-gray-50">
                  {items.map((item, idx) => (
                    <div key={`${po}-${idx}`} className="px-4 py-3 text-sm flex justify-between items-start hover:bg-gray-50/50">
                      <div>
                        <div className="font-bold text-gray-800">{item.nama_project}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.witel} {item.childWitel ? `/ ${item.childWitel}` : ''}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-lg inline-block">{item.usia} hari</div>
                        <div className="text-xs text-gray-400 mt-1">{item.status_tomps || '-'}</div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="px-4 py-3 text-gray-400 text-xs italic">Tidak ada data</div>
                  )}
                </div>
              </div>
            ))}
            {groupedTopPo.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Tidak ada data</p>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Tambahan
