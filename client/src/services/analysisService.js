import api from './coreService'

export const analysisService = {
  getDigitalProductAnalysis: (params) => {
    // Convert arrays to comma-separated strings for API
    const formattedParams = { ...params }
    if (Array.isArray(params.witels)) formattedParams.witels = params.witels.join(',')
    if (Array.isArray(params.channels)) formattedParams.channels = params.channels.join(',')
    if (Array.isArray(params.segments)) formattedParams.segments = params.segments.join(',')
    if (Array.isArray(params.statuses)) formattedParams.statuses = params.statuses.join(',')
    
    return api.get('/analysis/digital-product', { params: formattedParams })
  },

  getDatinAnalysis: (params) => {
    return api.get('/analysis/datin', { params })
  },

  getJTAnalysis: (params) => {
    return api.get('/analysis/jt', { params })
  },

  exportDigitalProduct: (params) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','))
        } else {
          queryParams.append(key, value)
        }
      }
    })

    // Use dynamic API URL from current origin
    const baseURL = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`
    window.location.href = `${baseURL}/api/analysis/digital-product/export?${queryParams.toString()}`
  }
}
