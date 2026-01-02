import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null)

  const fileInputRef = useRef(null)
  const storageKey = useMemo(() => `uploadedFile_${type}`, [type])

  // Check if user is in admin mode
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'superadmin'].includes(currentRole)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setUploadedFileInfo(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem(storageKey)
      }
    }
  }, [storageKey])

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
        const { totalRows, successRows, failedRows, batchId, totalBatches, progressLogs } = summary
        
        // Add batch progress logs if available
        if (progressLogs && progressLogs.length > 0) {
          const batchLogs = progressLogs
            .filter(log => log.status === 'success')
            .map(log => `Batch ${log.batch}: ${log.inserted} ${log.type} rows inserted`)
          setLogLines((prev) => [...prev, ...batchLogs])
        }
        
        setLogLines((prev) => [
          ...prev,
          `✅ Selesai diproses. Batch: ${batchId || 'n/a'}`,
          `📊 Total: ${successRows ?? 0}/${totalRows ?? 0} berhasil, ${failedRows ?? 0} gagal`,
          `📦 Jumlah batch: ${totalBatches ?? 'n/a'}`
        ])
      } else {
        setLogLines((prev) => [...prev, 'Selesai.'])
      }
      
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      if (onSuccess) {
        onSuccess(response.data.data)
      }

      const uploadedInfo = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
      setUploadedFileInfo(uploadedInfo)
      localStorage.setItem(storageKey, JSON.stringify(uploadedInfo))

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

    const handleDeleteUploaded = () => {
      setUploadedFileInfo(null)
      localStorage.removeItem(storageKey)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setLogLines((prev) => [...prev, 'Data upload ditandai dihapus dari UI.'])
    }

    const handleReplace = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
          id={`file-input-${type}`}
        />

        {!uploadedFileInfo && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
            onClick={handleReplace}
          >
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
          </div>
        )}

        {uploadedFileInfo && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">File sudah diupload</p>
                <p className="text-sm text-gray-600">{uploadedFileInfo.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(uploadedFileInfo.size / 1024)} KB • {new Date(uploadedFileInfo.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReplace}
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  Ubah file
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUploaded}
                  className="px-3 py-1.5 rounded-md bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition"
                  disabled={loading}
                >
                  Hapus file
                </button>
              </div>
            </div>
            {file && (
              <p className="text-xs text-blue-600 mt-2">File baru dipilih: {file.name}</p>
            )}
          </div>
        )}

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
          {loading ? `Uploading${uploadProgress !== null ? ` ${uploadProgress}%` : '...'}` : uploadedFileInfo ? 'Upload ulang' : 'Upload File'}
        </button>
      </form>
    </div>
  )
}

export default FileUploadForm
