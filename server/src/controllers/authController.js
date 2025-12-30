import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { PrismaClient } from '@prisma/client'
import { successResponse, errorResponse } from '../utils/response.js'

const prisma = new PrismaClient()

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    successResponse(res, newUser, 'User registered successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid credentials', 401)
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    )

    // Return user without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    successResponse(res, {
      user: userResponse,
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
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    successResponse(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, 'Profile retrieved successfully')
  } catch (error) {
    next(error)
  }
}
