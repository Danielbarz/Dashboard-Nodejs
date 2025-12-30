import sql from '../config/database.js'
import { successResponse, errorResponse } from '../utils/response.js'

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

    // Update current_role_as
    await sql`
      UPDATE users 
      SET current_role_as = ${targetRole}, updated_at = NOW()
      WHERE id = ${userId}
    `

    successResponse(res, { currentRoleAs: targetRole }, 'Role switched successfully')
  } catch (error) {
    next(error)
  }
}

// Get current active role
export const getCurrentRole = async (req, res, next) => {
  try {
    const userId = req.user.id

    const user = await sql`
      SELECT id, name, email, role, current_role_as 
      FROM users 
      WHERE id = ${userId}
    `

    if (user.length === 0) {
      return errorResponse(res, 'User not found', 404)
    }

    const currentUser = user[0]
    const activeRole = currentUser.current_role_as || currentUser.role

    // Can switch role if actual role is admin or super_admin (regardless of current active role)
    const canSwitchRole = ['admin', 'super_admin'].includes(currentUser.role)

    successResponse(res, {
      actualRole: currentUser.role,
      activeRole: activeRole,
      canSwitchRole: canSwitchRole
    })
  } catch (error) {
    next(error)
  }
}
