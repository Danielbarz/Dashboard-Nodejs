import React from 'react'

const KPICard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'border-l-blue-500 text-blue-600',
    green: 'border-l-green-500 text-green-600',
    orange: 'border-l-orange-500 text-orange-600'
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          </p>
        </div>
        {icon && (
          <div className={`text-4xl opacity-20 ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default KPICard
