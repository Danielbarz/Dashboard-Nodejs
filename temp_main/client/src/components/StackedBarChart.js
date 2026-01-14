import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const StackedBarChart = ({ title, data, colors = ['#FFA500', '#4F46E5', '#10B981', '#EF4444'] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    )
  }

  // Sort by total value and ambil top 10 supaya label tidak menumpuk
  const sortableKeys = Object.keys(data[0]).filter(key => key !== 'name' && key !== 'Name')
  const topData = [...data]
    .map(item => {
      const total = sortableKeys.reduce((sum, key) => sum + (Number(item[key]) || 0), 0)
      return { item, total }
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(d => d.item)

  const keys = sortableKeys.slice(0, 4)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
          <Legend />
          {keys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colors[index % colors.length]}
              name={key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StackedBarChart
