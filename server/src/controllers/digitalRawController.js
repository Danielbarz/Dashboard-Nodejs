import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

// --- LIST RAW DATA ---
export const getDigitalRawData = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query
    const skip = (page - 1) * limit
    const where = status ? { statusProcess: status } : {}

    const [data, total] = await Promise.all([
      prisma.digitalProductRaw.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.digitalProductRaw.count({ where })
    ])

    successResponse(res, { data, total, page, limit }, 'Raw data retrieved')
  } catch (error) {
    next(error)
  }
}

// --- DELETE RAW DATA ---
export const deleteDigitalRawData = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.digitalProductRaw.delete({ where: { id: BigInt(id) } })
    successResponse(res, null, 'Raw data deleted')
  } catch (error) {
    next(error)
  }
}

// --- PROCESS & PUBLISH LOGIC ---
export const processDigitalRawData = async (req, res, next) => {
  try {
    const { batchId } = req.body || {} 
    
    // 1. Fetch ALL DRAFT data (One Go)
    const where = { statusProcess: 'DRAFT' }
    if (batchId) where.batchId = batchId

    const rawData = await prisma.digitalProductRaw.findMany({
      where
      // Limit removed to process everything at once
    })

    if (rawData.length === 0) {
      return successResponse(res, { processed: 0, remaining: 0 }, 'No draft data to process')
    }

    console.log(`🔄 Processing ALL raw records: ${rawData.length}...`)
    
    const finalData = []
    const rawIdsToUpdate = [] // Successfully processed
    const rawIdsToIgnore = [] // Ignored (QC MIA)
    const orderIdsToClear = new Set() 

    // 2. Processing Logic (Splitting & Filtering)
    for (const row of rawData) {
      // --- FILTERING LOGIC ---
      // 1. Witel Filter (Only R5)
      const allowedWitels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'NUSA TENGGARA']
      const rowWitel = (row.witel || '').toUpperCase().replace('WITEL ', '').trim()
      
      if (!allowedWitels.includes(rowWitel)) {
         rawIdsToIgnore.push(row.id)
         // Optional: Add specific note for witel mismatch
         // But since we batch update ignored status later with a generic message or just 'IGNORED',
         // we might want to differentiate. For now, pushing to ignore list is enough.
         // To record specific reason, we'd need a map or individual updates.
         // Let's stick to the existing pattern of ignoring.
         continue; 
      }

      // 2. Status QC MIA Check
      const s1 = (row.orderStatus || '').toUpperCase()
      const s2 = (row.orderStatusN || '').toUpperCase()
      const s3 = (row.milestone || '').toUpperCase()
      
      if (s1.includes('QC MIA') || s2.includes('QC MIA') || s3.includes('QC MIA')) {
         rawIdsToIgnore.push(row.id)
         continue; 
      }

      // --- PRODUCT FALLBACK & VALIDATION ---
      let productString = row.product || ''
      // Fallback ke productDetail jika product kosong
      if (!productString.trim() && row.productDetail) {
         productString = row.productDetail
      }

      // Jika tetap kosong, buang datanya (Invalid Data)
      if (!productString.trim()) {
         rawIdsToIgnore.push(row.id)
         continue;
      }

      const orderIdOriginal = row.orderId || `AUTO-${Date.now()}-${row.id}`
      orderIdsToClear.add(orderIdOriginal)
      
      const products = productString.split(/\s+-\s+|\s*,\s*|\s*;\s*|\r?\n/).filter(p => p.trim().length > 0)
      
      if (products.length > 1) {
        // SPLIT CASE
        products.forEach((prod) => {
          const { id, statusProcess, validationNotes, createdAt, updatedAt, product, ...rest } = row
          finalData.push({
            ...rest,
            orderId: orderIdOriginal,
            product: prod.trim()
          })
        })
      } else {
        // NO SPLIT CASE
        const { id, statusProcess, validationNotes, createdAt, updatedAt, product, ...rest } = row
        finalData.push({ 
          ...rest, 
          orderId: orderIdOriginal,
          product: productString.trim() // Gunakan productString yang sudah ada fallback-nya
        })
      }
      
      rawIdsToUpdate.push(row.id)
    }

    // 3. Insert to Final Table
    await prisma.$transaction(async (tx) => {
        // A. Clear Old Data
        if (orderIdsToClear.size > 0) {
            const orderIdList = Array.from(orderIdsToClear)
            const DELETE_CHUNK = 5000
            for (let i = 0; i < orderIdList.length; i += DELETE_CHUNK) {
                await tx.digitalProduct.deleteMany({
                    where: { orderId: { in: orderIdList.slice(i, i + DELETE_CHUNK) } }
                })
            }
        }

        // B. Insert New Records
        const INSERT_CHUNK = 1000 
        for (let i = 0; i < finalData.length; i += INSERT_CHUNK) {
            await tx.digitalProduct.createMany({
                data: finalData.slice(i, i + INSERT_CHUNK)
            })
        }

        // C. Update Raw Status
        const STATUS_CHUNK = 5000
        if (rawIdsToUpdate.length > 0) {
            for (let i = 0; i < rawIdsToUpdate.length; i += STATUS_CHUNK) {
                await tx.digitalProductRaw.updateMany({
                    where: { id: { in: rawIdsToUpdate.slice(i, i + STATUS_CHUNK) } },
                    data: { statusProcess: 'PROCESSED', updatedAt: new Date() }
                })
            }
        }

        // D. Update Ignored Status
        if (rawIdsToIgnore.length > 0) {
            await tx.digitalProductRaw.updateMany({
                where: { id: { in: rawIdsToIgnore } },
                data: { statusProcess: 'IGNORED', validationNotes: 'Skipped: Invalid Witel (Non-R5) or Status QC MIA', updatedAt: new Date() }
            })
        }
    }, {
      maxWait: 15000, 
      timeout: 120000 
    })

    successResponse(res, {
        originalCount: rawData.length,
        finalCount: finalData.length,
        splitCount: finalData.length - (rawData.length - rawIdsToIgnore.length),
        ignoredCount: rawIdsToIgnore.length,
        remaining: 0
    }, 'Data successfully processed and published in one go')

  } catch (error) {
    next(error)
  }
}