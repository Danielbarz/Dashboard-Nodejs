import React, { useState, useMemo } from 'react'
import { FiDownload } from 'react-icons/fi'
import FileUploadForm from '../components/FileUploadForm'

const ReportsHSI = () => {
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

  const tableData = useMemo(() => [
    { id: 1, category: 'SME', witel: '', red: 0, inpro_sc: 0, qc: 0, fcc: 0, rjct_fcc: 0, survey: 0, un_sc: 0, h1: 0, h3: 0, h3plus: 0, total_pi: 0, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 0, jml_comp: 0, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '0%', ps_re: '0%', ps_pi: '0%', isCategoryHeader: true },
    { id: 2, category: '', witel: 'BALI', red: 45, inpro_sc: 5, qc: 8, fcc: 7, rjct_fcc: 2, survey: 3, un_sc: 1, h1: 2, h3: 1, h3plus: 0, total_pi: 3, kndl_plgn_f: 1, kndl_teknis_f: 0, kndl_system_f: 1, kndl_others_f: 0, uim: 1, asp: 1, osm: 0, total_fallout: 4, act_comp: 35, jml_comp: 35, kndl_plgn_c: 1, kndl_teknis_c: 0, kndl_system_c: 1, kndl_others_c: 0, total_cancel: 2, revoke: 1, pi_re: '94%', ps_re: '92%', ps_pi: '95%', isCategoryHeader: false },
    { id: 3, category: '', witel: 'JATIM BARAT', red: 38, inpro_sc: 4, qc: 6, fcc: 5, rjct_fcc: 1, survey: 2, un_sc: 2, h1: 1, h3: 1, h3plus: 0, total_pi: 2, kndl_plgn_f: 0, kndl_teknis_f: 1, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 1, osm: 0, total_fallout: 2, act_comp: 31, jml_comp: 31, kndl_plgn_c: 0, kndl_teknis_c: 1, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 1, revoke: 0, pi_re: '92%', ps_re: '90%', ps_pi: '93%', isCategoryHeader: false },
    { id: 4, category: '', witel: 'JATIM TIMUR', red: 52, inpro_sc: 6, qc: 9, fcc: 8, rjct_fcc: 3, survey: 4, un_sc: 2, h1: 3, h3: 2, h3plus: 0, total_pi: 5, kndl_plgn_f: 1, kndl_teknis_f: 0, kndl_system_f: 1, kndl_others_f: 0, uim: 1, asp: 1, osm: 0, total_fallout: 4, act_comp: 40, jml_comp: 40, kndl_plgn_c: 1, kndl_teknis_c: 0, kndl_system_c: 1, kndl_others_c: 0, total_cancel: 2, revoke: 1, pi_re: '96%', ps_re: '94%', ps_pi: '97%', isCategoryHeader: false },
    { id: 5, category: '', witel: 'NUSA TENGGARA', red: 30, inpro_sc: 3, qc: 5, fcc: 4, rjct_fcc: 1, survey: 2, un_sc: 1, h1: 1, h3: 1, h3plus: 0, total_pi: 2, kndl_plgn_f: 0, kndl_teknis_f: 1, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 1, act_comp: 25, jml_comp: 25, kndl_plgn_c: 0, kndl_teknis_c: 1, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 1, revoke: 0, pi_re: '90%', ps_re: '88%', ps_pi: '90%', isCategoryHeader: false },
    { id: 6, category: '', witel: 'SURAMADU', red: 42, inpro_sc: 5, qc: 7, fcc: 6, rjct_fcc: 2, survey: 3, un_sc: 1, h1: 2, h3: 1, h3plus: 0, total_pi: 3, kndl_plgn_f: 1, kndl_teknis_f: 0, kndl_system_f: 1, kndl_others_f: 0, uim: 0, asp: 1, osm: 0, total_fallout: 3, act_comp: 34, jml_comp: 34, kndl_plgn_c: 1, kndl_teknis_c: 0, kndl_system_c: 1, kndl_others_c: 0, total_cancel: 2, revoke: 1, pi_re: '94%', ps_re: '91%', ps_pi: '94%', isCategoryHeader: false },
    { id: 7, category: 'GOV', witel: '', red: 0, inpro_sc: 0, qc: 0, fcc: 0, rjct_fcc: 0, survey: 0, un_sc: 0, h1: 0, h3: 0, h3plus: 0, total_pi: 0, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 0, jml_comp: 0, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '0%', ps_re: '0%', ps_pi: '0%', isCategoryHeader: true },
    { id: 8, category: '', witel: 'BALI', red: 25, inpro_sc: 2, qc: 4, fcc: 3, rjct_fcc: 1, survey: 1, un_sc: 1, h1: 1, h3: 0, h3plus: 0, total_pi: 1, kndl_plgn_f: 0, kndl_teknis_f: 1, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 1, act_comp: 20, jml_comp: 20, kndl_plgn_c: 0, kndl_teknis_c: 1, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 1, revoke: 0, pi_re: '88%', ps_re: '85%', ps_pi: '88%', isCategoryHeader: false },
    { id: 9, category: '', witel: 'JATIM BARAT', red: 28, inpro_sc: 3, qc: 5, fcc: 4, rjct_fcc: 1, survey: 2, un_sc: 1, h1: 1, h3: 1, h3plus: 0, total_pi: 2, kndl_plgn_f: 0, kndl_teknis_f: 1, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 1, act_comp: 22, jml_comp: 22, kndl_plgn_c: 0, kndl_teknis_c: 1, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 1, revoke: 0, pi_re: '89%', ps_re: '87%', ps_pi: '91%', isCategoryHeader: false },
    { id: 10, category: '', witel: 'JATIM TIMUR', red: 35, inpro_sc: 4, qc: 6, fcc: 5, rjct_fcc: 2, survey: 3, un_sc: 1, h1: 1, h3: 1, h3plus: 0, total_pi: 2, kndl_plgn_f: 1, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 1, act_comp: 28, jml_comp: 28, kndl_plgn_c: 1, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 1, revoke: 0, pi_re: '91%', ps_re: '89%', ps_pi: '92%', isCategoryHeader: false },
    { id: 11, category: '', witel: 'NUSA TENGGARA', red: 20, inpro_sc: 2, qc: 3, fcc: 2, rjct_fcc: 1, survey: 1, un_sc: 0, h1: 0, h3: 1, h3plus: 0, total_pi: 1, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 15, jml_comp: 15, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '87%', ps_re: '82%', ps_pi: '87%', isCategoryHeader: false },
    { id: 12, category: '', witel: 'SURAMADU', red: 30, inpro_sc: 3, qc: 5, fcc: 4, rjct_fcc: 1, survey: 2, un_sc: 1, h1: 1, h3: 1, h3plus: 0, total_pi: 2, kndl_plgn_f: 0, kndl_teknis_f: 1, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 1, act_comp: 24, jml_comp: 24, kndl_plgn_c: 0, kndl_teknis_c: 1, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 1, revoke: 0, pi_re: '90%', ps_re: '87%', ps_pi: '90%', isCategoryHeader: false },
    { id: 13, category: 'PRIVATE', witel: '', red: 0, inpro_sc: 0, qc: 0, fcc: 0, rjct_fcc: 0, survey: 0, un_sc: 0, h1: 0, h3: 0, h3plus: 0, total_pi: 0, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 0, jml_comp: 0, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '0%', ps_re: '0%', ps_pi: '0%', isCategoryHeader: true },
    { id: 14, category: '', witel: 'BALI', red: 15, inpro_sc: 1, qc: 2, fcc: 2, rjct_fcc: 0, survey: 1, un_sc: 0, h1: 0, h3: 1, h3plus: 0, total_pi: 1, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 12, jml_comp: 12, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '85%', ps_re: '81%', ps_pi: '85%', isCategoryHeader: false },
    { id: 15, category: '', witel: 'JATIM BARAT', red: 18, inpro_sc: 2, qc: 3, fcc: 2, rjct_fcc: 1, survey: 1, un_sc: 0, h1: 0, h3: 1, h3plus: 0, total_pi: 1, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 14, jml_comp: 14, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '87%', ps_re: '83%', ps_pi: '88%', isCategoryHeader: false },
    { id: 16, category: '', witel: 'JATIM TIMUR', red: 22, inpro_sc: 2, qc: 4, fcc: 3, rjct_fcc: 1, survey: 2, un_sc: 1, h1: 1, h3: 1, h3plus: 0, total_pi: 2, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 1, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 1, act_comp: 18, jml_comp: 18, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 1, kndl_others_c: 0, total_cancel: 1, revoke: 0, pi_re: '89%', ps_re: '85%', ps_pi: '90%', isCategoryHeader: false },
    { id: 17, category: '', witel: 'NUSA TENGGARA', red: 12, inpro_sc: 1, qc: 2, fcc: 1, rjct_fcc: 0, survey: 1, un_sc: 0, h1: 0, h3: 1, h3plus: 0, total_pi: 1, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 10, jml_comp: 10, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '83%', ps_re: '78%', ps_pi: '83%', isCategoryHeader: false },
    { id: 18, category: '', witel: 'SURAMADU', red: 20, inpro_sc: 2, qc: 3, fcc: 2, rjct_fcc: 1, survey: 1, un_sc: 0, h1: 0, h3: 1, h3plus: 0, total_pi: 1, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 16, jml_comp: 16, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '86%', ps_re: '82%', ps_pi: '86%', isCategoryHeader: false },
    { id: 19, category: 'SOE', witel: '', red: 0, inpro_sc: 0, qc: 0, fcc: 0, rjct_fcc: 0, survey: 0, un_sc: 0, h1: 0, h3: 0, h3plus: 0, total_pi: 0, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 0, jml_comp: 0, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '0%', ps_re: '0%', ps_pi: '0%', isCategoryHeader: true },
    { id: 20, category: '', witel: 'BALI', red: 8, inpro_sc: 0, qc: 1, fcc: 1, rjct_fcc: 0, survey: 0, un_sc: 0, h1: 0, h3: 1, h3plus: 0, total_pi: 1, kndl_plgn_f: 0, kndl_teknis_f: 0, kndl_system_f: 0, kndl_others_f: 0, uim: 0, asp: 0, osm: 0, total_fallout: 0, act_comp: 6, jml_comp: 6, kndl_plgn_c: 0, kndl_teknis_c: 0, kndl_system_c: 0, kndl_others_c: 0, total_cancel: 0, revoke: 0, pi_re: '80%', ps_re: '75%', ps_pi: '80%', isCategoryHeader: false },
  ], [])

  const filteredData = useMemo(() => {
    let result = tableData
    if (selectedWitel) result = result.filter(row => row.witel === selectedWitel || row.isCategoryHeader)
    return result
  }, [tableData, selectedWitel])

  const visibleRows = filteredData

  const handleExport = () => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    window.location.href = `/api/export/report-hsi?${params.toString()}`
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Data</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <select value={selectedWitel} onChange={(e) => setSelectedWitel(e.target.value)} className="border-gray-300 rounded-md shadow-sm text-sm h-10 px-3 py-2 border focus:ring-blue-500 focus:border-blue-500">
            <option value="">Semua Witel</option>
            {witelList.map(witel => <option key={witel} value={witel}>{witel}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-300 h-10 shadow-sm">
            <div className="flex flex-col justify-center px-2">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none mb-0.5">Dari</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700 outline-none" />
            </div>
            <span className="text-gray-300 font-light text-2xl">|</span>
            <div className="flex flex-col justify-center px-2">
              <span className="text-[9px] text-gray-500 font-bold uppercase leading-none mb-0.5">Sampai</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border-none p-0 text-sm focus:ring-0 h-4 bg-transparent text-gray-700 outline-none" />
            </div>
          </div>

          <button onClick={handleExport} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 whitespace-nowrap h-10 shadow-md transition-colors">
            <FiDownload className="mr-2" size={16} />
            Ekspor Report
          </button>
        </div>
      </div>

      {/* Styled Table Container */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 z-0 relative">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-bold text-gray-800">Data Report HSI</h2>
           <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Live Data</span>
        </div>
        
        <div className="relative overflow-auto  rounded-lg border border-gray-200 shadow-inner isolate">
          <table className="min-w-full divide-y divide-gray-200 text-xs border-collapse">
            <thead className="bg-gray-50  shadow-sm">
              <tr className="bg-gradient-to-r from-blue-700 to-blue-600 border-b border-blue-800">
                <th rowSpan="2" className="px-3 py-3 text-center font-bold text-white border-r border-blue-500 whitespace-nowrap sticky left-0 z-[5] bg-blue-700 shadow-xl">WITEL</th>
                <th colSpan="4" className="px-2 py-2 text-center font-bold text-white border-r border-blue-500 bg-opacity-90">PROGRESS</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border-r border-red-500 bg-red-600 whitespace-nowrap">RJCT FCC</th>
                <th colSpan="2" className="px-2 py-2 text-center font-bold text-white border-r border-gray-500 bg-gray-600">SURVEY</th>
                <th colSpan="4" className="px-2 py-2 text-center font-bold text-white border-r border-gray-500 bg-gray-600">OGP</th>
                <th colSpan="8" className="px-2 py-2 text-center font-bold text-white border-r border-gray-500 bg-gray-600">PI FALLOUT</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border-r border-green-500 bg-green-600 whitespace-nowrap">ACT COMP<br/>(QC2)</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border-r border-green-500 bg-green-600 whitespace-nowrap">JML COMP<br/>(PS)</th>
                <th colSpan="5" className="px-2 py-2 text-center font-bold text-white border-r border-red-500 bg-red-600">CANCEL</th>
                <th rowSpan="2" className="px-2 py-2 text-center font-bold text-white border-r border-red-500 bg-red-600 whitespace-nowrap">REVOKE</th>
                <th colSpan="3" className="px-2 py-2 text-center font-bold text-white bg-blue-600">PERFORMANCE</th>
              </tr>
              <tr className="bg-gray-700">
                {/* Progress */}
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">RED</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">INPRO<br/>SC</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">QC</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">FCC</th>
                
                {/* Survey */}
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">SURVEY</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">UN-SC</th>

                {/* OGP */}
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">&lt;1 HARI</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">1-3 HARI</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">&gt;3 HARI</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">TOTAL PI</th>

                {/* Fallout */}
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">KNDL<br/>PLGN</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">KNDL<br/>TEKNIS</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">KNDL<br/>SYSTEM</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">KNDL<br/>OTHERS</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">UIM</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">ASP</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">OSM</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-gray-600 text-[10px] whitespace-nowrap hover:bg-gray-600 transition-colors  bg-gray-700">TOTAL<br/>FALLOUT</th>

                {/* Cancel */}
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-red-500 bg-red-600 text-[10px] whitespace-nowrap hover:bg-red-500 transition-colors ">KNDL<br/>PLGN</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-red-500 bg-red-600 text-[10px] whitespace-nowrap hover:bg-red-500 transition-colors ">KNDL<br/>TEKNIS</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-red-500 bg-red-600 text-[10px] whitespace-nowrap hover:bg-red-500 transition-colors ">KNDL<br/>SYSTEM</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-red-500 bg-red-600 text-[10px] whitespace-nowrap hover:bg-red-500 transition-colors ">KNDL<br/>OTHERS</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-red-500 bg-red-600 text-[10px] whitespace-nowrap hover:bg-red-500 transition-colors ">TOTAL<br/>CANCEL</th>

                {/* Performance */}
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-blue-500 bg-blue-600 text-[10px] whitespace-nowrap hover:bg-blue-500 transition-colors ">PI/RE</th>
                <th className="px-2 py-2 text-center font-semibold text-white border-r border-blue-500 bg-blue-600 text-[10px] whitespace-nowrap hover:bg-blue-500 transition-colors ">PS/RE</th>
                <th className="px-2 py-2 text-center font-semibold text-white bg-blue-600 text-[10px] whitespace-nowrap hover:bg-blue-500 transition-colors ">PS/PI</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center text-[11px]">
              {visibleRows.map((row) => (
                <tr key={row.id} className={`${row.isCategoryHeader ? 'bg-gray-800 font-bold text-white' : 'hover:bg-blue-50 transition-colors even:bg-gray-50'}`}>
                  <td className={`px-3 py-2 whitespace-nowrap border-r border-gray-200 text-left font-semibold sticky left-0 z-[5] ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-white'}`}>{row.isCategoryHeader ? row.category : row.witel}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.red}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.inpro_sc}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.qc}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.fcc}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-50 text-red-700'}`}>{row.rjct_fcc}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.survey}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.un_sc}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.h1}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.h3}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.h3plus}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'text-blue-700'}`}>{row.total_pi}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_plgn_f}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_teknis_f}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_system_f}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.kndl_others_f}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.uim}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.asp}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : ''}`}>{row.osm}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'text-orange-700'}`}>{row.total_fallout}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-green-50 text-green-700'}`}>{row.act_comp}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-green-100 text-green-800'}`}>{row.jml_comp}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-50'}`}>{row.kndl_plgn_c}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-50'}`}>{row.kndl_teknis_c}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-50'}`}>{row.kndl_system_c}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-50'}`}>{row.kndl_others_c}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-50 text-red-700'}`}>{row.total_cancel}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-red-100 text-red-800'}`}>{row.revoke}</td>
                  
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-800'}`}>{row.pi_re}</td>
                  <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-800'}`}>{row.ps_re}</td>
                  <td className={`px-2 py-2 whitespace-nowrap font-bold ${row.isCategoryHeader ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-800'}`}>{row.ps_pi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Unggah Data HSI</h2>
        <FileUploadForm reportType="hsi" />
      </div>
    </>
  )
}

export default ReportsHSI
