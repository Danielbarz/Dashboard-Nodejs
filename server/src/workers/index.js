import { fileImportQueue } from '../queues/index.js'
import { ProcessSOSImport } from '../jobs/ProcessSOSImport.js'
import { ProcessHSIImport } from '../jobs/ProcessHSIImport.js'
import { ProcessJTImport } from '../jobs/ProcessJTImport.js'
import logger from '../config/logger.js'

// Process SOS/Digital Product imports
fileImportQueue.process('sos-import', 1, async (job) => {
  logger.info(`Processing SOS import job ${job.id}`)
  const processor = new ProcessSOSImport(job)
  return await processor.handle()
})

// Process HSI imports
fileImportQueue.process('hsi-import', 1, async (job) => {
  logger.info(`Processing HSI import job ${job.id}`)
  const processor = new ProcessHSIImport(job)
  return await processor.handle()
})

// Process JT/Tambahan imports (limited concurrency to reduce DB connections)
fileImportQueue.process('jt-import', 3, async (job) => {
  logger.info(`Processing JT import job ${job.id}`)
  const processor = new ProcessJTImport(job)
  return await processor.handle()
})

// Process Datin imports
fileImportQueue.process('datin-import', 5, async (job) => {
  logger.info(`Processing Datin import job ${job.id}`)
  // TODO: Implement ProcessDatinImport
  return { success: true, message: 'Datin import placeholder' }
})

logger.info('🔄 Workers initialized and listening for jobs...')

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing workers...')
  await fileImportQueue.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing workers...')
  await fileImportQueue.close()
  process.exit(0)
})
