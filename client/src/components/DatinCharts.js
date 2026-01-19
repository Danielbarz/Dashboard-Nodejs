import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1']
const STATUS_COLORS = {
  'READY TO BILL': '#10b981', // Green
  'PROVIDE ORDER': '#3b82f6', // Blue
  'IN PROCESS': '#f59e0b',    // Orange
  'PROV. COMPLETE': '#8b5cf6', // Purple
  'UNKNOWN': '#9ca3af'        // Gray
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
      if (k !== ignoreKey && k !== 'target') keys.add(k)
    })
  })
  return Array.from(keys)
}

// --- SECTION 2: STATUS & DELIVERY MONITORING ---

export const OrderByStatusChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const RevenueByStatusChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-45} textAnchor="end" height={60} />
          <YAxis tickFormatter={formatRupiah} width={80} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="< 3 Bulan" stackId="a" fill="#3b82f6" />
          <Bar dataKey="> 3 Bulan" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const StatusPerWitelChart = ({ data }) => {
  const keys = getAllKeys(data)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status per Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fontSize: 9 }} 
            interval={0}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {keys.map((key) => (
            <Bar key={key} dataKey={key} stackId="a" fill={STATUS_COLORS[key] || '#9ca3af'} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// --- SECTION 3: BUSINESS PERFORMANCE ---

export const RevenueTrendChart = ({ data }) => {
  const keys = getAllKeys(data)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend Over Time</h3>
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
              stroke={STATUS_COLORS[key] || '#9ca3af'} 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
          <Line type="monotone" dataKey="target" stroke="#ff0000" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Target" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const RevenuePerWitelChart = ({ data }) => {
  const keys = getAllKeys(data)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue per Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart 
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
            <Bar key={key} dataKey={key} stackId="a" fill={STATUS_COLORS[key] || '#9ca3af'} />
          ))}
          <Line type="monotone" dataKey="target" stroke="#ff0000" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Target" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export const OrderPerWitelChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order per Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#3b82f6" name="Total Order" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="target" stroke="#ff0000" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Target" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export const RevenuePerProductChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue per Product</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={formatRupiah} tick={{ fontSize: 10 }} />
          <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9 }} interval={0} />
          <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
          <Bar dataKey="value" fill="#8b5cf6" name="Revenue" radius={[0, 4, 4, 0]} />
          <Line type="monotone" dataKey="target" stroke="#ff0000" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Target" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}