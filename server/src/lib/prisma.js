import { PrismaClient } from '../generated/client/index.js'

// Ensure single PrismaClient instance across hot reloads (nodemon)
const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient()
}

const prisma = globalForPrisma.prisma

export default prisma
