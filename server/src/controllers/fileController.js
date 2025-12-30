import { PrismaClient } from '@prisma/client'
import { successResponse, errorResponse } from '../utils/response.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { unlink } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

function pickCaseInsensitive(obj, key) {
  const found = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase())
  return found ? obj[found] : undefined
}

// Upload Excel/CSV file
export const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const type = (req.query.type || 'sos').toString().toLowerCase()

    // Only admin and super_admin can upload files
    if (!['admin', 'super_admin'].includes(userRole)) {
      return errorResponse(res, 'Unauthorized', 'Only admins can upload files', 403)
    }

    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 'Please provide a file', 400)
    }

    const filePath = req.file.path
    const fileName = req.file.originalname
    const ext = path.extname(fileName).toLowerCase()

    let records = []

    // Parse file
    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(filePath)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      records = XLSX.utils.sheet_to_json(worksheet)
    } else if (ext === '.csv') {
      records = await new Promise((resolve, reject) => {
        const results = []
        createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err))
      })
    } else {
      await unlink(filePath)
      return errorResponse(res, 'Invalid file format', 'Please upload Excel or CSV file', 400)
    }

    if (!records || records.length === 0) {
      await unlink(filePath)
      return errorResponse(res, 'Empty file', 'File contains no data', 400)
    }

    // Process records based on type
    let successCount = 0
    let failedCount = 0
    const errors = []

    for (const record of records) {
      try {
        if (type === 'sos') {
          // Insert/update SOS data
          const orderId = pickCaseInsensitive(record, 'order_id') || pickCaseInsensitive(record, 'ORDER_ID')
          if (!orderId) continue

          await prisma.sosData.upsert({
            where: { orderId: orderId.toString() },
            update: {
              nipnas: pickCaseInsensitive(record, 'nipnas'),
              standardName: pickCaseInsensitive(record, 'standard_name'),
              orderSubtype: pickCaseInsensitive(record, 'order_subtype'),
              orderDescription: pickCaseInsensitive(record, 'order_description'),
              segmen: pickCaseInsensitive(record, 'segmen'),
              subSegmen: pickCaseInsensitive(record, 'sub_segmen'),
              custCity: pickCaseInsensitive(record, 'cust_city'),
              custWitel: pickCaseInsensitive(record, 'cust_witel'),
              billWitel: pickCaseInsensitive(record, 'bill_witel'),
              liProductName: pickCaseInsensitive(record, 'li_product_name'),
              liMilestone: pickCaseInsensitive(record, 'li_milestone'),
              liStatus: pickCaseInsensitive(record, 'li_status'),
              kategori: pickCaseInsensitive(record, 'kategori'),
              revenue: parseFloat(pickCaseInsensitive(record, 'revenue')) || 0,
              biayaPasang: parseFloat(pickCaseInsensitive(record, 'biaya_pasang')) || 0,
              hrgBulanan: parseFloat(pickCaseInsensitive(record, 'hrg_bulanan')) || 0,
              batchId: `batch_${Date.now()}`
            },
            create: {
              orderId: orderId.toString(),
              nipnas: pickCaseInsensitive(record, 'nipnas'),
              standardName: pickCaseInsensitive(record, 'standard_name'),
              orderSubtype: pickCaseInsensitive(record, 'order_subtype'),
              orderDescription: pickCaseInsensitive(record, 'order_description'),
              segmen: pickCaseInsensitive(record, 'segmen'),
              subSegmen: pickCaseInsensitive(record, 'sub_segmen'),
              custCity: pickCaseInsensitive(record, 'cust_city'),
              custWitel: pickCaseInsensitive(record, 'cust_witel'),
              billWitel: pickCaseInsensitive(record, 'bill_witel'),
              liProductName: pickCaseInsensitive(record, 'li_product_name'),
              liMilestone: pickCaseInsensitive(record, 'li_milestone'),
              liStatus: pickCaseInsensitive(record, 'li_status'),
              kategori: pickCaseInsensitive(record, 'kategori'),
              revenue: parseFloat(pickCaseInsensitive(record, 'revenue')) || 0,
              biayaPasang: parseFloat(pickCaseInsensitive(record, 'biaya_pasang')) || 0,
              hrgBulanan: parseFloat(pickCaseInsensitive(record, 'hrg_bulanan')) || 0,
              batchId: `batch_${Date.now()}`
            }
          })
          successCount++
        } else if (type === 'hsi') {
          // Insert/update HSI data
          const orderId = pickCaseInsensitive(record, 'order_id')
          const noorder = pickCaseInsensitive(record, 'no_order')

          await prisma.hsiData.create({
            data: {
              orderId: orderId || noorder || `order_${Date.now()}`,
              nomor: pickCaseInsensitive(record, 'nomor'),
              witel: pickCaseInsensitive(record, 'witel'),
              datel: pickCaseInsensitive(record, 'datel'),
              customerName: pickCaseInsensitive(record, 'customer_name'),
              statusResume: pickCaseInsensitive(record, 'status_resume'),
              provider: pickCaseInsensitive(record, 'provider'),
              jenisPsb: pickCaseInsensitive(record, 'jenis_psb'),
              ncli: pickCaseInsensitive(record, 'ncli'),
              speedy: pickCaseInsensitive(record, 'speedy'),
              pots: pickCaseInsensitive(record, 'pots')
            }
          })
          successCount++
        } else if (type === 'jt' || type === 'tambahan') {
          // Insert to SPMK MOM for JT data
          const noNdeSpmk = pickCaseInsensitive(record, 'no_nde_spmk') || pickCaseInsensitive(record, 'NO_NDE_SPMK')

          await prisma.spmkMom.create({
            data: {
              noNdeSpmk: noNdeSpmk,
              witelBaru: pickCaseInsensitive(record, 'witel_baru') || pickCaseInsensitive(record, 'WITEL_BARU'),
              statusProyek: 'JT',
              revenuePlan: parseFloat(pickCaseInsensitive(record, 'revenue_plan')) || 0,
              batchId: `batch_${Date.now()}`,
              poName: pickCaseInsensitive(record, 'po_name'),
              segmen: pickCaseInsensitive(record, 'segmen')
            }
          })
          successCount++
        } else if (type === 'datin') {
          // Insert to SPMK MOM for DATIN data
          const noNdeSpmk = pickCaseInsensitive(record, 'no_nde_spmk')

          await prisma.spmkMom.create({
            data: {
              noNdeSpmk: noNdeSpmk,
              witelBaru: pickCaseInsensitive(record, 'witel_baru'),
              statusProyek: 'DATIN',
              revenuePlan: parseFloat(pickCaseInsensitive(record, 'revenue_plan')) || 0,
              batchId: `batch_${Date.now()}`,
              poName: pickCaseInsensitive(record, 'po_name'),
              segmen: pickCaseInsensitive(record, 'segmen')
            }
          })
          successCount++
        } else if (type === 'analysis') {
          // Insert to SOS data for analysis
          const orderId = pickCaseInsensitive(record, 'order_id')

          await prisma.sosData.create({
            data: {
              orderId: orderId || `order_${Date.now()}`,
              segmen: pickCaseInsensitive(record, 'segmen'),
              billWitel: pickCaseInsensitive(record, 'bill_witel'),
              liProductName: pickCaseInsensitive(record, 'li_product_name'),
              revenue: parseFloat(pickCaseInsensitive(record, 'revenue')) || 0,
              batchId: `batch_${Date.now()}`
            }
          })
          successCount++
        }
      } catch (err) {
        failedCount++
        errors.push({ row: record, error: err.message })
      }
    }

    // Clean up temp file
    await unlink(filePath)

    successResponse(
      res,
      {
        fileName,
        type,
        totalRows: records.length,
        successRows: successCount,
        failedRows: failedCount,
        errors: errors.length > 0 ? errors.slice(0, 5) : [] // Return first 5 errors
      },
      'File uploaded successfully'
    )
  } catch (error) {
    if (req.file) {
      try {
        await unlink(req.file.path)
      } catch (e) {
        console.error('Failed to delete temp file:', e)
      }
    }
    next(error)
  }
}

