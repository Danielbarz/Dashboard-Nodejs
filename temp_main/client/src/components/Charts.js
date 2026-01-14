import React from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export const RevenueByWitelChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue by Witel</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Witel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="witel" />
          <YAxis />
          <Tooltip
            formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const AmountByWitelChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Amount by Witel</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount by Witel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="witel" />
          <YAxis />
          <Tooltip labelStyle={{ color: '#000' }} />
          <Legend />
          <Bar dataKey="amount" fill="#82ca9d" name="Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const StatusDistributionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Distribution</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const BranchRevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue by Branch</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Branch</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="branch" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#ffc658" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
