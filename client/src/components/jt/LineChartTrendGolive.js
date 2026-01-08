import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LineChartTrendGolive = ({ data = [] }) => {
  const labels = data.map((d) => d.month)
  
  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Order Masuk (Input)',
        data: data.map((d) => d.input),
        borderColor: '#3b82f6', // Blue
        backgroundColor: '#3b82f6',
        tension: 0.3
      },
      {
        label: 'Order Selesai (Go Live)',
        data: data.map((d) => d.output),
        borderColor: '#22c55e', // Green
        backgroundColor: '#22c55e',
        tension: 0.3
      }
    ]
  }), [data, labels])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }), [])

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default LineChartTrendGolive
