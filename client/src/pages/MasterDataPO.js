import React, { useState, useEffect } from 'react'
import { FiSearch, FiUpload, FiEdit, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import api from '../services/api'
import { useCurrentRole } from '../hooks/useCurrentRole'

const MasterDataPO = () => {
  const [activeTab, setActiveTab] = useState('unmapped') // 'unmapped' | 'master' | 'ao'
  const [loading, setLoading] = useState(false)

  // Data States
  const [data, setData] = useState([]) // For Unmapped & Master
  const [aoData, setAoData] = useState([]) // For Account Officers

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [selectedWitel, setSelectedWitel] = useState('')

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('map') // 'map' | 'add' | 'add_ao'
  const [selectedItem, setSelectedItem] = useState(null)

  // Forms
  const [formData, setFormData] = useState({
    nipnas: '',
    poName: '',
    billCity: '',
    segmen: '',
    witel: ''
  })

  const [aoForm, setAoForm] = useState({
    name: '',
    displayWitel: '',
    filterWitelLama: '',
    specialFilterColumn: '',
    specialFilterValue: ''
  })

  const [poOptions, setPoOptions] = useState([])

  const currentRole = useCurrentRole()
  const canEdit = ['admin', 'superadmin'].includes(currentRole)

  // Fetch Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/po/options')
        if (res.data.success) {
          setPoOptions(res.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch PO options', err)
      }
    }
    fetchOptions()
  }, [])

  // Fetch Data based on active tab
  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'ao') {
        const res = await api.get('/po/ao')
        if (res.data.success) {
          setAoData(res.data.data)
        }
      } else {
        const endpoint = activeTab === 'master' ? '/po/master' : '/po/unmapped'
        const params = {
          page: pagination.page,
          limit: pagination.limit
        }

        if (activeTab === 'master' && search) params.search = search
        if (activeTab === 'unmapped' && selectedWitel) params.witel = selectedWitel

        const res = await api.get(endpoint, { params })
        if (res.data.success) {
          setData(res.data.data.data)
          setPagination(res.data.data.pagination)
        }
      }
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, pagination.page, search, selectedWitel])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPagination({ ...pagination, page: 1 })
    setSearch('')
    setSelectedWitel('')
  }

  const openMapModal = (item) => {
    setModalMode('map')
    setSelectedItem(item)
    setFormData({
      nipnas: item.nipnas || '',
      poName: '',
      billCity: item.billCity || '',
      segmen: item.segmen || '',
      witel: item.billWitel || ''
    })
    setShowModal(true)
  }

  const openAddModal = () => {
    setModalMode('add')
    setSelectedItem(null)
    setFormData({ nipnas: '', poName: '', billCity: '', segmen: '', witel: '' })
    setShowModal(true)
  }

  const openAddAoModal = () => {
    setModalMode('add_ao')
    setAoForm({ name: '', displayWitel: '', filterWitelLama: '', specialFilterColumn: '', specialFilterValue: '' })
    setShowModal(true)
  }

  const handleDeleteAO = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Account Officer?')) return
    try {
      await api.delete(`/po/ao/${id}`)
      fetchData()
    } catch (err) {
      alert('Failed to delete AO')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalMode === 'map') {
        if (!formData.poName) return alert('PO Name is required')
        await api.post('/po/map', {
          orderId: selectedItem.orderId,
          nipnas: formData.nipnas,
          poName: formData.poName,
          billCity: formData.billCity,
          segmen: formData.segmen,
          witelBaru: formData.witel
        })
        alert('Order mapped successfully')
      } else if (modalMode === 'add') {
        if (!formData.poName) return alert('PO Name is required')
        await api.post('/po/master', {
          nipnas: formData.nipnas,
          po: formData.poName,
          segment: formData.segmen,
          billCity: formData.billCity,
          witel: formData.witel
        })
        alert('Master data added successfully')
      } else if (modalMode === 'add_ao') {
        if (!aoForm.name || !aoForm.displayWitel) return alert('Name and Display Witel are required')
        await api.post('/po/ao', aoForm)
        alert('Account Officer added successfully')
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data PO</h1>
          <p className="text-gray-500 text-sm">Manage PO Mappings, Unmapped Orders, and Account Officers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => handleTabChange('unmapped')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'unmapped' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unmapped Orders
        </button>
        <button
          onClick={() => handleTabChange('master')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'master' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Master Dictionary
        </button>
        <button
          onClick={() => handleTabChange('ao')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'ao' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Account Officers
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          {activeTab === 'master' && (
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search NIPNAS / PO..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setPagination({ ...pagination, page: 1 })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
          {activeTab === 'unmapped' && (
            <select
              value={selectedWitel}
              onChange={(e) => setSelectedWitel(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Witels</option>
              {['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'].map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          )}
          {activeTab === 'ao' && (
             <div className="text-sm text-gray-500 flex items-center">
                Managing Account Officers for Digital Product Mapping
             </div>
          )}
        </div>

        <div className="flex gap-2">
          {activeTab === 'master' && canEdit && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <FiPlus /> Add Manual
            </button>
          )}
          {activeTab === 'ao' && canEdit && (
            <button
              onClick={openAddAoModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <FiPlus /> Add AO
            </button>
          )}
          <button
            onClick={fetchData}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'unmapped' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NIPNAS</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Witel</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Current PO</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </>
                ) : activeTab === 'master' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NIPNAS</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">PO Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Segment</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Witel</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bill City</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Display Witel</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Filter Source</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Special Filter</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">Loading data...</td></tr>
              ) : (activeTab === 'ao' ? aoData : data).length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No data found</td></tr>
              ) : (
                (activeTab === 'ao' ? aoData : data).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {activeTab === 'unmapped' ? (
                      <>
                        <td className="px-6 py-4 font-medium text-blue-600">{item.orderId}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(item.orderCreatedDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{item.nipnas || '-'}</td>
                        <td className="px-6 py-4">{item.standardName || '-'}</td>
                        <td className="px-6 py-4">{item.billWitel}</td>
                        <td className="px-6 py-4 text-red-500 font-medium bg-red-50 rounded w-fit px-2">{item.poName}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openMapModal(item)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Map Order
                          </button>
                        </td>
                      </>
                    ) : activeTab === 'master' ? (
                      <>
                        <td className="px-6 py-4 font-medium">{item.nipnas}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{item.po}</td>
                        <td className="px-6 py-4">{item.segment || '-'}</td>
                        <td className="px-6 py-4">{item.witel || '-'}</td>
                        <td className="px-6 py-4">{item.billCity || '-'}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                        <td className="px-6 py-4">{item.displayWitel}</td>
                        <td className="px-6 py-4">{item.filterWitelLama}</td>
                        <td className="px-6 py-4">
                          {item.specialFilterColumn && item.specialFilterValue
                            ? `${item.specialFilterColumn}: ${item.specialFilterValue}`
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {canEdit && (
                            <button
                              onClick={() => handleDeleteAO(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Only for non-AO tabs for now as AO is typically small list) */}
        {activeTab !== 'ao' && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === 'map' ? 'Map Order to PO' : modalMode === 'add_ao' ? 'Add Account Officer' : 'Add Master Data'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalMode === 'map' && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                  <p><strong>Order ID:</strong> {selectedItem?.orderId}</p>
                  <p><strong>Customer:</strong> {selectedItem?.standardName}</p>
                </div>
              )}

              {modalMode === 'add_ao' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={aoForm.name}
                      onChange={e => setAoForm({ ...aoForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Witel</label>
                    <input
                      type="text"
                      value={aoForm.displayWitel}
                      onChange={e => setAoForm({ ...aoForm, displayWitel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter Witel Lama (Source)</label>
                    <input
                      type="text"
                      value={aoForm.filterWitelLama}
                      onChange={e => setAoForm({ ...aoForm, filterWitelLama: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Filter Col</label>
                      <input
                        type="text"
                        placeholder="e.g. segment"
                        value={aoForm.specialFilterColumn}
                        onChange={e => setAoForm({ ...aoForm, specialFilterColumn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Filter Val</label>
                      <input
                        type="text"
                        placeholder="e.g. LEGS"
                        value={aoForm.specialFilterValue}
                        onChange={e => setAoForm({ ...aoForm, specialFilterValue: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIPNAS</label>
                    <input
                      type="text"
                      value={formData.nipnas}
                      onChange={e => setFormData({ ...formData, nipnas: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PO Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        list="po-options"
                        value={formData.poName}
                        onChange={e => setFormData({ ...formData, poName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Select or type PO Name"
                        required
                      />
                      <datalist id="po-options">
                        {poOptions.map((opt, i) => <option key={i} value={opt} />)}
                      </datalist>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Witel</label>
                      <input
                        type="text"
                        value={formData.witel}
                        onChange={e => setFormData({ ...formData, witel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bill City</label>
                      <input
                        type="text"
                        value={formData.billCity}
                        onChange={e => setFormData({ ...formData, billCity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
                    <input
                      type="text"
                      value={formData.segmen}
                      onChange={e => setFormData({ ...formData, segmen: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <FiSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MasterDataPO
