import React, { useState, useEffect, useMemo } from 'react'
import api from '../services/api'
import PieChartStatusLiveJT from '../components/jt/PieChartStatusLiveJT'
import StackedBarStatusWitelJT from '../components/jt/StackedBarStatusWitelJT'
import GroupedBarProgressWitelJT from '../components/jt/GroupedBarProgressWitelJT'
import LineChartTrendGolive from '../components/jt/LineChartTrendGolive'
import DoughnutChartBucketUsia from '../components/jt/DoughnutChartBucketUsia'
import KPICard from '../components/KPICard'
import SkeletonLoader from '../components/SkeletonLoader'
import { FiRefreshCw, FiCheckCircle, FiAlertCircle, FiXCircle, FiLayers } from 'react-icons/fi'

const Tambahan = () => {
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1)
  const defaultStart = oneYearAgo.toISOString().slice(0, 10)
  const defaultEnd = now.toISOString().slice(0, 10)

  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [tableData, setTableData] = useState([])
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

      const trendMapped = (data.trendGolive || []).map(item => ({
        month: item.month,
        input: Number(item.total_order || 0),
        output: Number(item.total_golive || 0)
      }))
      setTrendGolive(trendMapped)

      const bucketColors = { '< 30 Hari': '#22c55e', '30 - 60 Hari': '#eab308', '61 - 90 Hari': '#f97316', '> 90 Hari': '#ef4444' }
      const bucketMapped = (data.bucketUsiaData || []).map(item => ({
        label: item.range,
        count: Number(item.count || 0),
        color: bucketColors[item.range] || '#cbd5e1'
      }))
      setBucketUsiaData(bucketMapped)

    } catch (err) {
      console.error('Failed to load JT dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [startDate, endDate])

  const parentRows = useMemo(() => tableData.filter((r) => r.isParent), [tableData])

  const summary = useMemo(() => {
    const totalLop = parentRows.reduce((a, c) => a + (c.jumlahLop || 0), 0)
    const totalGoLive = parentRows.reduce((a, c) => a + (c.golive_jml || 0), 0)
    const totalDrop = parentRows.reduce((a, c) => a + (c.drop || 0), 0)
    const pending = Math.max(totalLop - totalGoLive, 0)
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
      const pending = Math.max((row.jumlahLop || 0) - (row.golive_jml || 0), 0)
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
        <button onClick={fetchData} className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-0 z-10 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? <SkeletonLoader count={4} /> : (
          <>
            <KPICard title="TOTAL LOP" value={formatNumber(summary.totalLop)} icon={<FiLayers />} color="blue" />
            <KPICard title="DONE GOLIVE" value={formatNumber(summary.totalGoLive)} icon={<FiCheckCircle />} color="green" />
            <KPICard title="BELUM GOLIVE" value={formatNumber(summary.pending)} icon={<FiAlertCircle />} color="orange" />
            <KPICard title="DROP" value={formatNumber(summary.totalDrop)} icon={<FiXCircle />} color="red" />
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? <><SkeletonLoader type="chart" /><SkeletonLoader type="chart" /></> : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Status Live JT</h3>
              <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                <PieChartStatusLiveJT data={{ doneGolive: summary.totalGoLive, blmGolive: summary.pending, drop: summary.totalDrop }} />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Distribusi Usia Proyek</h3>
              <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                <DoughnutChartBucketUsia data={bucketUsiaData} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? <><SkeletonLoader type="chart" /><SkeletonLoader type="chart" /></> : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[450px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Status LOP per Witel</h3>
              <div className="flex-1 w-full min-h-0"><StackedBarStatusWitelJT data={statusPerWitel} /></div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[450px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Progress Deploy per Witel</h3>
              <div className="flex-1 w-full min-h-0"><GroupedBarProgressWitelJT data={progressByWitel} /></div>
            </div>
          </>
        )}
      </div>

      {/* Trend Row */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[450px] flex flex-col">
        <h3 className="text-sm font-bold text-gray-700 mb-4 text-center">Trend Order Masuk vs Go-Live</h3>
        <div className="flex-1 w-full min-h-0">
          {loading ? <SkeletonLoader type="chart" className="h-full border-0 shadow-none" /> : <LineChartTrendGolive data={trendGolive} />}
        </div>
      </div>
    </div>
  )
}

export default Tambahan
