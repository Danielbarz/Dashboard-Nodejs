import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']

const PieDonutChart = ({ title, data, type = 'pie' }) => {
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

  const topData = [...data]
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 12)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={380}>
        <PieChart>
          <Pie
            data={topData}
            cx="50%"
            cy="50%"
            innerRadius={type === 'donut' ? 80 : 0}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value.toLocaleString('id-ID')}`}
          >
            {topData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieDonutChart
