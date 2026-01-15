import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'

const StackedBarChart = ({ title, data, colors = ['#3b82f6', '#ef4444', '#10B981', '#F59E0B'], layout, xAxisLabel, yAxisLabel, grouped = false }) => {
  console.log(`[StackedBarChart Debug] Rendering "${title}"`, { layout, xAxisLabel, yAxisLabel, dataLen: data?.length, sample: data?.[0] })
  
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

  // Debugging: Cek data di console
  // console.log(`Chart Data [${title}]:`, data)

  // Ambil data untuk ditampilkan (Top 10)
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
  const isHorizontal = layout === 'horizontal'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topData}
          layout={isHorizontal ? 'vertical' : 'horizontal'} // Recharts layout logic: 'vertical' means bars are horizontal
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={!isHorizontal} horizontal={isHorizontal} />
          
          {isHorizontal ? (
            // === HORIZONTAL CHART (e.g. Witel) ===
            // Y-Axis = Kategori (Bali, Jatim)
            // X-Axis = Angka (0, 100, 200)
            <>
              <XAxis type="number" tick={{ fontSize: 12 }}>
                <Label value={xAxisLabel} position="bottom" offset={0} style={{ fontSize: '12px', fontWeight: 'bold' }} />
              </XAxis>
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fontSize: 11, fontWeight: 600 }}
              >
                <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }} />
              </YAxis>
            </>
          ) : (
            // === VERTICAL CHART (e.g. Status, Revenue) ===
            // X-Axis = Kategori (In Process, Ready to Bill)
            // Y-Axis = Angka (0, 500, 1000)
            <>
              <XAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fontWeight: 600 }}
                interval={0} // Force show all labels
              >
                <Label value={xAxisLabel} position="bottom" offset={10} style={{ fontSize: '12px', fontWeight: 'bold' }} />
              </XAxis>
              <YAxis type="number" tick={{ fontSize: 12 }}>
                <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }} />
              </YAxis>
            </>
          )}

          <Tooltip 
            formatter={(value) => value.toLocaleString('id-ID')}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />
          <Legend verticalAlign="top" height={36} />
          
          {keys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId={grouped ? undefined : "a"}
              fill={colors[index % colors.length]}
              name={key}
              // Label angka pada bar
              label={{ 
                position: isHorizontal ? 'right' : 'top', 
                formatter: (val) => val > 0 ? val.toLocaleString('id-ID') : '',
                fontSize: 10,
                fill: '#666'
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StackedBarChart