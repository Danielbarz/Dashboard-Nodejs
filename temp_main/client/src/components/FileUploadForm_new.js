import React, { useState, useEffect } from 'react'
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
  const [fileUploaded, setFileUploaded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if user is in admin mode
  const currentRole = localStorage.getItem('currentRole') || user?.role || 'user'
  const isAdminMode = ['admin', 'superadmin'].includes(currentRole)


  // Restore upload state from localStorage on mount
  useEffect(() => {
    const uploadState = localStorage.getItem(`fileUploadState_${type}`)
    if (uploadState) {
      try {
        const { fileName, fileUploaded: wasUploaded, logLines: savedLogs } = JSON.parse(uploadState)
        if (wasUploaded && fileName) {
          // Create a File-like object to show in UI
          setFile({ name: fileName, size: 0 })
          setFileUploaded(true)
          setLogLines(savedLogs || [])
        }
      } catch (e) {
        console.error('Failed to restore upload state:', e)
        localStorage.removeItem(`fileUploadState_${type}`)
      }
    }
  }, [type])

  // Save upload state to localStorage
  useEffect(() => {
    if (fileUploaded && file) {
      const uploadState = {
        fileName: file.name,
        fileUploaded: true,
        logLines: logLines
      }
      localStorage.setItem(`fileUploadState_${type}`, JSON.stringify(uploadState))
    }
  }, [fileUploaded, file, logLines, type])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError(null)
    setSuccess(false)
    setFileUploaded(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    setSuccess(false)
    setUploadProgress(null)
    setLogLines([])
    setFileUploaded(false)
    localStorage.removeItem(`fileUploadState_${type}`)
    const fileInput = document.getElementById('file-input')
    if (fileInput) fileInput.value = ''
  }

  // Check job status - polls a few times to get final result
  const checkJobStatus = async (jobId, batchId) => {
    let attempts = 0
    const maxAttempts = 30 // 30 seconds

    while (attempts < maxAttempts) {
      attempts++
      try {
        const statusResponse = await fileService.getJobStatus(jobId)
        const jobData = statusResponse?.data?.data

        if (jobData?.state === 'completed' && jobData?.result) {
          console.log('✅ Job completed:', jobData.result)
          return jobData.result
        } else if (jobData?.state === 'failed') {
          throw new Error('Job processing failed')
        }
      } catch (err) {
        console.error(`Check attempt ${attempts} error:`, err.message)
      }

      // Wait 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Timeout - return default result
    console.log('Job status check timeout after 30 seconds')
    return { totalRows: 0, successRows: 0, failedRows: 0, batchId }
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

      const uploadData = response?.data?.data
      if (!uploadData) throw new Error('No response data from upload')

      const { jobId, batchId } = uploadData
      setLogLines((prev) => [...prev, `⏳ Menunggu hasil pemrosesan... (Job ID: ${jobId})`])

      // Check job status after upload
      const result = await checkJobStatus(jobId, batchId)

      setSuccess(true)
      setFileUploaded(true)
      setUploadProgress(null)

      const { totalRows, successRows, failedRows } = result
      setLogLines((prev) => [
        ...prev,
        `✅ Selesai diproses. Batch: ${batchId}`,
        `📊 Total: ${successRows ?? 0}/${totalRows ?? 0} berhasil, ${failedRows ?? 0} gagal`
      ])

      if (onSuccess) {
        onSuccess(result)
      }

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload file'
      setError(errorMessage)
      setUploadProgress(null)
      setLogLines((prev) => [...prev, `Gagal: ${errorMessage}`])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteData = async () => {
    if (!window.confirm(`⚠️ PERINGATAN KERAS!\n\nApakah Anda yakin ingin MENGHAPUS SEMUA DATA untuk modul "${type}"?\n\nTindakan ini tidak dapat dibatalkan. Data database akan dikosongkan.`)) {
      return
    }

    setIsDeleting(true)
    setError(null)
    setLogLines((prev) => [...prev, 'Menghapus data database...'])

    try {
      await fileService.truncateData(type)
      setLogLines((prev) => [...prev, '✅ Data berhasil dihapus (Truncated).'])
      setSuccess(true)
      // Clear file selection too as context is reset
      handleRemoveFile()
      if (onSuccess) onSuccess({ reset: true })
    } catch (err) {
      console.error('Delete error:', err)
      const msg = err.response?.data?.message || 'Gagal menghapus data'
      setError(msg)
      setLogLines((prev) => [...prev, `❌ Gagal hapus: ${msg}`])
    } finally {
      setIsDeleting(false)
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
        {!file || !fileUploaded ? (
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
                {file && !fileUploaded ? (
                  <div>
                    <p className="text-green-600 font-medium">{file.name}</p>
                    <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
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
        ) : (
          <div className="border-2 border-solid border-green-300 bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-green-800 font-semibold">{file.name}</p>
                  <p className="text-green-600 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <label htmlFor="file-input" className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                  Ubah File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                  id="file-input"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={loading}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                  Hapus File
                </button>
              </div>
            </div>
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
          disabled={!file || loading || isDeleting}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            file && !loading && !isDeleting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? `Uploading${uploadProgress !== null ? ` ${uploadProgress}%` : '...'}` : 'Upload File'}
        </button>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <button
            type="button"
            onClick={handleDeleteData}
            disabled={loading || isDeleting}
            className="w-full py-2 px-4 rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition flex justify-center items-center"
          >
            {isDeleting ? 'Menghapus...' : '🗑️ Hapus Semua Data Database (Reset)'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FileUploadForm
