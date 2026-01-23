import api from './api'

// Centralized role services
export const roleService = {
  getCurrentRole: () => api.get('/roles/current-role'),
  switchRole: (role) => api.post('/roles/switch', { role })
}

// File upload and processing services
export const fileService = {
  uploadFile: (file, type, onUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post(`/files/upload?type=${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  },
  
  getJobStatus: (jobId) => api.get(`/files/job/${jobId}/status`),
  
  getImportLogs: () => api.get('/files/import-logs'),
  
  truncateData: (type) => api.delete(`/files/data?type=${type}`)
}

export default api
