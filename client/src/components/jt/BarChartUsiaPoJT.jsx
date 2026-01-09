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

const BarChartUsiaPoJT = ({ data = [] }) => {
  // Similar logic to Witel, flatten and show top outliers
  
  const flatItems = useMemo(() => {
    let all = []
    data.forEach(group => {
      group.items.forEach(item => {
        all.push({
          label: `${group.po} - ${item.nama_project?.substring(0, 20)}...`,
          usia: item.usia,
          fullProject: item.nama_project
        })
      })
    })
    return all.sort((a, b) => b.usia - a.usia).slice(0, 3)
  }, [data])

  const labels = flatItems.map(d => d.label)
  const values = flatItems.map(d => d.usia)

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Usia (Hari)',
        data: values,
        backgroundColor: '#f97316', // Orange
      }
    ]
  }), [labels, values])

  const options = useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Usia: ${ctx.parsed.x} hari`
        }
      }
    },
    scales: {
      x: { beginAtZero: true }
    }
  }), [])

  return <Bar data={chartData} options={options} />
}

export default BarChartUsiaPoJT
