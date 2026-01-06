import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

// Switch user role (for super admin and admins)
export const switchRole = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const { targetRole } = req.body

    // Only admin and superadmin can switch roles
    if (!['admin', 'superadmin'].includes(userRole)) {
      return errorResponse(res, 'You do not have permission to switch roles', 403)
    }

    // Validate target role
    if (!['user', 'admin', 'superadmin'].includes(targetRole)) {
      return errorResponse(res, 'Invalid target role', 400)
    }

    // Super admin can switch to any role
    // Admin can switch to user or admin (bolak-balik)
    // User cannot switch roles
    if (userRole === 'admin' && !['user', 'admin'].includes(targetRole)) {
      return errorResponse(res, 'Admins can only switch between user and admin roles', 403)
    }

    console.log(`Switching role for user ID: ${userId} to ${targetRole}`)

    // Check if user exists first
    const userExists = await prisma.user.findUnique({
      where: { id: BigInt(userId) }
    })

    if (!userExists) {
      return errorResponse(res, 'User not found in database. Please logout and login again.', 404)
    }

    // Update current_role_as in database
    await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { 
        currentRoleAs: targetRole,
        updatedAt: new Date() 
      }
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
    const parsedId = typeof userId === 'string' ? BigInt(userId) : BigInt(userId)

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) }
    })

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    const activeRole = user.currentRoleAs || user.role

    // Can switch role if actual role is admin or superadmin
    const canSwitchRole = ['admin', 'superadmin'].includes(user.role)

    successResponse(res, {
      actualRole: user.role,
      activeRole: activeRole,
      canSwitchRole: canSwitchRole
    })
  } catch (error) {
    next(error)
  }
}
