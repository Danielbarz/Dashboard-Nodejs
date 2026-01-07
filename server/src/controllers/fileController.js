import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { unlink } from 'fs/promises'
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

// FIX: Clean numeric-like values (handle empty strings and comma decimals)
const cleanNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value
  
  // Replace koma dengan titik (format Indo 10,5 -> 10.5)
  const strVal = value.toString().replace(',', '.')
  // Hapus karakter non-angka kecuali titik dan minus
  const cleaned = strVal.replace(/[^0-9.\-]/g, '')
  return cleaned ? parseFloat(cleaned) : 0
}

// FIX: Clean date values (Robust Version)
const cleanDate = (value) => {
  if (!value) return null

  const dateStr = value.toString().trim()
  if (dateStr === '' || dateStr === '-') return null

  // 1. Handle Excel Serial Dates (Angka atau String Angka)
  // Contoh: 45236 atau "45236" (Excel date untuk ~2023)
  // Regex ini cek apakah isinya angka saja
  if (/^\d+(\.\d+)?$/.test(dateStr)) {
    const num = parseFloat(dateStr)
    // Sanity check: Serial date Excel untuk era modern (1950 - 2070) adalah sekitar 18000 - 65000
    // Jika angka > 70000, kemungkinan itu bukan tanggal Excel, tapi ID atau NIK
    if (num > 18000 && num < 70000) {
      // Excel base date is Dec 30, 1899
      const date = new Date((num - 25569) * 86400 * 1000)
      return isNaN(date.getTime()) ? null : date
    }
  }

  // 2. Handle standard Date object
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value
  }

  // 3. Try standard Date parse (ISO Format YYYY-MM-DD)
  let date = new Date(dateStr)
  // Pastikan tahun masuk akal (antara 1900 dan 2100) untuk menghindari error Postgres
  if (!isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100) {
    return date
  }

  // 4. Try DD/MM/YYYY or DD-MM-YYYY (Indonesian format)
  const match = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
  if (match) {
    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10) - 1 // Month is 0-indexed
    const year = parseInt(match[3], 10)
    date = new Date(year, month, day)
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
      if (buffer.length === 0) return 0
      
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
            'revenue','biaya_pasang','hrg_bulanan','order_created_date','action_cd','batch_id','created_at','updated_at'
          ]
          const values = []
          const now = new Date()
          const placeholders = buffer.map((row, rowIdx) => {
            const base = rowIdx * columns.length
            values.push(
              row.orderId, row.nipnas ?? null, row.standardName ?? null, row.orderSubtype ?? null,
              row.segmen ?? null, row.subSegmen ?? null, row.custCity ?? null, row.custWitel ?? null,
              row.billWitel ?? null, row.liProductName ?? null, row.liMilestone ?? null, row.liStatus ?? null,
              row.kategori ?? null, row.revenue ?? 0, row.biayaPasang ?? 0, row.hrgBulanan ?? 0,
              row.orderCreatedDate ?? null, row.actionCd ?? null, row.batchId ?? currentBatchId, now, now
            )
            const params = columns.map((_, colIdx) => `$${base + colIdx + 1}`)
            return `(${params.join(',')})`
          }).join(',')

          const setClause = columns.filter(col => col !== 'order_id').map(col => `"${col}" = EXCLUDED."${col}"`).join(', ')
          const sql = `INSERT INTO "sos_data" (${columns.map(c => `"${c}"`).join(',')}) VALUES ${placeholders} ON CONFLICT ("order_id") DO UPDATE SET ${setClause};`

          await prisma.$executeRawUnsafe(sql, ...values)
          insertedCount = buffer.length
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
            insertedCount = uniqRows.length
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
            'tahun', 'bulan', 'tanggal', 'ps_1', 'cek', 'hasil', 'telda', 'data_proses', 'no_order_revol', 
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
            insertedCount = uniqRows.length
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
        return insertedCount
      } catch (err) {
        batchCounter++
        const errorMsg = `❌ Batch ${batchCounter}: Error inserting ${label} - ${err.message}`
        console.error(errorMsg)
        console.error(`Detail: ${JSON.stringify(err)}`)
        progressLogs.push({ batch: batchCounter, type: label, error: err.message, status: 'failed', timestamp: new Date() })
        buffer.length = 0
        return 0
      }
    }

    // MAIN PROCESSING LOOP
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const keyMap = buildKeyMap(record)
      
      try {
        if (['digital_product', 'hsi', 'jt'].includes(type)) {
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
            successCount += await flushBuffer(digitalBuffer, null, 'DIGITAL', 'digital')
          }
        }

        if (type === 'sos') {
          const orderId = getValue(record, keyMap, 'order_id', 'orderid', 'no_order')
          if (!orderId) continue

          sosBuffer.push({
            orderId: orderId.toString(),
            nipnas: getValue(record, keyMap, 'nipnas'),
            standardName: getValue(record, keyMap, 'standard_name', 'standardname'),
            orderSubtype: getValue(record, keyMap, 'order_subtype'),
            segmen: getValue(record, keyMap, 'segmen'),
            subSegmen: getValue(record, keyMap, 'sub_segmen'),
            custCity: getValue(record, keyMap, 'cust_city'),
            custWitel: getValue(record, keyMap, 'cust_witel'),
            billWitel: getValue(record, keyMap, 'bill_witel', 'witel'),
            liProductName: getValue(record, keyMap, 'li_product_name', 'product'),
            liMilestone: getValue(record, keyMap, 'li_milestone', 'milestone'),
            liStatus: getValue(record, keyMap, 'li_status', 'status'),
            kategori: getValue(record, keyMap, 'kategori'),
            revenue: cleanNumber(getValue(record, keyMap, 'revenue')),
            biayaPasang: cleanNumber(getValue(record, keyMap, 'biaya_pasang')),
            hrgBulanan: cleanNumber(getValue(record, keyMap, 'hrg_bulanan')),
            orderCreatedDate: cleanDate(getValue(record, keyMap, 'order_created_date')),
            actionCd: getValue(record, keyMap, 'action_cd', 'type_order'),
            batchId: currentBatchId
          })

          if (sosBuffer.length >= BATCH_SIZE) {
            successCount += await flushBuffer(sosBuffer, prisma.sosData, 'SOS', 'upsert')
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
            tgl_manja: ['tgl_manja'], detail_manja: ['detail_manja'], suberrorcode: ['suberrorcode'], engineermemo: ['engineermemo'],
            tahun: ['tahun'], bulan: ['bulan'], tanggal: ['tanggal'], ps_1: ['ps 1', 'ps1'], cek: ['cek'], hasil: ['hasil'],
            telda: ['telda'], data_proses: ['data_proses'], no_order_revoke: ['no_order_revoke', 'no_order_revol'], data_ps_revoke: ['data_ps_revoke'],
            untuk_ps_pi: ['untuk_ps_pi'], untuk_ps_re: ['untuk_ps_re']
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
          
          hsiRow.batch_id = currentBatchId
          if (!hsiRow.order_id) hsiRow.order_id = `order_${Date.now()}_${i}`

          hsiBuffer.push(hsiRow)
          if (hsiBuffer.length >= BATCH_SIZE) {
            successCount += await flushBuffer(hsiBuffer, null, 'HSI', 'hsi')
          }
        } else if (type === 'jt' || type === 'tambahan' || type === 'datin') {
          // JT/Datin Logic
          const isDatin = type === 'datin'
          const buffer = isDatin ? datinBuffer : jtBuffer
          const label = isDatin ? 'DATIN' : 'JT'
          
          buffer.push({
            noNdeSpmk: getValue(record, keyMap, 'no_nde_spmk', 'nondeSpmk') || `nd_${Date.now()}_${i}`,
            witelBaru: getValue(record, keyMap, 'witel_baru'),
            statusProyek: label,
            revenuePlan: cleanNumber(getValue(record, keyMap, 'revenue_plan')),
            batchId: currentBatchId,
            poName: getValue(record, keyMap, 'po_name'),
            segmen: getValue(record, keyMap, 'segmen')
          })

          if (buffer.length >= BATCH_SIZE) {
            successCount += await flushBuffer(buffer, prisma.spmkMom, label)
          }
        }
      } catch (err) {
        failedCount++
        errors.push({ row: record, error: err.message })
      }
    }

    // Flush remaining
    console.log('📤 Flushing remaining buffers...')
    successCount += await flushBuffer(sosBuffer, prisma.sosData, 'SOS (final)', 'upsert')
    successCount += await flushBuffer(hsiBuffer, null, 'HSI (final)', 'hsi')
    successCount += await flushBuffer(jtBuffer, prisma.spmkMom, 'JT (final)')
    successCount += await flushBuffer(datinBuffer, prisma.spmkMom, 'DATIN (final)')
    successCount += await flushBuffer(digitalBuffer, null, 'DIGITAL (final)', 'digital')

    console.log(`✅ Import complete: ${successCount} success, ${failedCount} failed`)

    // Clean up
    await unlink(filePath)

    successResponse(
      res,
      {
        fileName,
        type,
        totalRows: records.length,
        successRows: successCount,
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