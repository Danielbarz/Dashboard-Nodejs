
import prisma from './src/lib/prisma.js'

async function inspectRaw() {
  try {
    // Get a raw record
    const sample = await prisma.sosData.findFirst()
    const serialized = JSON.stringify(sample, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    , 2)
    console.log('Raw Record Sample:', serialized)
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

inspectRaw()
