import { successResponse, errorResponse } from '../utils/response.js'
import bcryptjs from 'bcryptjs'
import prisma from '../lib/prisma.js'

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Convert BigInt to string
    const usersWithStringId = users.map(user => ({
      ...user,
      id: user.id.toString()
    }))

    successResponse(res, usersWithStringId, 'Users retrieved successfully')
  } catch (error) {
    console.error('Error fetching users:', error)
    errorResponse(res, 'Failed to fetch users', 500)
  }
}

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    // Convert BigInt to string
    const userWithStringId = {
      ...user,
      id: user.id.toString()
    }

    successResponse(res, userWithStringId, 'User retrieved successfully')
  } catch (error) {
    console.error('Error fetching user:', error)
    errorResponse(res, 'Failed to fetch user', 500)
  }
}

// Create user
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400)
    }

    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return errorResponse(res, 'Email already exists', 409)
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

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
        createdAt: true,
        updatedAt: true
      }
    })

    // Convert BigInt to string
    const userWithStringId = {
      ...newUser,
      id: newUser.id.toString()
    }

    successResponse(res, userWithStringId, 'User created successfully', 201)
  } catch (error) {
    console.error('Error creating user:', error)
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return errorResponse(res, 'Email already exists', 409)
    }
    errorResponse(res, 'Failed to create user', 500)
  }
}

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, email, password, role } = req.body

    if (!name && !email && !password && !role) {
      return errorResponse(res, 'At least one field is required', 400)
    }

    if (role && !['user', 'admin', 'superadmin'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400)
    }

    const updateData = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (password) {
      updateData.password = await bcryptjs.hash(password, 10)
    }
    if (role) updateData.role = role
    updateData.updatedAt = new Date()

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Convert BigInt to string
    const userWithStringId = {
      ...updatedUser,
      id: updatedUser.id.toString()
    }

    successResponse(res, userWithStringId, 'User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
    if (error.code === 'P2025') {
      return errorResponse(res, 'User not found', 404)
    }
    errorResponse(res, 'Failed to update user', 500)
  }
}

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    // Prevent deleting yourself
    if (BigInt(id) === BigInt(req.user.id)) {
      return errorResponse(res, 'You cannot delete your own account', 400)
    }

    const deletedUser = await prisma.user.delete({
      where: { id: BigInt(id) },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    // Convert BigInt to string
    const userWithStringId = {
      ...deletedUser,
      id: deletedUser.id.toString()
    }

    successResponse(res, userWithStringId, 'User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error.code === 'P2025') {
      return errorResponse(res, 'User not found', 404)
    }
    errorResponse(res, 'Failed to delete user', 500)
  }
}

// Truncate Jaringan Tambahan (JT) data: clear table spmk_mom
export const truncateJT = async (req, res, next) => {
  try {
    // Safety: only admin routes hit this; additional confirmation could be added via payload if needed
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "spmk_mom" RESTART IDENTITY CASCADE;')

    successResponse(res, { table: 'spmk_mom', truncated: true }, 'JT data truncated successfully')
  } catch (error) {
    console.error('Error truncating JT data:', error)
    errorResponse(res, 'Failed to truncate JT data', 500)
  }
}

// Truncate Digital Product Data (Raw & Final)
export const truncateDigital = async (req, res, next) => {
  try {
    // Truncate Raw Table
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "digital_product_raws" RESTART IDENTITY CASCADE;')
    // Truncate Final Table
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "digital_products" RESTART IDENTITY CASCADE;')

    successResponse(res, { truncated: true }, 'Digital Product data (Raw & Final) truncated successfully')
  } catch (error) {
    console.error('Error truncating Digital data:', error)
    errorResponse(res, 'Failed to truncate Digital data', 500)
  }
}
