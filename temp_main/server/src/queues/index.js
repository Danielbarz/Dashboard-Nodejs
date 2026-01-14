import Queue from 'bull'
import config from '../config/index.js'

// Create queues for different import types
export const fileImportQueue = new Queue('file-import', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500 // Keep last 500 failed jobs
  }
})

// Monitor queue events
fileImportQueue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`)
})

fileImportQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message)
})

fileImportQueue.on('progress', (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`)
})

export default {
  fileImportQueue
}
