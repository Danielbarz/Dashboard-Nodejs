import { PrismaClient } from '@prisma/client'
import { successResponse, errorResponse } from '../utils/response.js'

const prisma = new PrismaClient()

// Switch user role (for super admin and admins)
export const switchRole = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const { targetRole } = req.body

    // Only admin and super_admin can switch roles
    if (!['admin', 'super_admin'].includes(userRole)) {
      return errorResponse(res, 'You do not have permission to switch roles', 403)
    }

    // Validate target role
    if (!['user', 'admin', 'super_admin'].includes(targetRole)) {
      return errorResponse(res, 'Invalid target role', 400)
    }

    // Super admin can switch to any role
    // Admin can switch to user or admin (bolak-balik)
    // User cannot switch roles
    if (userRole === 'admin' && !['user', 'admin'].includes(targetRole)) {
      return errorResponse(res, 'Admins can only switch between user and admin roles', 403)
    }

    // Update active role
    await prisma.user.update({
      where: { id: userId },
      data: { updatedAt: new Date() }
    })

    successResponse(res, { currentRoleAs: targetRole }, 'Role switched successfully')
  } catch (error) {
    next(error)
  }
}

// Get current active role
export const getCurrentRole = async (req, res, next) => {
  try {
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    // Can switch role if actual role is admin or super_admin
    const canSwitchRole = ['admin', 'super_admin'].includes(user.role)

    successResponse(res, {
      actualRole: user.role,
      activeRole: user.role,
      canSwitchRole: canSwitchRole
    })
  } catch (error) {
    next(error)
  }
}
