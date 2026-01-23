import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(email, password)

      // Get user from localStorage (already set by authService)
      const userStr = localStorage.getItem('user')
      const userData = userStr ? JSON.parse(userStr) : null
      const userRole = userData?.role || 'user'

      console.log('=== LOGIN DEBUG ===')
      console.log('User from localStorage:', userData)
      console.log('User role:', userRole)

      // Redirect based on role
      if (userRole === 'superadmin') {
        console.log('✅ Redirecting Super Admin to /admin/users')
        navigate('/admin/users', { replace: true })
      } else {
        console.log('✅ Redirecting User/Admin to /')
        navigate('/', { replace: true })
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/tlt-surabaya.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a'
      }}
    >
      <div className="absolute inset-0 bg-black/55" aria-hidden="true"></div>
      <div className="relative w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8 text-white drop-shadow-md">
          <img src={`${process.env.PUBLIC_URL}/images/logotelkom.png`} alt="Telkom" className="mx-auto h-12 w-auto mb-3" />
          <h1 className="text-3xl font-bold">Telkom Dashboard</h1>
          <p className="text-gray-200 mt-2">Welcome back</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
                Register here
              </Link>
            </p>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-medium">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Email: admin@example.com</p>
            <p className="text-xs text-gray-600">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
