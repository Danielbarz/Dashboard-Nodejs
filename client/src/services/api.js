import axios from 'axios'

// Detect base URL dynamically to support port forwarding / network access
const getBaseUrl = () => {
  const { protocol, hostname, port } = window.location
  
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL
  }

  // LOGIC: 
  // If we are on port 3000 (React Dev Server), the backend is usually on port 5000
  // of the SAME host (IP/Domain).
  if (port === '3000') {
    return `${protocol}//${hostname}:5000/api`
  }
  
  // Default to the current hostname but on port 5000
  return `${protocol}//${hostname}:5000/api`
}

export const API_URL = getBaseUrl()
// Export the base server URL (without /api) for non-api calls like direct downloads
export const SERVER_URL = API_URL.replace(/\/api$/, '')

console.log(`%c [API CONFIG] %c Using Backend: ${API_URL}`, "color: white; background: #f44336; font-weight: bold;", "color: #f44336;")

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api