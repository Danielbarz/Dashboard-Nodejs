import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import axios from 'axios'

const MasterDataPO = () => {
  const [accountOfficers, setAccountOfficers] = useState([])
  const [poMaster, setPoMaster] = useState([])
  const [unmappedOrders, setUnmappedOrders] = useState([])

  // UI States
  const [showAOForm, setShowAOForm] = useState(false)
  const [showPOForm, setShowPOForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Pagination State untuk PO Master
  const [currentPagePO, setCurrentPagePO] = useState(1)
  const [itemsPerPagePO] = useState(10)

  const [aoForm, setAoForm] = useState({
    name: '',
    displayWitel: '',
    filterWitelLama: '',
    specialFilterColumn: '',
    specialFilterValue: ''
  })

  const [poForm, setPoForm] = useState({
    nipnas: '',
    namaPo: '',
    segment: '',
    witel: ''
  })

  const [editForm, setEditForm] = useState({
    poName: '',
    billCity: '',
    billWitel: '',
    segment: ''
  })

  useEffect(() => {
    fetchAccountOfficers()
    fetchPOMaster()
    fetchUnmappedOrders()
  }, [])

  const fetchAccountOfficers = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/account-officers`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAccountOfficers(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch account officers:', error)
    }
  }

  const fetchPOMaster = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/po`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPoMaster(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch PO master:', error)
    }
  }

  const fetchUnmappedOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/unmapped-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = response.data.data
      if (Array.isArray(data)) {
        setUnmappedOrders(data)
      } else if (data && Array.isArray(data.items)) {
        setUnmappedOrders(data.items)
      } else {
        setUnmappedOrders([])
      }
    } catch (error) {
      console.error('Failed to fetch unmapped orders:', error)
    }
  }

  const handleAddAO = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/account-officers`,
        aoForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowAOForm(false)
      setAoForm({ name: '', displayWitel: '', filterWitelLama: '', specialFilterColumn: '', specialFilterValue: '' })
      fetchAccountOfficers()
    } catch (error) {
      console.error('Failed to add account officer:', error)
    }
  }

  const handleDeleteAO = async (id) => {
    if (!window.confirm('Hapus Account Officer ini?')) return
    try {
      const token = localStorage.getItem('accessToken')
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/account-officers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchAccountOfficers()
    } catch (error) {
      console.error('Failed to delete account officer:', error)
    }
  }

  const handleAddPO = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/po`,
        poForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowPOForm(false)
      setPoForm({ nipnas: '', namaPo: '', segment: '', witel: '' })
      fetchPOMaster()
    } catch (error) {
      console.error('Failed to add PO:', error)
    }
  }

  const handleDeletePO = async (id) => {
    if (!window.confirm('Hapus PO ini?')) return
    try {
      const token = localStorage.getItem('accessToken')
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/po/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchPOMaster()
    } catch (error) {
      console.error('Failed to delete PO:', error)
    }
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
      const token = localStorage.getItem('accessToken')
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/update-mapping/${selectedOrder.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowEditModal(false)
      fetchUnmappedOrders()
    } catch (error) {
      console.error('Failed to update mapping:', error)
    }
  }

  const handleAutoMapping = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/master/auto-mapping`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchUnmappedOrders()
      alert('Mapping otomatis selesai!')
    } catch (error) {
      console.error('Failed to auto-map:', error)
    }
  }

  // Logic Pagination PO
  const indexOfLastPO = currentPagePO * itemsPerPagePO
  const indexOfFirstPO = indexOfLastPO - itemsPerPagePO
  const currentPOs = poMaster.slice(indexOfFirstPO, indexOfLastPO)
  const totalPagesPO = Math.ceil(poMaster.length / itemsPerPagePO)

  return (
    <div className="space-y-6">
      {/* Section 1: Master Account Officer */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Master Account Officer (Digital Product)</h2>
          <button
            onClick={() => setShowAOForm(!showAOForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
          >
            <FiPlus className="mr-2" /> Tambah AO
          </button>
        </div>

        {showAOForm && (
          <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            {/* Form Tambah AO tetap sama */}
            <h3 className="font-semibold mb-3">Tambah Account Officer Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama AO</label>
                <input
                  type="text"
                  placeholder="Contoh: Alfonsus..."
                  value={aoForm.name}
                  onChange={(e) => setAoForm({ ...aoForm, name: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Witel</label>
                <input
                  type="text"
                  placeholder="Contoh: JATIM BARAT"
                  value={aoForm.displayWitel}
                  onChange={(e) => setAoForm({ ...aoForm, displayWitel: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter Witel Lama (Source)</label>
                <input
                  type="text"
                  placeholder="Contoh: MADIUN"
                  value={aoForm.filterWitelLama}
                  onChange={(e) => setAoForm({ ...aoForm, filterWitelLama: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Filter Column (Opt)</label>
                <input
                  type="text"
                  placeholder="Contoh: segment"
                  value={aoForm.specialFilterColumn}
                  onChange={(e) => setAoForm({ ...aoForm, specialFilterColumn: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Filter Value (Opt)</label>
                <input
                  type="text"
                  placeholder="Contoh: LEGS"
                  value={aoForm.specialFilterValue}
                  onChange={(e) => setAoForm({ ...aoForm, specialFilterValue: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddAO}
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
              >
                <FiCheck className="mr-2" /> Simpan
              </button>
              <button
                onClick={() => setShowAOForm(false)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-white border">Nama</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Display Witel</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Filter Source</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Special Filter</th>
                <th className="px-4 py-3 text-center font-bold text-white border">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accountOfficers.map((ao) => (
                <tr key={ao.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{ao.name}</td>
                  <td className="px-4 py-2 border">{ao.displayWitel}</td>
                  <td className="px-4 py-2 border">{ao.filterWitelLama}</td>
                  <td className="px-4 py-2 border">
                    {ao.specialFilterColumn && ao.specialFilterValue
                      ? `${ao.specialFilterColumn}: ${ao.specialFilterValue}`
                      : '-'}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDeleteAO(ao.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Master Data PO (Dengan Pagination) */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Master Data PO (Datin/SOS)</h2>
          <button
            onClick={() => setShowPOForm(!showPOForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
          >
            <FiPlus className="mr-2" /> Tambah PO
          </button>
        </div>

        {showPOForm && (
          <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            {/* Form Tambah PO */}
            <h3 className="font-semibold mb-3">Tambah PO Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIPNAS</label>
                <input
                  type="text"
                  value={poForm.nipnas}
                  onChange={(e) => setPoForm({ ...poForm, nipnas: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama PO</label>
                <input
                  type="text"
                  value={poForm.namaPo}
                  onChange={(e) => setPoForm({ ...poForm, namaPo: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segmen</label>
                <input
                  type="text"
                  value={poForm.segment}
                  onChange={(e) => setPoForm({ ...poForm, segment: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Witel</label>
                <input
                  type="text"
                  value={poForm.witel}
                  onChange={(e) => setPoForm({ ...poForm, witel: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddPO}
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
              >
                <FiCheck className="mr-2" /> Simpan
              </button>
              <button
                onClick={() => setShowPOForm(false)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]"> {/* Min height biar gak jumping saat ganti page */}
          <table className="min-w-full divide-y divide-gray-200 border text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-white border">PO</th>
                <th className="px-4 py-3 text-left font-bold text-white border">NIPNAS</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Segment</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Bill City</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Witel</th>
                <th className="px-4 py-3 text-center font-bold text-white border">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPOs.length > 0 ? (
                currentPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{po.namaPo}</td>
                    <td className="px-4 py-2 border">{po.nipnas}</td>
                    <td className="px-4 py-2 border">{po.segment}</td>
                    <td className="px-4 py-2 border">{po.billCity || '-'}</td>
                    <td className="px-4 py-2 border">{po.witel}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDeletePO(po.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    Tidak ada data PO.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {poMaster.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPagePO(prev => Math.max(prev - 1, 1))}
                disabled={currentPagePO === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPagePO(prev => Math.min(prev + 1, totalPagesPO))}
                disabled={currentPagePO === totalPagesPO}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstPO + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastPO, poMaster.length)}</span> of{' '}
                  <span className="font-medium">{poMaster.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPagePO(prev => Math.max(prev - 1, 1))}
                    disabled={currentPagePO === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* Page Numbers Simple Logic: Show current page */}
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    Page {currentPagePO} of {totalPagesPO}
                  </span>
                  <button
                    onClick={() => setCurrentPagePO(prev => Math.min(prev + 1, totalPagesPO))}
                    disabled={currentPagePO === totalPagesPO}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Mapping Data Transaksi */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Mapping Data Transaksi (Datin)</h2>
            <p className="text-sm text-gray-600">Daftar order yang belum memiliki PO Name valid.</p>
          </div>
          <button
            onClick={handleAutoMapping}
            className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700"
          >
            <FiCheck className="mr-2" /> Jalankan Mapping Otomatis
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-white border">Order ID</th>
                <th className="px-4 py-3 text-left font-bold text-white border">NIPNAS</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Nama Pelanggan</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Cust City</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Serv City</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Bill Witel</th>
                <th className="px-4 py-3 text-left font-bold text-white border">Bill City</th>
                <th className="px-4 py-3 text-center font-bold text-white border">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unmappedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order.orderId}</td>
                  <td className="px-4 py-2 border">{order.nipnas}</td>
                  <td className="px-4 py-2 border">{order.customerName}</td>
                  <td className="px-4 py-2 border">{order.custCity}</td>
                  <td className="px-4 py-2 border">{order.servCity}</td>
                  <td className="px-4 py-2 border">{order.billWitel || '-'}</td>
                  <td className="px-4 py-2 border">{order.billCity || '-'}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Mapping PO</h3>
            <p className="text-sm text-gray-600 mb-4">
              Perbarui PO Name untuk NIPNAS: {selectedOrder.nipnas} ({selectedOrder.customerName})
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih PO Name (AM)</label>
                <select
                  value={editForm.poName}
                  onChange={(e) => setEditForm({ ...editForm, poName: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                >
                  <option value="">-- Pilih Account Manager --</option>
                  {accountOfficers.map((ao) => (
                    <option key={ao.id} value={ao.nama}>
                      {ao.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill City (Kota Tagihan)</label>
                <input
                  type="text"
                  value={editForm.billCity}
                  onChange={(e) => setEditForm({ ...editForm, billCity: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">*Ubah kota jika mapping Witel gagal.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Witel (Witel Tagihan)</label>
                <input
                  type="text"
                  placeholder="Contoh: SURAMADU"
                  value={editForm.billWitel}
                  onChange={(e) => setEditForm({ ...editForm, billWitel: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">*Isi manual 5 Witel Utama (BALI, SURAMADU, dll) jika mapping otomatis gagal.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segmen</label>
                <input
                  type="text"
                  placeholder="Contoh: State-Owned Enterprise Service"
                  value={editForm.segment}
                  onChange={(e) => setEditForm({ ...editForm, segment: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">*Segmen dari order ini (isi manual jika data kosong).</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleUpdateMapping}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
              >
                <FiCheck className="mr-2" /> Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MasterDataPO