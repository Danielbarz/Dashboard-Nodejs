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

const BarChartTopMitraRevenue = ({ data = [] }) => {
  const labels = data.map((d) => d.poName)
  const revenues = data.map((d) => d.totalRevenue)

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Total Revenue Plan',
        data: revenues,
        backgroundColor: '#3b82f6', // Blue-500
        borderColor: '#2563eb', // Blue-600
        borderWidth: 1
      }
    ]
  }), [labels, revenues])

  const options = useMemo(() => ({
    indexAxis: 'y', // Horizontal Bar
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { right: 20 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.x !== null) {
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumSignificantDigits: 3
              }).format(context.parsed.x)
            }
            return label
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          callback: (value) => {
            if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'M'
            if (value >= 1000000) return (value / 1000000).toFixed(0) + 'jt'
            return value
          }
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          font: { size: 11 } // Smaller font for Mitra names
        }
      }
    }
  }), [])

  return (
    <div className="h-full w-full p-2">
      <div className="relative h-full w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default BarChartTopMitraRevenue
