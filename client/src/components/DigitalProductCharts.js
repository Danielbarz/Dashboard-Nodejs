import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Scatter
} from 'recharts'

// Custom marker for target (a vertical line for horizontal bar charts)
const TargetMarker = (props) => {
  const { x, y } = props
  if (x === undefined || y === undefined) return null
  return (
    <line 
      x1={x} y1={y - 15} 
      x2={x} y2={y + 15} 
      stroke="#ef4444" 
      strokeWidth={1.5} 
      strokeDasharray="10 5"
    />
  )
}

// Custom marker for vertical bar charts (horizontal line)
const TargetMarkerVertical = (props) => {
  const { x, y } = props
  if (x === undefined || y === undefined) return null
  return (
    <line 
      x1={x - 15} y1={y} 
      x2={x + 15} y2={y} 
      stroke="#ef4444" 
      strokeWidth={1.5} 
      strokeDasharray="10 5"
    />
  )
}

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

const getAllKeys = (data, ignoreKey = ['name', 'target']) => {
  const keys = new Set()
  const ignore = Array.isArray(ignoreKey) ? ignoreKey : [ignoreKey]
  data.forEach(item => {
    Object.keys(item).forEach(k => {
      if (!ignore.includes(k)) keys.add(k)
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
  const hasTarget = data.some(d => d.target > 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Witel</h3>
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
            padding={{ top: 0, bottom: 0 }}
          />
          <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {keys.map((key) => (
            <Bar key={key} dataKey={key} stackId="a" fill={PRODUCT_COLORS[key] || '#9ca3af'} />
          ))}
          {hasTarget && (
            <Line 
              type="stepAfter" 
              dataKey="target" 
              stroke="#ef4444" 
              strokeWidth={1} 
              strokeDasharray="10 5" 
              dot={false} 
              name="Target" 
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export const OrderByWitelChart = ({ data }) => {
  const keys = getAllKeys(data)
  const isSimple = keys.includes('value')
  const hasTarget = data.some(d => d.target > 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order by Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            interval={0} 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            padding={{ left: 0, right: 0 }}
          />
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
          {hasTarget && (
            <Line 
              type="stepAfter" 
              dataKey="target" 
              stroke="#ef4444" 
              strokeWidth={1} 
              strokeDasharray="10 5" 
              dot={false} 
              name="Target" 
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export const RevenueTrendChart = ({ data }) => {
  const keys = getAllKeys(data)
  const hasTarget = data.some(d => d.target > 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Product Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} padding={{ left: 0, right: 0 }} />
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
          {hasTarget && (
            <Line
              type="linear"
              dataKey="target"
              stroke="#ef4444"
              name="Target"
              dot={false}
              strokeWidth={1}
              strokeDasharray="10 5"
            />
          )}
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
  const hasTarget = data.some(d => d.target > 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} padding={{ left: 0, right: 0 }} />          <YAxis width={40} tick={{ fontSize: 11 }} />
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
          {hasTarget && (
            <Line 
              type="linear" 
              dataKey="target" 
              stroke="#ef4444" 
              name="Target" 
              dot={false} 
              strokeWidth={1} 
              strokeDasharray="10 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}