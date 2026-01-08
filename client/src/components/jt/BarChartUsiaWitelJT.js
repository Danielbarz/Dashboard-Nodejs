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

const BarChartUsiaWitelJT = ({ data = [] }) => {
  const chartData = useMemo(() => {
    // Take the maximum age (first item in sorted list) for each witel
    const labels = data.map(d => d.witel)
    const values = data.map(d => (d.items && d.items.length > 0) ? d.items[0].usia : 0)

    return {
      labels,
      datasets: [
        {
          label: 'Usia Tertinggi (Hari)',
          data: values,
          backgroundColor: '#ef4444', // red-500
          borderColor: '#dc2626', // red-600
          borderWidth: 1
        }
      ]
    }
  }, [data])

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Hari' }
      },
      y: {
        ticks: { font: { size: 10 } }
      }
    }
  }

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default BarChartUsiaWitelJT
