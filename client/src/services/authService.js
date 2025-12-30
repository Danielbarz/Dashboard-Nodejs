import api from './api'

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      console.log('Login response:', response.data)
      
      const { user, accessToken, refreshToken } = response.data.data
      
      // Save to localStorage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      
      console.log('Tokens saved to localStorage')
      console.log('User saved:', user)
      
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async register(name, email, password, role = 'user') {
    const response = await api.post('/auth/register', { name, email, password, role })
    return response.data
  },

  async logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },

  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    console.log('getCurrentUser:', user)
    return user
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  }
}
