import React, { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChartBucketUsia = ({ data = [] }) => {
  const chartData = useMemo(() => ({
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: data.map(d => d.color),
        borderWidth: 1
      }
    ]
  }), [data])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%', // Thicker doughnut
    plugins: {
      legend: { position: 'bottom' }
    }
  }), [])

  const total = data.reduce((a, b) => a + b.count, 0)

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative">
      <div className="relative h-full w-full">
        <Doughnut data={chartData} options={options} />
        {/* Center Text - positioned relative to the chart area */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700">
                {total}
              </div>
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Projects</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DoughnutChartBucketUsia
