import React, { useState, useEffect, useRef } from 'react'
import { fileService } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'
import { FiUploadCloud, FiFile, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'

const FileUploadForm = ({ onSuccess, type = 'digital_product' }) => {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  
  // Status Details
  const [resultSummary, setResultSummary] = useState(null)

  // Check if user is in admin mode
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'superadmin'].includes(currentRole)

  // Strict Visibility: If not admin, render nothing
  if (!isAdminMode) return null

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      validateAndSetFile(droppedFiles[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile) => {
    const validExtensions = ['xlsx', 'xls', 'csv']
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Invalid file type. Please upload Excel (.xlsx, .xls) or CSV.')
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError(null)
    setSuccess(false)
    setResultSummary(null)
    setUploadProgress(0)
  }

  const checkJobStatus = async (jobId, batchId) => {
    let attempts = 0
    const maxAttempts = 30 // 30 seconds

    while (attempts < maxAttempts) {
      attempts++
      try {
        const statusResponse = await fileService.getJobStatus(jobId)
        const jobData = statusResponse?.data?.data

        if (jobData?.state === 'completed' && jobData?.result) {
          return jobData.result
        } else if (jobData?.state === 'failed') {
          throw new Error('Processing failed on server.')
        }
      } catch (err) {
        console.error(`Check attempt ${attempts} error:`, err.message)
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    return { totalRows: 0, successRows: 0, failedRows: 0, batchId }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setUploadProgress(10) // Start progress

    try {
      const response = await fileService.uploadFile(file, type, (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded * 100) / event.total)
          setUploadProgress(percent < 90 ? percent : 90) // Keep 10% for processing
        }
      })

      const uploadData = response?.data?.data
      if (!uploadData) throw new Error('No response data')

      const { jobId, batchId, totalRows, successRows, failedRows } = uploadData
      let finalResult = { totalRows, successRows, failedRows, batchId }

      if (jobId) {
        setUploadProgress(95) // Processing...
        finalResult = await checkJobStatus(jobId, batchId)
      }

      setUploadProgress(100)
      setSuccess(true)
      setResultSummary(finalResult)
      
      if (onSuccess) onSuccess(finalResult)

    } catch (err) {
      console.error('Upload Error:', err)
      setError(err.response?.data?.message || err.message || 'Upload failed.')
      setUploadProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setSuccess(false)
    setError(null)
    setResultSummary(null)
    setUploadProgress(0)
  }

  return (
    <div className="w-full">
      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            flex flex-col items-center justify-center gap-3
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
          `}
        >
          <input 
            type="file" 
            id={`file-upload-${type}`} 
            className="hidden" 
            onChange={handleFileSelect} 
            accept=".xlsx,.xls,.csv"
          />
          <label htmlFor={`file-upload-${type}`} className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-2">
              <FiUploadCloud size={32} />
            </div>
            <p className="text-sm font-bold text-gray-700">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">Excel or CSV files only</p>
          </label>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* File Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <FiFile size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            {!loading && !success && (
              <button onClick={resetForm} className="text-gray-400 hover:text-red-500 text-sm">
                Remove
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1 text-gray-600">
                <span>Uploading & Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4 flex items-start gap-3 animate-fade-in">
              <FiCheckCircle className="text-green-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-green-800">Upload Successful!</p>
                {resultSummary && (
                  <p className="text-xs text-green-700 mt-1">
                    Batch: {resultSummary.batchId} • Success: {resultSummary.successRows} • Failed: {resultSummary.failedRows}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4 flex items-start gap-3 animate-fade-in">
              <FiXCircle className="text-red-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-red-800">Upload Failed</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            {!success && !loading && (
              <button 
                onClick={handleUpload}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100"
              >
                Start Upload
              </button>
            )}
            {(success || error) && !loading && (
              <button 
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
              >
                Upload Another
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadForm