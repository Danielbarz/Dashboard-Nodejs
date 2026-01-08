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

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Done GoLive',
        data: data.map((d) => d.golive),
        backgroundColor: '#22c55e', // green-500
        stack: 'Stack 0',
      },
      {
        label: 'Belum GoLive',
        data: data.map((d) => d.pending),
        backgroundColor: '#eab308', // yellow-500
        stack: 'Stack 0',
      },
      {
        label: 'Drop',
        data: data.map((d) => d.drop),
        backgroundColor: '#ef4444', // red-500
        stack: 'Stack 0',
      },
    ]
  }), [data, labels])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false }
    }
  }), [])

  return <Bar data={chartData} options={options} />
}

export default StackedBarStatusWitelJT
