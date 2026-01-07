import prisma from '../lib/prisma.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream, unlinkSync } from 'fs'
import { Redis } from 'ioredis'
import config from '../config/index.js'

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
})

// Normalize header keys
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
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  const cleaned = value.toString().replace(/[^0-9.]/g, '')
  return cleaned ? parseFloat(cleaned) : 0
}

export class ProcessSOSImport {
  constructor(job) {
    this.job = job
    this.progressKey = `import:progress:${job.id}`
  }

  async handle() {
    const { filePath, fileName, batchId, userId } = this.job.data
    
    try {
      // Update progress: Parsing file
      await this.updateProgress(5, 'Parsing file...')
      
      const records = await this.parseFile(filePath, fileName)
      
      if (!records || records.length === 0) {
        throw new Error('File is empty or invalid')
      }

      await this.updateProgress(15, `Found ${records.length} rows, processing...`)

      // Process records in chunks
      const chunkSize = 500
      let successCount = 0
      let failedCount = 0
      const errors = []

      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize)
        const result = await this.processChunk(chunk, batchId)
        
        successCount += result.success
        failedCount += result.failed
        errors.push(...result.errors)

        // Update progress
        const progress = 15 + Math.floor((i / records.length) * 80)
        await this.updateProgress(
          progress,
          `Processed ${i + chunk.length}/${records.length} rows`
        )
      }

      // Cleanup temp file
      unlinkSync(filePath)

      await this.updateProgress(100, 'Import completed')

      return {
        success: true,
        totalRows: records.length,
        successRows: successCount,
        failedRows: failedCount,
        batchId,
        errors: errors.slice(0, 10) // Return first 10 errors
      }
    } catch (error) {
      await this.updateProgress(-1, `Error: ${error.message}`)
      throw error
    }
  }

  async parseFile(filePath, fileName) {
    const ext = fileName.toLowerCase().match(/\.(xlsx|xls|csv)$/)?.[1]
    
    if (ext === 'xlsx' || ext === 'xls') {
      const workbook = XLSX.readFile(filePath)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      return XLSX.utils.sheet_to_json(worksheet)
    } else if (ext === 'csv') {
      return new Promise((resolve, reject) => {
        const results = []
        createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err))
      })
    }
    
    throw new Error('Unsupported file format')
  }

  async processChunk(records, batchId) {
    let success = 0
    let failed = 0
    const errors = []

    for (const record of records) {
      const keyMap = buildKeyMap(record)
      
      try {
        const orderId = getValue(
          record,
          keyMap,
          'order_id',
          'orderid',
          'order id',
          'product + order id',
          'productorderid'
        )

        if (!orderId) {
          failed++
          errors.push({ row: record, error: 'Missing order_id' })
          continue
        }

        await prisma.sosData.upsert({
          where: { orderId: orderId.toString() },
          update: {
            poName: getValue(record, keyMap, 'po_name', 'poname', 'po'),
            nipnas: getValue(record, keyMap, 'nipnas'),
            standardName: getValue(record, keyMap, 'standard_name', 'standardname'),
            orderSubtype: getValue(record, keyMap, 'order_subtype', 'ordersubtype', 'order subtype'),
            orderDescription: getValue(record, keyMap, 'order_description', 'orderdescription', 'produk details'),
            segmen: getValue(record, keyMap, 'segmen', 'segmen_n'),
            subSegmen: getValue(record, keyMap, 'sub_segmen', 'subsegmen'),
            custCity: getValue(record, keyMap, 'cust_city', 'custcity', 'sto'),
            custWitel: getValue(record, keyMap, 'cust_witel', 'custwitel', 'nama witel'),
            billWitel: getValue(record, keyMap, 'bill_witel', 'billwitel', 'witel'),
            liProductName: getValue(record, keyMap, 'li_product_name', 'nama produk', 'product name', 'product'),
            liMilestone: getValue(record, keyMap, 'li_milestone', 'milestone', 'order status'),
            liStatus: getValue(record, keyMap, 'li_status', 'order_status_n', 'order status'),
            kategori: getValue(record, keyMap, 'kategori'),
            revenue: cleanNumber(getValue(record, keyMap, 'revenue', 'net price', 'netprice')),
            biayaPasang: cleanNumber(getValue(record, keyMap, 'biaya_pasang', 'biayapasang')),
            hrgBulanan: cleanNumber(getValue(record, keyMap, 'hrg_bulanan', 'hrgbulanan')),
            batchId
          },
          create: {
            orderId: orderId.toString(),
            poName: getValue(record, keyMap, 'po_name', 'poname', 'po'),
            nipnas: getValue(record, keyMap, 'nipnas'),
            standardName: getValue(record, keyMap, 'standard_name', 'standardname'),
            orderSubtype: getValue(record, keyMap, 'order_subtype', 'ordersubtype', 'order subtype'),
            orderDescription: getValue(record, keyMap, 'order_description', 'orderdescription', 'produk details'),
            segmen: getValue(record, keyMap, 'segmen', 'segmen_n'),
            subSegmen: getValue(record, keyMap, 'sub_segmen', 'subsegmen'),
            custCity: getValue(record, keyMap, 'cust_city', 'custcity', 'sto'),
            custWitel: getValue(record, keyMap, 'cust_witel', 'custwitel', 'nama witel'),
            billWitel: getValue(record, keyMap, 'bill_witel', 'billwitel', 'witel'),
            liProductName: getValue(record, keyMap, 'li_product_name', 'nama produk', 'product name', 'product'),
            liMilestone: getValue(record, keyMap, 'li_milestone', 'milestone', 'order status'),
            liStatus: getValue(record, keyMap, 'li_status', 'order_status_n', 'order status'),
            kategori: getValue(record, keyMap, 'kategori'),
            revenue: cleanNumber(getValue(record, keyMap, 'revenue', 'net price', 'netprice')),
            biayaPasang: cleanNumber(getValue(record, keyMap, 'biaya_pasang', 'biayapasang')),
            hrgBulanan: cleanNumber(getValue(record, keyMap, 'hrg_bulanan', 'hrgbulanan')),
            batchId
          }
        })
        
        success++
      } catch (error) {
        failed++
        errors.push({ row: record, error: error.message })
      }
    }

    return { success, failed, errors }
  }

  async updateProgress(percent, message) {
    const progress = {
      percent,
      message,
      updatedAt: new Date().toISOString()
    }
    
    await redis.setex(this.progressKey, 3600, JSON.stringify(progress))
    await this.job.progress(percent)
  }
}
