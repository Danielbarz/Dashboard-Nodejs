import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1']
const PRODUCT_COLORS = {
  'Antares': '#8b5cf6',
  'Netmonk': '#22c55e',
  'OCA': '#f59e0b',
  'Pijar': '#ef4444',
  'Unknown': '#9ca3af'
}
const STATUS_COLORS = {
  'COMPLETED': '#10b981',
  'IN PROGRESS': '#3b82f6',
  'UNKNOWN': '#9ca3af'
}

const formatRupiah = (value) => {
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)} M`
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)} Jt`
  return `Rp ${value.toLocaleString('id-ID')}`
}

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 z-50">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatter ? formatter(entry.value) : entry.value.toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const getAllKeys = (data, ignoreKey = 'name') => {
  const keys = new Set()
  data.forEach(item => {
    Object.keys(item).forEach(k => {
      if (k !== ignoreKey) keys.add(k)
    })
  })
  return Array.from(keys)
}

// --- SECTION 2: MONITORING ---

export const OrderByStatusChart = ({ data }) => {
  const inProgressCount = data.find(d => d.name === 'IN PROGRESS')?.value || 0

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order by Status</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={135}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-15" fontSize="36" fontWeight="bold" fill="#1f2937">{inProgressCount}</tspan>
            <tspan x="50%" dy="30" fontSize="14" fontWeight="600" fill="#6b7280">Order In-Progress</tspan>
          </text>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const RevenueByWitelChart = ({ data }) => {
  const keys = getAllKeys(data)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={formatRupiah} tick={{ fontSize: 10 }} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fontSize: 9 }} 
            interval={0}
          />
          <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {keys.map((key) => (
            <Bar key={key} dataKey={key} stackId="a" fill={PRODUCT_COLORS[key] || '#9ca3af'} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const OrderByWitelChart = ({ data }) => {
  const keys = getAllKeys(data)
  const isSimple = keys.includes('value')

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order by Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {keys.map((key) => (
            <Bar 
              key={key} 
              dataKey={key} 
              stackId={isSimple ? undefined : "a"} 
              fill={isSimple ? '#3b82f6' : (STATUS_COLORS[key] || '#9ca3af')} 
              name={isSimple ? 'Total Order' : key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const RevenueTrendChart = ({ data }) => {
  const keys = getAllKeys(data)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Product Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatRupiah} width={80} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {keys.map((key) => (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={PRODUCT_COLORS[key] || '#9ca3af'} 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const ProductShareChart = ({ data }) => {
  const topProduct = data.reduce((prev, current) => (prev.value > current.value) ? prev : current, { value: 0, name: '' })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Share (Revenue)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={135}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[entry.name] || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-20" fontSize="24" fontWeight="bold" fill="#1f2937">{formatRupiah(topProduct.value)}</tspan>
            <tspan x="50%" dy="25" fontSize="12" fontWeight="600" fill="#4b5563">{topProduct.name}</tspan>
            <tspan x="50%" dy="20" fontSize="11" fill="#9ca3af">Biggest Product Revenue</tspan>
          </text>
          <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const OrderTrendChart = ({ data }) => {
  const keys = getAllKeys(data)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis width={40} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {keys.map((key) => (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={PRODUCT_COLORS[key] || '#9ca3af'} 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}