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
  const chartData = useMemo(() => ({
    labels: data.map(d => d.witel),
    datasets: [
      {
        label: 'Go Live',
        data: data.map(d => d.golive),
        backgroundColor: '#10b981', // green-500
      },
      {
        label: 'Pending',
        data: data.map(d => d.pending),
        backgroundColor: '#f59e0b', // amber-500
      },
      {
        label: 'Drop',
        data: data.map(d => d.drop),
        backgroundColor: '#ef4444', // red-500
      }
    ]
  }), [data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  }

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default StackedBarStatusWitelJT
