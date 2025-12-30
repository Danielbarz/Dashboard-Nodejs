import React, { useState, useEffect } from 'react'
import FileUploadForm from '../components/FileUploadForm'
import { useAuth } from '../context/AuthContext'
import { roleService } from '../services/dashboardService'

const FlowProcessHSI = () => {
  const [selectedProcess, setSelectedProcess] = useState('order')
  const { user } = useAuth()
  const [activeRole, setActiveRole] = useState(user?.role || 'user')

  useEffect(() => {
    roleService.getCurrentRole().then(res => {
      setActiveRole(res.data?.data?.activeRole || activeRole)
    }).catch(() => {})
  }, [])

  const processes = [
    { id: 'order', label: 'Order Process', steps: 5, completed: 3, status: 'In Progress' },
    { id: 'deployment', label: 'Deployment', steps: 6, completed: 4, status: 'In Progress' },
    { id: 'activation', label: 'Activation', steps: 4, completed: 2, status: 'In Progress' },
    { id: 'support', label: 'Support Ticket', steps: 3, completed: 1, status: 'Pending' },
  ]

  const selectedProcessData = processes.find(p => p.id === selectedProcess)

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flow Process HSI</h1>
          <p className="text-gray-600 mt-1">Visualisasi dan tracking proses HSI dari order hingga activation</p>
        </div>

        {/* Process Selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {processes.map((process) => (
            <button
              key={process.id}
              onClick={() => setSelectedProcess(process.id)}
              className={`p-4 rounded-lg transition ${
                selectedProcess === process.id
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-800 hover:border-red-300'
              }`}
            >
              <p className="font-semibold">{process.label}</p>
              <p className={`text-sm mt-1 ${selectedProcess === process.id ? 'text-red-100' : 'text-gray-600'}`}>
                {process.completed}/{process.steps} steps
              </p>
            </button>
          ))}
        </div>

        {/* Process Details */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{selectedProcessData?.label}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedProcessData?.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedProcessData?.status}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(selectedProcessData?.completed / selectedProcessData?.steps) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {selectedProcessData?.completed} dari {selectedProcessData?.steps} tahap selesai
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-4">
            {[...Array(selectedProcessData?.steps)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                    i < selectedProcessData?.completed
                      ? 'bg-green-500'
                      : i === selectedProcessData?.completed
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                >
                  {i < selectedProcessData?.completed ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    i < selectedProcessData?.completed
                      ? 'text-green-700'
                      : i === selectedProcessData?.completed
                      ? 'text-blue-700'
                      : 'text-gray-600'
                  }`}>
                    Step {i + 1}: {['Submission', 'Review', 'Approval', 'Processing', 'Deployment', 'Completion'][i]}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {i < selectedProcessData?.completed
                      ? `Selesai pada ${new Date(Date.now() - (selectedProcessData?.completed - i) * 86400000).toLocaleDateString('id-ID')}`
                      : i === selectedProcessData?.completed
                      ? 'Sedang berlangsung'
                      : 'Belum dimulai'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 text-sm">Start Date</p>
            <p className="text-xl font-bold text-blue-600 mt-2">{new Date(Date.now() - 10 * 86400000).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <p className="text-gray-700 text-sm">Estimated Complete</p>
            <p className="text-xl font-bold text-orange-600 mt-2">{new Date(Date.now() + 5 * 86400000).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-gray-700 text-sm">Progress</p>
            <p className="text-xl font-bold text-green-600 mt-2">
              {Math.round((selectedProcessData?.completed / selectedProcessData?.steps) * 100)}%
            </p>
          </div>
        </div>

        {/* Upload Section (Admin/Super Admin) */}
        {['admin', 'super_admin'].includes(activeRole) && (
          <div className="mt-6">
            <FileUploadForm type="hsi" onSuccess={() => { /* future: refetch process data */ }} />
          </div>
        )}
      </div>
  )
}

export default FlowProcessHSI
