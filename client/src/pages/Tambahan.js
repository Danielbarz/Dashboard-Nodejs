import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import PieChartStatusLiveJT from '../components/jt/PieChartStatusLiveJT'
import StackedBarStatusWitelJT from '../components/jt/StackedBarStatusWitelJT'
import GroupedBarProgressWitelJT from '../components/jt/GroupedBarProgressWitelJT'
import BarChartUsiaWitelJT from '../components/jt/BarChartUsiaWitelJT'
import BarChartUsiaPoJT from '../components/jt/BarChartUsiaPoJT'
import BarChartTopMitraRevenue from '../components/jt/BarChartTopMitraRevenue'
import LineChartTrendGolive from '../components/jt/LineChartTrendGolive'
import DoughnutChartBucketUsia from '../components/jt/DoughnutChartBucketUsia'

const statusColors = {
  golive: 'bg-green-100 text-green-800 border border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  drop: 'bg-red-100 text-red-800 border border-red-200'
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
  const [topWitel, setTopWitel] = useState([])
  const [topPo, setTopPo] = useState([])
  const [previewData, setPreviewData] = useState([])
  
  // New Charts State
  const [topMitraRevenue, setTopMitraRevenue] = useState([])
  const [trendGolive, setTrendGolive] = useState([])
  const [bucketUsiaData, setBucketUsiaData] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/report/tambahan`,
        {
          params: { start_date: startDate, end_date: endDate },
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = response.data?.data || {}
      setTableData(data.tableData || [])
      setProjectData(data.projectData || [])
      setTopWitel(data.topUsiaByWitel || [])
      setTopPo(data.topUsiaByPo || [])
      setPreviewData(data.previewData || [])
      
      // Set New Charts Data
      setTopMitraRevenue(data.topMitraRevenue || [])
      setTrendGolive(data.trendGolive || [])
      setBucketUsiaData(data.bucketUsiaData || [])

    } catch (err) {
      console.error('Failed to load JT dashboard:', err)
      setError('Gagal memuat data dashboard. Coba ulangi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  const parentRows = useMemo(() => tableData.filter((r) => r.isParent), [tableData])

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
    <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter</h3>
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={fetchData}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700"
            >
              Refresh
            </button>
          </div>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`rounded-lg p-4 ${statusColors.golive}`}>
            <p className="text-sm font-semibold">Done GoLive</p>
            <p className="text-2xl font-bold">{formatNumber(summary.totalGoLive)}</p>
          </div>
          <div className={`rounded-lg p-4 ${statusColors.pending}`}>
            <p className="text-sm font-semibold">Belum GoLive</p>
            <p className="text-2xl font-bold">{formatNumber(summary.pending)}</p>
          </div>
          <div className={`rounded-lg p-4 ${statusColors.drop}`}>
            <p className="text-sm font-semibold">Drop</p>
            <p className="text-2xl font-bold">{formatNumber(summary.totalDrop)}</p>
          </div>
          <div className="rounded-lg p-4 bg-gray-100 text-gray-800 border border-gray-200">
            <p className="text-sm font-semibold">Total LOP</p>
            <p className="text-2xl font-bold">{formatNumber(summary.totalLop)}</p>
          </div>
        </div>

        {/* Charts Row 1: Status Live & Bucket Usia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4 h-[280px]">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Status Live JT</h3>
            <div className="h-[calc(100%-2rem)] flex items-center justify-center">
              <PieChartStatusLiveJT
                data={{
                  doneGolive: summary.totalGoLive,
                  blmGolive: summary.pending,
                  drop: summary.totalDrop
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 h-[280px]">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Distribusi Usia Proyek (Belum GoLive)</h3>
            <div className="h-[calc(100%-2rem)] flex items-center justify-center">
              <DoughnutChartBucketUsia data={bucketUsiaData} />
            </div>
          </div>
        </div>

        {/* Charts Row 2: Status & Progress Witel */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 h-[420px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status LOP per Witel</h3>
            <div className="h-full">
              <StackedBarStatusWitelJT data={statusPerWitel} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 h-[420px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Deploy per Witel</h3>
            <div className="h-full">
              <GroupedBarProgressWitelJT data={progressByWitel} />
            </div>
          </div>
        </div>

        {/* Charts Row 3: Trend Go-Live & Top Mitra Revenue */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 h-[320px] xl:col-span-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Trend Order Masuk vs Go-Live</h3>
            <div className="h-[calc(100%-2rem)]">
              <LineChartTrendGolive data={trendGolive} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 h-[320px]">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Top 10 Mitra by Revenue</h3>
            <div className="h-[calc(100%-2rem)]">
              <BarChartTopMitraRevenue data={topMitraRevenue} />
            </div>
          </div>
        </div>

        {/* Charts Row 4: Top Usia (Witel & PO) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 h-[420px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 3 Usia Order per Witel</h3>
            <div className="h-full">
              <BarChartUsiaWitelJT data={topWitel} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 h-[420px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 3 Usia Order per PO</h3>
            <div className="h-full">
              <BarChartUsiaPoJT data={topPo} />
            </div>
          </div>
        </div>

        {/* Status per Witel + Progress Deploy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status LOP per Witel</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Witel</th>
                    <th className="px-3 py-2 text-right">Done</th>
                    <th className="px-3 py-2 text-right">Blm GoLive</th>
                    <th className="px-3 py-2 text-right">Drop</th>
                  </tr>
                </thead>
                <tbody>
                  {statusPerWitel.map((row) => (
                    <tr key={row.witel} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{row.witel}</td>
                      <td className="px-3 py-2 border text-right text-green-700 font-semibold">{formatNumber(row.golive)}</td>
                      <td className="px-3 py-2 border text-right text-yellow-700 font-semibold">{formatNumber(row.pending)}</td>
                      <td className="px-3 py-2 border text-right text-red-700 font-semibold">{formatNumber(row.drop)}</td>
                    </tr>
                  ))}
                  {statusPerWitel.length === 0 && (
                    <tr><td className="px-3 py-3 text-center text-gray-500" colSpan={4}>Tidak ada data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Perbandingan Progress Deploy per Witel</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Witel</th>
                    <th className="px-3 py-2 text-right">Initial</th>
                    <th className="px-3 py-2 text-right">Survey & DRM</th>
                    <th className="px-3 py-2 text-right">Perizinan & MOS</th>
                    <th className="px-3 py-2 text-right">Instalasi</th>
                    <th className="px-3 py-2 text-right">FI-OGP Live</th>
                  </tr>
                </thead>
                <tbody>
                  {progressByWitel.map((row) => (
                    <tr key={row.witel} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{row.witel}</td>
                      <td className="px-3 py-2 border text-right">{formatNumber(row.initial)}</td>
                      <td className="px-3 py-2 border text-right">{formatNumber(row.survey)}</td>
                      <td className="px-3 py-2 border text-right">{formatNumber(row.perizinan)}</td>
                      <td className="px-3 py-2 border text-right">{formatNumber(row.instalasi)}</td>
                      <td className="px-3 py-2 border text-right">{formatNumber(row.piOgp)}</td>
                    </tr>
                  ))}
                  {progressByWitel.length === 0 && (
                    <tr><td className="px-3 py-3 text-center text-gray-500" colSpan={6}>Tidak ada data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Usia */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 3 Usia Order Tertinggi per Witel</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {topWitel.map(({ witel, items }) => (
                <div key={witel} className="border rounded-md">
                  <div className="bg-gray-100 px-3 py-2 font-semibold">{witel}</div>
                  <div className="divide-y">
                    {items.map((item, idx) => (
                      <div key={`${witel}-${idx}`} className="px-3 py-2 text-sm flex justify-between">
                        <div>
                          <div className="font-semibold">{item.nama_project}</div>
                          <div className="text-gray-600">IHLD: {item.ihld || '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-700 font-bold">{item.usia} hari</div>
                          <div className="text-gray-600">Status: {item.status_tomps || '-'}</div>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-sm">Tidak ada data</div>
                    )}
                  </div>
                </div>
              ))}
              {topWitel.length === 0 && <p className="text-sm text-gray-500">Tidak ada data</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 3 Usia Order Tertinggi per PO</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {topPo.map(({ po, items }) => (
                <div key={po} className="border rounded-md">
                  <div className="bg-gray-100 px-3 py-2 font-semibold">{po}</div>
                  <div className="divide-y">
                    {items.map((item, idx) => (
                      <div key={`${po}-${idx}`} className="px-3 py-2 text-sm flex justify-between">
                        <div>
                          <div className="font-semibold">{item.nama_project}</div>
                          <div className="text-gray-600">Witel: {item.witel} / {item.childWitel}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-700 font-bold">{item.usia} hari</div>
                          <div className="text-gray-600">Status: {item.status_tomps || '-'}</div>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-sm">Tidak ada data</div>
                    )}
                  </div>
                </div>
              ))}
              {topPo.length === 0 && <p className="text-sm text-gray-500">Tidak ada data</p>}
            </div>
          </div>
        </div>

        {/* Data Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Preview (Usia Tertinggi)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-2 py-2 text-left">ID i-HLD</th>
                  <th className="px-2 py-2 text-left">PO Name</th>
                  <th className="px-2 py-2 text-left">Witel Baru</th>
                  <th className="px-2 py-2 text-left">Witel Lama</th>
                  <th className="px-2 py-2 text-left">Status Proyek</th>
                  <th className="px-2 py-2 text-left">Go Live</th>
                  <th className="px-2 py-2 text-left">Usia (Hari)</th>
                  <th className="px-2 py-2 text-left">Revenue Plan</th>
                  <th className="px-2 py-2 text-left">Tomps Last Activity</th>
                  <th className="px-2 py-2 text-left">Tgl MOM</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={`${row.id || row.idIHld || idx}`} className="odd:bg-white even:bg-gray-50">
                    <td className="px-2 py-2 border">{row.idIHld || '-'}</td>
                    <td className="px-2 py-2 border">{row.poName || '-'}</td>
                    <td className="px-2 py-2 border">{row.witelBaru || '-'}</td>
                    <td className="px-2 py-2 border">{row.witelLama || '-'}</td>
                    <td className="px-2 py-2 border">{row.statusProyek || '-'}</td>
                    <td className="px-2 py-2 border">{row.goLive || '-'}</td>
                    <td className="px-2 py-2 border text-red-700 font-semibold">{row.usia ?? '-'}</td>
                    <td className="px-2 py-2 border">{formatNumber(row.revenuePlan)}</td>
                    <td className="px-2 py-2 border">{row.statusTompsLastActivity || '-'}</td>
                    <td className="px-2 py-2 border">{row.tanggalMom ? new Date(row.tanggalMom).toISOString().slice(0,10) : '-'}</td>
                  </tr>
                ))}
                {previewData.length === 0 && (
                  <tr><td className="px-3 py-3 text-center text-gray-500" colSpan={10}>Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

export default Tambahan
