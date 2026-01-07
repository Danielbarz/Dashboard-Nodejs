import axios from 'axios'

// Fallback to local API if env is not set to avoid network errors in dev
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const dashboardService = {
  getRevenueByWitel: (filters = {}) => {
    return api.get('/dashboard/revenue-by-witel', { params: filters })
  },

  getAmountByWitel: (filters = {}) => {
    return api.get('/dashboard/amount-by-witel', { params: filters })
  },

  getKPIData: (filters = {}) => {
    return api.get('/dashboard/kpi-data', { params: filters })
  },

  getTotalOrderByRegional: (filters = {}) => {
    return api.get('/dashboard/total-order-regional', { params: filters })
  },

  getSebaranDataPS: (filters = {}) => {
    return api.get('/dashboard/sebaran-data-ps', { params: filters })
  },

  getCancelByFCC: (filters = {}) => {
    return api.get('/dashboard/cancel-by-fcc', { params: filters })
  },

  getFilterOptions: () => {
    return api.get('/dashboard/filter-options')
  },

  getDashboardData: (filters = {}) => {
    return api.get('/dashboard/data', { params: filters })
  }
}

export const roleService = {
  switchRole: async (targetRole) => {
    const response = await api.post('/roles/switch-role', { targetRole })
    
    // After switching role, fetch updated user profile and update localStorage
    if (response.status === 200) {
      try {
        const profileResponse = await api.get('/auth/profile')
        if (profileResponse.data.success && profileResponse.data.data) {
          localStorage.setItem('user', JSON.stringify(profileResponse.data.data))
          localStorage.setItem('currentRoleAs', profileResponse.data.data.currentRoleAs || profileResponse.data.data.role)
        }
      } catch (error) {
        console.error('Failed to update user profile after role switch:', error)
      }
    }
    
    return response
  },

  getCurrentRole: () => {
    return api.get('/roles/current-role')
  }
}

export const fileService = {
  uploadFile: (file, type = 'digital_product', onUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/files/upload', formData, {
      params: { type },
      onUploadProgress
    })
  },

  getJobStatus: (jobId) => {
    return api.get(`/files/job/${jobId}/status`)
  },

  getJobProgress: (jobId) => {
    return api.get(`/files/job/${jobId}/progress`)
  },

  getImportLogs: () => {
    return api.get('/files/import-logs')
  }
}

export default api


// ... code existing

export const fetchHSIDashboard = async (params) => {
  const response = await api.get('/dashboard/hsi/dashboard', { params })
  return response.data
}

export const fetchHSIFlowStats = async (params) => {
  const response = await api.get('/dashboard/hsi/flow', { params })
  return response.data
}
