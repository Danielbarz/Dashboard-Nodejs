import React, { useState } from 'react'
import FileUploadForm from './FileUploadForm'

const AdminReport = () => {
  const [targets, setTargets] = useState({
    BALI: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    JATIM_BARAT: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    JATIM_TIMUR: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    NUSA_TENGGARA: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    SURAMADU: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 }
  })

  const [revenueTargets, setRevenueTargets] = useState({
    BALI: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    JATIM_BARAT: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    JATIM_TIMUR: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    NUSA_TENGGARA: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 },
    SURAMADU: { netmonk: 0, oca: 0, antares: 0, pijarSekolah: 0 }
  })

  const [orders, setOrders] = useState([
    {
      id: 1,
      milestone: 'SEND PAPERLESS OPEN',
      status: 'In Progress',
      product: 'Netmonk',
      orderId: '1002122596',
      witel: 'SURAMADU',
      customer: 'WAR***',
      date: '4 Desember 2025'
    }
  ])

  const [showTableConfig, setShowTableConfig] = useState(false)
  const [editTargetMinimized, setEditTargetMinimized] = useState(false)

  const regions = ['BALI', 'JATIM_BARAT', 'JATIM_TIMUR', 'NUSA_TENGGARA', 'SURAMADU']
  const products = ['Netmonk', 'OCA', 'Antares', 'Pijar Sekolah']

  const handleTargetChange = (region, product, value) => {
    setTargets(prev => ({
      ...prev,
      [region]: {
        ...prev[region],
        [product.toLowerCase().replace(/\s/g, '')]: parseInt(value) || 0
      }
    }))
  }

  const handleRevenueChange = (region, product, value) => {
    setRevenueTargets(prev => ({
      ...prev,
      [region]: {
        ...prev[region],
        [product.toLowerCase().replace(/\s/g, '')]: parseInt(value) || 0
      }
    }))
  }

  const handleSaveTargets = () => {
    console.log('Targets saved:', targets, revenueTargets)
    alert('Target berhasil disimpan!')
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Details Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">127</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">OGP</p>
            <p className="text-2xl font-bold text-gray-900">40</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Closed</p>
            <p className="text-2xl font-bold text-gray-900">87</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Segment</p>
            <p className="text-2xl font-bold text-gray-900">SME</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Period</p>
            <p className="text-2xl font-bold text-gray-900">Desember 2025</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Unggah Data Mentah</h2>
        <p className="text-sm text-gray-600 mb-4">Unggah Dokumen (xlsx, xls, csv) untuk memperbarui data.</p>
        <FileUploadForm type="digital_product" onSuccess={() => {}} />
      </div>

      {/* Edit Target Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer" onClick={() => setEditTargetMinimized(!editTargetMinimized)}>
          <h2 className="text-lg font-bold text-gray-900">Edit Target</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            {editTargetMinimized ? 'Expand' : 'Minimize'}
          </button>
        </div>

        {!editTargetMinimized && (
          <div className="p-6 space-y-6">
            {/* Prov Comp Targets */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Prov Comp Targets</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">Region</th>
                      {products.map(p => (
                        <th key={p} className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {regions.map(region => (
                      <tr key={region} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900">{region}</td>
                        {products.map(product => (
                          <td key={`${region}-${product}`} className="border border-gray-300 px-4 py-2">
                            <input
                              type="number"
                              value={targets[region]?.[product.toLowerCase().replace(/\s/g, '')] || 0}
                              onChange={(e) => handleTargetChange(region, product, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Targets */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue Targets (Rp Juta)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">Region</th>
                      {products.map(p => (
                        <th key={p} className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {regions.map(region => (
                      <tr key={region} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900">{region}</td>
                        {products.map(product => (
                          <td key={`revenue-${region}-${product}`} className="border border-gray-300 px-4 py-2">
                            <input
                              type="number"
                              value={revenueTargets[region]?.[product.toLowerCase().replace(/\s/g, '')] || 0}
                              onChange={(e) => handleRevenueChange(region, product, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={handleSaveTargets}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Simpan Target
            </button>
          </div>
        )}
      </div>

      {/* Process Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
            Proses Order Complete
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
            Proses Order Cancel
          </button>
        </div>
      </div>

      {/* Table Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={() => setShowTableConfig(!showTableConfig)}
          className="text-blue-600 font-medium hover:text-blue-700 mb-4"
        >
          {showTableConfig ? 'Tutup' : 'Buka'} Konfigurasi Tampilan Tabel
        </button>
        {showTableConfig && (
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-600">Konfigurasi kolom dan format tabel data report</p>
          </div>
        )}
      </div>

      {/* Data Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Data Report</h2>
          <div className="flex gap-2">
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Ekspor Excel</button>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Desimal: 2</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-300 px-2 py-2">WILAYAH TELKOM</th>
                <th colSpan="4" className="border border-gray-300 px-2 py-2 text-center">In Progress</th>
                <th colSpan="4" className="border border-gray-300 px-2 py-2 text-center">Prov Comp</th>
                <th colSpan="4" className="border border-gray-300 px-2 py-2 text-center bg-green-700">REVENUE (Rp Juta)</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-2 text-center">Grand Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50 font-bold">
                <td className="border border-gray-300 px-2 py-2">BALI</td>
                <td className="border border-gray-300 px-2 py-2 text-center">12</td>
                <td className="border border-gray-300 px-2 py-2 text-center">0</td>
                <td className="border border-gray-300 px-2 py-2 text-center">1</td>
                <td className="border border-gray-300 px-2 py-2 text-center">1</td>
                <td className="border border-gray-300 px-2 py-2 text-center">0</td>
                <td className="border border-gray-300 px-2 py-2 text-center">39</td>
                <td colSpan="2" className="border border-gray-300 px-2 py-2 text-center">0.0%</td>
                <td className="border border-gray-300 px-2 py-2 text-center bg-green-100">1.02</td>
                <td className="border border-gray-300 px-2 py-2 text-center bg-green-100">0</td>
                <td className="border border-gray-300 px-2 py-2 text-center bg-green-100">39</td>
                <td className="border border-gray-300 px-2 py-2 text-center">0.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Data Orders Table */}
        <div className="mt-6">
          <div className="flex gap-2 mb-4">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">In Progress (83)</button>
            <button className="px-3 py-1 text-gray-600 text-sm">Complete (13300)</button>
            <button className="px-3 py-1 text-gray-600 text-sm">QC (6)</button>
            <button className="px-3 py-1 text-gray-600 text-sm">History (159)</button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Cari Order ID..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
              Cari
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">No.</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Milestone</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Product</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Order ID</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Witel</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Customer</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">{idx + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">{order.milestone}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{order.product}</td>
                    <td className="border border-gray-300 px-3 py-2">{order.orderId}</td>
                    <td className="border border-gray-300 px-3 py-2">{order.witel}</td>
                    <td className="border border-gray-300 px-3 py-2 text-xs">{order.customer}</td>
                    <td className="border border-gray-300 px-3 py-2 text-xs">{order.date}</td>
                    <td className="border border-gray-300 px-3 py-2 space-x-2">
                      <button className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                        COMPLETE
                      </button>
                      <button className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                        CANCEL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Net Price Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Net Price Analysis (28086)</h2>
        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="Cari di Net Price..." className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">Cari</button>
        </div>
        <p className="text-sm text-gray-600">Net Price Analysis data akan ditampilkan di sini</p>
      </div>

      {/* KPI PO Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">KPI PO Analysis</h2>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 mb-4">Ekspor Excel</button>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Nama PO</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Witel</th>
                <th colSpan="2" className="border border-gray-300 px-3 py-2 text-center font-semibold bg-orange-100">Prodigi Done</th>
                <th colSpan="2" className="border border-gray-300 px-3 py-2 text-center font-semibold bg-blue-100">Prodigi OGP</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Total</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Ach</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">Alfonsus Jaconias</td>
                <td className="border border-gray-300 px-3 py-2">JATIM BARAT</td>
                <td className="border border-gray-300 px-3 py-2 text-center">4</td>
                <td className="border border-gray-300 px-3 py-2 text-center">1219</td>
                <td className="border border-gray-300 px-3 py-2 text-center">0</td>
                <td className="border border-gray-300 px-3 py-2 text-center">5</td>
                <td className="border border-gray-300 px-3 py-2 text-center">1228</td>
                <td className="border border-gray-300 px-3 py-2 text-center bg-yellow-100">99.6%</td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <button className="text-blue-600 text-xs hover:text-blue-700">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminReport
