import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { unlink, writeFile, appendFile } from 'fs/promises'
import path from 'path'

function pickCaseInsensitive(obj, key) {
  const found = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase())
  return found ? obj[found] : undefined
}

const normalizeKey = (key) => key.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const buildKeyMap = (record) => {
  const map = {}
  Object.keys(record).forEach((k) => {
    map[normalizeKey(k)] = k
  })
  return map
}

const getValue = (record, keyMap, ...candidates) => {
  for (const cand of candidates) {
    const norm = normalizeKey(cand)
    if (keyMap[norm] !== undefined) {
      return record[keyMap[norm]]
    }
  }
  return undefined
}

const cleanNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value
  let strVal = value.toString().trim().replace(/Rp|IDR|USD|\s/gi, '').replace(/[^\x20-\x7E]/g, '')
  if (strVal.startsWith('(') && strVal.endsWith(')')) strVal = '-' + strVal.slice(1, -1)
  const hasComma = strVal.includes(',')
  const hasDot = strVal.includes('.')
  if (hasComma && hasDot) {
    const lastComma = strVal.lastIndexOf(',')
    const lastDot = strVal.lastIndexOf('.')
    if (lastComma > lastDot) strVal = strVal.replace(/\./g, '').replace(',', '.')
    else strVal = strVal.replace(/,/g, '')
  } else if (hasComma) {
    if (/^,\d{2}$/.test(strVal)) strVal = strVal.replace(',', '.')
    else strVal = strVal.replace(/,/g, '')
  } else if (hasDot) {
    if (/^\.\d{3}/.test(strVal) && !/^\.\d{2}$/.test(strVal)) strVal = strVal.replace(/\./g, '')
  }
  const cleaned = strVal.replace(/[^0-9.\-]/g, '')
  return cleaned ? parseFloat(cleaned) : 0
}

const cleanDate = (value) => {
  if (!value) return null
  const dateStr = value.toString().trim()
  if (dateStr === '' || dateStr === '-' || dateStr === '#N/A') return null
  if (/^\d+(\.\d+)?$/.test(dateStr)) {
    const num = parseFloat(dateStr)
    if (num > 18000 && num < 70000) {
      const date = new Date((num - 25569) * 86400 * 1000)
      return isNaN(date.getTime()) ? null : date
    }
  }
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    januari: 0,februari: 1, maret: 2, april: 3, mei: 4, juni: 5, juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
    agt: 7, sep: 8, okt: 9, nop: 10, des: 11
  }
  const parts = dateStr.match(/^(\d{1,2})[\s\-](\\[a-zA-Z]+)[\s\-](\d{2,4})$/)
  if (parts) {
    const day = parseInt(parts[1], 10)
    const monthStr = parts[2].toLowerCase()
    let year = parseInt(parts[3], 10)
    if (year < 100) year += 2000
    const month = monthMap[monthStr]
    if (month !== undefined) {
      const date = new Date(year, month, day)
      date.setHours(12, 0, 0, 0)
      if (!isNaN(date.getTime())) return date
    }
  }
  let date = new Date(dateStr)
  if (!isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100) return date
  const match = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/) 
  if (match) {
    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10) - 1
    const year = parseInt(match[3], 10)
    date = new Date(year, month, day)
    date.setHours(12, 0, 0, 0)
    if (!isNaN(date.getTime())) return date
  }
  return null
}

export const uploadFile = async (req, res, next) => {
  try {
    const userRole = req.user.role
    let type = (req.query.type || 'sos').toString().toLowerCase()
    if (['digital', 'dp', 'analysis'].includes(type)) type = 'digital_product'
    if (['datin', 'sos'].includes(type)) type = 'sos'

    if (!['admin', 'superadmin'].includes(userRole)) return errorResponse(res, 'Unauthorized', 'Only admins can upload files', 403)
    if (!req.file) return errorResponse(res, 'No file uploaded', 'Please provide a file', 400)

    const filePath = req.file.path
    const fileName = req.file.originalname
    const ext = path.extname(fileName).toLowerCase()
    let records = []

    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(filePath)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      records = XLSX.utils.sheet_to_json(worksheet, { defval: "" })
    } else if (ext === '.csv') {
      records = await new Promise((resolve, reject) => {
        const results = []; let firstLine = ''; let delimiter = ','
        createReadStream(filePath)
          .on('data', (chunk) => {
            if (!firstLine) {
              firstLine += chunk.toString()
              const newlineIndex = firstLine.indexOf('\n')
              if (newlineIndex > 0) {
                firstLine = firstLine.substring(0, newlineIndex)
                const tabCount = (firstLine.match(/\t/g) || []).length
                const commaCount = (firstLine.match(/,/g) || []).length
                delimiter = tabCount > commaCount ? '\t' : ','
              }
            }
          })
          .pipe(csv({ delimiter }))
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err))
      })
    }

    if (!records || records.length === 0) {
      await unlink(filePath); return errorResponse(res, 'Empty file', 'File contains no data', 400)
    }

    const currentBatchId = `batch_${Date.now()}`
    const BATCH_SIZE = 100
    const digitalBuffer = []
    const sosBuffer = []
    const hsiBuffer = []
    const jtBuffer = []
    const datinBuffer = []
    let successCount = 0
    let failedCount = 0

    const flushBuffer = async (buffer, model, label, mode = 'createMany') => {
      if (buffer.length === 0) return { inserted: 0, failed: 0 }
      try {
        if (mode === 'createMany') {
          const result = await model.createMany({ data: buffer, skipDuplicates: true })
          return { inserted: result.count, failed: 0 }
        } else if (mode === 'upsert' && label === 'SOS') {
           for (const row of buffer) {
             await prisma.sosData.upsert({ where: { orderId: row.orderId }, update: row, create: row })
           }
           return { inserted: buffer.length, failed: 0 }
        }
        return { inserted: 0, failed: 0 }
      } catch (err) {
        console.error(`Error flushing ${label}:`, err.message)
        return { inserted: 0, failed: buffer.length }
      } finally {
        buffer.length = 0
      }
    }

    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      if (Object.values(record).every(val => val === '' || val === null || val === undefined)) continue
      const keyMap = buildKeyMap(record)

      if (type === 'digital_product') {
        const orderIdVal = getValue(record, keyMap, 'order id', 'order_id') || `AUTO-${Date.now()}-${i}`
        
        // Helper to safely convert to string without getting "null"
        const s = (val) => (val === null || val === undefined) ? '' : val.toString()

        digitalBuffer.push({
          product: s(getValue(record, keyMap, 'product')),
          orderId: s(orderIdVal),
          productOrderId: s(getValue(record, keyMap, 'product + order id', 'product_orderid')),
          filterProduct: s(getValue(record, keyMap, 'filter product', 'filter_product')),
          orderSubtype: s(getValue(record, keyMap, 'order subtype', 'order_subtype')),
          productDetail: s(getValue(record, keyMap, 'product name', 'product_name')),
          orderDate: cleanDate(getValue(record, keyMap, 'order date', 'order_date')),
          custName: s(getValue(record, keyMap, 'customer name', 'cust_name')),
          channel: s(getValue(record, keyMap, 'channel')),
          regional: s(getValue(record, keyMap, 'regional')),
          witel: s(getValue(record, keyMap, 'witel')),
          telda: s(getValue(record, keyMap, 'telda')),
          orderStatus: s(getValue(record, keyMap, 'order status', 'order_status')),
          orderStatusN: s(getValue(record, keyMap, 'order status n', 'order_status_n')),
          milestone: s(getValue(record, keyMap, 'milestone')),
          layanan: s(getValue(record, keyMap, 'layanan')),
          segmen: s(getValue(record, keyMap, 'segmen_n', 'segmen')),
          sto: s(getValue(record, keyMap, 'sto')),
          ach: s(getValue(record, keyMap, 'ach')),
          activeUser: s(getValue(record, keyMap, 'active user', 'active_user')),
          billcompDate: cleanDate(getValue(record, keyMap, 'billcomp date', 'billcomp_date')),
          joinNamaTarget: s(getValue(record, keyMap, 'join nama target', 'join_nama_target')),
          kategori: s(getValue(record, keyMap, 'kategori')),
          lastUpdate: cleanDate(getValue(record, keyMap, 'last_update', 'last update')),
          netPrice: cleanNumber(getValue(record, keyMap, 'net price', 'net_price')),
          regAntaresEazy: s(getValue(record, keyMap, 'regional antares eazy', 'reg_antares_eazy')),
          regionalJoin: s(getValue(record, keyMap, 'regional_join', 'regional join')),
          tahun: cleanNumber(getValue(record, keyMap, 'tahun')),
          week: cleanNumber(getValue(record, keyMap, 'week')),
          batchId: currentBatchId,
          statusProcess: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        if (digitalBuffer.length >= BATCH_SIZE) {
          const res = await flushBuffer(digitalBuffer, prisma.digitalProductRaw, 'DIGITAL_RAW')
          successCount += res.inserted; failedCount += res.failed
        }
      } else if (type === 'sos') {
          const orderId = getValue(record, keyMap, 'order_id', 'orderid', 'order id')
          if (!orderId) continue
          sosBuffer.push({
            orderId: orderId.toString(),
            nipnas: getValue(record, keyMap, 'nipnas'),
            standardName: getValue(record, keyMap, 'standard_name', 'customer_name'),
            revenue: cleanNumber(getValue(record, keyMap, 'revenue', 'net_price')),
            batchId: currentBatchId
          })
          if (sosBuffer.length >= BATCH_SIZE) {
            const res = await flushBuffer(sosBuffer, prisma.sosData, 'SOS', 'upsert')
            successCount += res.inserted; failedCount += res.failed
          }
      }
    }

    // Final Flushes
    let flushRes = await flushBuffer(digitalBuffer, prisma.digitalProductRaw, 'DIGITAL_RAW')
    successCount += flushRes.inserted; failedCount += flushRes.failed
    flushRes = await flushBuffer(sosBuffer, prisma.sosData, 'SOS', 'upsert')
    successCount += flushRes.inserted; failedCount += flushRes.failed

    await unlink(filePath)
    successResponse(res, { fileName, type, totalRows: records.length, successRows: successCount, failedRows: failedCount, batchId: currentBatchId })
  } catch (error) {
    if (req.file) try { await unlink(req.file.path) } catch (e) {}
    next(error)
  }
}

export const getImportLogs = async (req, res, next) => {
  try {
    const digitalBatches = await prisma.digitalProductRaw.groupBy({
      by: ['batchId', 'createdAt'], _count: { id: true }, orderBy: { createdAt: 'desc' }, take: 10
    })
    const formatted = digitalBatches.map(b => ({ batchId: b.batchId, importDate: b.createdAt, recordCount: b._count.id, type: 'Digital Product' }))
    successResponse(res, formatted)
  } catch (error) { next(error) }
}

export const truncateData = async (req, res, next) => {
  try {
    const type = (req.query.type || '').toString().toLowerCase()
    if (type === 'digital_product' || type === 'digital') {
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "digital_product_raws" RESTART IDENTITY CASCADE;')
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "digital_products" RESTART IDENTITY CASCADE;')
      return successResponse(res, null, 'Digital Data Reset')
    }
    errorResponse(res, 'Invalid type', 'Specify digital', 400)
  } catch (error) { next(error) }
}
