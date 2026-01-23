import React, { useState, useEffect } from 'react'
import api from '../services/coreService'

const tabs = [
  { key: 'digital', label: 'Digital Product' },
  { key: 'jt', label: 'Analysis JT' },
  { key: 'datin', label: 'Analysis Datin' },
  { key: 'hsi', label: 'HSI Data' },
  { key: 'sos', label: 'SOS Data / Analysis' }
]

const WarningBox = () => (
  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
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
  const [history, setHistory] = useState([])
  const [fetchingHistory, setFetchingHistory] = useState(false)

  useEffect(() => {
    fetchBatchHistory()
  }, [activeTab])

  const fetchBatchHistory = async () => {
    try {
      setFetchingHistory(true)
      const response = await api.get('/admin/batches', { params: { type: activeTab } })
      setHistory(response.data?.data || [])
    } catch (err) {
      console.error('Error fetching history:', err)
    } finally {
      setFetchingHistory(false)
    }
  }

  const handleRollback = async (selectedId) => {
    const targetId = selectedId || batchId
    if (!targetId.trim()) {
      alert('Please enter a Batch ID')
      return
    }

    if (!window.confirm('Are you sure? This will delete data from related tables.')) {
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/admin/rollback', { 
        batchId: targetId, 
        type: activeTab 
      })
      alert(response.data?.message || 'Rollback success')
      setBatchId('')
      fetchBatchHistory()
    } catch (err) {
      alert(err.response?.data?.message || 'Rollback failed')
    } finally {
      setLoading(false)
    }
  }

  return (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <WarningBox />
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Batch ID ({tabs.find(t => t.key === activeTab)?.label}) untuk Di-Rollback</label>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Masukkan atau pilih Batch ID dari daftar..."
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => handleRollback()}
              disabled={loading}
              className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `JALANKAN ROLLBACK ${tabs.find(t => t.key === activeTab)?.label.toUpperCase()}`}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Riwayat Batch {tabs.find(t => t.key === activeTab)?.label}</h3>
          {fetchingHistory ? (
            <p className="text-sm text-gray-500 italic">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Belum ada riwayat batch.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {history.map((item) => (
                <div key={item.batchId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-gray-100">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono font-bold text-blue-600 truncate">{item.batchId}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(item.createdAt).toLocaleString('id-ID')} • {item.recordCount} baris
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRollback(item.batchId)}
                    className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminRollback
