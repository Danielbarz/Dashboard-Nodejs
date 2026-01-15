import React from 'react'
import { useSearchParams } from 'react-router-dom'

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connectivity Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor status dan performa jaringan Telkom HSI</p>
        </div>

        {/* Network Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => setSelectedNetwork(network.id)}
              className={`p-6 rounded-lg border-2 transition text-left ${
                selectedNetwork === network.id
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">{network.label}</p>
              <p className="text-sm text-gray-600 mt-2">{network.desc}</p>
            </button>
          ))}
        </div>

        {/* Network Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-2xl font-bold text-green-600 mt-2">ONLINE</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Uptime</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">99.9%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm">Avg Latency</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">45ms</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Bandwidth Used</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">72%</p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Performance</h2>
          <div className="bg-gray-50 rounded-lg h-64 flex items-center justify-center text-gray-500">
            Chart akan ditampilkan di sini
          </div>
        </div>
      </div>
  )
}

export default Connectivity
