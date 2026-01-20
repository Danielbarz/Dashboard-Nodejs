import React, { memo, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

const STATUS_COLORS = {
  'READY TO BILL': '#10b981',
  'PROVIDE ORDER': '#3b82f6',
  'IN PROCESS': '#f59e0b',
  'PROV. COMPLETE': '#8b5cf6',
  'PIPELINE': '#6366f1',
  'UNKNOWN': '#9ca3af'
}

const CONSISTENT_STATUS_KEYS = ['READY TO BILL', 'PROVIDE ORDER', 'IN PROCESS', 'PROV. COMPLETE', 'PIPELINE']

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

const useStableData = (data, sortKey = 'name') => {
  return useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => (a[sortKey] || '').localeCompare(b[sortKey] || ''));
  }, [data, sortKey]);
}

// --- CHARTS ---

export const OrderByStatusChart = memo(({ data }) => {
  const stableData = useStableData(data);
  return (
    <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order by Status</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={stableData}
            cx="50%" cy="50%"
            innerRadius={60} outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            isAnimationActive={false}
          >
            {stableData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#9ca3af'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
})

export const RevenueByStatusChart = memo(({ data }) => {
  const stableData = useStableData(data);
  return (
    <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Status</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={stableData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} height={60} interval={0} angle={-45} textAnchor="end" />
          <YAxis tickFormatter={formatRupiah} width={80} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
          <Legend />
          <Bar dataKey="< 3 Bulan" stackId="a" fill="#3b82f6" isAnimationActive={false} />
          <Bar dataKey="> 3 Bulan" stackId="a" fill="#ef4444" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})

// Renamed from StatusPerWitelChart -> OrderByWitelChart (Stacked Order)
export const OrderByWitelChart = memo(({ data }) => (
  <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order per Witel</h3>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9 }} interval={0} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {CONSISTENT_STATUS_KEYS.map((key) => (
          <Bar key={key} dataKey={key} stackId="a" fill={STATUS_COLORS[key]} isAnimationActive={false} />
        ))}
        {/* Target Line */}
        {data && data[0] && data[0].target !== undefined && (
             <Line dataKey="target" stroke="#ff0000" strokeWidth={2} dot={false} isAnimationActive={false} />
        )}
      </BarChart>
    </ResponsiveContainer>
  </div>
))

// Renamed from RevenuePerWitelChart -> RevenueByWitelChart
export const RevenueByWitelChart = memo(({ data }) => (
  <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue per Witel</h3>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={formatRupiah} tick={{ fontSize: 10 }} />
        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9 }} interval={0} />
        <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
        <Legend />
        {CONSISTENT_STATUS_KEYS.map((key) => (
          <Bar key={key} dataKey={key} stackId="a" fill={STATUS_COLORS[key]} isAnimationActive={false} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
))

export const RevenueTrendChart = memo(({ data }) => (
  <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend Over Time</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatRupiah} width={80} tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
        <Legend />
        {CONSISTENT_STATUS_KEYS.map((key) => (
          <Line key={key} type="monotone" dataKey={key} stroke={STATUS_COLORS[key]} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
        ))}
        <Line type="monotone" dataKey="target" stroke="#ff0000" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
))

// New Component: Order Trend
export const OrderTrendChart = memo(({ data }) => (
  <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trend Over Time</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis width={40} tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} name="Total Order" />
      </LineChart>
    </ResponsiveContainer>
  </div>
))

// Renamed from RevenuePerProductChart -> ProductShareChart
export const ProductShareChart = memo(({ data }) => (
  <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue per Product</h3>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={formatRupiah} tick={{ fontSize: 10 }} />
        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9 }} interval={0} />
        <Tooltip content={<CustomTooltip formatter={formatRupiah} />} />
        <Bar dataKey="value" fill="#8b5cf6" name="Revenue" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  </div>
))

// Aliases for backward compatibility (in case old files use them)
export const StatusPerWitelChart = OrderByWitelChart
export const RevenuePerWitelChart = RevenueByWitelChart
export const OrderPerWitelChart = memo(({ data }) => (
  <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order per Witel</h3>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} height={60} interval={0} angle={-45} textAnchor="end" />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="#3b82f6" name="Total Order" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  </div>
))
export const RevenuePerProductChart = ProductShareChart