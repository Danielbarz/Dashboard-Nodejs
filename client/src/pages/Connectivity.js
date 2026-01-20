import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiActivity, FiCpu, FiGlobe, FiServer } from 'react-icons/fi'
import KPICard from '../components/KPICard'

const Connectivity = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedNetwork = searchParams.get('tab') || 'jaringan'

  const setSelectedNetwork = (tab) => {
    setSearchParams({ tab }, { replace: true })
  }

  const networks = [
    { id: 'jaringan', label: 'Jaringan Overview', desc: 'Status dan performa jaringan utama' },
    { id: 'bandwidth', label: 'Bandwidth Usage', desc: 'Penggunaan bandwidth per witel' },
    { id: 'latency', label: 'Latency Monitor', desc: 'Monitoring latensi koneksi' },
  ]

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Connectivity Dashboard</h1>
          <p className="text-gray-500 text-sm">Monitor status dan performa jaringan Telkom HSI</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => setSelectedNetwork(network.id)}
            className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-center h-24 ${
              selectedNetwork === network.id
                ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <p className={`font-bold ${selectedNetwork === network.id ? 'text-blue-700' : 'text-gray-800'}`}>
              {network.label}
            </p>
            <p className="text-xs text-gray-500 mt-1">{network.desc}</p>
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="NETWORK STATUS"
          value="ONLINE"
          icon={<FiGlobe />}
          color="green"
        />
        <KPICard
          title="UPTIME"
          value="99.9%"
          icon={<FiActivity />}
          color="blue"
        />
        <KPICard
          title="AVG LATENCY"
          value="45ms"
          icon={<FiCpu />}
          color="orange"
        />
        <KPICard
          title="BANDWIDTH USED"
          value="72%"
          icon={<FiServer />}
          color="purple"
        />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[500px]">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Network Performance - {networks.find(n => n.id === selectedNetwork)?.label}
        </h2>
        
        {/* Placeholder Chart */}
        <div className="bg-gray-50 rounded-xl h-[400px] flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200">
          <FiActivity size={48} className="mb-4 opacity-20" />
          <p>Visualisasi data real-time akan ditampilkan di sini</p>
        </div>
      </div>

    </div>
  )
}

export default Connectivity