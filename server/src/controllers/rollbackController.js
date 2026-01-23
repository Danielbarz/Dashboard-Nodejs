import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

/**
 * Get batch history for different data types
 */
export const getBatchHistory = async (req, res, next) => {
  try {
    const { type } = req.query

    let batches = []

    if (type === 'digital') {
      batches = await prisma.digitalProduct.groupBy({
        by: ['batchId', 'createdAt'],
        _count: { id: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    } else if (type === 'jt' || type === 'datin') {
      batches = await prisma.spmkMom.groupBy({
        by: ['batchId', 'createdAt'],
        _count: { id: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    } else if (type === 'sos') {
      batches = await prisma.sosData.groupBy({
        by: ['batchId', 'createdAt'],
        _count: { id: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    } else if (type === 'hsi') {
      batches = await prisma.hsiData.groupBy({
        by: ['batchId', 'createdAt'],
        _count: { id: true },
        where: { batchId: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    }

    const formattedBatches = batches.map(b => ({
      batchId: b.batchId,
      createdAt: b.createdAt,
      recordCount: b._count?.id || 0
    }))

    successResponse(res, formattedBatches, 'Batch history retrieved successfully')
  } catch (error) {
    console.error('Error fetching batch history:', error)
    errorResponse(res, 'Failed to fetch batch history', 500)
  }
}

/**
 * Rollback (delete) data associated with a specific batch ID
 */
export const rollbackBatch = async (req, res, next) => {
  try {
    const { batchId, type } = req.body

    if (!batchId) {
      return errorResponse(res, 'Batch ID is required', 400)
    }

    let deletedCount = 0

    if (type === 'digital') {
      const result = await prisma.digitalProduct.deleteMany({
        where: { batchId: batchId }
      })
      deletedCount = result.count
      
      // Also cleanup related data if any
      await prisma.documentData.deleteMany({ where: { batchId: batchId } })
    } else if (type === 'jt' || type === 'datin') {
      const result = await prisma.spmkMom.deleteMany({
        where: { batchId: batchId }
      })
      deletedCount = result.count
    } else if (type === 'sos') {
      const result = await prisma.sosData.deleteMany({
        where: { batchId: batchId }
      })
      deletedCount = result.count
    } else if (type === 'hsi') {
      const result = await prisma.hsiData.deleteMany({
        where: { batchId: batchId }
      })
      deletedCount = result.count
    } else {
      return errorResponse(res, 'Invalid data type for rollback', 400)
    }

    successResponse(res, { deletedCount }, `Successfully rolled back batch ${batchId}. ${deletedCount} records deleted.`)
  } catch (error) {
    console.error('Error performing rollback:', error)
    errorResponse(res, error.message || 'Failed to perform rollback', 500)
  }
}
