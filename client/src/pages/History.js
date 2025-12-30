import React, { useState, useEffect } from 'react'

const History = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch history data from API
    setTimeout(() => {
      setTransactions([
        { id: 1, action: 'Created Digital Product', user: 'Admin Telkom', date: '2024-12-24 14:30', status: 'success' },
        { id: 2, action: 'Updated Product Revenue', user: 'Admin Telkom', date: '2024-12-23 10:15', status: 'success' },
        { id: 3, action: 'Exported Excel Report', user: 'Admin Telkom', date: '2024-12-22 09:45', status: 'success' },
        { id: 4, action: 'Bulk Import Data', user: 'Admin Telkom', date: '2024-12-21 16:20', status: 'success' },
      ])
      setLoading(false)
    }, 500)
  }, [])

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">History</h1>
          <p className="text-gray-600 mt-1">Riwayat aktivitas dan perubahan data Anda</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">Tidak ada riwayat</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{transaction.action}</p>
                      <p className="text-sm text-gray-600 mt-1">by {transaction.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  )
}

export default History
