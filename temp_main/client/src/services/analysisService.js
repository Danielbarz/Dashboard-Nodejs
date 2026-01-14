import api from './api'

export const analysisService = {
  async getDigitalProducts(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('limit', limit)
    if (filters.search) params.append('search', filters.search)
    if (filters.witel) params.append('witel', filters.witel)
    if (filters.branch) params.append('branch', filters.branch)
    if (filters.status) params.append('status', filters.status)

    const response = await api.get(`/analysis/digital-product?${params}`)
    return response.data
  },

  async getDigitalProductStats(filters = {}) {
    const params = new URLSearchParams()
    if (filters.witel) params.append('witel', filters.witel)
    if (filters.branch) params.append('branch', filters.branch)
    if (filters.status) params.append('status', filters.status)

    const response = await api.get(`/analysis/digital-product/stats?${params}`)
    return response.data
  },

  async exportDigitalProducts(filters = {}) {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.witel) params.append('witel', filters.witel)
    if (filters.branch) params.append('branch', filters.branch)
    if (filters.status) params.append('status', filters.status)

    // Download file using backend URL
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
    window.location.href = `${baseURL}/api/analysis/digital-product/export?${params}`
  }
}
