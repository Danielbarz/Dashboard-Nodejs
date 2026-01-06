
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'user@telkom.co.id'
  const password = 'password123'
  const name = 'Regular User'
  const role = 'user'

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`User ${email} already exists.`)
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    })

    console.log(`Created new user: ${email} with role: ${role}`)
    console.log(`Password: ${password}`)
  } catch (e) {
    console.error('Error creating user:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
