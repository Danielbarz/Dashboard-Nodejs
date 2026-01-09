import React, { useState } from 'react'
import { FiUpload, FiDownload, FiX } from 'react-icons/fi'
import api from '../services/dashboardService'

const AdminMergeFiles = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [mergeResult, setMergeResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase()
      return ['csv', 'xlsx', 'xls'].includes(ext)
    })

    if (validFiles.length !== selectedFiles.length) {
      setError('Only CSV and XLSX files are allowed')
      setTimeout(() => setError(null), 3000)
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles])
  }

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 files to merge')
      setTimeout(() => setError(null), 3000)
      return
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    try {
      setLoading(true)
      setError(null)

      const response = await api.post('/admin/merge-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMergeResult(response.data?.data)
      setFiles([])
    } catch (err) {
      console.error('Error merging files:', err)
      setError(err.response?.data?.message || 'Failed to merge files')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!mergeResult?.filePath) return

    try {
      const response = await api.get('/admin/merge-files/download', {
        params: { filePath: mergeResult.filePath },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', mergeResult.fileName || 'merged-file.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading file:', err)
      setError('Failed to download file')
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Merge CSV/XLSX Files</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload multiple CSV or XLSX files to merge them into a single file
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to upload or drag and drop
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  CSV or XLSX files (max 10 files)
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      disabled={loading}
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Merge Button */}
          {files.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleMerge}
                disabled={loading || files.length < 2}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                  loading || files.length < 2
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Merging Files...
                  </>
                ) : (
                  'Merge Files'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Merge Result */}
        {mergeResult && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Merge Result</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Success
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">File Name:</p>
                  <p className="font-medium text-gray-900">{mergeResult.fileName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Rows:</p>
                  <p className="font-medium text-gray-900">
                    {mergeResult.totalRows?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Files Merged:</p>
                  <p className="font-medium text-gray-900">{mergeResult.filesCount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created:</p>
                  <p className="font-medium text-gray-900">
                    {new Date(mergeResult.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <FiDownload className="mr-2" size={20} />
              Download Merged File
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Upload at least 2 CSV or XLSX files to merge</li>
            <li>Files will be merged vertically (rows combined)</li>
            <li>All files should have the same column structure</li>
            <li>The merged file will be in XLSX format</li>
            <li>Maximum 10 files can be merged at once</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminMergeFiles
