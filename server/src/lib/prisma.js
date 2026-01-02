import { PrismaClient } from '@prisma/client'

// Ensure single PrismaClient instance across hot reloads (nodemon)
const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient()
}

const prisma = globalForPrisma.prisma

export default prisma
