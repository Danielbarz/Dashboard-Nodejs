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

const parseDate = (value) => {
  if (!value) return null
  if (value instanceof Date) return value
  
  // Handle Excel serial date
  if (typeof value === 'number') {
    return new Date(Math.round((value - 25569) * 86400 * 1000))
  }

  // Handle string formats
  const str = String(value).trim()
  if (!str) return null

  // Try standard Date.parse
  const timestamp = Date.parse(str)
  if (!isNaN(timestamp)) {
    return new Date(timestamp)
  }

  // Handle MM/DD/YYYY HH:mm or DD/MM/YYYY HH:mm
  // Assuming MM/DD/YYYY based on user sample 12/15/2025 (Month 12)
  const parts = str.split(/[/\s:-]/)
  if (parts.length >= 3) {
    // Try US format first MM/DD/YYYY
    const p1 = parseInt(parts[0])
    const p2 = parseInt(parts[1])
    const p3 = parseInt(parts[2])
    
    // Heuristic: if p1 > 12, it must be DD/MM/YYYY
    // But user sample had 12/15/2025, which is MM/DD. 
    // If we see 15/12/2025, that would be DD/MM.
    
    let m, d, y
    if (p1 > 12) {
       // Likely DD/MM/YYYY
       d = p1; m = p2; y = p3
    } else {
       // Default to MM/DD/YYYY as per sample
       m = p1; d = p2; y = p3
    }

    if (y < 100) y += 2000 // Handle 2 digit year

    const h = parts.length > 3 ? parseInt(parts[3]) : 0
    const min = parts.length > 4 ? parseInt(parts[4]) : 0
    const s = parts.length > 5 ? parseInt(parts[5]) : 0

    if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
      return new Date(y, m - 1, d, h, min, s)
    }
  }

  return null
}

export class ProcessHSIImport {
  constructor(job) {
    this.job = job
    this.progressKey = `import:progress:${job.id}`
  }

  async handle() {
    const { filePath, fileName, batchId } = this.job.data
    
    console.log(`[HSI Import] Starting import for ${fileName} (Batch: ${batchId})`);

    try {
      await this.updateProgress(5, 'Parsing HSI file...')
      
      const records = await this.parseFile(filePath, fileName)
      if (!records || records.length === 0) {
        throw new Error('File is empty')
      }

      console.log(`[HSI Import] Found ${records.length} records. Processing...`);
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

      console.log(`[HSI Import] Finished. Success: ${successCount}, Failed: ${failedCount}`);
      
      // Only delete file if it exists (test script might delete it, or race conditions)
      try {
        if (filePath && await this.fileExists(filePath)) {
             unlinkSync(filePath) 
        }
      } catch (e) { console.warn('Could not delete temp file', e.message) }

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
      console.error(`[HSI Import] Fatal Error: ${error.message}`);
      await this.updateProgress(-1, `Error: ${error.message}`)
      throw error
    }
  }

  async fileExists(path) {
    const { promises: fs } = await import('fs')
    try {
      await fs.access(path)
      return true
    } catch {
      return false
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
      const finalOrderId = orderId || noorder || `hsi_${Date.now()}_${Math.random()}`

      return {
        nomor: getValue(record, keyMap, 'nomor', 'no'),
        orderId: finalOrderId,
        regional: getValue(record, keyMap, 'regional', 'reg'),
        witel: getValue(record, keyMap, 'witel'),
        regionalOld: getValue(record, keyMap, 'regional_old', 'regionalold'),
        witelOld: getValue(record, keyMap, 'witel_old', 'witelold'),
        datel: getValue(record, keyMap, 'datel'),
        sto: getValue(record, keyMap, 'sto'),
        unit: getValue(record, keyMap, 'unit'),
        jenisPsb: getValue(record, keyMap, 'jenis_psb', 'jenispsb'),
        typeTrans: getValue(record, keyMap, 'type_trans', 'typetrans'),
        typeLayanan: getValue(record, keyMap, 'type_layanan', 'typelayanan'),
        statusResume: getValue(record, keyMap, 'status_resume', 'statusresume', 'status'),
        provider: getValue(record, keyMap, 'provider'),
        orderDate: parseDate(getValue(record, keyMap, 'order_date', 'orderdate')),
        lastUpdatedDate: parseDate(getValue(record, keyMap, 'last_updated_date', 'lastupdateddate')),
        ncli: getValue(record, keyMap, 'ncli'),
        pots: getValue(record, keyMap, 'pots'),
        speedy: getValue(record, keyMap, 'speedy'),
        customerName: getValue(record, keyMap, 'customer_name', 'customername', 'nama_customer'),
        locId: getValue(record, keyMap, 'loc_id', 'locid'),
        wonum: getValue(record, keyMap, 'wonum'),
        flagDeposit: getValue(record, keyMap, 'flag_deposit', 'flagdeposit'),
        contactHp: getValue(record, keyMap, 'contact_hp', 'contacthp', 'nohp'),
        insAddress: getValue(record, keyMap, 'ins_address', 'insaddress', 'alamat'),
        gpsLongitude: getValue(record, keyMap, 'gps_longitude', 'gpslongitude'),
        gpsLatitude: getValue(record, keyMap, 'gps_latitude', 'gpslatitude'),
        kcontact: getValue(record, keyMap, 'kcontact'),
        channel: getValue(record, keyMap, 'channel'),
        statusInet: getValue(record, keyMap, 'status_inet', 'statusinet'),
        statusOnu: getValue(record, keyMap, 'status_onu', 'statusonu'),
        upload: getValue(record, keyMap, 'upload'),
        download: getValue(record, keyMap, 'download'),
        lastProgram: getValue(record, keyMap, 'last_program', 'lastprogram'),
        statusVoice: getValue(record, keyMap, 'status_voice', 'statusvoice'),
        clid: getValue(record, keyMap, 'clid'),
        lastStart: getValue(record, keyMap, 'last_start', 'laststart'),
        tindakLanjut: getValue(record, keyMap, 'tindak_lanjut', 'tindaklanjut'),
        isiComment: getValue(record, keyMap, 'isi_comment', 'isicomment'),
        userIdTl: getValue(record, keyMap, 'user_id_tl', 'useridtl'),
        tglComment: parseDate(getValue(record, keyMap, 'tgl_comment', 'tglcomment')),
        tanggalManja: parseDate(getValue(record, keyMap, 'tanggal_manja', 'tanggalmanja')),
        kelompokKendala: getValue(record, keyMap, 'kelompok_kendala', 'kelompokkendala'),
        kelompokStatus: getValue(record, keyMap, 'kelompok_status', 'kelompokstatus'),
        hero: getValue(record, keyMap, 'hero'),
        addon: getValue(record, keyMap, 'addon'),
        tglPs: parseDate(getValue(record, keyMap, 'tgl_ps', 'tglps')),
        statusMessage: getValue(record, keyMap, 'status_message', 'statusmessage'),
        packageName: getValue(record, keyMap, 'package_name', 'packagename'),
        groupPaket: getValue(record, keyMap, 'group_paket', 'grouppaket'),
        reasonCancel: getValue(record, keyMap, 'reason_cancel', 'reasoncancel'),
        keteranganCancel: getValue(record, keyMap, 'keterangan_cancel', 'keterangancancel'),
        tglManja: parseDate(getValue(record, keyMap, 'tgl_manja', 'tglmanja')),
        detailManja: getValue(record, keyMap, 'detail_manja', 'detailmanja'),
        suberrorcode: getValue(record, keyMap, 'suberrorcode'),
        engineermemo: getValue(record, keyMap, 'engineermemo'),
        dataProses: getValue(record, keyMap, 'data_proses', 'dataproses'),
        noOrderRevoke: getValue(record, keyMap, 'no_order_rev', 'noorderrev', 'no_order_revol'),
        datasPsRevoke: getValue(record, keyMap, 'data_ps_rev', 'datapsrev', 'data_ps_revoke'),
        untukPsPi: getValue(record, keyMap, 'untuk_ps_pi', 'untukpspi')
      }
    })

    try {
      // Use createMany with skipDuplicates. 
      // Note: skipDuplicates only works if there is a unique constraint in the DB.
      // If orderId is not unique in the DB, this will insert duplicates.
      const result = await prisma.hsiData.createMany({
        data: dataToCreate,
        skipDuplicates: true
      })
      return { success: result.count, failed: records.length - result.count, errors: [] }
    } catch (error) {
      console.error(`[HSI Import] Failed to process chunk. Error: ${error.message}`)
      return { success: 0, failed: records.length, errors: [{ error: error.message }] }
    }
  }
