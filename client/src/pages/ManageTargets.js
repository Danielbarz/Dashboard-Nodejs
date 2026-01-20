import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiEdit2, FiPlus, FiTrash2, FiArrowLeft, FiX, FiAlertCircle, FiFilter } from 'react-icons/fi'
import api from '../services/api'

const ManageTargets = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const urlType = searchParams.get('type') // 'DIGITAL' or 'DATIN' or null

  // If URL type is present, lock the view. Otherwise allow tabs.
  const isLockedMode = !!urlType
  
  const [targets, setTargets] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(urlType || 'ALL') 
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    dashboardType: 'DIGITAL',
    periodType: 'BULANAN',
    targetType: 'REVENUE',
    witel: 'ALL',
    product: 'ALL',
    value: '',
    periodDate: new Date().toISOString().split('T')[0]
  })

  // Sync tab with URL if present
  useEffect(() => {
    if (urlType && ['DIGITAL', 'DATIN'].includes(urlType)) {
      setActiveTab(urlType)
    }
  }, [urlType])

  const fetchTargets = async () => {
    setLoading(true)
    try {
      const res = await api.get('/master/targets')
      if (res.data.success) {
        setTargets(res.data.data)
      }
    } catch (error) { console.error('Failed to fetch targets:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTargets() }, [])

  // Filtered Targets based on Tab
  const filteredTargets = targets.filter(t => {
    if (activeTab === 'ALL') return true
    return t.dashboardType === activeTab
  })

  const openModal = (target = null) => {
    if (target) {
      setEditingId(target.id)
      setFormData({
        dashboardType: target.dashboardType || 'DIGITAL',
        periodType: target.periodType,
        targetType: target.targetType,
        witel: target.witel,
        product: target.product,
        value: target.value,
        periodDate: new Date(target.periodDate).toISOString().split('T')[0]
      })
    } else {
      setEditingId(null)
      const defaultDashboard = activeTab === 'ALL' ? 'DIGITAL' : activeTab
      setFormData({
        dashboardType: defaultDashboard,
        periodType: 'BULANAN',
        targetType: 'REVENUE',
        witel: 'ALL',
        product: defaultDashboard === 'DATIN' ? 'DATIN' : 'ALL',
        value: '',
        periodDate: new Date().toISOString().split('T')[0]
      })
    }
    setError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      if (editingId) await api.put(`/master/targets/${editingId}`, formData)
      else await api.post('/master/targets', formData)
      fetchTargets(); closeModal();
    } catch (error) { 
      console.error("Submit Error:", error);
      const msg = error.response?.data?.message || error.message || 'Gagal menyimpan target';
      setError(msg);
    }
    finally { setIsSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Hapus target ini?')) {
      try { await api.delete(`/master/targets/${id}`); fetchTargets(); }
      catch (error) { alert('Gagal menghapus target') }
    }
  }

  // Dynamic Title
  const getPageTitle = () => {
    if (urlType === 'DATIN') return 'Manajemen Target DATIN'
    if (urlType === 'DIGITAL') return 'Manajemen Target Digital Product'
    return 'Manajemen Target (Semua)'
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><FiArrowLeft size={20} /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
            <p className="text-gray-500 text-sm">
              {urlType ? 'Atur target KPI khusus untuk dashboard ini' : 'Atur target KPI secara terpusat'}
            </p>
          </div>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md"><FiPlus size={18} /> Tambah Target</button>
      </div>

      {/* Tabs (Only show if NOT in locked mode) */}
      {!isLockedMode && (
        <div className="flex gap-2 border-b border-gray-200">
          {['ALL', 'DIGITAL', 'DATIN'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'ALL' ? 'Semua Target' : tab === 'DIGITAL' ? 'Digital Product' : 'DATIN'}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {filteredTargets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FiFilter size={48} className="mb-4 opacity-20" />
            <p>Belum ada target.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {/* Hide Dashboard Column if Locked Mode */}
                  {!isLockedMode && <th className="px-6 py-3 text-left">Dashboard</th>}
                  <th className="px-6 py-3 text-left">Periode</th>
                  <th className="px-6 py-3 text-left">Kategori</th>
                  <th className="px-6 py-3 text-left">Witel</th>
                  <th className="px-6 py-3 text-left">Produk</th>
                  <th className="px-6 py-3 text-right">Nilai Target</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-600">
                {filteredTargets.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {!isLockedMode && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.dashboardType === 'DATIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.dashboardType}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{new Date(item.periodDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{item.periodType}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">{item.witel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-black text-gray-900">{item.targetType === 'REVENUE' ? `Rp ${Number(item.value).toLocaleString('id-ID')}` : Number(item.value).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Target' : 'Tambah Target Baru'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <FiAlertCircle className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Only show Dashboard Selection if NOT in locked mode */}
                {!isLockedMode && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Pilih Dashboard</label>
                    <select 
                      value={formData.dashboardType} 
                      onChange={(e) => setFormData({ ...formData, dashboardType: e.target.value, product: e.target.value === 'DATIN' ? 'DATIN' : 'ALL' })} 
                      className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DIGITAL">Digital Product</option>
                      <option value="DATIN">DATIN</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Kategori Waktu</label>
                  <select value={formData.periodType} onChange={(e) => setFormData({ ...formData, periodType: e.target.value })} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                    <option value="BULANAN">Bulanan</option><option value="KUARTAL">Kuartal</option><option value="TAHUNAN">Tahunan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Mulai Periode</label>
                  <input type="date" value={formData.periodDate} onChange={(e) => setFormData({ ...formData, periodDate: e.target.value })} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Jenis Target</label>
                  <select value={formData.targetType} onChange={(e) => setFormData({ ...formData, targetType: e.target.value })} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                    <option value="REVENUE">Revenue</option><option value="ORDER">Jumlah Order</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nilai Target</label>
                  <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full p-3 bg-gray-50 border rounded-xl outline-none font-bold" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Witel</label>
                  <select value={formData.witel} onChange={(e) => setFormData({ ...formData, witel: e.target.value })} className="w-full p-3 bg-gray-50 border rounded-xl outline-none font-bold">
                    <option value="ALL">ALL</option><option value="BALI">BALI</option><option value="SURAMADU">SURAMADU</option><option value="JATIM BARAT">JATIM BARAT</option><option value="JATIM TIMUR">JATIM TIMUR</option><option value="NUSA TENGGARA">NUSA TENGGARA</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Product</label>
                  {/* Dynamic Product Dropdown based on active type */}
                  {formData.dashboardType === 'DATIN' ? (
                    <select value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                      <option value="DATIN">DATIN (All Products)</option>
                    </select>
                  ) : (
                    <select value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full p-3 bg-gray-50 border rounded-xl outline-none">
                      <option value="ALL">ALL</option><option value="OCA">OCA</option><option value="Netmonk">Netmonk</option><option value="Pijar">Pijar</option><option value="Antares">Antares</option>
                    </select>
                  )}
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg">{isSubmitting ? 'Menyimpan...' : 'Simpan Target'}</button>
                <button type="button" onClick={closeModal} className="px-6 py-3 text-gray-600 font-bold border rounded-xl hover:bg-gray-50">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageTargets
