
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const aos = await prisma.accountOfficer.findMany()
    console.log('Account Officers:', aos.map(a => ({ name: a.name, witels: a.filterWitelLama })))
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
