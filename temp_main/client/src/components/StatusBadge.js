import React from 'react'

const StatusBadge = ({ status }) => {
  const statusMap = {
    'complete': { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
    'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Proses' },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Batal' }
  }

  const config = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge
