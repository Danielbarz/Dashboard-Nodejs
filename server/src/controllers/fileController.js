import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream, writeFileSync } from 'fs'
import { unlink } from 'fs/promises'
import path from 'path'
import AdmZip from 'adm-zip'
// import { fileImportQueue } from '../queues/index.js'
// import { Redis } from 'ioredis'
// import config from '../config/index.js'

// Redis disabled until queue system activated
// const redis = new Redis({
//   host: config.redis.host,
//   port: config.redis.port,
//   password: config.redis.password
// })

// Daftar Witel yang diizinkan (Sesuai HsiDataImport.php Laravel)
const ALLOWED_WITELS = ['JATIM TIMUR', 'JATIM BARAT', 'SURAMADU', 'NUSA TENGGARA', 'BALI']

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

// Clean numeric-like values (strip non-digits except dot)
const cleanNumber = (value) => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  const cleaned = value.toString().replace(/[^0-9.]/g, '')
  return cleaned ? parseFloat(cleaned) : 0
}

// Clean date values
const cleanDate = (value, dateFormat = 'm/d/Y') => {
  if (!value) return null
  
  let date
  // Handle Excel serial dates (numbers)
  if (typeof value === 'number') {
    // Excel base date is Dec 30, 1899
    date = new Date((value - 25569) * 86400 * 1000)
  } else {
    // Handle string dates
    date = new Date(value)
  }

  if (isNaN(date.getTime())) return null

  // Logic Tukar Bulan/Tanggal (US Format Fix) - Porting dari Laravel HsiDataImport.php
  // Jika format m/d/Y dan tanggal <= 12, tukar tanggal dengan bulan
  if (dateFormat === 'm/d/Y') {
    const day = date.getDate()
    const month = date.getMonth() // 0-indexed (0 = Jan)
    
    if (day <= 12) {
      // Swap: Day jadi Month, Month jadi Day
      // date.setMonth(index) -> index 0-11
      // date.setDate(value) -> value 1-31
      
      // Contoh: 4 Des (4/12). Terbaca 12 April (12/4). Day=12, Month=3 (April).
      // Target: Month=11 (Des), Day=4.
      // New Month = Day - 1 (12 - 1 = 11)
      // New Day = Month + 1 (3 + 1 = 4)
      
      date.setMonth(day - 1)
      date.setDate(month + 1)
    }
  }

  return date
}

// Upload Excel/CSV file
export const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    let type = (req.query.type || 'sos').toString().toLowerCase()
    const dateFormat = req.body.date_format || 'm/d/Y' // Default format dari request

    // Normalize aliases
    // 'analysis' removed from here so it defaults to 'sos' logic (which populates SosData)
    if (['digital', 'dp'].includes(type)) type = 'digital_product'

    // Only admin and superadmin can upload files
    if (!['admin', 'superadmin'].includes(userRole)) {
      return errorResponse(res, 'Unauthorized', 'Only admins can upload files', 403)
    }

    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 'Please provide a file', 400)
    }

    let filePath = req.file.path
    const fileName = req.file.originalname
    let ext = path.extname(fileName).toLowerCase()

    let records = []

    // Handle ZIP Extraction (Porting dari ReportHsiAdminController.php)
    if (ext === '.zip') {
      try {
        const zip = new AdmZip(filePath)
        const zipEntries = zip.getEntries()
        // Cari file excel/csv pertama dalam zip
        const entry = zipEntries.find(e => e.entryName.match(/\.(xlsx|xls|csv)$/i))
        
        if (!entry) {
          await unlink(filePath)
          return errorResponse(res, 'Invalid ZIP', 'File ZIP tidak berisi file Excel (.xlsx/.xls) atau CSV yang valid.', 400)
        }

        // Ekstrak file
        const buffer = zip.readFile(entry)
        const extractName = `extracted-${Date.now()}-${path.basename(entry.entryName)}`
        const extractDir = path.dirname(filePath)
        zip.extractEntryTo(entry, extractDir, false, true, extractName)
        const newPath = path.join(extractDir, extractName)
        
        writeFileSync(newPath, buffer)
        
        // Hapus zip asli dan update path ke file hasil ekstrak
        await unlink(filePath)
        filePath = path.join(extractDir, extractName)
        filePath = newPath
        ext = path.extname(extractName).toLowerCase()
      } catch (err) {
        return errorResponse(res, 'ZIP Error', 'Gagal mengekstrak file ZIP: ' + err.message, 400)
      }
    }

    // Parse file
    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(filePath)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      records = XLSX.utils.sheet_to_json(worksheet)
    } else if (ext === '.csv') {
      records = await new Promise((resolve, reject) => {
        const results = []
        // Detect delimiter: check first line to determine if TSV (tab) or CSV (comma)
        let firstLine = ''
        let delimiter = ','
        
        const stream = createReadStream(filePath)
          .on('data', (chunk) => {
            if (!firstLine) {
              firstLine += chunk.toString()
              const newlineIndex = firstLine.indexOf('\n')
              if (newlineIndex > 0) {
                firstLine = firstLine.substring(0, newlineIndex)
                // Count tabs vs commas
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

    // DEBUG: Log first row headers
    if (records.length > 0) {
      console.log('🔍 DEBUG - File headers:', Object.keys(records[0]).slice(0, 10))
      console.log('🔍 DEBUG - Total records to process:', records.length)
    }

    // Ensure digital_products table exists (for dashboard/report sync)
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

    // Process records based on type
    let successCount = 0
    let failedCount = 0
    const errors = []

    // Generate Batch ID for this upload session
    const currentBatchId = `batch_${Date.now()}`

    // Batch configuration
    const BATCH_SIZE = 100
    const sosBuffer = []
    const hsiBuffer = []
    const jtBuffer = []
    const datinBuffer = []
    const digitalBuffer = []
    let batchCounter = 0
    const progressLogs = []

    console.log(`🚀 Starting batch import of ${records.length} records (batch size: ${BATCH_SIZE})`)
    
    // Helper function to flush a buffer
    const flushBuffer = async (buffer, model, label, mode = 'createMany') => {
      if (buffer.length === 0) return 0
      
      try {
        batchCounter++
        const logMsg = `📦 Batch ${batchCounter}: Processing ${buffer.length} ${label} rows`
        console.log(logMsg)
        progressLogs.push({ batch: batchCounter, type: label, count: buffer.length, timestamp: new Date() })
        
        let insertedCount = 0

        if (mode === 'upsert' && label === 'SOS') {
          // Raw upsert for SOS in one round trip (faster than many Prisma upserts)
          const columns = [
            'order_id','nipnas','standard_name','order_subtype','order_description','segmen','sub_segmen',
            'cust_city','cust_witel','bill_witel','li_product_name','li_milestone','li_status','kategori',
            'revenue','biaya_pasang','hrg_bulanan','order_created_date','batch_id'
          ]

          const values = []
          const placeholders = buffer.map((row, rowIdx) => {
            const base = rowIdx * columns.length
            values.push(
              row.orderId,
              row.nipnas ?? null,
              row.standardName ?? null,
              row.orderSubtype ?? null,
              row.orderDescription ?? null,
              row.segmen ?? null,
              row.subSegmen ?? null,
              row.custCity ?? null,
              row.custWitel ?? null,
              row.billWitel ?? null,
              row.liProductName ?? null,
              row.liMilestone ?? null,
              row.liStatus ?? null,
              row.kategori ?? null,
              row.revenue ?? 0,
              row.biayaPasang ?? 0,
              row.hrgBulanan ?? 0,
              row.orderCreatedDate ?? null,
              row.batchId ?? currentBatchId
            )
            const params = columns.map((_, colIdx) => `$${base + colIdx + 1}`)
            return `(${params.join(',')})`
          }).join(',')

          const setClause = columns
            .filter(col => col !== 'order_id')
            .map(col => `"${col}" = EXCLUDED."${col}"`)
            .join(', ')

          const sql = `INSERT INTO "SosData" (${columns.map(c => `"${c}"`).join(',')}) VALUES ${placeholders} ON CONFLICT ("order_id") DO UPDATE SET ${setClause};`

          await prisma.$executeRawUnsafe(sql, ...values)
          insertedCount = buffer.length
        } else if (mode === 'digital') {
          // Raw upsert into digital_products (single round trip)
          const columns = [
            'order_number','product_name','customer_name','po_name','witel','branch','revenue','amount','status','milestone','segment','category','sub_type','order_date','batch_id','created_at','updated_at'
          ]

          // Deduplicate within batch by order_number to avoid ON CONFLICT double-hit
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
              row.order_number,
              row.product_name,
              row.customer_name,
              row.po_name,
              row.witel,
              row.branch,
              row.revenue,
              row.amount,
              row.status,
              row.milestone,
              row.segment,
              row.category,
              row.sub_type,
              row.order_date,
              row.batch_id,
              row.created_at,
              row.updated_at
            )
            const params = columns.map((_, colIdx) => `$${base + colIdx + 1}`)
            return `(${params.join(',')})`
          }).join(',')

          const setClause = columns
            .filter(col => col !== 'order_number')
            .map(col => `"${col}" = EXCLUDED."${col}"`)
            .join(', ')

          const sql = `INSERT INTO "digital_products" (${columns.map(c => `"${c}"`).join(',')}) VALUES ${placeholders} ON CONFLICT ("order_number") DO UPDATE SET ${setClause};`

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
        
        const successMsg = `✅ Batch ${batchCounter}: Inserted ${insertedCount} ${label} rows`
        console.log(successMsg)
        progressLogs.push({ batch: batchCounter, type: label, inserted: insertedCount, status: 'success', timestamp: new Date() })
        
        buffer.length = 0 // Clear buffer
        return insertedCount
      } catch (err) {
        batchCounter++
        const errorMsg = `❌ Batch ${batchCounter}: Error inserting ${label} - ${err.message}`
        console.error(errorMsg)
        progressLogs.push({ batch: batchCounter, type: label, error: err.message, status: 'failed', timestamp: new Date() })
        buffer.length = 0 // Clear buffer anyway to prevent data corruption
        return 0
      }
    }

    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const keyMap = buildKeyMap(record)
      
      // DEBUG: Log keyMap for first row only
      if (i === 0) {
        console.log('🔍 DEBUG - Sample keyMap:', Object.keys(keyMap).slice(0, 15))
        console.log('🔍 DEBUG - Looking for orderid in keyMap:', keyMap['orderid'])
        console.log('🔍 DEBUG - Test getValue for Order Id:', getValue(record, keyMap, 'order id', 'orderid'))
      }
      
      try {
        // Unified digital_products intake for dashboard/reports
        if (type === 'digital_product') {
          const now = new Date()
          const orderNumber = getValue(record, keyMap, 'order_number', 'order number', 'orderid', 'order_id', 'no_order', 'order') || `AUTO-${Date.now()}-${i}`
          const productName = getValue(record, keyMap, 'product_name', 'product', 'productname', 'li_product_name') || 'DIGITAL_PRODUCT'
          const customerName = getValue(record, keyMap, 'customer_name', 'customername', 'standard_name', 'standardname', 'customer')
          const poName = getValue(record, keyMap, 'po_name', 'poname', 'po')
          const witelVal = getValue(record, keyMap, 'witel', 'nama witel', 'namawitel', 'cust_witel', 'bill_witel')
          const branchVal = getValue(record, keyMap, 'branch', 'datel', 'cust_city', 'sto')
          const revenueVal = cleanNumber(getValue(record, keyMap, 'revenue', 'rev', 'net price', 'netprice'))
          const amountVal = cleanNumber(getValue(record, keyMap, 'amount', 'qty', 'quantity', 'jumlah')) || 0
          const statusVal = getValue(record, keyMap, 'status', 'status_resume', 'order_status', 'li_status') || 'progress'
          const milestoneVal = getValue(record, keyMap, 'milestone', 'li_milestone', 'status_detail')
          const segmentVal = getValue(record, keyMap, 'segment', 'segmen', 'segmen_n')
          const categoryVal = getValue(record, keyMap, 'category', 'kategori')
          const subTypeVal = getValue(record, keyMap, 'sub_type', 'subtype', 'order_subtype', 'ordersubtype')
          const orderDateVal = cleanDate(getValue(record, keyMap, 'order_date', 'order_created_date', 'created_date', 'date'))

          digitalBuffer.push({
            order_number: orderNumber.toString(),
            product_name: productName,
            customer_name: customerName || null,
            po_name: poName || null,
            witel: witelVal || null,
            branch: branchVal || null,
            revenue: revenueVal || 0,
            amount: amountVal || 0,
            status: statusVal,
            milestone: milestoneVal || null,
            segment: segmentVal || null,
            category: categoryVal || null,
            sub_type: subTypeVal || null,
            order_date: cleanDate(getValue(record, keyMap, 'order_date', 'order_created_date', 'created_date', 'date'), dateFormat),
            batch_id: currentBatchId,
            created_at: now,
            updated_at: now
          })

          if (digitalBuffer.length >= BATCH_SIZE) {
            const count = await flushBuffer(digitalBuffer, null, 'DIGITAL', 'digital')
            successCount += count
          }

          continue
        }

        if (type === 'sos') {
          // Prepare SOS data for batch insert
          const orderId = getValue(
            record,
            keyMap,
            'order_id',
            'orderid',
            'order id',
            'product + order id',
            'productorderid',
            'product_order_id',
            'no_order',
            'order'
          )
          if (!orderId) {
            if (i < 5) console.log('⚠️  Row skipped - Missing order_id')
            failedCount++
            errors.push({ row: record, error: 'Missing order_id' })
            continue
          }

          sosBuffer.push({
            orderId: orderId.toString(),
            nipnas: getValue(record, keyMap, 'nipnas'),
            standardName: getValue(record, keyMap, 'standard_name', 'standardname'),
            orderSubtype: getValue(record, keyMap, 'order_subtype', 'ordersubtype', 'order subtype'),
            orderDescription: getValue(record, keyMap, 'order_description', 'orderdescription', 'produk details', 'productdetails'),
            segmen: getValue(record, keyMap, 'segmen', 'segmen_n'),
            subSegmen: getValue(record, keyMap, 'sub_segmen', 'subsegmen'),
            custCity: getValue(record, keyMap, 'cust_city', 'custcity', 'sto'),
            custWitel: getValue(record, keyMap, 'cust_witel', 'custwitel', 'nama witel', 'namawitel'),
            billWitel: getValue(record, keyMap, 'bill_witel', 'billwitel', 'witel', 'nama witel'),
            liProductName: getValue(record, keyMap, 'li_product_name', 'liproductname', 'nama produk', 'product name', 'product', 'productname'),
            liMilestone: getValue(record, keyMap, 'li_milestone', 'limilestone', 'milestone', 'order status', 'orderstatus'),
            liStatus: getValue(record, keyMap, 'li_status', 'listatus', 'order_status_n', 'order status', 'orderstatus'),
            kategori: getValue(record, keyMap, 'kategori'),
            revenue: cleanNumber(getValue(record, keyMap, 'revenue', 'rev', 'net price', 'netprice')),
            biayaPasang: cleanNumber(getValue(record, keyMap, 'biaya_pasang', 'biayapasang')),
            hrgBulanan: cleanNumber(getValue(record, keyMap, 'hrg_bulanan', 'hrgbulanan')),
            orderCreatedDate: cleanDate(getValue(record, keyMap, 'order_created_date', 'ordercreateddate', 'order date', 'orderdate', 'created date', 'createddate', 'date'), dateFormat),
            batchId: currentBatchId
          })

          // Process batch when buffer reaches BATCH_SIZE
          if (sosBuffer.length >= BATCH_SIZE) {
            const count = await flushBuffer(sosBuffer, prisma.sosData, 'SOS', 'upsert')
            successCount += count
          }
        } else if (type === 'hsi') {
          // Prepare HSI data for batch insert with all available fields
          // Gunakan cleanDate yang sudah di-update dengan logic swap date
          const parseDate = (dateVal) => cleanDate(dateVal, dateFormat)
          const parseDecimal = (val) => val ? parseFloat(val) : 0

          const orderId = String(getValue(record, keyMap, 'order_id', 'orderid', 'order id', 'no_order') || '')
          const nomor = String(getValue(record, keyMap, 'nomor') || '')
          const witelRaw = getValue(record, keyMap, 'witel', 'nama witel', 'namawitel')
          const witel = witelRaw ? witelRaw.toString().toUpperCase().trim() : null
          const datel = getValue(record, keyMap, 'datel')

          // Filter Witel (Porting dari HsiDataImport.php)
          if (!witel || !ALLOWED_WITELS.includes(witel)) {
            continue // Skip baris ini jika witel tidak diizinkan
          }

          const customerName = getValue(record, keyMap, 'customer_name', 'customername')
          const statusResume = getValue(record, keyMap, 'status_resume', 'statusresume')
          const provider = getValue(record, keyMap, 'provider')
          
          // Extended field mapping
          const regional = String(getValue(record, keyMap, 'regional') || '')
          const regionalOld = String(getValue(record, keyMap, 'regional_old', 'regionalold') || '')
          const witelOld = getValue(record, keyMap, 'witel_old', 'witelold')
          const sto = getValue(record, keyMap, 'sto')
          const unit = getValue(record, keyMap, 'unit')
          const jenisPsb = getValue(record, keyMap, 'jenis_psb', 'jenispsb', 'jenis psb')
          const typeTrans = getValue(record, keyMap, 'type_trans', 'typetrans', 'type trans')
          const typeLayanan = getValue(record, keyMap, 'type_layanan', 'typelayanan', 'type layanan')
          const orderDate = parseDate(getValue(record, keyMap, 'order_date', 'orderdate'))
          const lastUpdatedDate = parseDate(getValue(record, keyMap, 'last_updated_date', 'lastupdateddate'))
          const ncli = String(getValue(record, keyMap, 'ncli') || '')
          const pots = String(getValue(record, keyMap, 'pots') || '')
          const speedy = getValue(record, keyMap, 'speedy')
          const locId = getValue(record, keyMap, 'loc_id', 'locid')
          const wonum = getValue(record, keyMap, 'wonum')
          const flagDeposit = getValue(record, keyMap, 'flag_deposit', 'flagdeposit')
          const contactHp = getValue(record, keyMap, 'contact_hp', 'contacthp', 'kontak hp')
          const insAddress = getValue(record, keyMap, 'ins_address', 'insaddress', 'alamat instalasi')
          const gpsLongitude = String(getValue(record, keyMap, 'gps_longitude', 'gpslongitude') || '')
          const gpsLatitude = String(getValue(record, keyMap, 'gps_latitude', 'gpslatitude') || '')
          const kcontact = getValue(record, keyMap, 'kcontact')
          const channel = getValue(record, keyMap, 'channel', 'saluran')
          const statusInet = getValue(record, keyMap, 'status_inet', 'statusiinet')
          const statusOnu = getValue(record, keyMap, 'status_onu', 'statusonu')
          const upload = getValue(record, keyMap, 'upload', 'upload_speed')
          const download = getValue(record, keyMap, 'download', 'download_speed')
          const lastProgram = getValue(record, keyMap, 'last_program', 'lastprogram')
          const statusVoice = getValue(record, keyMap, 'status_voice', 'statusvoice')
          const clid = getValue(record, keyMap, 'clid')
          const lastStart = getValue(record, keyMap, 'last_start', 'laststart')
          const tindakLanjut = getValue(record, keyMap, 'tindak_lanjut', 'tindaklanjut')
          const isiComment = String(getValue(record, keyMap, 'isi_comment', 'isicomment') || '')
          const userIdTl = getValue(record, keyMap, 'user_id_tl', 'useridtl')
          const tglComment = parseDate(getValue(record, keyMap, 'tgl_comment', 'tglcomment'))
          const tanggalManja = parseDate(getValue(record, keyMap, 'tanggal_manja', 'tanggalmanja'))
          const kelompokKendala = getValue(record, keyMap, 'kelompok_kendala', 'kelompok kendala')
          const kelompokStatus = getValue(record, keyMap, 'kelompok_status', 'kelompok status')
          const hero = getValue(record, keyMap, 'hero')
          const addon = getValue(record, keyMap, 'addon')
          const tglPs = parseDate(getValue(record, keyMap, 'tgl_ps', 'tglps'))

          hsiBuffer.push({
            orderId: orderId || `order_${Date.now()}_${i}`,
            nomor: nomor,
            witel: witel,
            regional: regional,
            regionalOld: regionalOld,
            witelOld: witelOld,
            datel: datel,
            sto: sto,
            unit: unit,
            jenisPsb: jenisPsb,
            typeTrans: typeTrans,
            typeLayanan: typeLayanan,
            statusResume: statusResume,
            provider: provider,
            orderDate: orderDate,
            lastUpdatedDate: lastUpdatedDate,
            ncli: ncli,
            pots: pots,
            speedy: speedy,
            customerName: customerName,
            locId: locId,
            wonum: wonum,
            flagDeposit: flagDeposit,
            contactHp: contactHp,
            insAddress: insAddress,
            gpsLongitude: gpsLongitude,
            gpsLatitude: gpsLatitude,
            kcontact: kcontact,
            channel: channel,
            statusInet: statusInet,
            statusOnu: statusOnu,
            upload: upload,
            download: download,
            lastProgram: lastProgram,
            statusVoice: statusVoice,
            clid: clid,
            lastStart: lastStart,
            tindakLanjut: tindakLanjut,
            isiComment: isiComment,
            userIdTl: userIdTl,
            tglComment: tglComment,
            tanggalManja: tanggalManja,
            kelompokKendala: kelompokKendala,
            kelompokStatus: kelompokStatus,
            hero: hero,
            addon: addon,
            tglPs: tglPs
          })

          if (hsiBuffer.length >= BATCH_SIZE) {
            const count = await flushBuffer(hsiBuffer, prisma.hsiData, 'HSI')
            successCount += count
          }
        } else if (type === 'jt' || type === 'tambahan') {
          // Prepare SPMK MOM for JT data
          const noNdeSpmk = getValue(record, keyMap, 'no_nde_spmk', 'nondeSpmk')
          const witelBaru = getValue(record, keyMap, 'witel_baru', 'witelbaru')
          const revenuePlan = cleanNumber(getValue(record, keyMap, 'revenue_plan', 'revenueplan'))

          jtBuffer.push({
            noNdeSpmk: noNdeSpmk || `nd_${Date.now()}_${i}`,
            witelBaru: witelBaru,
            statusProyek: 'JT',
            revenuePlan: revenuePlan || 0,
            batchId: currentBatchId,
            poName: getValue(record, keyMap, 'po_name', 'poname'),
            segmen: getValue(record, keyMap, 'segmen', 'segmen_n')
          })

          if (jtBuffer.length >= BATCH_SIZE) {
            const count = await flushBuffer(jtBuffer, prisma.spmkMom, 'JT')
            successCount += count
          }
        } else if (type === 'datin') {
          // Prepare SPMK MOM for DATIN data
          const noNdeSpmk = getValue(record, keyMap, 'no_nde_spmk', 'nondeSpmk')
          const witelBaru = getValue(record, keyMap, 'witel_baru', 'witelbaru')
          const revenuePlan = cleanNumber(getValue(record, keyMap, 'revenue_plan', 'revenueplan'))

          datinBuffer.push({
            noNdeSpmk: noNdeSpmk || `nd_${Date.now()}_${i}`,
            witelBaru: witelBaru,
            statusProyek: 'DATIN',
            revenuePlan: revenuePlan || 0,
            batchId: currentBatchId,
            poName: getValue(record, keyMap, 'po_name', 'poname'),
            segmen: getValue(record, keyMap, 'segmen', 'segmen_n')
          })

          if (datinBuffer.length >= BATCH_SIZE) {
            const count = await flushBuffer(datinBuffer, prisma.spmkMom, 'DATIN')
            successCount += count
          }
        }
      } catch (err) {
        if (failedCount < 5) {
          console.error(`❌ ERROR on row ${i + 1}:`, err.message)
          console.error('   Data:', JSON.stringify(record).substring(0, 200))
        }
        failedCount++
        errors.push({ row: record, error: err.message })
      }
    }

    // Flush remaining data in all buffers
    console.log('📤 Flushing remaining buffers...')
    successCount += await flushBuffer(sosBuffer, prisma.sosData, 'SOS (final)', 'upsert')
    successCount += await flushBuffer(hsiBuffer, prisma.hsiData, 'HSI (final)')
    successCount += await flushBuffer(jtBuffer, prisma.spmkMom, 'JT (final)')
    successCount += await flushBuffer(datinBuffer, prisma.spmkMom, 'DATIN (final)')
    successCount += await flushBuffer(digitalBuffer, null, 'DIGITAL (final)', 'digital')

    console.log(`✅ Import complete: ${successCount} success, ${failedCount} failed`)

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
        batchId: currentBatchId,
        totalBatches: batchCounter,
        progressLogs: progressLogs,
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

// ---------------------------------------------------------
// NEW FUNCTION ADDED HERE TO FIX THE CRASH
// ---------------------------------------------------------
export const getImportLogs = async (req, res, next) => {
  try {
    // Karena kita tidak punya tabel khusus logs, kita akan mengambil
    // data batch (kelompok upload) dari tabel sosData dan spmkMom
    // sebagai representasi riwayat import.

    // 1. Ambil Batch dari SOS Data
    const sosBatches = await prisma.sosData.groupBy({
      by: ['batchId', 'createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // 2. Ambil Batch dari SPMK MOM
    const spmkBatches = await prisma.spmkMom.groupBy({
      by: ['batchId', 'createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // 3. Ambil Batch dari Digital Product
    const digitalBatches = await prisma.digitalProduct.groupBy({
      by: ['batchId', 'createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // 4. Format data agar seragam
    const formattedSos = sosBatches
      .filter(b => b.batchId) // Hanya yang punya batchId
      .map(batch => ({
        batchId: batch.batchId,
        importDate: batch.createdAt,
        recordCount: batch._count.id,
        type: 'SOS Data / Analysis'
      }))

    const formattedSpmk = spmkBatches
      .filter(b => b.batchId)
      .map(batch => ({
        batchId: batch.batchId,
        importDate: batch.createdAt,
        recordCount: batch._count.id,
        type: 'SPMK (JT/Datin)'
      }))

    const formattedDigital = digitalBatches
      .filter(b => b.batchId)
      .map(batch => ({
        batchId: batch.batchId,
        importDate: batch.createdAt,
        recordCount: batch._count.id,
        type: 'Digital Product'
      }))

    // 5. Gabungkan dan urutkan berdasarkan tanggal terbaru
    const allLogs = [...formattedSos, ...formattedSpmk, ...formattedDigital].sort((a, b) => {
      return new Date(b.importDate) - new Date(a.importDate)
    })

    successResponse(res, allLogs, 'Import logs retrieved successfully')
  } catch (error) {
    next(error)
  }
}