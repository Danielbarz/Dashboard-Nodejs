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

const stages = [
  { key: 'initial', label: 'Initial', color: '#3b82f6' }, // Blue
  { key: 'survey', label: 'Survey / DRM', color: '#06b6d4' }, // Cyan
  { key: 'perizinan', label: 'Perizinan / MOS', color: '#eab308' }, // Yellow
  { key: 'instalasi', label: 'Instalasi', color: '#f97316' }, // Orange
  { key: 'piOgp', label: 'FI-OGP Live', color: '#8b5cf6' }, // Purple
  { key: 'done', label: 'Done Go Live', color: '#22c55e' } // Green
]

const GroupedBarProgressWitelJT = ({ data = [] }) => {
  const labels = data.map((d) => d.witel)

  const datasets = useMemo(() => stages.map((stage) => ({
    label: stage.label,
    backgroundColor: stage.color,
    data: data.map((row) => row[stage.key] || 0)
  })), [data])

  const chartData = useMemo(() => ({ labels, datasets }), [labels, datasets])

  const options = useMemo(() => ({
    responsive: true,
    scales: {
      x: { stacked: false },
      y: { stacked: false, beginAtZero: true, title: { display: true, text: 'Count' } }
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const witel = ctx.label
            const stage = ctx.dataset.label
            const value = ctx.parsed.y
            return `${stage} ${witel}: ${value}`
          }
        }
      }
    }
  }), [])

  return <Bar data={chartData} options={options} />
}

export default GroupedBarProgressWitelJT
