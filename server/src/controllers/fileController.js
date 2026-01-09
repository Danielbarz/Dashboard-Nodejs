import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { unlink, writeFile } from 'fs/promises'
import path from 'path'

function pickCaseInsensitive(obj, key) {
  const found = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase())
  return found ? obj[found] : undefined
}

// Normalize header keys: lowercase and strip spaces/underscores/non-alnum
const normalizeKey = (key) => key.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '')

// Build a map of normalizedKey -> originalKey for fast lookup per record
const buildKeyMap = (record) => {
  const map = {}
  Object.keys(record).forEach((k) => {
    map[normalizeKey(k)] = k
  })
  return map
}

// Get value by trying multiple candidate keys (normalized)
const getValue = (record, keyMap, ...candidates) => {
  for (const cand of candidates) {
    const norm = normalizeKey(cand)
    if (keyMap[norm] !== undefined) {
      return record[keyMap[norm]]
    }
  }
  return undefined
}

// FIX: Clean numeric-like values (handle empty strings and comma/dot confusion)
const cleanNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value

  let strVal = value.toString().trim()

  // Remove Rp, IDR, spaces
  strVal = strVal.replace(/Rp|IDR|\s/gi, '')

  // Check format
  const hasComma = strVal.includes(',')
  const hasDot = strVal.includes('.')

  if (hasComma && hasDot) {
    // Both present. The last one is decimal.
    const lastComma = strVal.lastIndexOf(',')
    const lastDot = strVal.lastIndexOf('.')

    if (lastComma > lastDot) {
      // Format: 1.000.000,00 (Indo standard) -> remove dots, replace comma with dot
      strVal = strVal.replace(/\./g, '').replace(',', '.')
    } else {
      // Format: 1,000,000.00 (US standard) -> remove commas
      strVal = strVal.replace(/,/g, '')
    }
  } else if (hasComma) {
    // Only commas. Could be 100,50 (decimal) or 9,000 (thousand) or 9,000,000
    // Heuristic: Split by comma. If any part except the last one has !== 3 digits, it's weird.
    // Simpler: If comma is followed by exactly 2 digits at the end (e.g. ,00), likely decimal.
    // If followed by 3 digits (e.g. ,000), likely thousand.

    if (/,\d{2}$/.test(strVal)) {
       // Ends in ,XX -> decimal
       strVal = strVal.replace(',', '.')
    } else {
       // Likely thousand separator -> remove
       strVal = strVal.replace(/,/g, '')
    }
  } else if (hasDot) {
    // Only dots. Could be 100.50 (decimal) or 9.000 (thousand)
    // Same heuristic.
    if (/\.\d{2}$/.test(strVal)) {
       // Ends in .XX -> keep/standardize
    } else {
       // Likely thousand separator (Indo) -> remove
       strVal = strVal.replace(/\./g, '')
    }
  }

  // Cleanup any remaining non-numeric chars (except dot and minus)
  const cleaned = strVal.replace(/[^0-9.\-]/g, '')
  return cleaned ? parseFloat(cleaned) : 0
}

// FIX: Clean date values (Robust Version with Month Name Support)
const cleanDate = (value) => {
  if (!value) return null

  const dateStr = value.toString().trim()
  if (dateStr === '' || dateStr === '-' || dateStr === '#N/A') return null

  // 1. Handle Excel Serial Dates
  if (/^\d+(\.\d+)?$/.test(dateStr)) {
    const num = parseFloat(dateStr)
    if (num > 18000 && num < 70000) {
      const date = new Date((num - 25569) * 86400 * 1000)
      return isNaN(date.getTime()) ? null : date
    }
  }

  // 2. Handle standard Date object
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value
  }

  // 3. Handle 'DD-Mon-YY' or 'DD-Mon-YYYY' (e.g. 17-Dec-24)
  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5, juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
    agt: 7, sep: 8, okt: 9, nop: 10, des: 11
  }

  const parts = dateStr.match(/^(\d{1,2})[\s\-]([a-zA-Z]+)[\s\-](\d{2,4})$/)
  if (parts) {
    const day = parseInt(parts[1], 10)
    const monthStr = parts[2].toLowerCase()
    let year = parseInt(parts[3], 10)
    if (year < 100) year += 2000 // Assume 20xx for 2-digit years

    const month = monthMap[monthStr]
    if (month !== undefined) {
      const date = new Date(year, month, day)
      // Adjust timezone offset if needed (but Date() creates local time which is usually fine)
      // To be safe, force set hours to avoid date shifting
      date.setHours(12, 0, 0, 0)
      if (!isNaN(date.getTime())) return date
    }
  }

  // 4. Try standard Date parse
  let date = new Date(dateStr)
  if (!isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100) {
    return date
  }

  // 5. Try DD/MM/YYYY
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

// Upload Excel/CSV file
export const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    let type = (req.query.type || 'sos').toString().toLowerCase()

    // Normalize aliases
    if (['digital', 'dp'].includes(type)) type = 'digital_product'
    if (type === 'datin') type = 'sos'

    console.log(`📂 Processing Upload - Original Type: ${req.query.type}, Resolved Type: ${type}`)

    // Only admin and superadmin can upload files
    if (!['admin', 'superadmin'].includes(userRole)) {
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
      // defval: "" memastikan sel kosong terbaca sebagai string kosong, bukan undefined
      records = XLSX.utils.sheet_to_json(worksheet, { defval: "" })
    } else if (ext === '.csv') {
      records = await new Promise((resolve, reject) => {
        const results = []
        let firstLine = ''
        let delimiter = ','

        const stream = createReadStream(filePath)
          .on('data', (chunk) => {
            if (!firstLine) {
              firstLine += chunk.toString()
              const newlineIndex = firstLine.indexOf('\n')
              if (newlineIndex > 0) {
                firstLine = firstLine.substring(0, newlineIndex)
                // Count tabs vs commas to auto-detect delimiter
                const tabCount = (firstLine.match(/\t/g) || []).length
                const commaCount = (firstLine.match(/,/g) || []).length
                delimiter = tabCount > commaCount ? '\t' : ','
                console.log(`📊 CSV Delimiter detected: ${delimiter === '\t' ? 'TAB (TSV)' : 'COMMA (CSV)'}`)
              }
            }
          })

        stream
          .pipe(csv({ delimiter }))
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

    // DEBUG: Log Headers
    if (records.length > 0) {
      console.log('📊 Detected Headers (First Row Keys):', Object.keys(records[0]))
      console.log('📊 First Row Sample:', JSON.stringify(records[0]).substring(0, 200))
    }

    // DEBUG: Init Skipped Logs
    const debugSkipped = []
    let skippedCount = 0
    let emptyCount = 0
    const skippedRows = [] // Store all skipped rows for debugging

    // Ensure digital_products table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "digital_products" (
        id BIGSERIAL PRIMARY KEY,
        order_number TEXT UNIQUE,
        product_name TEXT,
        customer_name TEXT,
        po_name TEXT,
        witel TEXT,
        branch TEXT,
        revenue NUMERIC(18,2) DEFAULT 0,
        amount NUMERIC(18,2) DEFAULT 0,
        status TEXT,
        milestone TEXT,
        segment TEXT,
        category TEXT,
        sub_type TEXT,
        order_date TIMESTAMPTZ,
        batch_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    // 1. RESET TABEL HSI
    if (type === 'hsi') {
      try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "hsi_data";`)
      } catch (e) {
        console.log('⚠️ Warning: Could not drop hsi_data table:', e.message)
      }

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "hsi_data" (
          id BIGSERIAL PRIMARY KEY,
          order_id TEXT UNIQUE,
          nomor TEXT, regional TEXT, witel TEXT, regional_old TEXT, witel_old TEXT, datel TEXT, sto TEXT, unit TEXT,
          jenis_psb TEXT, type_trans TEXT, type_layanan TEXT, customer_name TEXT, status_resume TEXT, provider TEXT,
          order_date TIMESTAMPTZ, last_updated_date TIMESTAMPTZ,
          ncli TEXT, pots TEXT, speedy TEXT, loc_id TEXT, wonum TEXT, flag_deposit TEXT, contact_hp TEXT, ins_address TEXT,
          gps_longitude TEXT, gps_latitude TEXT, kcontact TEXT, channel TEXT, status_inet TEXT, status_onu TEXT,
          upload TEXT, download TEXT, last_program TEXT, status_voice TEXT, clid TEXT, last_start TEXT, tindak_lanjut TEXT,
          isi_comment TEXT, user_id_tl TEXT, tgl_comment TIMESTAMPTZ, tanggal_manja TIMESTAMPTZ,
          kelompok_kendala TEXT, kelompok_status TEXT, hero TEXT, addon TEXT, tgl_ps TIMESTAMPTZ, status_message TEXT,
          package_name TEXT, group_paket TEXT, reason_cancel TEXT, keterangan_cancel TEXT, tgl_manja TIMESTAMPTZ,
          detail_manja TEXT, suberrorcode TEXT, engineermemo TEXT, tahun TEXT, bulan TEXT, tanggal TEXT, ps_1 TEXT,
          cek TEXT, hasil TEXT, telda TEXT, data_proses TEXT, no_order_revoke TEXT, data_ps_revoke TEXT,
          untuk_ps_pi TEXT, untuk_ps_re TEXT,
          batch_id TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `)
    }

    if (type === 'jt') {
       try {
         await prisma.spmkMom.deleteMany({})
         console.log('🗑️  Cleared spmk_mom table')
       } catch (e) {
         console.log('⚠️ Warning: Could not clear spmk_mom table:', e.message)
       }
    }

    // FIX: Pastikan kolom-kolom penting ada (Self-Healing Schema)
    const hsiTextCols = [
      'nomor', 'regional', 'witel', 'regional_old', 'witel_old', 'datel', 'sto', 'unit',
      'jenis_psb', 'type_trans', 'type_layanan', 'customer_name', 'status_resume', 'provider',
      'ncli', 'pots', 'speedy', 'loc_id', 'wonum', 'flag_deposit', 'contact_hp', 'ins_address',
      'gps_longitude', 'gps_latitude', 'kcontact', 'channel', 'status_inet', 'status_onu',
      'upload', 'download', 'last_program', 'status_voice', 'clid', 'last_start', 'tindak_lanjut',
      'isi_comment', 'user_id_tl', 'kelompok_kendala', 'kelompok_status', 'hero', 'addon',
      'status_message', 'package_name', 'group_paket', 'reason_cancel', 'keterangan_cancel',
      'detail_manja', 'suberrorcode', 'engineermemo', 'tahun', 'bulan', 'tanggal', 'ps_1',
      'cek', 'hasil', 'telda', 'data_proses', 'no_order_revoke', 'data_ps_revoke', 'untuk_ps_pi',
      'untuk_ps_re', 'batch_id'
    ]
    const hsiTimeCols = ['order_date', 'last_updated_date', 'tgl_comment', 'tanggal_manja', 'tgl_ps', 'tgl_manja']

    for (const col of hsiTextCols) {
      try { await prisma.$executeRawUnsafe(`ALTER TABLE "hsi_data" ADD COLUMN IF NOT EXISTS "${col}" TEXT;`) } catch(e) {}
    }
    for (const col of hsiTimeCols) {
      try { await prisma.$executeRawUnsafe(`ALTER TABLE "hsi_data" ADD COLUMN IF NOT EXISTS "${col}" TIMESTAMPTZ;`) } catch(e) {}
    }

    try {
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "hsi_data_order_id_key" ON "hsi_data"("order_id");`)
    } catch (e) { }

    // Process records based on type
    let successCount = 0
    let failedCount = 0
    const errors = []
    const currentBatchId = `batch_${Date.now()}`
    const importStartTime = new Date()
    // Increased batch size for local development (5x faster)
    // Note: Max Postgres params is ~65535. HSI has ~65 cols. 65 * 1000 = 65000 (Risk).
    // So 500 is the safe sweet spot (32,500 params).
    const BATCH_SIZE = 100
    const sosBuffer = []
    const hsiBuffer = []
    const jtBuffer = []
    const datinBuffer = []
    const digitalBuffer = []
    let batchCounter = 0
    const progressLogs = []

    console.log(`🚀 Starting batch import of ${records.length} records (batch size: ${BATCH_SIZE})`)
    console.log(`ℹ️ Batch ID: ${currentBatchId} - Import start: ${importStartTime.toISOString()}`)

    // Helper function to flush a buffer
    const flushBuffer = async (buffer, model, label, mode = 'createMany') => {
      if (buffer.length === 0) return { inserted: 0, failed: 0 }

      try {
        batchCounter++
        console.log(`📦 Batch ${batchCounter}: Processing ${buffer.length} ${label} rows`)
        progressLogs.push({ batch: batchCounter, type: label, count: buffer.length, timestamp: new Date() })

        let insertedCount = 0

        if (mode === 'upsert' && label === 'SOS') {
          // SOS Logic
          const columns = [
            'order_id','nipnas','standard_name','order_subtype','segmen','sub_segmen',
            'cust_city','cust_witel','bill_witel','li_product_name','li_milestone','li_status','kategori',
            'revenue','biaya_pasang','hrg_bulanan','order_created_date','action_cd','batch_id','created_at','updated_at',
            'serv_city', 'service_witel', 'li_billdate', 'li_status_date',
            'is_termin', 'agree_type', 'agree_start_date', 'agree_end_date',
            'lama_kontrak_hari', 'amortisasi', 'kategori_umur', 'umur_order',
            'bill_city', 'po_name', 'tipe_order', 'segmen_baru', 'scalling1',
            'scalling2', 'tipe_grup', 'witel_baru', 'kategori_baru'
          ]

          // Deduplicate buffer by orderId to avoid "ON CONFLICT DO UPDATE command cannot affect row a second time"
          const uniqueRowsMap = new Map()
          for (const row of buffer) {
            if (row.orderId) {
              uniqueRowsMap.set(row.orderId, row)
            }
          }
          const uniqueBuffer = Array.from(uniqueRowsMap.values())

          if (uniqueBuffer.length === 0) return 0

          const values = []
          const now = new Date()
          const placeholders = uniqueBuffer.map((row, rowIdx) => {
            const base = rowIdx * columns.length
            values.push(
              row.orderId, row.nipnas ?? null, row.standardName ?? null, row.orderSubtype ?? null,
              row.segmen ?? null, row.subSegmen ?? null, row.custCity ?? null, row.custWitel ?? null,
              row.billWitel ?? null, row.liProductName ?? null, row.liMilestone ?? null, row.liStatus ?? null,
              row.kategori ?? null, row.revenue ?? 0, row.biayaPasang ?? 0, row.hrgBulanan ?? 0,
              row.orderCreatedDate ?? null, row.actionCd ?? null, row.batchId ?? currentBatchId, now, now,
              row.servCity ?? null, row.serviceWitel ?? null, row.liBilldate ?? null, row.liStatusDate ?? null,
              row.isTermin ?? null, row.agreeType ?? null, row.agreeStartDate ?? null, row.agreeEndDate ?? null,
              row.lamaKontrakHari ?? null, row.amortisasi ?? null, row.kategoriUmur ?? null, row.umurOrder ?? null,
              row.billCity ?? null, row.poName ?? null, row.tipeOrder ?? null, row.segmenBaru ?? null,
              row.scalling1 ?? null, row.scalling2 ?? null, row.tipeGrup ?? null, row.witelBaru ?? null, row.kategoriBaru ?? null
            )
            const params = columns.map((_, colIdx) => `$${base + colIdx + 1}`)
            return `(${params.join(',')})`
          }).join(',')

          const setClause = columns.filter(col => col !== 'order_id').map(col => `"${col}" = EXCLUDED."${col}"`).join(', ')
          const sql = `INSERT INTO "sos_data" (${columns.map(c => `"${c}"`).join(',')}) VALUES ${placeholders} ON CONFLICT ("order_id") DO UPDATE SET ${setClause};`

          await prisma.$executeRawUnsafe(sql, ...values)
          insertedCount = buffer.length // Count all processed rows (merged included)
        } else if (mode === 'digital') {
          // Digital Product Logic
          const columns = [
            'order_number','product_name','customer_name','po_name','witel','branch','revenue','amount','status','milestone','segment','category','sub_type','order_date','batch_id','created_at','updated_at'
          ]
          const uniqMap = new Map()
          for (const row of buffer) {
            if (!row.order_number) continue
            uniqMap.set(row.order_number, row)
          }
          const uniqRows = Array.from(uniqMap.values())
          const values = []
          const placeholders = uniqRows.map((row, rowIdx) => {
            const base = rowIdx * columns.length
            values.push(
              row.order_number, row.product_name, row.customer_name, row.po_name, row.witel, row.branch,
              row.revenue, row.amount, row.status, row.milestone, row.segment, row.category, row.sub_type,
              row.order_date, row.batch_id, row.created_at, row.updated_at
            )
            const params = columns.map((_, colIdx) => `$${base + colIdx + 1}`)
            return `(${params.join(',')})`
          }).join(',')

          const setClause = columns.filter(col => col !== 'order_number').map(col => `"${col}" = EXCLUDED."${col}"`).join(', ')
          const sql = `INSERT INTO "digital_products" (${columns.map(c => `"${c}"`).join(',')}) VALUES ${placeholders} ON CONFLICT ("order_number") DO UPDATE SET ${setClause};`
          if (placeholders.length > 0) {
            await prisma.$executeRawUnsafe(sql, ...values)
            insertedCount = buffer.length
          }
        } else if (mode === 'hsi') {
          // HSI Logic (Improved with ISO String safety)
          const columns = [
            'order_id', 'nomor', 'regional', 'witel', 'regional_old', 'witel_old', 'datel', 'sto', 'unit',
            'jenis_psb', 'type_trans', 'type_layanan', 'customer_name', 'status_resume', 'provider',
            'order_date', 'last_updated_date', 'ncli', 'pots', 'speedy', 'loc_id', 'wonum', 'flag_deposit',
            'contact_hp', 'ins_address', 'gps_longitude', 'gps_latitude', 'kcontact', 'channel', 'status_inet',
            'status_onu', 'upload', 'download', 'last_program', 'status_voice', 'clid', 'last_start',
            'tindak_lanjut', 'isi_comment', 'user_id_tl', 'tgl_comment', 'tanggal_manja', 'kelompok_kendala',
            'kelompok_status', 'hero', 'addon', 'tgl_ps', 'status_message', 'package_name', 'group_paket',
            'reason_cancel', 'keterangan_cancel', 'tgl_manja', 'detail_manja', 'suberrorcode', 'engineermemo',
            'tahun', 'bulan', 'tanggal', 'ps_1', 'cek', 'hasil', 'telda', 'data_proses', 'no_order_revoke',
            'data_ps_revoke', 'untuk_ps_pi', 'untuk_ps_re',
            'batch_id', 'created_at', 'updated_at'
          ]

          const uniqMap = new Map()
          for (const row of buffer) {
             if (!row.order_id) continue
             uniqMap.set(row.order_id, row)
          }
          const uniqRows = Array.from(uniqMap.values())
          const values = []
          const now = new Date().toISOString()
          const timestampCols = ['order_date', 'last_updated_date', 'tgl_comment', 'tanggal_manja', 'tgl_ps', 'tgl_manja', 'created_at', 'updated_at']

          const placeholders = uniqRows.map((row, rowIdx) => {
            const base = rowIdx * columns.length

            columns.forEach(col => {
              if (col === 'created_at' || col === 'updated_at') {
                values.push(now)
              } else {
                const val = row[col]
                // FIX: Konversi Date object ke string ISO dengan pengecekan
                if (val instanceof Date) {
                  // Pastikan tahun valid (tidak 57345)
                  if (!isNaN(val.getTime()) && val.getFullYear() < 2100) {
                     values.push(val.toISOString())
                  } else {
                     values.push(null) // Masukkan NULL jika tahun ngaco
                  }
                } else {
                  values.push(val ?? null)
                }
              }
            })

            const params = columns.map((col, colIdx) => {
              const p = `$${base + colIdx + 1}`
              return timestampCols.includes(col) ? `${p}::timestamptz` : p
            })
            return `(${params.join(',')})`
          }).join(',')

          const setClause = columns
            .filter(col => col !== 'order_id' && col !== 'created_at')
            .map(col => `"${col}" = EXCLUDED."${col}"`)
            .join(', ')

          const sql = `INSERT INTO "hsi_data" (${columns.map(c => `"${c}"`).join(',')}) VALUES ${placeholders} ON CONFLICT ("order_id") DO UPDATE SET ${setClause};`

          if (placeholders.length > 0) {
            await prisma.$executeRawUnsafe(sql, ...values)
            insertedCount = buffer.length
          }
        } else {
          const result = await model.createMany({
            data: buffer,
            skipDuplicates: true
          })
          insertedCount = result.count
        }

        console.log(`✅ Batch ${batchCounter}: Inserted ${insertedCount} ${label} rows`)
        progressLogs.push({ batch: batchCounter, type: label, inserted: insertedCount, status: 'success', timestamp: new Date() })
        buffer.length = 0
        return { inserted: insertedCount, failed: 0 }
      } catch (err) {
        batchCounter++
        const errorMsg = `❌ Batch ${batchCounter}: Error inserting ${label} - ${err.message}`
        console.error(errorMsg) // Print plain string first
        console.error(`Detail: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`) // Print full error object
        progressLogs.push({ batch: batchCounter, type: label, error: err.message, status: 'failed', timestamp: new Date() })
        const failedCount = buffer.length
        buffer.length = 0
        return { inserted: 0, failed: failedCount }
      }
    }

    // MAIN PROCESSING LOOP
    for (let i = 0; i < records.length; i++) {
      const record = records[i]

      // Check if row is completely empty
      if (Object.values(record).every(val => val === '' || val === null || val === undefined)) {
        emptyCount++
        // Log sample empty rows to debug file to prove they are empty
        if (emptyCount <= 20) {
           skippedRows.push({ index: i + 1, reason: 'COMPLETELY EMPTY ROW', data: record })
        }
        continue
      }

      const keyMap = buildKeyMap(record)

      try {
        if (['digital_product'].includes(type)) {
          const now = new Date()
          const orderNumber = getValue(record, keyMap, 'order_number', 'order number', 'orderid', 'order_id', 'no_order', 'order') || `AUTO-${Date.now()}-${i}`
          const productName = type === 'digital_product'
            ? (getValue(record, keyMap, 'product_name', 'product', 'productname', 'li_product_name') || 'DIGITAL_PRODUCT')
            : type.toUpperCase()

          digitalBuffer.push({
            order_number: orderNumber.toString(),
            product_name: productName,
            customer_name: getValue(record, keyMap, 'customer_name', 'customername'),
            po_name: getValue(record, keyMap, 'po_name'),
            witel: getValue(record, keyMap, 'witel', 'nama witel'),
            branch: getValue(record, keyMap, 'branch', 'datel', 'sto'),
            revenue: cleanNumber(getValue(record, keyMap, 'revenue', 'rev')),
            amount: cleanNumber(getValue(record, keyMap, 'amount', 'qty')) || 0,
            status: getValue(record, keyMap, 'status', 'status_resume') || 'progress',
            milestone: getValue(record, keyMap, 'milestone'),
            segment: getValue(record, keyMap, 'segment', 'segmen'),
            category: getValue(record, keyMap, 'category', 'kategori'),
            sub_type: getValue(record, keyMap, 'sub_type'),
            order_date: cleanDate(getValue(record, keyMap, 'order_date')),
            batch_id: currentBatchId, created_at: now, updated_at: now
          })

          if (digitalBuffer.length >= BATCH_SIZE) {
            const flushResult = await flushBuffer(digitalBuffer, null, 'DIGITAL', 'digital')
            successCount += flushResult.inserted
            failedCount += flushResult.failed
          }
        }

        if (type === 'sos') {
          // Add more variations for Order ID to catch 11k+ rows
          // Common variations: Order ID, No Order, No SC, SC Number, Nomor SC, Account ID, ND, Contract No
          const orderId = getValue(record, keyMap,
            'order_id', 'orderid', 'no_order', 'no_sc', 'nosc', 'scid', 'order_no', 'no_order_sc',
            'nomor_order', 'id_order', 'order_id_telkom',
            'sc_number', 'sc_no', 'nomor_sc', 'nomer_sc', 'no_sc_telkom',
            'contract_no', 'no_kontrak', 'nomor_kontrak',
            'nomor_internet', 'nd', 'nomor_jastel', 'nomer_jastel',
            'account_id', 'id_akun', 'account_no',
            'id' // Last resort
          )

          if (!orderId) {
             const reason = `Missing Order ID. Available keys: ${Object.keys(record).join(', ')}`
             skippedRows.push({ index: i + 1, reason, keys_found: Object.keys(record), data: record })

             if (skippedCount < 10) {
                console.log(`⚠️ Skipping SOS Row ${i+1}: ${reason}`)
                debugSkipped.push({ row: i+1, reason, data: record })
             }
             skippedCount++
             continue
          }

          sosBuffer.push({
            orderId: orderId.toString(),
            nipnas: getValue(record, keyMap, 'nipnas', 'no_nipnas'),
            standardName: getValue(record, keyMap, 'standard_name', 'standardname', 'customer_name', 'nama_pelanggan'),
            orderSubtype: getValue(record, keyMap, 'order_subtype', 'subtype', 'order_type'),
            segmen: getValue(record, keyMap, 'segmen', 'segment', 'customer_segment'),
            subSegmen: getValue(record, keyMap, 'sub_segmen', 'sub_segment'),
            custCity: getValue(record, keyMap, 'cust_city', 'city', 'kota'),
            custWitel: getValue(record, keyMap, 'cust_witel', 'witel', 'witel_name', 'nama_witel'),
            billWitel: getValue(record, keyMap, 'bill_witel', 'billing_witel'),
            liProductName: getValue(record, keyMap, 'li_product_name', 'product', 'product_name', 'nama_produk'),
            liMilestone: getValue(record, keyMap, 'li_milestone', 'milestone', 'status_milestone'),
            liStatus: getValue(record, keyMap, 'li_status', 'status', 'order_status'),
            kategori: getValue(record, keyMap, 'kategori', 'category'),
            revenue: cleanNumber(getValue(record, keyMap, 'revenue', 'rev', 'est_revenue', 'nilai_revenue', 'total_revenue')),
            biayaPasang: cleanNumber(getValue(record, keyMap, 'biaya_pasang', 'otc', 'biaya_instalasi')),
            hrgBulanan: cleanNumber(getValue(record, keyMap, 'hrg_bulanan', 'monthly_fee', 'recurring')),
            orderCreatedDate: cleanDate(getValue(record, keyMap, 'order_created_date', 'order_date', 'tanggal_order', 'tgl_order')),
            actionCd: getValue(record, keyMap, 'action_cd', 'action_code', 'type_order', 'jenis_order'),
            batchId: currentBatchId,

            // New Fields Mapping
            servCity: getValue(record, keyMap, 'servcity', 'serv_city', 'service_city'),
            serviceWitel: getValue(record, keyMap, 'service_witel', 'servicewitel', 'witel_service'),
            liBilldate: cleanDate(getValue(record, keyMap, 'li_billdate', 'billdate', 'tgl_billing')),
            liStatusDate: cleanDate(getValue(record, keyMap, 'li_status_date', 'status_date', 'tgl_status')),
            isTermin: getValue(record, keyMap, 'is_termin', 'termin'),
            agreeType: getValue(record, keyMap, 'agree_type', 'tipe_kontrak'),
            agreeStartDate: cleanDate(getValue(record, keyMap, 'agree_start_date', 'start_date')),
            agreeEndDate: cleanDate(getValue(record, keyMap, 'agree_end_date', 'end_date')),
            lamaKontrakHari: cleanNumber(getValue(record, keyMap, 'lama_kontrak_hari', 'lama_kontrak')),
            amortisasi: cleanNumber(getValue(record, keyMap, 'amortisasi')),
            kategoriUmur: getValue(record, keyMap, 'kategori_umur', 'umur_category'),
            umurOrder: cleanNumber(getValue(record, keyMap, 'umur_order', 'umur')),
            billCity: getValue(record, keyMap, 'billcity', 'bill_city', 'tagihan_kota'),
            poName: getValue(record, keyMap, 'po_name', 'po', 'nama_po'),
            tipeOrder: getValue(record, keyMap, 'tipe_order', 'type_order'),
            segmenBaru: getValue(record, keyMap, 'segmen_baru', 'new_segment'),
            scalling1: cleanNumber(getValue(record, keyMap, 'scaling', 'scalling', 'scalling1')),
            scalling2: cleanNumber(getValue(record, keyMap, 'scaling2', 'scalling2')),
            tipeGrup: getValue(record, keyMap, 'tipe_grup', 'group_type'),
            witelBaru: getValue(record, keyMap, 'witel_baru', 'new_witel'),
            kategoriBaru: getValue(record, keyMap, 'kategori_baru', 'new_category')
          })

          if (sosBuffer.length >= BATCH_SIZE) {
            const flushResult = await flushBuffer(sosBuffer, prisma.sosData, 'SOS', 'upsert')
            successCount += flushResult.inserted
            failedCount += flushResult.failed
          }
        } else if (type === 'hsi') {
          const hsiMapping = {
            order_id: ['order_id', 'orderid', 'order id', 'no_order'],
            nomor: ['nomor', 'nd', 'nomer', 'nomor_internet'],
            regional: ['regional', 'reg'], witel: ['witel', 'nama witel'], regional_old: ['regional_old'], witel_old: ['witel_old'],
            datel: ['datel'], sto: ['sto'], unit: ['unit'], jenis_psb: ['jenispsb', 'jenis_psb'], type_trans: ['type_trans'],
            type_layanan: ['type_layanan'], status_resume: ['status_resume', 'status'], provider: ['provider'],
            order_date: ['order_date', 'orderdate', 'tgl_order'], last_updated_date: ['last_updated_date'],
            ncli: ['ncli'], pots: ['pots'], speedy: ['speedy'], customer_name: ['customer_name', 'nama pelanggan'],
            loc_id: ['loc_id'], wonum: ['wonum'], flag_deposit: ['flag_deposit'], contact_hp: ['contact_hp', 'no_hp'],
            ins_address: ['ins_address', 'alamat'], gps_longitude: ['gps_longitude'], gps_latitude: ['gps_latitude'],
            kcontact: ['kcontact'], channel: ['channel'], status_inet: ['status_inet'], status_onu: ['status_onu'],
            upload: ['upload'], download: ['download'], last_program: ['last_program'], status_voice: ['status_voice'],
            clid: ['clid'], last_start: ['last_start'], tindak_lanjut: ['tindak_lanjut'], isi_comment: ['isi_comment', 'comment'],
            user_id_tl: ['user_id_tl'], tgl_comment: ['tgl_comment'], tanggal_manja: ['tanggal_manja'],
            kelompok_kendala: ['kelompok_kendala'], kelompok_status: ['kelompok_status'], hero: ['hero'], addon: ['addon'],
            tgl_ps: ['tgl_ps', 'tanggal_ps'], status_message: ['status_message'], package_name: ['package_name'],
            group_paket: ['group_paket'], reason_cancel: ['reason_cancel'], keterangan_cancel: ['keterangan_cancel'],
            tgl_manja: ['tgl_manja', 'tgl manja'], detail_manja: ['detail_manja', 'detail manja'], suberrorcode: ['suberrorcode'], engineermemo: ['engineermemo'],
            tahun: ['tahun'], bulan: ['bulan'], tanggal: ['tanggal'], cek: ['cek'], hasil: ['hasil'],
            telda: ['telda'], data_proses: ['data_proses', 'data proses'], no_order_revoke: ['no_order_revoke', 'no_order_revol', 'no order revol'], data_ps_revoke: ['data_ps_revoke', 'data ps revoke'],
            untuk_ps_pi: ['untuk_ps_pi', 'untuk ps/pi'], untuk_ps_re: ['untuk_ps_re', 'untuk ps/re']
          }

          const hsiRow = {}
          for (const [dbCol, candidates] of Object.entries(hsiMapping)) {
             let val = getValue(record, keyMap, ...candidates)
             if (['order_date', 'last_updated_date', 'tgl_comment', 'tanggal_manja', 'tgl_ps', 'tgl_manja'].includes(dbCol)) {
                val = cleanDate(val)
             } else if (val !== undefined && val !== null) {
                val = val.toString()
             }
             hsiRow[dbCol] = val
          }

          // --- GENERATOR LOGIC (AUTO-FILL) ---
          // Mengisi kolom ps_1, no_order_revoke, dll berdasarkan status_resume jika kosong
          const status = (hsiRow.status_resume || '').toString().toUpperCase()

          if (!hsiRow.ps_1) {
             if (status.includes('PS')) hsiRow.ps_1 = 'PS'
             else if (status.includes('FALLOUT')) hsiRow.ps_1 = 'FALLOUT'
             else if (status.includes('CANCEL')) hsiRow.ps_1 = 'CANCEL'
             else if (status.includes('UNSC')) hsiRow.ps_1 = 'UNSC'
             else if (status.includes('PROVISIONING') || status.includes('OGP')) hsiRow.ps_1 = 'OGP PROVI'
             else if (status.includes('REVOKE')) hsiRow.ps_1 = 'REVOKE' // Fallback
          }

          if (!hsiRow.no_order_revoke) {
             if (status.includes('REVOKE')) hsiRow.no_order_revoke = 'REVOKE'
             else if (status.includes('FALLOUT')) hsiRow.no_order_revoke = 'FALLOUT'
             else if (status.includes('CANCEL')) hsiRow.no_order_revoke = 'CANCEL'
          }
          // -----------------------------------

          hsiRow.batch_id = currentBatchId
          if (!hsiRow.order_id) hsiRow.order_id = `order_${Date.now()}_${i}`

          hsiBuffer.push(hsiRow)
          if (hsiBuffer.length >= BATCH_SIZE) {
            const flushResult = await flushBuffer(hsiBuffer, null, 'HSI', 'hsi')
            successCount += flushResult.inserted
            failedCount += flushResult.failed
          }
        } else if (type === 'jt' || type === 'tambahan' || type === 'datin') {
          // JT/Datin Logic
          const isDatin = type === 'datin'
          const buffer = isDatin ? datinBuffer : jtBuffer
          const label = isDatin ? 'DATIN' : 'JT'

          const witelBaruVal = getValue(record, keyMap, 'witel baru', 'witel_baru', 'witel', 'lokasi')
          const witelLamaVal = getValue(record, keyMap, 'witel lama', 'witel_lama', 'witel_eksisting')

          // 1. Skip if Witel is missing (Empty Row)
          if (!witelBaruVal) continue

          // 2. Filter out unwanted Witels (Jawa Tengah)
          const unwantedWitels = ['SOLO', 'YOGYA', 'MAGELANG', 'SEMARANG', 'KUDUS', 'PURWOKERTO', 'JATENG', 'PEKALONGAN']
          const witelStr = ((witelBaruVal || '') + ' ' + (witelLamaVal || '')).toUpperCase()

          if (unwantedWitels.some(w => witelStr.includes(w))) continue

          buffer.push({
            // Identification
            batchId: currentBatchId,

            // Core Info
            bulan: getValue(record, keyMap, 'bulan'),
            tahun: cleanNumber(getValue(record, keyMap, 'tahun')),
            region: getValue(record, keyMap, 'region'),
            witelBaru: witelBaruVal,
            witelLama: witelLamaVal,
            idIHld: getValue(record, keyMap, 'id i-hld', 'id_i_hld', 'id ihld', 'ihld', 'id_i-hld'),

            // SPMK Info
            noNdeSpmk: getValue(record, keyMap, 'no nde spmk', 'no_nde_spmk', 'nonde spmk', 'no nde', 'nomor_spmk') || `nd_${Date.now()}_${i}`,
            perihalNdeSpmk: getValue(record, keyMap, 'perihal nde spmk', 'perihal_nde_spmk'),
            uraianKegiatan: getValue(record, keyMap, 'uraian kegiatan', 'uraian_kegiatan', 'uraian', 'pekerjaan', 'kegiatan', 'project_name', 'nama_project'),
            segmen: getValue(record, keyMap, 'segmen', 'segment', 'segmen_pelanggan', 'nama_pelanggan'),
            poName: getValue(record, keyMap, 'po', 'po_name', 'po name', 'mitra', 'nama_po', 'nama mitra'),
            mitraLokal: getValue(record, keyMap, 'mitra lokal', 'mitra_lokal'),

            // Dates
            tanggalGolive: cleanDate(getValue(record, keyMap, 'tanggal golive', 'tanggal golive\n(dd/mm/yyyy)', 'tanggal_golive', 'tgl_golive', 'golive', 'tanggal_selesai')),
            tanggalMom: cleanDate(getValue(record, keyMap, 'tanggal mom', 'tanggal_mom', 'tgl_mom', 'mom_date')),
            tanggalCb: cleanDate(getValue(record, keyMap, 'tanggal cb', 'tanggal_cb', 'tgl_cb', 'tanggal_spmk')),

            // Technical & Status
            jenisKegiatan: getValue(record, keyMap, 'jenis kegiatan', 'jenis_kegiatan', 'jenis', 'type', 'jenis_layanan'),
            revenuePlan: cleanNumber(getValue(record, keyMap, 'revenue plan', 'revenue_plan', 'rev', 'nilai', 'rab', 'nilai_proyek')),
            rab: cleanNumber(getValue(record, keyMap, 'rab')),
            statusProyek: getValue(record, keyMap, 'status proyek', 'status_proyek', 'status') || label,
            goLive: (getValue(record, keyMap, 'golive', 'go_live', 'go live', 'status_golive') || 'N').toString().substring(0, 1),
            baDrop: (getValue(record, keyMap, 'ba drop', 'ba_drop', 'drop', 'ba_progress') || '').toString(),
            populasiNonDrop: (getValue(record, keyMap, 'populasi (non drop)', 'populasi_non_drop', 'populasi', 'non_drop') || 'Y').toString().substring(0, 1),
            mom: getValue(record, keyMap, 'mom'),
            konfirmasiPo: getValue(record, keyMap, 'konfirmasi po', 'konfirmasi_po'),

            // Tracking & Aging
            usia: cleanNumber(getValue(record, keyMap, 'usia')),
            totalPort: getValue(record, keyMap, 'total port', 'total_port'),
            templateDurasi: getValue(record, keyMap, 'template durasi', 'template_durasi'),
            toc: getValue(record, keyMap, 'toc'),
            keteranganToc: getValue(record, keyMap, 'keterangan toc', 'keterangan_toc', 'keterangan'),
            umurPekerjaan: getValue(record, keyMap, 'umur pekerjaan', 'umur_pekerjaan'),
            kategoriUmurPekerjaan: getValue(record, keyMap, 'kategori umur pekerjaan', 'kategori_umur_pekerjaan'),

            // Detailed Status
            statusTompsLastActivity: getValue(record, keyMap, 'status tomps - last activity', 'status_tomps_last_activity', 'status tomps last activity', 'status_tomps', 'tomps'),
            statusTompsNew: getValue(record, keyMap, 'status tomps new', 'status_tomps_new', 'tomps_new'),
            statusIHld: getValue(record, keyMap, 'status i-hld', 'status_i_hld', 'status ihld', 'status hld'),

            // PO Name Sanitization & Fallback
            poName: (() => {
              let po = getValue(record, keyMap, 'po', 'po_name', 'po name', 'mitra', 'nama_po', 'nama mitra')
              const mitraLokal = getValue(record, keyMap, 'mitra lokal', 'mitra_lokal')
              const uraian = getValue(record, keyMap, 'uraian kegiatan', 'uraian_kegiatan', 'uraian', 'pekerjaan')

              // 1. Clean existing PO (handle Excel errors)
              if (po && (po.toString().includes('#NAME') || po.toString().includes('#REF'))) po = null

              // 2. Fallback to Mitra Lokal
              if (!po && mitraLokal) po = mitraLokal

              // 3. Fallback to Uraian Extraction (Try to find PT. or CV. or PT3xxx)
              if (!po && uraian) {
                // Regex to find PT. Name, CV. Name, or PT codes like PT3BR, PT2NS
                const match = uraian.toString().match(/(PT\.?\s?[\w\s]+|CV\.?\s?[\w\s]+|PT\d+[A-Z0-9]+)/i)
                if (match) {
                   // Take first 3 words max to avoid taking the whole sentence
                   const words = match[0].split(' ').slice(0, 4).join(' ')
                   po = words.toUpperCase()
                }
              }

              return po || 'UNIDENTIFIED PO'
            })(),

            namaOdpGoLive: getValue(record, keyMap, 'nama odp go live', 'nama_odp_go_live'),
            bak: getValue(record, keyMap, 'bak'),
            keteranganPelimpahan: getValue(record, keyMap, 'keterangan pelimpahan', 'keterangan_pelimpahan')
          })

          if (buffer.length >= BATCH_SIZE) {
            const flushResult = await flushBuffer(buffer, prisma.spmkMom, label)
            successCount += flushResult.inserted
            failedCount += flushResult.failed
          }
        }
      } catch (err) {
        failedCount++
        errors.push({ row: record, error: err.message })
      }
    }

    // Flush remaining
    console.log('📤 Flushing remaining buffers...')
    let flushResult = await flushBuffer(sosBuffer, prisma.sosData, 'SOS (final)', 'upsert'); successCount += flushResult.inserted || 0; failedCount += flushResult.failed || 0
    flushResult = await flushBuffer(hsiBuffer, null, 'HSI (final)', 'hsi'); successCount += flushResult.inserted || 0; failedCount += flushResult.failed || 0
    flushResult = await flushBuffer(jtBuffer, prisma.spmkMom, 'JT (final)'); successCount += flushResult.inserted || 0; failedCount += flushResult.failed || 0
    flushResult = await flushBuffer(datinBuffer, prisma.spmkMom, 'DATIN (final)'); successCount += flushResult.inserted || 0; failedCount += flushResult.failed || 0
    flushResult = await flushBuffer(digitalBuffer, null, 'DIGITAL (final)', 'digital'); successCount += flushResult.inserted || 0; failedCount += flushResult.failed || 0

    console.log(`✅ Import complete: ${successCount} success, ${emptyCount} empty, ${skippedCount} skipped (missing ID), ${failedCount} failed`)

    if (skippedRows.length > 0) {
      await writeFile(path.join(process.cwd(), 'skipped_debug.json'), JSON.stringify(skippedRows, null, 2))
      console.log(`⚠️ Dumped ${skippedRows.length} skipped rows to skipped_debug.json`)
    }

    // Clean up
    await unlink(filePath)

    successResponse(
      res,
      {
        fileName,
        type,
        totalRows: records.length,
        successRows: successCount,
        emptyRows: emptyCount,
        skippedRows: skippedCount,
        failedRows: failedCount,
        batchId: currentBatchId,
        progressLogs: progressLogs,
        errors: errors.slice(0, 5)
      },
      'File uploaded successfully'
    )
  } catch (error) {
    if (req.file) {
      try { await unlink(req.file.path) } catch (e) {}
    }
    next(error)
  }
}

export const getImportLogs = async (req, res, next) => {
  try {
    const sosBatches = await prisma.sosData.groupBy({
      by: ['batchId', 'createdAt'], _count: { id: true }, orderBy: { createdAt: 'desc' }, take: 10
    })
    const spmkBatches = await prisma.spmkMom.groupBy({
      by: ['batchId', 'createdAt'], _count: { id: true }, orderBy: { createdAt: 'desc' }, take: 10
    })
    const digitalBatches = await prisma.digitalProduct.groupBy({
      by: ['batchId', 'createdAt'], _count: { id: true }, orderBy: { createdAt: 'desc' }, take: 10
    })

    const formattedSos = sosBatches.filter(b => b.batchId).map(batch => ({
        batchId: batch.batchId, importDate: batch.createdAt, recordCount: batch._count.id, type: 'SOS Data / Analysis'
    }))
    const formattedSpmk = spmkBatches.filter(b => b.batchId).map(batch => ({
        batchId: batch.batchId, importDate: batch.createdAt, recordCount: batch._count.id, type: 'SPMK (JT/Datin)'
    }))
    const formattedDigital = digitalBatches.filter(b => b.batchId).map(batch => ({
        batchId: batch.batchId, importDate: batch.createdAt, recordCount: batch._count.id, type: 'Digital Product'
    }))

    const allLogs = [...formattedSos, ...formattedSpmk, ...formattedDigital].sort((a, b) => {
      return new Date(b.importDate) - new Date(a.importDate)
    })

    successResponse(res, allLogs, 'Import logs retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Truncate/Clear all data for a specific type
export const truncateData = async (req, res, next) => {
  try {
    let type = (req.query.type || '').toString().toLowerCase()

    // Normalize aliases
    if (['digital', 'dp'].includes(type)) type = 'digital_product'
    if (type === 'datin') type = 'sos'

    let tableName = ''
    let label = ''

    if (type === 'digital_product') {
      tableName = 'digital_products'
      label = 'Digital Product'
    } else if (type === 'hsi') {
      tableName = 'hsi_data'
      label = 'HSI'
    } else if (type === 'sos') {
      tableName = 'sos_data'
      label = 'SOS / Datin'
    } else if (type === 'jt' || type === 'tambahan') {
      tableName = 'spmk_mom'
      label = 'Jaringan Tambahan (SPMK)'
    } else {
      return errorResponse(res, 'Invalid type', 'Please specify a valid type (hsi, digital, sos, jt)', 400)
    }

    // Execute Truncate
    console.log(`🗑️ Truncating table: ${tableName} for type: ${type}`)
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`)

    successResponse(res, null, `Successfully deleted all data for ${label}`)
  } catch (error) {
    next(error)
  }
}
