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
  // Flatten data for chart: Label = "Witel - Project", Value = Usia
  // Take top 1 from each witel or flatten all items and sort?
  // Usually this component receives an array of { witel, items: [] }
  // We want to show top outliers across witels or top per witel?
  // Let's flatten all items and take top 10 overall for the chart, labeling with Witel
  
  const flatItems = useMemo(() => {
    let all = []
    data.forEach(group => {
      group.items.forEach(item => {
        all.push({
          label: `${group.witel} - ${item.nama_project?.substring(0, 20)}...`,
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
        backgroundColor: '#ef4444',
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

export default BarChartUsiaWitelJT
