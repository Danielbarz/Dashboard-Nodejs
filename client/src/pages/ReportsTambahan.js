import React, { useState, useMemo } from 'react'
import { FiDownload } from 'react-icons/fi'
import FileUploadForm from '../components/FileUploadForm'

const ReportsTambahan = () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const formatDateLocal = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [startDate, setStartDate] = useState(formatDateLocal(startOfMonth))
  const [endDate, setEndDate] = useState(formatDateLocal(now))
  const [selectedWitel, setSelectedWitel] = useState('')

  const witelList = ['WITEL BALI', 'WITEL DENPASAR', 'WITEL SINGARAJA', 'WITEL JATIM BARAT', 'WITEL KEDIRI', 'WITEL MADIUN', 'WITEL MALANG', 'WITEL JATIM TIMUR', 'WITEL JEMBER', 'WITEL PASURUAN', 'WITEL SIDOARJO', 'WITEL NUSA TENGGARA', 'WITEL NTT', 'WITEL NTB', 'WITEL SURAMADU', 'WITEL SURABAYA UTARA', 'WITEL SURABAYA SELATAN', 'WITEL MADURA']

  const tableData = useMemo(() => [
    { id: 1, witel: 'WITEL BALI', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 2, witel: 'WITEL DENPASAR', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 3, witel: 'WITEL SINGARAJA', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 4, witel: 'WITEL JATIM BARAT', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 5, witel: 'WITEL KEDIRI', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 6, witel: 'WITEL MADIUN', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 7, witel: 'WITEL MALANG', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 8, witel: 'WITEL JATIM TIMUR', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 9, witel: 'WITEL JEMBER', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 10, witel: 'WITEL PASURUAN', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 11, witel: 'WITEL SIDOARJO', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 12, witel: 'WITEL NUSA TENGGARA', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 13, witel: 'WITEL NTT', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 14, witel: 'WITEL NTB', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 15, witel: 'WITEL SURAMADU', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 16, witel: 'WITEL SURABAYA UTARA', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 17, witel: 'WITEL SURABAYA SELATAN', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
    { id: 18, witel: 'WITEL MADURA', jumlah_lop: 0, rev_all: '0,00', initial: 0, survey: 0, perizinan: 0, instalasi: 0, fi_ogp: 0, golive: 0, drop: 0, jml_lop: 0, rev_lop: '0,00', persen_close: '0,00%' },
  ], [])

  const projectBelumGoLive = useMemo(() => [
    { id: 1, witel: 'WITEL BALI', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 2, witel: 'WITEL DENPASAR', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 3, witel: 'WITEL SINGARAJA', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 4, witel: 'WITEL JATIM BARAT', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 5, witel: 'WITEL KEDIRI', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 6, witel: 'WITEL MADIUN', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 7, witel: 'WITEL MALANG', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 8, witel: 'WITEL JATIM TIMUR', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 9, witel: 'WITEL JEMBER', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 10, witel: 'WITEL PASURUAN', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 11, witel: 'WITEL SIDOARJO', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 12, witel: 'WITEL NUSA TENGGARA', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 13, witel: 'WITEL NTT', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 14, witel: 'WITEL NTB', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 15, witel: 'WITEL SURAMADU', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 16, witel: 'WITEL SURABAYA UTARA', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 17, witel: 'WITEL SURABAYA SELATAN', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
    { id: 18, witel: 'WITEL MADURA', witel_lama: 0, survey_selesai: 0, perizinan: 0, persen: '0,00%' },
  ], [])

  const filteredData = useMemo(() => {
    let result = tableData
    if (selectedWitel) result = result.filter(row => row.witel === selectedWitel)
    return result
  }, [tableData, selectedWitel])

  const visibleRows = filteredData

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-tambahan?${params.toString()}`
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Data</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <select value={selectedWitel} onChange={(e) => setSelectedWitel(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2 border">
            <option value="">Semua Witel</option>
            {witelList.map(witel => <option key={witel} value={witel}>{witel}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10">
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Dari</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700" />
            </div>
            <span className="text-gray-400 font-light">|</span>
            <div className="flex flex-col justify-center px-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none">Sampai</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700" />
            </div>
          </div>

          <button onClick={handleExport} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 whitespace-nowrap h-10">
            <FiDownload className="mr-2" size={16} />
            Ekspor Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Report Jaringan Tambahan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-gray-800 border">WITEL</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-green-600 border text-[10px]">JUMLAH LOP<br/>(exc Drop)</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-green-600 border text-[10px]">REV ALL LOP</th>
                <th colSpan="5" className="px-2 py-2 text-center font-medium text-white uppercase bg-blue-600 border">PROGRESS DEPLOY</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-orange-500 border text-[10px]">GOLIVE<br/>(exc Drop)</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-red-600 border">DROP</th>
                <th colSpan="2" className="px-2 py-2 text-center font-medium text-black uppercase bg-yellow-400 border text-[10px]">Project Belum GO LIVE</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-medium text-white uppercase bg-purple-600 border">%CLOSE</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">INITIAL</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">SURVEY &<br/>DRM</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">PERIZINAN<br/>& MOS</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">INSTALASI</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">FI-OGP LIVE</th>
                <th className="px-2 py-1 text-center font-medium text-black bg-yellow-300 border text-[10px]">JML LOP</th>
                <th className="px-2 py-1 text-center font-medium text-black bg-yellow-300 border text-[10px]">REV LOP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1 whitespace-nowrap border text-left text-[11px]">{row.witel}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.jumlah_lop}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.rev_all}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.initial}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.survey}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.perizinan}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.instalasi}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.fi_ogp}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.golive}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.drop}</td>
                  <td className="px-2 py-1 whitespace-nowrap border bg-yellow-50">{row.jml_lop}</td>
                  <td className="px-2 py-1 whitespace-nowrap border bg-yellow-50">{row.rev_lop}</td>
                  <td className="px-2 py-1 whitespace-nowrap border font-semibold">{row.persen_close}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td className="px-2 py-1 border text-left text-[11px]">GRAND TOTAL</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0,00</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border bg-yellow-50">0</td>
                <td className="px-2 py-1 border bg-yellow-50">0,00</td>
                <td className="px-2 py-1 border">0,00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Project Belum GO LIVE</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-center font-medium text-white uppercase bg-gray-800 border">WITEL LAMA</th>
                <th className="px-2 py-2 text-center font-medium text-white uppercase bg-blue-600 border text-[10px]">SURVEY SELESAI</th>
                <th className="px-2 py-2 text-center font-medium text-white uppercase bg-orange-600 border text-[10px]">PERIZINAN</th>
                <th className="px-2 py-2 text-center font-medium text-white uppercase bg-purple-600 border">%</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {projectBelumGoLive.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1 whitespace-nowrap border text-left text-[11px]">{row.witel}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.survey_selesai}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.perizinan}</td>
                  <td className="px-2 py-1 whitespace-nowrap border font-semibold">{row.persen}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td className="px-2 py-1 border text-left text-[11px]">TOTAL</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0</td>
                <td className="px-2 py-1 border">0,00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top 3 Usia Project Terbaru (On Progress) - By Witel Induk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-center font-medium text-white uppercase bg-gray-800 border text-[10px]">NAMA PROJECT</th>
                <th colSpan="5" className="px-2 py-2 text-center font-medium text-white uppercase bg-blue-600 border">TOP 3 USIA PROJECT ON PROGRESS</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-medium text-white bg-gray-700 border text-[10px]"></th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">IHLD</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">TGL MOM</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">REVENUE</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">STATUS TOMPS</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">USIA (HARI)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="6" className="px-2 py-4 text-center text-gray-500 italic">Tidak ada data "On Progress" yang ditemukan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top 3 Usia Project Terbaru (On Progress) - By PO</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-center font-medium text-white uppercase bg-gray-800 border text-[10px]">NAMA PO</th>
                <th className="px-2 py-2 text-center font-medium text-white uppercase bg-gray-700 border text-[10px]">NAMA PROJECT</th>
                <th colSpan="5" className="px-2 py-2 text-center font-medium text-white uppercase bg-blue-600 border">TOP 3 USIA PROJECT ON PROGRESS</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-medium text-white bg-gray-700 border text-[10px]"></th>
                <th className="px-2 py-1 text-center font-medium text-white bg-gray-600 border text-[10px]"></th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">IHLD</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">TGL MOM</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">REVENUE</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">STATUS TOMPS</th>
                <th className="px-2 py-1 text-center font-medium text-white bg-blue-500 border text-[10px]">USIA (HARI)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="7" className="px-2 py-4 text-center text-gray-500 italic">Tidak ada data "On Progress" yang ditemukan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data Jaringan Tambahan</h2>
        <FileUploadForm reportType="tambahan" />
      </div>
    </>
  )
}

export default ReportsTambahan

