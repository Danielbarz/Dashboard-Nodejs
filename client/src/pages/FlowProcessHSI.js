import React, { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { fetchHSIFlowStats, fetchHSIDashboard } from '../services/dashboardService' // IMPORT SERVICE API

// --- KOMPONEN DROPDOWN REUSABLE ---
const MultiSelectDropdown = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer flex justify-between items-center text-sm shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-gray-700 select-none">
          {selected.length > 0 ? `${selected.length} Dipilih` : placeholder}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {options.map((option) => (
            <div key={option} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => toggleOption(option)}>
              <input type="checkbox" checked={selected.includes(option)} readOnly className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded pointer-events-none" />
              <span className="text-sm text-gray-700 select-none">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const FlowProcessHSI = () => {
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [selectedWitels, setSelectedWitels] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const witels = ['JABAR', 'JATIM', 'JATENG', 'BALI', 'NUSRA', 'KALIMANTAN', 'SULAWESI']
  const branches = ['Branch A', 'Branch B', 'Branch C']

  // --- STATE DATA FLOW (Ganti Mock Data dengan State) ---
  const [flowStats, setFlowStats] = useState({
    re: 0, valid_re: 0, valid_wo: 0, valid_pi: 0, ps_count: 0,
    ogp_verif: 0, cancel_qc1: 0, cancel_fcc: 0, cancel_wo: 0, unsc: 0,
    ogp_survey_count: 0, cancel_instalasi: 0, fallout: 0, revoke_count: 0,
    ogp_provi: 0, ps_re_denominator: 0, ps_pi_denominator: 0,
    followup_completed: 0, revoke_completed: 0, revoke_order: 0,
    ps_revoke: 0, ogp_provi_revoke: 0, fallout_revoke: 0,
    cancel_revoke: 0, lain_lain_revoke: 0, comply_count: 0
  })

  // State Detail Data
  const [detailData, setDetailData] = useState({ data: [], links: [] })

  const branchOptions = useMemo(() => {
    if (selectedWitels.length === 0) return branches
    return branches
  }, [selectedWitels])

  // --- 1. FETCH FLOW STATS ---
  const loadStats = async () => {
    setLoading(true)
    try {
      const params = {
        witel: selectedWitels.join(','),
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined
      }
      
      const result = await fetchHSIFlowStats(params)
      if (result.data) {
        setFlowStats(prev => ({ ...prev, ...result.data }))
      }
    } catch (error) {
      console.error("Failed to load flow stats:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- 2. FETCH DETAIL DATA ---
  const loadDetail = async (category) => {
    setDetailLoading(true)
    setDetailData({ data: [] })
    try {
      let statusFilter = ''
      if (category === 'PS (COMPLETED)' || category === 'PS') statusFilter = 'PS'
      else if (category.includes('Cancel')) statusFilter = 'CANCEL'
      else if (category.includes('Fallout')) statusFilter = 'KENDALA'
      
      const params = {
        page: 1,
        limit: 50,
        search: '',
        witel: selectedWitels.join(','),
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined
      }
      
      const result = await fetchHSIDashboard(params)
      if (result.data && result.data.table) {
        let filtered = result.data.table
        if (statusFilter) {
            filtered = filtered.filter(item => 
                item.kelompok_status && item.kelompok_status.includes(statusFilter)
            )
        }
        setDetailData({ data: filtered })
      }
    } catch (error) {
      console.error("Failed to load detail:", error)
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [startDate, endDate, selectedWitels])

  const applyFilter = () => { loadStats() }

  const resetFilter = () => {
    setDateRange([null, null])
    setSelectedWitels([])
    setSelectedBranches([])
    setActiveCategory(null)
    setDetailData({ data: [] })
  }

  const handleCardClick = (categoryName) => {
    setActiveCategory(categoryName)
    loadDetail(categoryName)
    setTimeout(() => {
      document.getElementById('detail-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const handleExportDetail = () => {
    if (!activeCategory) return
    alert(`Fitur export untuk ${activeCategory} akan segera tersedia.`)
  }

  const psRePercent = flowStats?.ps_re_denominator > 0 ? ((flowStats.ps_count / flowStats.ps_re_denominator) * 100).toFixed(2) : '0.00'
  const psPiPercent = flowStats?.ps_pi_denominator > 0 ? ((flowStats.ps_count / flowStats.ps_pi_denominator) * 100).toFixed(2) : '0.00'
  const complyPercent = flowStats?.ps_count > 0 ? ((flowStats.comply_count / flowStats.ps_count) * 100).toFixed(2) : '0.00'

  // SUB-KOMPONEN UI
  const HeaderStep = ({ title, color = 'bg-gray-800', isLast = false, stepNumber }) => (
    <div className="relative flex-1 min-w-[120px]">
      <div
        className={`${color} text-white font-bold h-12 flex items-center justify-center px-4 md:px-8 text-xs md:text-sm text-center relative z-10 shadow-md transition-all hover:brightness-110`}
        style={{
          clipPath: isLast
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 100% 100%, 0% 100%, 15px 50%)'
            : 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)',
          marginLeft: stepNumber === 0 ? '0' : '-12px',
          paddingLeft: stepNumber === 0 ? '1rem' : '2rem',
        }}
      >
        {title}
      </div>
    </div>
  )

  const MainCard = ({ title, count, total, colorClass = 'bg-slate-50 border-2 border-gray-300', onClick }) => {
    const percent = total > 0 ? ((count / total) * 100).toFixed(2) + '%' : ''
    return (
      <div onClick={onClick} className={`${colorClass} rounded-lg p-3 text-center shadow-sm flex flex-col justify-center min-h-[120px] hover:shadow-lg hover:scale-105 transition-all cursor-pointer`}>
        <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">{title}</div>
        <div className="flex flex-col items-center">
          <div className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-none">{loading ? '...' : count?.toLocaleString() || 0}</div>
          {percent && <div className="text-xl md:text-2xl font-bold text-green-600 mt-1">{percent}</div>}
        </div>
      </div>
    )
  }

  const DetailCard = ({ title, count, totalForPercent, highlight = false, onClick }) => {
    const percent = totalForPercent > 0 ? ((count / totalForPercent) * 100).toFixed(2) + '%' : ''
    return (
      <div onClick={onClick} className={`relative overflow-hidden rounded-lg p-3 shadow-sm border flex flex-col justify-center min-h-[80px] transition-all hover:translate-y-[-2px] hover:shadow-md cursor-pointer ${highlight ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-blue-50 border-blue-100 hover:bg-blue-100'}`}>
        <div className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase leading-tight mb-1">{title}</div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span className={`text-lg md:text-xl font-bold ${highlight ? 'text-red-700' : 'text-blue-900'}`}>{loading ? '...' : count?.toLocaleString() || 0}</span>
          {percent && <span className={`text-lg md:text-xl font-bold ${highlight ? 'text-red-500' : 'text-blue-500'}`}>({percent})</span>}
        </div>
      </div>
    )
  }

  const TreeCard = ({ title, count, total, color = 'bg-white', borderColor = 'border-gray-300', textColor = 'text-gray-800', onClick }) => {
    const percent = total > 0 ? ((count / total) * 100).toFixed(2) + '%' : ''
    return (
      <div onClick={onClick} className={`p-3 rounded-3xl border-2 ${borderColor} ${color} shadow-sm text-center w-full min-w-[110px] z-20 relative hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer`}>
        <div className={`text-[10px] font-bold uppercase mb-2 ${textColor} opacity-80`}>{title}</div>
        <div className="flex flex-col items-center">
          <div className={`text-xl font-extrabold ${textColor} leading-tight`}>{loading ? '...' : count?.toLocaleString() || 0}</div>
          {percent && <div className={`text-lg font-bold ${textColor} opacity-90 mt-1`}>{percent}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 uppercase">Data Pengawalan PSB HSI</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></span> 
            {loading ? 'Updating Data...' : `Last Update: ${new Date().toLocaleDateString()}`}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Periode Data</label>
              <div className="flex gap-2">
                <input type="date" onChange={(e) => setDateRange([e.target.value ? new Date(e.target.value) : null, endDate])} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <input type="date" onChange={(e) => setDateRange([startDate, e.target.value ? new Date(e.target.value) : null])} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Filter Witel</label>
              <MultiSelectDropdown options={witels} selected={selectedWitels} onChange={setSelectedWitels} placeholder="Semua Witel" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Filter Branch</label>
              <MultiSelectDropdown options={branchOptions} selected={selectedBranches} onChange={setSelectedBranches} placeholder="Semua Branch" />
            </div>
            <div className="flex gap-2">
              <button onClick={applyFilter} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-4 rounded shadow w-full">{loading ? 'Loading...' : 'Terapkan'}</button>
              <button onClick={resetFilter} className="bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2.5 px-4 rounded shadow">Reset</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex w-full mb-8 overflow-x-auto pb-4 no-scrollbar pl-2">
            <HeaderStep title="OFFERING" stepNumber={0} />
            <HeaderStep title="VERIFICATION & VALID" stepNumber={1} />
            <HeaderStep title="FEASIBILITY" stepNumber={2} />
            <HeaderStep title="INSTALASI & AKTIVASI" stepNumber={3} />
            <HeaderStep title="PS" color="bg-green-600" isLast={true} stepNumber={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-3">
              <MainCard title="RE" count={flowStats?.re} onClick={() => handleCardClick('RE')} />
              <div className="min-h-[300px] border-2 border-transparent"></div>
            </div>
            <div className="space-y-3">
              <MainCard title="Valid RE" count={flowStats?.valid_re} total={flowStats?.re} onClick={() => handleCardClick('Valid RE')} />
              <div className="p-3 bg-slate-50 rounded-lg border-2 border-gray-100 min-h-[300px] flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Fallout Points</div>
                <DetailCard title="OGP Verif & Valid" count={flowStats?.ogp_verif} totalForPercent={flowStats?.re} onClick={() => handleCardClick('OGP Verif & Valid')} />
                <DetailCard title="Cancel QC 1" count={flowStats?.cancel_qc1} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel QC 1')} />
                <DetailCard title="Cancel FCC" count={flowStats?.cancel_fcc} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel FCC')} />
              </div>
            </div>
            <div className="space-y-3">
              <MainCard title="Valid WO" count={flowStats?.valid_wo} total={flowStats?.re} onClick={() => handleCardClick('Valid WO')} />
              <div className="p-3 bg-slate-50 rounded-lg border-2 border-gray-100 min-h-[300px] flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Process</div>
                <DetailCard title="Cancel WO" count={flowStats?.cancel_wo} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel WO')} />
                <DetailCard title="UNSC" count={flowStats?.unsc} totalForPercent={flowStats?.re} onClick={() => handleCardClick('UNSC')} />
                <DetailCard title="OGP SURVEY" count={flowStats?.ogp_survey_count} totalForPercent={flowStats?.re} onClick={() => handleCardClick('OGP SURVEY')} />
              </div>
            </div>
            <div className="space-y-3">
              <MainCard title="Valid PI" count={flowStats?.valid_pi} total={flowStats?.re} onClick={() => handleCardClick('Valid PI')} />
              <div className="p-3 bg-slate-50 rounded-lg border-2 border-gray-100 min-h-[300px] flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Technician</div>
                <DetailCard title="Cancel Instalasi" count={flowStats?.cancel_instalasi} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Cancel Instalasi')} />
                <DetailCard title="Fallout" count={flowStats?.fallout} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Fallout')} />
                <DetailCard title="Revoke" count={flowStats?.revoke_count} totalForPercent={flowStats?.re} highlight onClick={() => handleCardClick('Revoke')} />
              </div>
            </div>
            <div className="space-y-3">
              <MainCard title="PS (COMPLETED)" count={flowStats?.ps_count} total={flowStats?.re} colorClass="bg-green-50 border-2 border-green-500" onClick={() => handleCardClick('PS (COMPLETED)')} />
              <div className="p-3 bg-slate-50 rounded-lg border-2 border-gray-100 flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Provisioning</div>
                <DetailCard title="OGP Provisioning" count={flowStats?.ogp_provi} totalForPercent={flowStats?.re} onClick={() => handleCardClick('OGP Provisioning')} />
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 text-white shadow-lg flex flex-col justify-center mt-auto gap-3">
                <div className="text-center">
                  <div className="text-[10px] md:text-xs font-medium text-blue-200 uppercase mb-1">Conversion PS/RE</div>
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">{psRePercent}<span className="text-sm md:text-lg">%</span></div>
                </div>
                <div className="w-full bg-blue-500/30 h-px"></div>
                <div className="text-center">
                  <div className="text-[10px] md:text-xs font-medium text-blue-200 uppercase mb-1">Conversion PS/PI</div>
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">{psPiPercent}<span className="text-sm md:text-lg">%</span></div>
                </div>
                <div className="w-full bg-blue-500/30 h-px"></div>
                <div className="text-center">
                  <div className="text-[10px] md:text-xs font-medium text-blue-200 uppercase mb-1">Comply</div>
                  <div className="text-2xl md:text-3xl font-bold tracking-tight text-green-300">{complyPercent}<span className="text-sm md:text-lg">%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-3xl shadow border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 bg-red-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-800">Analisis Revoke & Fallout</h3>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[900px] flex flex-col items-center">
              <div className="relative z-10 mb-16">
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-3xl text-center shadow min-w-[200px] cursor-pointer hover:bg-red-100 transition-colors" onClick={() => handleCardClick('Total Revoke')}>
                  <div className="text-xs font-bold text-red-600 uppercase mb-1">Total Revoke</div>
                  <div className="text-3xl font-extrabold text-red-900">{loading ? '...' : flowStats?.revoke_count?.toLocaleString() || 0}</div>
                </div>
              </div>
              <div className="flex justify-center gap-10 w-full relative mb-12">
                <div className="absolute -top-6 left-[20%] right-[20%] h-10 border-t-2 border-r-2 border-l-2 border-gray-300 rounded-t-3xl"></div>
                <div className="flex flex-col items-center w-1/3 relative">
                  <TreeCard title="Follow Up Completed" count={flowStats?.followup_completed} total={flowStats?.revoke_count} borderColor="border-blue-300" textColor="text-blue-900" color="bg-blue-50" onClick={() => handleCardClick('Follow Up Completed')} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-300"></div>
                </div>
                <div className="flex flex-col items-center w-1/3 z-10">
                  <TreeCard title="Revoke Completed" count={flowStats?.revoke_completed} total={flowStats?.revoke_count} onClick={() => handleCardClick('Revoke Completed')} />
                </div>
                <div className="flex flex-col items-center w-1/3 z-10">
                  <TreeCard title="Revoke Order" count={flowStats?.revoke_order} total={flowStats?.revoke_count} onClick={() => handleCardClick('Revoke Order')} />
                </div>
              </div>
              <div className="relative w-full flex justify-start pl-[5%] pr-[20%]">
                <div className="w-full relative pt-6">
                  <div className="absolute top-0 border-t-2 border-l-2 border-r-2 border-gray-300 rounded-t-3xl h-6" style={{ left: 'calc(10% - 1.2rem)', right: 'calc(10% - 1.2rem)' }}></div>
                  <div className="grid grid-cols-5 gap-12">
                    <div className="relative flex flex-col items-center"><TreeCard title="PS" count={flowStats?.ps_revoke} total={flowStats?.followup_completed} color="bg-green-50" borderColor="border-green-200" textColor="text-green-800" onClick={() => handleCardClick('PS Revoke')} /></div>
                    <div className="relative flex flex-col items-center"><div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-300"></div><TreeCard title="OGP Provi" count={flowStats?.ogp_provi_revoke} total={flowStats?.followup_completed} color="bg-yellow-50" borderColor="border-yellow-200" textColor="text-yellow-800" onClick={() => handleCardClick('OGP Provi Revoke')} /></div>
                    <div className="relative flex flex-col items-center"><div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-300"></div><TreeCard title="Fallout" count={flowStats?.fallout_revoke} total={flowStats?.followup_completed} color="bg-orange-50" borderColor="border-orange-200" textColor="text-orange-800" onClick={() => handleCardClick('Fallout Revoke')} /></div>
                    <div className="relative flex flex-col items-center"><div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-300"></div><TreeCard title="Cancel" count={flowStats?.cancel_revoke} total={flowStats?.followup_completed} color="bg-red-50" borderColor="border-red-200" textColor="text-red-800" onClick={() => handleCardClick('Cancel Revoke')} /></div>
                    <div className="relative flex flex-col items-center"><TreeCard title="Lain-Lain" count={flowStats?.lain_lain_revoke} total={flowStats?.followup_completed} onClick={() => handleCardClick('Lain-Lain Revoke')} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeCategory && (
          <div className="mt-12 bg-white rounded-3xl shadow border border-gray-200 p-8 scroll-mt-20" id="detail-section">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <div><h3 className="text-lg font-bold text-gray-800">Detail Data: <span className="text-blue-600">{activeCategory}</span></h3><p className="text-sm text-gray-500">Menampilkan daftar order untuk kategori terpilih.</p></div>
              </div>
              <button onClick={handleExportDetail} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 text-sm font-bold transition-colors"><ArrowDownTrayIcon className="w-4 h-4" />Export Excel</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tgl Order</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Witel</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Layanan</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status Group</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Resume Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailLoading ? (<tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">Memuat data detail...</td></tr>) : detailData && detailData.data && detailData.data.length > 0 ? (
                    detailData.data.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{item.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.order_date ? new Date(item.order_date).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{item.customer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.witel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.type_layanan}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs font-bold ${item.kelompok_status === 'PS' ? 'bg-green-100 text-green-800' : item.kelompok_status && item.kelompok_status.includes('CANCEL') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.kelompok_status}</span></td>
                        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate" title={item.status_resume}>{item.status_resume}</td>
                      </tr>
                    ))
                  ) : (<tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500 italic">Tidak ada data detail untuk kategori ini.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlowProcessHSI