import React, { useState } from 'react'
import { FiUpload, FiDownload, FiX, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import api from '../services/coreService'

const AdminMergeFiles = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [mergeResult, setMergeResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    processFiles(selectedFiles)
    // Clear input value so same file can be selected again
    e.target.value = ''
  }

  const processFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase()
      return ['csv', 'xlsx', 'xls'].includes(ext)
    })

    if (validFiles.length !== selectedFiles.length) {
      setError('Hanya file CSV dan XLSX yang diperbolehkan')
      setTimeout(() => setError(null), 5000)
    }

    setFiles(prevFiles => {
      const newFiles = [...prevFiles]
      validFiles.forEach(file => {
        if (!newFiles.find(f => f.name === file.name && f.size === file.size)) {
          newFiles.push(file)
        }
      })
      return newFiles
    })
    setMergeResult(null)
  }

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Pilih minimal 2 file untuk digabungkan')
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
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setMergeResult(response.data?.data)
      setFiles([])
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menggabungkan file')
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
    } catch (err) {
      setError('Gagal mengunduh file')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Merge Utility</h1>
        <p className="text-slate-500 font-medium">Satukan ribuan data CSV/XLSX dalam hitungan detik.</p>
      </div>

      {/* UPLOAD BOX CONTAINER */}
      <div className="relative group w-full">
        {/* THE ACTUAL INPUT - STRETCHED TO FULL BOX */}
        <input
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
          title=""
        />
        
        {/* VISUAL BOX - UNDER THE INPUT */}
        <div className="w-full min-h-[320px] flex flex-col items-center justify-center border-4 border-dashed border-slate-300 rounded-3xl bg-white group-hover:bg-blue-50 group-hover:border-blue-500 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-100">
          <div className="flex flex-col items-center p-10 pointer-events-none">
            <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <FiUpload className="text-blue-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">Pilih File Laporan</h3>
            <p className="text-slate-500 text-center max-w-sm">
              Seret file ke sini atau <span className="text-blue-600 font-bold underline">Klik Area Ini</span> untuk memilih file.
            </p>
            <div className="mt-6 flex gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">CSV</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">XLSX</span>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-center p-5 text-red-800 bg-red-50 rounded-2xl border-2 border-red-100 animate-pulse">
          <FiAlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* QUEUE LIST */}
      {files.length > 0 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Daftar Antrean ({files.length})</h2>
            <button onClick={() => setFiles([])} className="text-red-500 font-bold hover:text-red-700 transition-colors">Reset</button>
          </div>
          
          <div className="grid grid-cols-1 gap-3 mb-8">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 border border-slate-200 shadow-sm">
                  <FiFileText className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400 font-medium uppercase">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => removeFile(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <FiX size={20} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleMerge}
            disabled={loading || files.length < 2}
            className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center transition-all duration-300 ${
              loading || files.length < 2 
              ? 'bg-slate-200 shadow-none cursor-not-allowed text-slate-400' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:-translate-y-1 active:translate-y-0'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent mr-3"></div>
                SEDANG MENGGABUNGKAN...
              </div>
            ) : (
              <>MENGGABUNGKAN SEKARANG</>
            )}
          </button>
        </div>
      )}

      {/* SUCCESS RESULT */}
      {mergeResult && (
        <div className="bg-emerald-500 p-8 rounded-3xl shadow-xl shadow-emerald-100 border-2 border-emerald-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-5 backdrop-blur-sm">
                <FiCheckCircle size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter">PROCESS COMPLETE!</h3>
                <p className="opacity-90 font-medium">{mergeResult.totalRows.toLocaleString()} baris data berhasil disatukan.</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="w-full md:w-auto px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black text-lg shadow-lg hover:bg-slate-50 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
            >
              <FiDownload className="mr-3" size={24} />
              UNDUH XLSX
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMergeFiles
