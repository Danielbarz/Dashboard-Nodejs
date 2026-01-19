import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiEdit2, FiPlus, FiTrash2, FiArrowLeft, FiX, FiSave, FiAlertCircle } from 'react-icons/fi'
import api from '../services/api'

const ManageTargets = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [targets, setTargets] = useState([])
  const [loading, setLoading] = useState(false)
  const [datinProducts, setDatinProducts] = useState([])
  
  // Dashboard Type State
  const initialType = searchParams.get('type') || 'DIGITAL'
  const [dashboardType, setDashboardType] = useState(initialType)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    periodType: 'BULANAN',
    targetType: 'REVENUE',
    dashboardType: initialType,
    witel: 'ALL',
    product: 'ALL',
    value: '',
    periodDate: new Date().toISOString().split('T')[0]
  })

  // Update URL when dashboardType changes
  useEffect(() => {
    setSearchParams({ type: dashboardType })
    setFormData(prev => ({ ...prev, dashboardType }))
  }, [dashboardType, setSearchParams])

  const fetchDatinOptions = async () => {
    try {
      const res = await api.get('/dashboard/sos-datin/filters')
      if (res.data?.data?.products) {
        setDatinProducts(res.data.data.products)
      }
    } catch (err) {
      console.error('Failed to fetch DATIN options', err)
    }
  }

  useEffect(() => {
    if (dashboardType === 'DATIN') {
      fetchDatinOptions()
    }
  }, [dashboardType])

  const fetchTargets = async () => {
    setLoading(true)
    try {
      const res = await api.get('/master/targets', { params: { type: dashboardType } })
      if (res.data.success) {
        setTargets(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch targets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTargets()
  }, [dashboardType])

  const openModal = (target = null) => {
    if (target) {
      setEditingId(target.id)
      setFormData({
        periodType: target.periodType,
        targetType: target.targetType,
        dashboardType: target.dashboardType || dashboardType,
        witel: target.witel,
        product: target.product,
        value: target.value,
        periodDate: new Date(target.periodDate).toISOString().split('T')[0]
      })
    } else {
      setEditingId(null)
      setFormData({
        periodType: 'BULANAN',
        targetType: 'REVENUE',
        dashboardType: dashboardType,
        witel: 'ALL',
        product: 'ALL',
        value: '',
        periodDate: new Date().toISOString().split('T')[0]
      })
    }
    setError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (editingId) {
        await api.put(`/master/targets/${editingId}`, formData)
      } else {
        await api.post('/master/targets', formData)
      }
      fetchTargets()
      closeModal()
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal menyimpan target')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus target ini?')) {
      try {
        await api.delete(`/master/targets/${id}`)
        fetchTargets()
      } catch (error) {
        alert('Gagal menghapus target')
      }
    }
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(dashboardType === 'DATIN' ? '/datin' : '/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Target</h1>
            <p className="text-gray-500 text-sm">Kelola target KPI {dashboardType === 'DATIN' ? 'DATIN' : 'Digital Product'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
            <FiPlus size={18} />
            Tambah Target
            </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Periode</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Witel</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Produk / Segmen</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Nilai Target</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && targets.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400">Memuat data...</td></tr>
              ) : targets.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400">Belum ada target yang diatur untuk {dashboardType}.</td></tr>
              ) : (
                targets.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {new Date(item.periodDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.periodType === 'BULANAN' ? 'bg-blue-100 text-blue-700' :
                        item.periodType === 'KUARTAL' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.periodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.targetType === 'REVENUE' ? 'Revenue' : 'Jumlah Order'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{item.witel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                      {item.targetType === 'REVENUE' ? `Rp ${item.value.toLocaleString('id-ID')}` : item.value.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Target"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Target"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-hidden transform transition-all animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Detail Target' : 'Tambah Target Baru'}</h2>
                  <p className="text-sm text-gray-500">Lengkapi detail target KPI ({formData.dashboardType}) di bawah ini</p>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <FiX size={24} />
                </button>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
                  <FiAlertCircle className="flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dashboard Type - Hidden/Readonly or Selectable if needed, but easier to just use current tab context */}
                  {/* Kategori Waktu */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori Waktu</label>
                    <select
                      value={formData.periodType}
                      onChange={(e) => setFormData({ ...formData, periodType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-gray-50 focus:bg-white"
                    >
                      <option value="BULANAN">Bulanan</option>
                      <option value="KUARTAL">Kuartal</option>
                      <option value="TAHUNAN">Tahunan</option>
                    </select>
                  </div>

                  {/* Tanggal Periode */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Mulai Periode</label>
                    <input
                      type="date"
                      value={formData.periodDate}
                      onChange={(e) => setFormData({ ...formData, periodDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Jenis Target */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis Target</label>
                    <select
                      value={formData.targetType}
                      onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-gray-50 focus:bg-white"
                    >
                      <option value="REVENUE">Revenue</option>
                      <option value="ORDER">Jumlah Order</option>
                    </select>
                  </div>

                  {/* Nilai Target */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nilai Target</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder={formData.targetType === 'REVENUE' ? 'Contoh: 1000000000' : 'Contoh: 50'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Witel */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Witel</label>
                    <select
                      value={formData.witel}
                      onChange={(e) => setFormData({ ...formData, witel: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-gray-50 focus:bg-white"
                    >
                      <option value="ALL">ALL</option>
                      <option value="BALI">BALI</option>
                      <option value="SURAMADU">SURAMADU</option>
                      <option value="JATIM BARAT">JATIM BARAT</option>
                      <option value="JATIM TIMUR">JATIM TIMUR</option>
                      <option value="NUSA TENGGARA">NUSA TENGGARA</option>
                    </select>
                  </div>

                  {/* Product / Segment - DYNAMIC based on Dashboard Type */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Produk
                    </label>
                    
                    {formData.dashboardType === 'DIGITAL' ? (
                        <select
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-gray-50 focus:bg-white"
                        >
                        <option value="ALL">ALL</option>
                        <option value="OCA">OCA</option>
                        <option value="Netmonk">Netmonk</option>
                        <option value="Pijar">Pijar</option>
                        <option value="Antares">Antares</option>
                        </select>
                    ) : (
                        <select
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-gray-50 focus:bg-white"
                        >
                        <option value="ALL">ALL</option>
                        {datinProducts.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                        </select>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                  >
                    <FiSave size={18} />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Target'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageTargets