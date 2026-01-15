import React, { useState, useEffect } from 'react'
import {
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiX,
  FiChevronLeft, FiChevronRight, FiAlertCircle, FiDatabase, FiUser
} from 'react-icons/fi'
import api from '../services/api'

const MasterDataPO = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('po') // 'po', 'ao', 'mapping'
  const [error, setError] = useState(null)

  const [accountOfficers, setAccountOfficers] = useState([])
  const [poMaster, setPoMaster] = useState([])
  const [unmappedOrders, setUnmappedOrders] = useState([])

  // Modal States
  const [showAOModal, setShowAOModal] = useState(false)
  const [showPOModal, setShowPOModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState(null)

  // Pagination State for PO
  const [currentPagePO, setCurrentPagePO] = useState(1)
  const [itemsPerPagePO] = useState(10)

  // Forms
  const [aoForm, setAoForm] = useState({
    name: '', displayWitel: '', filterWitelLama: '', specialFilterColumn: '', specialFilterValue: ''
  })
  const [poForm, setPoForm] = useState({
    nipnas: '', namaPo: '', segment: '', witel: ''
  })
  const [editForm, setEditForm] = useState({
    poName: '', billCity: '', billWitel: '', segment: ''
  })

  // --- Effects ---
  useEffect(() => {
    fetchAccountOfficers()
    fetchPOMaster()
    fetchUnmappedOrders()
  }, [])

  // --- Fetch Functions ---
    const fetchAccountOfficers = async () => {
      try {
        setError(null)
        const response = await api.get('/master/account-officers')
        const data = response.data.data
        setAccountOfficers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching AO:', error)
        setError('Gagal memuat data Account Officer')
      }
    }

    const fetchPOMaster = async () => {
      try {
        setError(null)
        const response = await api.get('/master/po')
        const data = response.data.data
        setPoMaster(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching PO:', error)
        setError('Gagal memuat data Master PO')
      }
    }
  const fetchUnmappedOrders = async () => {
    try {
      setError(null)
      const response = await api.get('/master/unmapped-orders')
      const data = response.data.data
      setUnmappedOrders(Array.isArray(data) ? data : (data?.items || []))
    } catch (error) {
      console.error('Error fetching unmapped:', error)
      setError('Gagal memuat data Unmapped Orders')
    }
  }

  // --- Handlers ---
  const handleAddAO = async () => {
    try {
      await api.post('/master/account-officers', aoForm)
      setShowAOModal(false)
      setAoForm({ name: '', displayWitel: '', filterWitelLama: '', specialFilterColumn: '', specialFilterValue: '' })
      fetchAccountOfficers()
    } catch (error) { alert('Gagal menambah AO') }
  }

  const handleDeleteAO = async (id) => {
    if (!window.confirm('Hapus Account Officer ini?')) return
    try {
      await api.delete(`/master/account-officers/${id}`)
      fetchAccountOfficers()
    } catch (error) { alert('Gagal menghapus AO') }
  }

  const handleAddPO = async () => {
    try {
      await api.post('/master/po', poForm)
      setShowPOModal(false)
      setPoForm({ nipnas: '', namaPo: '', segment: '', witel: '' })
      fetchPOMaster()
    } catch (error) { alert('Gagal menambah PO') }
  }

  const handleDeletePO = async (id) => {
    if (!window.confirm('Hapus PO ini?')) return
    try {
      await api.delete(`/master/po/${id}`)
      fetchPOMaster()
    } catch (error) { alert('Gagal menghapus PO') }
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setEditForm({
      poName: order.poName || '',
      billCity: order.billCity || '',
      billWitel: order.billWitel || '',
      segment: order.segment || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateMapping = async () => {
    try {
      await api.put(`/master/update-mapping/${selectedOrder.id}`, editForm)
      setShowEditModal(false)
      fetchUnmappedOrders()
    } catch (error) { alert('Gagal update mapping') }
  }

  const handleAutoMapping = async () => {
    try {
      await api.post('/master/auto-mapping', {})
      fetchUnmappedOrders()
      alert('Mapping otomatis selesai!')
    } catch (error) { alert('Gagal auto mapping') }
  }

  // --- Pagination Logic (PO) ---
  const indexOfLastPO = currentPagePO * itemsPerPagePO
  const indexOfFirstPO = indexOfLastPO - itemsPerPagePO
  const currentPOs = poMaster.slice(indexOfFirstPO, indexOfLastPO)
  const totalPagesPO = Math.ceil(poMaster.length / itemsPerPagePO)

  // --- Render Helpers ---
  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
        activeTab === id
          ? 'border-red-600 text-red-600 bg-red-50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon className={`mr-2 ${activeTab === id ? 'text-red-600' : 'text-gray-400'}`} size={18} />
      {label}
      {count !== undefined && (
        <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs ${
          activeTab === id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  )

  const Modal = ({ title, children, onClose, onSave, saveLabel = "Simpan" }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all scale-100">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm shadow-sm transition-colors flex items-center"
          >
            <FiCheck className="mr-2" /> {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 shadow-sm rounded-r-lg">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-400 mr-3" size={20} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-800">Master Data Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data referensi PO, Account Officer, dan Mapping Order.</p>
        </div>

        <div className="flex border-b border-gray-200 overflow-x-auto">
          <TabButton id="po" label="Master PO" icon={FiDatabase} count={poMaster.length} />
          <TabButton id="ao" label="Account Officers" icon={FiUser} count={accountOfficers.length} />
          <TabButton id="mapping" label="Unmapped Orders" icon={FiAlertCircle} count={unmappedOrders.length} />
        </div>

        {/* --- TAB CONTENT: MASTER PO --- */}
        {activeTab === 'po' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari PO / NIPNAS..."
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 w-64"
                />
              </div>
              <button
                onClick={() => setShowPOModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
              >
                <FiPlus className="mr-2" /> Tambah PO
              </button>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nama PO', 'NIPNAS', 'Segment', 'Bill City', 'Witel', 'Aksi'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPOs.length > 0 ? (
                    currentPOs.map((po) => (
                      <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{po.namaPo}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{po.nipnas}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{po.segment}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{po.billCity || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{po.witel}</td>
                        <td className="px-6 py-4 text-sm">
                          <button onClick={() => handleDeletePO(po.id)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors">
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">Belum ada data PO.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPagesPO > 1 && (
              <div className="flex items-center justify-between mt-4 border-t pt-4">
                <span className="text-sm text-gray-700">
                  Halaman <span className="font-medium">{currentPagePO}</span> dari <span className="font-medium">{totalPagesPO}</span>
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPagePO(p => Math.max(1, p - 1))}
                    disabled={currentPagePO === 1}
                    className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentPagePO(p => Math.min(totalPagesPO, p + 1))}
                    disabled={currentPagePO === totalPagesPO}
                    className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: ACCOUNT OFFICERS --- */}
        {activeTab === 'ao' && (
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowAOModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
              >
                <FiPlus className="mr-2" /> Tambah AO
              </button>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nama AO', 'Display Witel', 'Filter Source', 'Special Filter', 'Aksi'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accountOfficers.map((ao) => (
                    <tr key={ao.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{ao.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ao.displayWitel}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ao.filterWitelLama}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-xs font-mono bg-gray-50 rounded p-1">
                        {ao.specialFilterColumn ? `${ao.specialFilterColumn}: ${ao.specialFilterValue}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button onClick={() => handleDeleteAO(ao.id)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: MAPPING --- */}
        {activeTab === 'mapping' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div>
                <h3 className="text-sm font-bold text-yellow-800">Perhatian</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Terdapat <span className="font-bold">{unmappedOrders.length} order</span> yang belum memiliki mapping PO valid.
                </p>
              </div>
              <button
                onClick={handleAutoMapping}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium shadow-sm"
              >
                <FiCheck className="mr-2" /> Auto Mapping
              </button>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'NIPNAS', 'Pelanggan', 'Cust City', 'Bill Witel', 'Aksi'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unmappedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-blue-600 font-mono">{order.orderId}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.nipnas}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.custCity}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.billWitel || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <button onClick={() => handleEditOrder(order)} className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                          <FiEdit2 size={14} /> <span>Map Manual</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. Modal Tambah PO */}
      {showPOModal && (
        <Modal title="Tambah PO Baru" onClose={() => setShowPOModal(false)} onSave={handleAddPO}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama PO</label>
              <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                value={poForm.namaPo} onChange={(e) => setPoForm({ ...poForm, namaPo: e.target.value })} placeholder="Nama Account Manager" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIPNAS</label>
              <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                value={poForm.nipnas} onChange={(e) => setPoForm({ ...poForm, nipnas: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segmen</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={poForm.segment} onChange={(e) => setPoForm({ ...poForm, segment: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Witel</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={poForm.witel} onChange={(e) => setPoForm({ ...poForm, witel: e.target.value })} />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 2. Modal Tambah AO */}
      {showAOModal && (
        <Modal title="Tambah Account Officer" onClose={() => setShowAOModal(false)} onSave={handleAddAO}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama AO</label>
              <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                value={aoForm.name} onChange={(e) => setAoForm({ ...aoForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Witel</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={aoForm.displayWitel} onChange={(e) => setAoForm({ ...aoForm, displayWitel: e.target.value })} placeholder="Ex: JATIM BARAT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter Source</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={aoForm.filterWitelLama} onChange={(e) => setAoForm({ ...aoForm, filterWitelLama: e.target.value })} placeholder="Ex: MADIUN" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Col (Opt)</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={aoForm.specialFilterColumn} onChange={(e) => setAoForm({ ...aoForm, specialFilterColumn: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Val (Opt)</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={aoForm.specialFilterValue} onChange={(e) => setAoForm({ ...aoForm, specialFilterValue: e.target.value })} />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Modal Edit Mapping */}
      {showEditModal && selectedOrder && (
        <Modal title="Update Mapping Manual" onClose={() => setShowEditModal(false)} onSave={handleUpdateMapping} saveLabel="Update">
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold">Pelanggan</p>
              <p className="text-sm font-bold text-gray-800">{selectedOrder.customerName}</p>
              <p className="text-xs text-gray-600 font-mono mt-1">{selectedOrder.nipnas}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih PO Name (AM)</label>
              <select
                value={editForm.poName}
                onChange={(e) => setEditForm({ ...editForm, poName: e.target.value })}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
              >
                <option value="">-- Pilih Account Manager --</option>
                {accountOfficers.map((ao) => (
                  <option key={ao.id} value={ao.name}>{ao.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill City</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={editForm.billCity} onChange={(e) => setEditForm({ ...editForm, billCity: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Witel</label>
                <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  value={editForm.billWitel} onChange={(e) => setEditForm({ ...editForm, billWitel: e.target.value })} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MasterDataPO