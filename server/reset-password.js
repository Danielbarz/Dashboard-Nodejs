
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@telkom.co.id'
  const newPassword = 'password123'

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log(`Password for ${email} has been reset to: ${newPassword}`)
  } catch (e) {
    console.error('Error resetting password:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
