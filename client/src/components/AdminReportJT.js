import React, { useState } from 'react'
import FileUploadForm from './FileUploadForm'

// Admin-only detailed view for Jaringan Tambahan
const AdminReportJT = () => {
  const summaryOnProgress = [
    { status: 'INITIAL', order: 0, revenue: 0 },
    { status: 'SURVEY & DRM', order: 0, revenue: 0 },
    { status: 'PERIZINAN & MOS', order: 0, revenue: 0 },
    { status: 'INSTALASI', order: 0, revenue: 0 },
    { status: 'FI-OGP LIVE', order: 0, revenue: 0 }
  ]

  const summaryGoLive = [{ status: 'GO LIVE', order: 514, revenue: 0 }]

  const dataReport = [
    ['WITEL BALI', 87, '7.176.067.094,00', 0, 0, 0, 0, 0, 87, '0,00', 6, '100,00%'],
    ['WITEL DENPASAR', 30, '2.545.784.964,00', 0, 0, 0, 0, 0, 30, '0,00', 4, '100,00%'],
    ['WITEL SINGARAJA', 57, '4.630.282.130,00', 0, 0, 0, 0, 0, 57, '0,00', 2, '100,00%'],
    ['WITEL JATIM BARAT', 167, '5.857.446.485,00', 0, 0, 0, 0, 0, 167, '0,00', 4, '100,00%'],
    ['WITEL KEDIRI', 75, '894.019.008,00', 0, 0, 0, 0, 0, 75, '0,00', 4, '100,00%'],
    ['WITEL MADIUN', 55, '2.045.530.808,00', 0, 0, 0, 0, 0, 55, '0,00', 0, '100,00%'],
    ['WITEL MALANG', 37, '2.917.896.669,00', 0, 0, 0, 0, 0, 37, '0,00', 0, '100,00%'],
    ['WITEL JATIM TIMUR', 91, '3.946.999.525,00', 0, 0, 0, 0, 0, 91, '0,00', 10, '100,00%'],
    ['WITEL JEMBER', 32, '1.276.364.561,00', 0, 0, 0, 0, 0, 32, '0,00', 1, '100,00%'],
    ['WITEL PASURUAN', 9, '621.220.000,00', 0, 0, 0, 0, 0, 9, '0,00', 3, '100,00%'],
    ['WITEL SIDOARJO', 50, '2.049.414.964,00', 0, 0, 0, 0, 0, 50, '0,00', 6, '100,00%'],
    ['WITEL NUSA TENGGARA', 67, '9.163.251.954,00', 0, 0, 0, 0, 0, 67, '0,00', 12, '100,00%'],
    ['WITEL NTT', 29, '1.770.443.514,00', 0, 0, 0, 0, 0, 29, '0,00', 2, '100,00%'],
    ['WITEL NTB', 38, '7.392.808.440,00', 0, 0, 0, 0, 0, 38, '0,00', 10, '100,00%'],
    ['WITEL SURAMADU', 102, '6.793.437.112,00', 0, 0, 0, 0, 0, 102, '0,00', 5, '100,00%'],
    ['WITEL SURABAYA UTARA', 56, '1.635.170.763,00', 0, 0, 0, 0, 0, 56, '0,00', 5, '100,00%'],
    ['WITEL SURABAYA SELATAN', 21, '4.399.709.829,00', 0, 0, 0, 0, 0, 21, '0,00', 0, '100,00%'],
    ['WITEL MADURA', 25, '758.556.520,00', 0, 0, 0, 0, 0, 25, '0,00', 0, '100,00%'],
    ['GRAND TOTAL', 514, '32.937.202.170,00', 0, 0, 0, 0, 0, 514, '0,00', 37, '100,00%']
  ]

  const [showTableConfig, setShowTableConfig] = useState(false)

  return (
    <div className="space-y-6 pb-10">
      {/* Ringkasan Report JT */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Report JT</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Total LOP On Progress (by Status)</h3>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left border-b">Status</th>
                  <th className="px-3 py-2 text-right border-b">Order</th>
                  <th className="px-3 py-2 text-right border-b">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {summaryOnProgress.map((row) => (
                  <tr key={row.status} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b text-gray-800">{row.status}</td>
                    <td className="px-3 py-2 border-b text-right">{row.order}</td>
                    <td className="px-3 py-2 border-b text-right">{row.revenue}</td>
                  </tr>
                ))}
                {summaryOnProgress.length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-3 text-center text-gray-500">Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Total LOP GO LIVE (exc Drop)</h3>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left border-b">Status</th>
                  <th className="px-3 py-2 text-right border-b">Order</th>
                  <th className="px-3 py-2 text-right border-b">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {summaryGoLive.map((row) => (
                  <tr key={row.status} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b text-gray-800">{row.status}</td>
                    <td className="px-3 py-2 border-b text-right">{row.order}</td>
                    <td className="px-3 py-2 border-b text-right">{row.revenue}</td>
                  </tr>
                ))}
                {summaryGoLive.length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-3 text-center text-gray-500">Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Unggah Data Mentah JT</h2>
        <p className="text-sm text-gray-600 mb-4">Unggah file Excel (xlsx, xls, csv) untuk memperbarui data JT.</p>
        <FileUploadForm type="jaringan_tambahan" onSuccess={() => {}} />
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
            <p className="text-sm text-gray-600">Konfigurasi kolom dan format tabel data report.</p>
          </div>
        )}
      </div>

      {/* Data Report JT */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Data Report JT</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Ekspor Excel</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left border">WITEL</th>
                <th className="px-2 py-2 text-right border">ORDER</th>
                <th className="px-2 py-2 text-right border">REVENUE</th>
                <th className="px-2 py-2 text-right border">0</th>
                <th className="px-2 py-2 text-right border">0</th>
                <th className="px-2 py-2 text-right border">0</th>
                <th className="px-2 py-2 text-right border">0</th>
                <th className="px-2 py-2 text-right border">0</th>
                <th className="px-2 py-2 text-right border">TOTAL</th>
                <th className="px-2 py-2 text-right border">0,00</th>
                <th className="px-2 py-2 text-right border">ACH</th>
                <th className="px-2 py-2 text-right border">%</th>
              </tr>
            </thead>
            <tbody>
              {dataReport.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {row.map((col, cIdx) => (
                    <td key={cIdx} className="px-2 py-2 border text-right first:text-left first:font-semibold">
                      {col}
                    </td>
                  ))}
                </tr>
              ))}
              {dataReport.length === 0 && (
                <tr><td colSpan={12} className="px-3 py-4 text-center text-gray-500">Belum ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional cards placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Project Belum GO LIVE</h2>
        <p className="text-sm text-gray-600">Data belum tersedia.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Top 3 On Progress by Witel / PO</h2>
        <p className="text-sm text-gray-600">Data belum tersedia.</p>
      </div>
    </div>
  )
}

export default AdminReportJT