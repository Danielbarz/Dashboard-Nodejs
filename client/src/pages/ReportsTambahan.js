import React from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const ReportsTambahan = () => {
  const onProgressRows = [
    'INITIAL',
    'SURVEY & DRM',
    'PERIZINAN & MOS',
    'INSTALASI',
    'FI-OGP LIVE'
  ].map((status) => ({ status }))

  const goLiveRows = []

  const witelRows = []

  const witelLamaRows = []

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analysis Jaringan Tambahan</h1>
            <p className="text-gray-600 mt-1">Ringkasan laporan JT dengan unggah data</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700">
            Keluar Mode Admin
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Ringkasan Report JT</h2>
            <p className="text-sm text-gray-600">Total LOP On Progress (by Status)</p>
            <div className="overflow-x-auto">
              <table className="min-w-[480px] w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Order</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {onProgressRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                    </tr>
                  ) : (
                    onProgressRows.map((row) => (
                      <tr key={row.status}>
                        <td className="px-3 py-2 text-gray-800 whitespace-nowrap">{row.status}</td>
                        <td className="px-3 py-2 text-gray-800 whitespace-nowrap">{row.order || '-'}</td>
                        <td className="px-3 py-2 text-gray-800 whitespace-nowrap">{row.revenue || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Total LOP GO LIVE (exc Drop)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-[360px] w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Order</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {goLiveRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                    </tr>
                  ) : (
                    goLiveRows.map((row) => (
                      <tr key={row.status}>
                        <td className="px-3 py-2 text-gray-800 whitespace-nowrap">{row.status}</td>
                        <td className="px-3 py-2 text-gray-800 whitespace-nowrap">{row.order || '-'}</td>
                        <td className="px-3 py-2 text-gray-800 whitespace-nowrap">{row.revenue || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Unggah Data Mentah JT</h2>
            <p className="text-sm text-gray-600">Unggah file Excel (xlsx, xls, csv) untuk memperbarui data JT.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input type="file" className="block w-full max-w-sm text-sm text-gray-700" />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold text-sm hover:bg-indigo-700">Unggah Dokumen</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Konfigurasi Tampilan Tabel</h2>
            <button className="text-sm text-indigo-600 font-semibold">Buka</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Report JT</h2>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
              <ArrowDownTrayIcon className="w-5 h-5" />
              Ekspor Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['WITEL', 'ORDER', 'REVENUE', 'INITIAL', 'SURVEY & DRM', 'PERIZINAN & MOS', 'INSTALASI', 'FI-OGP LIVE', 'GO LIVE', 'DROP', 'PO', 'KONTRIBUSI'].map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {witelRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                  </tr>
                ) : (
                  witelRows.map((row) => (
                    <tr key={row[0]} className="hover:bg-gray-50">
                      {row.map((cell, idx) => (
                        <td key={idx} className="px-3 py-2 whitespace-nowrap text-gray-800">{cell}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Project Belum GO LIVE', 'Top 3 On Progress by Witel', 'Top 3 On Progress by PO'].map((title) => (
            <div key={title} className="bg-white rounded-lg shadow p-4 h-40 flex items-center justify-center text-gray-500 text-sm">
              {title}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">WITEL LAMA</h2>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['WITEL', 'ORDER', 'REVENUE', '% CONTRIBUTION'].map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {witelLamaRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                  </tr>
                ) : (
                  witelLamaRows.map((row) => (
                    <tr key={row.witel} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-800">{row.witel}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-800">{row.order || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-800">{row.revenue || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-800">{row.percent || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportsTambahan
