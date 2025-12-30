import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import sql from '../config/database.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body

    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return errorResponse(res, 'Email already registered', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with explicit timestamps
    const now = new Date()
    const newUser = await sql`
      INSERT INTO users (name, email, password, role, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, ${now}, ${now})
      RETURNING id, name, email, role, created_at
    `

    successResponse(res, newUser[0], 'User registered successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const users = await sql`
      SELECT id, name, email, password, role, current_role_as
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, currentRoleAs: user.current_role_as },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    )

    // Remove password from response
    delete user.password

    successResponse(res, {
      user: {
        ...user,
        currentRoleAs: user.current_role_as
      },
      accessToken,
      refreshToken
    }, 'Login successful')
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token required', 400)
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret)

    // Get user
    const users = await sql`
      SELECT id, name, email, role 
      FROM users 
      WHERE id = ${decoded.id}
    `

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 404)
    }

    const user = users[0]

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    successResponse(res, { accessToken }, 'Token refreshed successfully')
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Invalid refresh token', 401)
    }
    next(error)
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const users = await sql`
      SELECT id, name, email, role, current_role_as, created_at, updated_at
      FROM users
      WHERE id = ${req.user.id}
    `

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 404)
    }

    const user = users[0]
    const activeRole = user.current_role_as || user.role
    
    successResponse(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      currentRoleAs: activeRole,
      current_role_as: activeRole,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }, 'Profile retrieved successfully')
  } catch (error) {
    next(error)
  }
}
