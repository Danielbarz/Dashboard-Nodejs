
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@telkom.co.id'
  const password = 'admin123'
  const name = 'Admin User'
  const role = 'admin'

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`User ${email} already exists. Updating role to admin...`)
      await prisma.user.update({
        where: { email },
        data: { role: 'admin' }
      })
      console.log(`User ${email} updated to role: admin`)
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
    console.error('Error creating admin user:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
