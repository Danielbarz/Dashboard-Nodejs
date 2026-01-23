import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import prisma from '../lib/prisma.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, config.jwt.secret)
    
    // Fetch fresh user data from database to ensure up-to-date role
    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.id) }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    // Assign full user object to req.user
    req.user = {
      ...user,
      id: user.id.toString() // Keep ID as string for compatibility
    }

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }

    next(error)
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions'
      })
    }

    next()
  }
}

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    })
  }

  // Base role is used here (which we fetched from DB in 'authenticate' middleware)
  const allowedRoles = ['admin', 'superadmin']
  if (!allowedRoles.includes(req.user.role)) {
    console.warn(`[adminOnly] Access denied for user ${req.user.email} with role ${req.user.role}`)
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required'
    })
  }

  next()
}
