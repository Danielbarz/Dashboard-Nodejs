
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const segments = await prisma.sosData.groupBy({
    by: ['segmen'],
    _count: { id: true }
  })
  console.log('Segments:', segments)

  const actionCds = await prisma.sosData.groupBy({
    by: ['actionCd'],
    _count: { id: true }
  })
  console.log('Action Codes:', actionCds)

  const statuses = await prisma.sosData.groupBy({
    by: ['liStatus'],
    _count: { id: true }
  })
  console.log('Statuses:', statuses)
  
  const milestones = await prisma.sosData.groupBy({
    by: ['liMilestone'],
    _count: { id: true }
  })
  console.log('Milestones:', milestones)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
