import React from 'react'

const KPICard = ({ title, value, icon, color = 'blue', target = null, achievement = null }) => {
  const colorClasses = {
    blue: 'border-l-blue-500 text-blue-600',
    green: 'border-l-green-500 text-green-600',
    orange: 'border-l-orange-500 text-orange-600',
    red: 'border-l-red-500 text-red-600'
  }

  // Determine active theme color based on achievement percentage
  let activeColor = color
  if (target !== null && target !== 0 && achievement !== null) {
    const achNum = parseFloat(achievement)
    if (!isNaN(achNum)) {
      activeColor = achNum >= 100 ? 'green' : 'red'
    }
  }

  const themeClass = colorClasses[activeColor] || colorClasses.blue

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${themeClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${themeClass}`}>
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          </p>
          
          {(target !== null && target !== 0) && (
            <div className="mt-3 flex items-center gap-3 text-xs border-t pt-2 border-gray-100">
              <div>
                <span className="text-gray-400">Target: </span>
                <span className="font-semibold text-gray-700">
                  {typeof target === 'number' ? target.toLocaleString('id-ID') : target}
                </span>
              </div>
              {achievement !== null && (
                <div className={`font-bold ${parseFloat(achievement) >= 100 ? 'text-green-600' : 'text-red-500'}`}>
                  {achievement}% Achieved
                </div>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={`text-4xl opacity-20 ${themeClass} flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default KPICard
