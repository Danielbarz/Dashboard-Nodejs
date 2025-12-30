import sql from '../config/database.js'
import { successResponse, errorResponse } from '../utils/response.js'
import bcryptjs from 'bcryptjs'

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await sql`
      SELECT id, name, email, role, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `
    
    successResponse(res, users, 'Users retrieved successfully')
  } catch (error) {
    console.error('Error fetching users:', error)
    errorResponse(res, 'Failed to fetch users', 500)
  }
}

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await sql`
      SELECT id, name, email, role, created_at, updated_at 
      FROM users 
      WHERE id = ${id}
    `
    
    if (user.length === 0) {
      return errorResponse(res, 'User not found', 404)
    }
    
    successResponse(res, user[0], 'User retrieved successfully')
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
    
    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400)
    }
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)
    
    const result = await sql`
      INSERT INTO users (name, email, password, role, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, NOW(), NOW())
      RETURNING id, name, email, role, created_at, updated_at
    `
    
    successResponse(res, result[0], 'User created successfully', 201)
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
    
    if (role && !['user', 'admin', 'super_admin'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400)
    }
    
    let updateParts = []
    
    if (name) updateParts.push(sql`name = ${name}`)
    if (email) updateParts.push(sql`email = ${email}`)
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10)
      updateParts.push(sql`password = ${hashedPassword}`)
    }
    if (role) updateParts.push(sql`role = ${role}`)
    
    updateParts.push(sql`updated_at = NOW()`)
    
    const result = await sql`
      UPDATE users
      SET ${sql(updateParts)}
      WHERE id = ${id}
      RETURNING id, name, email, role, created_at, updated_at
    `
    
    if (result.length === 0) {
      return errorResponse(res, 'User not found', 404)
    }
    
    successResponse(res, result[0], 'User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
    errorResponse(res, 'Failed to update user', 500)
  }
}

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    
    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return errorResponse(res, 'You cannot delete your own account', 400)
    }
    
    const result = await sql`
      DELETE FROM users 
      WHERE id = ${id}
      RETURNING id, name, email
    `
    
    if (result.length === 0) {
      return errorResponse(res, 'User not found', 404)
    }
    
    successResponse(res, result[0], 'User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
    errorResponse(res, 'Failed to delete user', 500)
  }
}
