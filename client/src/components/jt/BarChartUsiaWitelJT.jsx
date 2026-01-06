import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const colors = ['#ef4444', '#facc15', '#22c55e']

const BarChartUsiaWitelJT = ({ data = [] }) => {
  const labels = data.map((d) => d.witel)

  const rankArrays = useMemo(() => {
    const base = [[], [], []]
    data.forEach((row, idx) => {
      for (let r = 0; r < 3; r += 1) {
        const item = row.items?.[r]
        base[r][idx] = item ? item.usia || 0 : 0
      }
    })
    return base
  }, [data])

  const tooltipLookup = useMemo(() => {
    const map = {}
    data.forEach((row) => {
      map[row.witel] = row.items || []
    })
    return map
  }, [data])

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Rank 1',
        data: rankArrays[0],
        backgroundColor: colors[0],
        stack: 'rank'
      },
      {
        label: 'Rank 2',
        data: rankArrays[1],
        backgroundColor: colors[1],
        stack: 'rank'
      },
      {
        label: 'Rank 3',
        data: rankArrays[2],
        backgroundColor: colors[2],
        stack: 'rank'
      }
    ]
  }), [labels, rankArrays])

  const options = useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: { stacked: true, title: { display: true, text: 'Usia (hari)' } },
      y: { stacked: true }
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const witel = ctx.label
            const rankIndex = ctx.datasetIndex
            const item = tooltipLookup[witel]?.[rankIndex]
            const nama = item?.nama_project || '-'
            const usia = item?.usia ?? 0
            return `Rank ${rankIndex + 1}: ${usia} hari — ${nama}`
          }
        }
      }
    }
  }), [tooltipLookup])

  return <Bar data={chartData} options={options} />
}

export default BarChartUsiaWitelJT
