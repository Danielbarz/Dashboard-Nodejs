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

// Color palette for products
const PRODUCT_COLORS = {
  'Antares': '#8b5cf6',  // Purple
  'Netmonk': '#22c55e',  // Green
  'OCA': '#f59e0b',      // Orange/Amber
  'Pijar': '#ef4444',    // Red
  'Unknown': '#6b7280'   // Gray
}

// Color palette for segments
const SEGMENT_COLORS = {
  'LEGS': '#818cf8',  // Indigo
  'SME': '#34d399',   // Emerald
  'Unknown': '#9ca3af' // Gray
}

// Color palette for channels
const CHANNEL_COLORS = {
  'NCX': '#3b82f6',      // Blue
  'SC-One': '#ef4444',   // Red
  'Unmapped': '#9ca3af'  // Gray
}

// Format number to Indonesian Rupiah
const formatRupiah = (value) => {
  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(1)} M`
  } else if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)} Jt`
  }
  return `Rp ${value.toLocaleString('id-ID')}`
}

// Custom tooltip for revenue
const RevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatRupiah(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Custom tooltip for amount/count
const AmountTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    )
  }
  return null
}

/**
 * 1. Revenue by Witel - Vertical Stacked Bar Chart
 */
export const RevenueByWitelChart = ({ data, products = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue by Witel</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  const productKeys = products.length > 0 ? products : ['Antares', 'Netmonk', 'OCA', 'Pijar']

  return (
    <div className="bg-white p-6 pb-2 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="witel" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <YAxis 
            tickFormatter={(value) => {
              if (value >= 1000000000) return `${(value / 1000000000).toFixed(0)}M`
              if (value >= 1000000) return `${(value / 1000000).toFixed(0)}Jt`
              return value
            }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<RevenueTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {productKeys.map((product) => (
            <Bar 
              key={product} 
              dataKey={product} 
              stackId="a" 
              fill={PRODUCT_COLORS[product] || '#6b7280'} 
              name={product}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 2. Amount by Witel - Vertical Stacked Bar Chart
 */
export const AmountByWitelChart = ({ data, products = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Amount by Witel</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  const productKeys = products.length > 0 ? products : ['Antares', 'Netmonk', 'OCA', 'Pijar']

  return (
    <div className="bg-white p-6 pb-2 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount by Witel</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="witel" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<AmountTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {productKeys.map((product) => (
            <Bar 
              key={product} 
              dataKey={product} 
              stackId="a" 
              fill={PRODUCT_COLORS[product] || '#6b7280'} 
              name={product}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 3. Product by Segment - Horizontal Stacked Bar Chart
 */
export const ProductBySegmentChart = ({ data, segments = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product by Segment</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  const segmentKeys = segments.length > 0 ? segments : ['LEGS', 'SME']

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product by Segment</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis 
            dataKey="product" 
            type="category" 
            tick={{ fontSize: 11 }}
            width={60}
          />
          <Tooltip content={<AmountTooltip />} />
          <Legend />
          {segmentKeys.map((segment) => (
            <Bar 
              key={segment} 
              dataKey={segment} 
              stackId="a" 
              fill={SEGMENT_COLORS[segment] || '#6b7280'} 
              name={segment}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 4. Product by Channel - Horizontal Stacked Bar Chart
 */
export const ProductByChannelChart = ({ data, channels = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product by Channel</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  const channelKeys = channels.length > 0 ? channels : ['NCX', 'SC-One', 'Unmapped']

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product by Channel</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis 
            dataKey="product" 
            type="category" 
            tick={{ fontSize: 11 }}
            width={60}
          />
          <Tooltip content={<AmountTooltip />} />
          <Legend />
          {channelKeys.map((channel) => (
            <Bar 
              key={channel} 
              dataKey={channel} 
              stackId="a" 
              fill={CHANNEL_COLORS[channel] || '#6b7280'} 
              name={channel}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 5. Product Share - Pie Chart with Labels
 */
export const ProductShareChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Share</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan.</p>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Calculate percentages
  const dataWithPercent = data.map(item => ({
    ...item,
    displayPercent: total > 0 ? ((item.value / total) * 100).toFixed(0) : 0
  }))

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Share</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithPercent.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={PRODUCT_COLORS[entry.name] || '#6b7280'} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [value.toLocaleString('id-ID'), name]}
          />
          <Legend 
            verticalAlign="middle" 
            align="right"
            layout="vertical"
            wrapperStyle={{ paddingLeft: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default {
  RevenueByWitelChart,
  AmountByWitelChart,
  ProductBySegmentChart,
  ProductByChannelChart,
  ProductShareChart
}
