import React, { useState, useMemo } from 'react'
import { FiDownload } from 'react-icons/fi'
import FileUploadForm from '../components/FileUploadForm'

const ReportsDatin = () => {
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

  const witelList = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

  const table1Data = useMemo(() => [
    { id: 1, category: 'SME', witel: '', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: true },
    { id: 2, category: '', witel: 'BALI', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 3, category: '', witel: 'JATIM BARAT', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 4, category: '', witel: 'JATIM TIMUR', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 5, category: '', witel: 'NUSA TENGGARA', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 6, category: '', witel: 'SURAMADU', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 7, category: 'GOV', witel: '', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: true },
    { id: 8, category: '', witel: 'BALI', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 9, category: '', witel: 'JATIM BARAT', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 10, category: '', witel: 'JATIM TIMUR', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 11, category: '', witel: 'NUSA TENGGARA', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 12, category: '', witel: 'SURAMADU', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 13, category: 'PRIVATE', witel: '', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: true },
    { id: 14, category: '', witel: 'BALI', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 15, category: '', witel: 'JATIM BARAT', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 16, category: '', witel: 'JATIM TIMUR', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 17, category: '', witel: 'NUSA TENGGARA', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 18, category: '', witel: 'SURAMADU', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 19, category: 'SOE', witel: '', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: true },
    { id: 20, category: '', witel: 'BALI', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
    { id: 21, category: '', witel: 'JATIM BARAT', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, est_3bln: '0,00', total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, est_3bln2: '0,00', total_3bln2: 0, grand_total: 0, isCategoryHeader: false },
  ], [])

  const table2Data = useMemo(() => [
    { id: 1, witel: 'SME', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 2, witel: 'BALI', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 3, witel: 'JATIM BARAT', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 4, witel: 'JATIM TIMUR', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 5, witel: 'NUSA TENGGARA', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 6, witel: 'SURAMADU', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 7, witel: 'GOV', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 8, witel: 'BALI', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 9, witel: 'JATIM BARAT', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 10, witel: 'JATIM TIMUR', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 11, witel: 'NUSA TENGGARA', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 12, witel: 'SURAMADU', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 13, witel: 'PRIVATE', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 14, witel: 'BALI', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 15, witel: 'JATIM BARAT', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 16, witel: 'JATIM TIMUR', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 17, witel: 'NUSA TENGGARA', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 18, witel: 'SURAMADU', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 19, witel: 'SOE', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 20, witel: 'BALI', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
    { id: 21, witel: 'JATIM BARAT', provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 },
  ], [])

  const galaksiData = useMemo(() => [
    { id: 1, po: 'Grand Total', ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, total_3bln2: 0, achievement: '100%' },
  ], [])

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-datin?${params.toString()}`
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Report (Tampilan PSA & SO DO RO)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[10px]">
            <thead className="bg-blue-600">
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">WITEL</th>
                <th colSpan="4" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&lt;3BLN</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px]">ORDER<br/>&lt;3BLN<br/>TOTAL</th>
                <th colSpan="4" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&gt;3BLN</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px]">ORDER<br/>&gt;3BLN<br/>TOTAL</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">GRAND<br/>TOTAL<br/>ORDER</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">PROVIDE<br/>ORDER</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">EST BC<br/>(JT)</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">IN<br/>PROCESS</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">READY<br/>TO BILL</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">PROVIDE<br/>ORDER</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">EST BC<br/>(JT)</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">IN<br/>PROCESS</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">READY<br/>TO BILL</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {table1Data.map((row) => (
                <tr key={row.id} className={row.isCategoryHeader ? 'bg-blue-700 font-bold text-white' : 'hover:bg-gray-50'}>
                  <td className={`px-2 py-1 whitespace-nowrap border text-left ${row.isCategoryHeader ? 'font-bold text-white bg-blue-700' : ''}`}>{row.isCategoryHeader ? row.category : row.witel}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.ao_3bln}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_3bln}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.do_3bln}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.mo_3bln}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.total_3bln}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.ao_3bln2}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.est_3bln2}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.do_3bln2}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.mo_3bln2}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border font-semibold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.total_3bln2}</td>
                  <td className={`px-2 py-1 whitespace-nowrap border font-bold ${row.isCategoryHeader ? 'bg-blue-700 text-white' : ''}`}>{row.grand_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Report (Tampilan SO DO RO)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[10px]">
            <thead className="bg-red-900">
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">WITEL</th>
                <th colSpan="3" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&lt;3BLN</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&lt;3BLN<br/>TOTAL</th>
                <th colSpan="3" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&gt;3BLN</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border text-[9px]">&gt;3BLN<br/>TOTAL</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">GRAND<br/>TOTAL<br/>ORDER</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">PROVIDE<br/>ORDER</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">IN<br/>PROCESS</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">READY<br/>TO BILL</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">PROVIDE<br/>ORDER</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">IN<br/>PROCESS</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-red-800 border text-[9px]">READY<br/>TO BILL</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {table2Data.map((row) => (
                <tr key={row.id} className={`hover:bg-gray-50 ${['SME', 'GOV', 'PRIVATE', 'SOE'].includes(row.witel) ? 'bg-red-900 font-bold text-white' : ''}`}>
                  <td className="px-2 py-1 whitespace-nowrap border text-left">{row.witel}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.provide_order}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.in_process}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ready_bill}</td>
                  <td className="px-2 py-1 whitespace-nowrap border font-semibold">{row.total_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.provide_order2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.in_process2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ready_bill2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border font-semibold">{row.total_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border font-bold">{row.grand_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Posisi Galaksi (Order In Progress)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-[10px]">
            <thead className="bg-gray-700">
              <tr>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">PO</th>
                <th colSpan="5" className="px-2 py-2 text-center font-bold text-white border bg-blue-600 text-[9px]">&lt; 3 BLN</th>
                <th colSpan="5" className="px-2 py-2 text-center font-bold text-white border bg-blue-600 text-[9px]">&gt; 3 BLN</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border">Achievement<br/>&gt;3bln</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">AO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">SO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">DO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">MO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">RO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">&lt; 3 BLN Total</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">AO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">SO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">DO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">MO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">RO</th>
                <th className="px-2 py-1 text-center font-bold text-white bg-blue-700 border text-[9px]">&gt; 3 BLN Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {galaksiData.map((row) => (
                <tr key={row.id} className="bg-gray-800 font-bold text-white">
                  <td className="px-2 py-1 whitespace-nowrap border">{row.po}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ao_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.so_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.do_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.mo_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ro_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.total_3bln}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ao_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.so_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.do_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.mo_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.ro_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.total_3bln2}</td>
                  <td className="px-2 py-1 whitespace-nowrap border">{row.achievement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data Datin</h2>
        <FileUploadForm type="datin" />
      </div>
    </>
  )
}

export default ReportsDatin
