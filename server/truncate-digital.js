
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Truncating digital_products table...')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE digital_products RESTART IDENTITY;')
    console.log('Done.')
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
