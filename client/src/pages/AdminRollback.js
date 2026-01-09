import React, { useState } from 'react'

const tabs = [
  { key: 'digital', label: 'Digital Product' },
  { key: 'jt', label: 'Analysis JT' },
  { key: 'datin', label: 'Analysis Datin' }
]

const WarningBox = () => (
  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
    <div className="flex items-center space-x-3">
      <span className="text-xl">⚠️</span>
      <div>
        <p className="font-bold">Peringatan Keras!</p>
        <p className="text-sm">Fitur ini akan menghapus data dari tabel 'document_data', 'order_products', dan 'update_logs'.</p>
      </div>
    </div>
  </div>
)

const AdminRollback = () => {
  const [activeTab, setActiveTab] = useState('digital')
  const [batchId, setBatchId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRollback = async () => {
    if (!batchId.trim()) {
      alert('Please enter a Batch ID')
      return
    }

    if (!window.confirm('Are you sure? This will delete data from related tables.')) {
      return
    }

    setLoading(true)
    try {
      // API call placeholder - implement when backend rollback endpoint is ready
      console.log('Rollback initiated for batch:', batchId, 'type:', activeTab)
      alert('Rollback feature coming soon - backend endpoint needed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center space-x-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-semibold ${
                activeTab === tab.key
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'digital' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <WarningBox />
              <div className="bg-white rounded-lg shadow p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Batch ID (Digital Product) untuk Di-Rollback</label>
                  <input
                    type="text"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    placeholder="Masukkan atau pilih Batch ID dari daftar..."
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  onClick={handleRollback}
                  disabled={loading}
                  className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'JALANKAN ROLLBACK DIGITAL PRODUCT'}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Riwayat Batch Digital Product</h3>
              <p className="text-sm text-gray-500">Batch history endpoint akan ditampilkan di sini ketika backend siap.</p>
            </div>
          </div>
        )}

        {activeTab === 'jt' && (
          <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
            Rollback untuk Analysis JT akan ditempatkan di sini.
          </div>
        )}

        {activeTab === 'datin' && (
          <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
            Rollback untuk Analysis Datin akan ditempatkan di sini.
          </div>
        )}
      </div>
    </>
  )
}

export default AdminRollback
