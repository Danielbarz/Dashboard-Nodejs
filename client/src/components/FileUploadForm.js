import React, { useState } from 'react'
import { fileService } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'

const FileUploadForm = ({ onSuccess, type = 'digital_product' }) => {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [logLines, setLogLines] = useState([])

  // Check if user is in admin mode
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'super_admin'].includes(currentRole)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setUploadProgress(0)
    setLogLines(['Menyiapkan upload...'])
    setError(null)
    setSuccess(false)

    try {
      console.log('Uploading file:', file.name, 'Type:', type)
      const response = await fileService.uploadFile(file, type, (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded * 100) / event.total)
          setUploadProgress(percent)
          if (percent === 100) {
            setLogLines((prev) => [...prev, 'Upload selesai, memproses di server...'])
          } else {
            setLogLines((prev) => {
              if (prev[prev.length - 1]?.startsWith('Mengunggah')) return prev
              return [...prev, 'Mengunggah file...']
            })
          }
        }
      })
      console.log('Upload response:', response)

      setSuccess(true)
      setFile(null)
      setUploadProgress(null)
      const summary = response?.data?.data
      if (summary) {
        const { totalRows, successRows, failedRows, batchId } = summary
        setLogLines((prev) => [
          ...prev,
          `Selesai diproses. Batch: ${batchId || 'n/a'}`,
          `Rows: ${successRows ?? 0}/${totalRows ?? 0} berhasil, gagal: ${failedRows ?? 0}`
        ])
      } else {
        setLogLines((prev) => [...prev, 'Selesai.'])
      }
      
      // Reset file input
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
      
      if (onSuccess) {
        onSuccess(response.data.data)
      }

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Upload error:', err)
      console.error('Error response:', err.response)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload file'
      setError(errorMessage)
      setUploadProgress(null)
      setLogLines((prev) => [...prev, `Gagal: ${errorMessage}`])
    } finally {
      setLoading(false)
    }
  }

  // If not in admin mode, show access denied message
  if (!isAdminMode) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Data (Excel/CSV)</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p className="font-medium">Access Restricted</p>
          <p className="text-sm mt-1">File upload is only available in admin mode. Please enter admin mode to upload files.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Data (Excel/CSV)</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-gray-600">
              {file ? (
                <p className="text-green-600 font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-gray-500">or click to select file</p>
                  <p className="text-xs text-gray-400 mt-2">Supported formats: Excel (.xlsx, .xls), CSV</p>
                </>
              )}
            </div>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            File uploaded successfully!
          </div>
        )}

        {uploadProgress !== null && (
          <div className="w-full bg-gray-100 rounded-lg h-3">
            <div
              className="bg-blue-600 h-3 rounded-lg transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
            <div className="text-sm text-gray-600 mt-1 text-right">{uploadProgress}%</div>
          </div>
        )}

        {logLines.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 space-y-1 max-h-40 overflow-y-auto">
            {logLines.map((line, idx) => (
              <div key={idx}>• {line}</div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            file && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? `Uploading${uploadProgress !== null ? ` ${uploadProgress}%` : '...'}` : 'Upload File'}
        </button>
      </form>
    </div>
  )
}

export default FileUploadForm
