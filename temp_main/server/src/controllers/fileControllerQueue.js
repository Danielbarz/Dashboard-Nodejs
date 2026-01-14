import { successResponse, errorResponse } from '../utils/response.js'
import { fileImportQueue } from '../queues/index.js'
import { Redis } from 'ioredis'
import config from '../config/index.js'

import prisma from '../lib/prisma.js'
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
})

// Upload file and dispatch to queue
export const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    // Normalize type
    const rawType = (req.query.type || 'sos').toString().toLowerCase()
    const type = ['digital_product', 'digital', 'dp', 'report', 'digitalproduct', 'analysis'].includes(rawType)
      ? 'sos'
      : rawType

    if (!['admin', 'super_admin'].includes(userRole)) {
      return errorResponse(res, 'Unauthorized', 'Only admins can upload files', 403)
    }

    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 'Please provide a file', 400)
    }

    const filePath = req.file.path
    const fileName = req.file.originalname
    const batchId = `batch_${Date.now()}`

    // Determine job type
    let jobType = 'sos-import'
    if (type === 'hsi') jobType = 'hsi-import'
    else if (type === 'jt' || type === 'tambahan') jobType = 'jt-import'
    else if (type === 'datin') jobType = 'datin-import'

    // Dispatch to queue
    const job = await fileImportQueue.add(jobType, {
      filePath,
      fileName,
      batchId,
      userId,
      type
    }, {
      jobId: batchId,
      attempts: 3
    })

    successResponse(
      res,
      {
        jobId: job.id,
        batchId,
        fileName,
        type,
        status: 'queued',
        message: 'File uploaded and queued for processing'
      },
      'File uploaded successfully'
    )
  } catch (error) {
    if (req.file) {
      try {
        const { unlink } = await import('fs/promises')
        await unlink(req.file.path)
      } catch (e) {
        console.error('Failed to delete temp file:', e)
      }
    }
    next(error)
  }
}

// Get job progress
export const getJobProgress = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const progressKey = `import:progress:${jobId}`

    const progressData = await redis.get(progressKey)

    if (!progressData) {
      return errorResponse(res, 'Progress not found or expired', 404)
    }

    const progress = JSON.parse(progressData)
    successResponse(res, progress, 'Progress retrieved')
  } catch (error) {
    next(error)
  }
}

// Get job status
export const getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const job = await fileImportQueue.getJob(jobId)

    if (!job) {
      return errorResponse(res, 'Job not found', 404)
    }

    const state = await job.getState()
    const progress = job.progress()
    const result = job.returnvalue

    // Safely serialize result to avoid circular references
    const safeResult = result ? JSON.parse(JSON.stringify(result)) : null

    successResponse(res, {
      jobId: job.id,
      state,
      progress,
      result: safeResult,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn
    }, 'Job status retrieved')
  } catch (error) {
    next(error)
  }
}

// Get import logs
export const getImportLogs = async (req, res, next) => {
  try {
    // Get completed/failed jobs from queue
    const completed = await fileImportQueue.getCompleted(0, 50)
    const failed = await fileImportQueue.getFailed(0, 50)

    const logs = []

    for (const job of completed) {
      logs.push({
        jobId: job.id,
        batchId: job.data.batchId,
        fileName: job.data.fileName,
        type: job.data.type,
        status: 'completed',
        result: job.returnvalue,
        timestamp: job.timestamp,
        finishedOn: job.finishedOn
      })
    }

    for (const job of failed) {
      logs.push({
        jobId: job.id,
        batchId: job.data.batchId,
        fileName: job.data.fileName,
        type: job.data.type,
        status: 'failed',
        error: job.failedReason,
        timestamp: job.timestamp,
        finishedOn: job.finishedOn
      })
    }

    // Sort by timestamp desc
    logs.sort((a, b) => b.timestamp - a.timestamp)

    successResponse(res, { logs, total: logs.length }, 'Import logs retrieved')
  } catch (error) {
    next(error)
  }
}
