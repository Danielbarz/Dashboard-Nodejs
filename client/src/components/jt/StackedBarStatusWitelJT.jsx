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

const StackedBarStatusWitelJT = ({ data = [] }) => {
  const labels = data.map((d) => d.witel)
  const golive = data.map((d) => d.golive || 0)
  const pending = data.map((d) => d.blmGolive || 0)
  const drop = data.map((d) => d.drop || 0)

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Done GoLive',
        data: golive,
        backgroundColor: '#16a34a',
        stack: 'status'
      },
      {
        label: 'Belum GoLive',
        data: pending,
        backgroundColor: '#facc15',
        stack: 'status'
      },
      {
        label: 'Drop',
        data: drop,
        backgroundColor: '#ef4444',
        stack: 'status'
      }
    ]
  }), [labels, golive, pending, drop])

  const options = useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.x}`
        }
      }
    },
    scales: {
      x: { stacked: true, ticks: { precision: 0 } },
      y: { stacked: true }
    }
  }), [])

  return <Bar data={chartData} options={options} />
}

export default StackedBarStatusWitelJT
