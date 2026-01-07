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

const normalizeKey = (key) => key.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '')
const buildKeyMap = (record) => {
  const map = {}
  Object.keys(record).forEach((k) => { map[normalizeKey(k)] = k })
  return map
}
const getValue = (record, keyMap, ...candidates) => {
  for (const cand of candidates) {
    const norm = normalizeKey(cand)
    if (keyMap[norm] !== undefined) return record[keyMap[norm]]
  }
  return undefined
}
const cleanNumber = (value) => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  const cleaned = value.toString().replace(/[^0-9.]/g, '')
  return cleaned ? parseFloat(cleaned) : 0
}

export class ProcessHSIImport {
  constructor(job) {
    this.job = job
    this.progressKey = `import:progress:${job.id}`
  }

  async handle() {
    const { filePath, fileName, batchId } = this.job.data
    
    try {
      await this.updateProgress(5, 'Parsing HSI file...')
      
      const records = await this.parseFile(filePath, fileName)
      if (!records || records.length === 0) {
        throw new Error('File is empty')
      }

      await this.updateProgress(15, `Found ${records.length} rows`)

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

        const progress = 15 + Math.floor((i / records.length) * 80)
        await this.updateProgress(progress, `Processed ${i + chunk.length}/${records.length}`)
      }

      unlinkSync(filePath)
      await this.updateProgress(100, 'HSI Import completed')

      return {
        success: true,
        totalRows: records.length,
        successRows: successCount,
        failedRows: failedCount,
        batchId,
        errors: errors.slice(0, 10)
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
    const dataToCreate = records.map(record => {
        const keyMap = buildKeyMap(record)
        const orderId = getValue(record, keyMap, 'order_id', 'orderid', 'no_order', 'noorder')
        const noorder = getValue(record, keyMap, 'no_order', 'noorder')

        return {
            orderId: orderId || noorder || `hsi_${Date.now()}_${Math.random()}`,
            nomor: getValue(record, keyMap, 'nomor', 'no'),
            witel: getValue(record, keyMap, 'witel'),
            datel: getValue(record, keyMap, 'datel'),
            customerName: getValue(record, keyMap, 'customer_name', 'customername', 'nama_customer'),
            statusResume: getValue(record, keyMap, 'status_resume', 'statusresume', 'status'),
            provider: getValue(record, keyMap, 'provider'),
            jenisPsb: getValue(record, keyMap, 'jenis_psb', 'jenispsb'),
            ncli: getValue(record, keyMap, 'ncli'),
            speedy: getValue(record, keyMap, 'speedy'),
            pots: getValue(record, keyMap, 'pots')
        };
    });

    try {
        const result = await prisma.hsiData.createMany({
            data: dataToCreate,
            skipDuplicates: true,
        });
        return { success: result.count, failed: records.length - result.count, errors: [] };
    } catch (error) {
        console.error(`[HSI Import] Failed to process chunk. Error: ${error.message}`);
        return { success: 0, failed: records.length, errors: [{ error: error.message }] };
    }
}

  async updateProgress(percent, message) {
    const progress = { percent, message, updatedAt: new Date().toISOString() }
    await redis.setex(this.progressKey, 3600, JSON.stringify(progress))
    await this.job.progress(percent)
  }
}
