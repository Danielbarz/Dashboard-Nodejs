import React, { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChartStatusLiveJT = ({ data }) => {
  const { doneGolive = 0, blmGolive = 0, drop = 0 } = data || {}
  const total = doneGolive + blmGolive + drop

  const chartData = useMemo(() => ({
    labels: ['Done GoLive', 'Belum GoLive', 'Drop'],
    datasets: [
      {
        data: [doneGolive, blmGolive, drop],
        backgroundColor: ['#16a34a', '#facc15', '#ef4444'],
        borderColor: '#ffffff',
        borderWidth: 1
      }
    ]
  }), [doneGolive, blmGolive, drop])

  const options = useMemo(() => ({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed || 0
            if (total === 0) return `${ctx.label}: 0`
            const pct = ((value / total) * 100).toFixed(1)
            return `${ctx.label}: ${value} (${pct}%)`
          }
        }
      }
    }
  }), [total])

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="relative h-full w-full">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}

export default PieChartStatusLiveJT
