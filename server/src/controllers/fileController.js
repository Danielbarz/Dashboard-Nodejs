import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { unlink } from 'fs/promises'
import path from 'path'
// import { fileImportQueue } from '../queues/index.js'
// import { Redis } from 'ioredis'
// import config from '../config/index.js'

// Redis disabled until queue system activated
// const redis = new Redis({
//   host: config.redis.host,
//   port: config.redis.port,
//   password: config.redis.password
// })

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
const cleanDate = (value) => {
  if (!value) return null
  
  // Handle Excel serial dates (numbers)
  if (typeof value === 'number') {
    // Excel base date is Dec 30, 1899
    const date = new Date((value - 25569) * 86400 * 1000)
    return isNaN(date.getTime()) ? null : date
  }

  // Handle string dates
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

// Upload Excel/CSV file
export const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    let type = (req.query.type || 'sos').toString().toLowerCase()

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
        if (['digital_product', 'hsi', 'jt', 'datin'].includes(type)) {
          const now = new Date()
          const orderNumber = getValue(record, keyMap, 'order_number', 'order number', 'orderid', 'order_id', 'no_order', 'order') || `AUTO-${Date.now()}-${i}`
          const productName = type === 'digital_product'
            ? (getValue(record, keyMap, 'product_name', 'product', 'productname', 'li_product_name') || 'DIGITAL_PRODUCT')
            : type.toUpperCase()
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
            order_date: orderDateVal || null,
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
            orderCreatedDate: cleanDate(getValue(record, keyMap, 'order_created_date', 'ordercreateddate', 'order date', 'orderdate', 'created date', 'createddate', 'date')),
            batchId: currentBatchId
          })

          // Process batch when buffer reaches BATCH_SIZE
          if (sosBuffer.length >= BATCH_SIZE) {
            const count = await flushBuffer(sosBuffer, prisma.sosData, 'SOS', 'upsert')
            successCount += count
          }
        } else if (type === 'hsi') {
          // Prepare HSI data for batch insert
          const orderId = getValue(record, keyMap, 'order_id', 'orderid', 'order id', 'no_order')
          const nomor = getValue(record, keyMap, 'nomor')
          const witel = getValue(record, keyMap, 'witel', 'nama witel', 'namawitel')
          const datel = getValue(record, keyMap, 'datel')
          const customerName = getValue(record, keyMap, 'customer_name', 'customername')
          const statusResume = getValue(record, keyMap, 'status_resume', 'statusresume')
          const provider = getValue(record, keyMap, 'provider')

          hsiBuffer.push({
            orderId: orderId || `order_${Date.now()}_${i}`,
            nomor: nomor,
            witel: witel,
            datel: datel,
            customerName: customerName,
            statusResume: statusResume,
            provider: provider,
            batchId: currentBatchId
          })

          if (hsiBuffer.length >= BATCH_SIZE) {
            const count = await flushBuffer(hsiBuffer, prisma.hsiData, 'HSI')
            successCount += count
          }
        } else if (type === 'jt' || type === 'tambahan') {
          // Prepare SPMK MOM for JT data
          const noNdeSpmk = getValue(record, keyMap, 'no_nde_spmk', 'nondeSpmk', 'no_nde', 'nde')
          const witelBaru = getValue(record, keyMap, 'witel_baru', 'witelbaru', 'witel', 'nama_witel')
          const revenuePlan = cleanNumber(getValue(record, keyMap, 'revenue_plan', 'revenueplan', 'revenue', 'rev_all'))

          const goLiveVal = (getValue(record, keyMap, 'go_live', 'golive', 'status_golive') || 'N').toString().toUpperCase().startsWith('Y') ? 'Y' : 'N'
          const populasiNonDropVal = (getValue(record, keyMap, 'populasi_non_drop', 'non_drop') || 'Y').toString().toUpperCase().startsWith('N') ? 'N' : 'Y'

          jtBuffer.push({
            noNdeSpmk: noNdeSpmk || `nd_${Date.now()}_${i}`,
            witelBaru: witelBaru || 'Unknown',
            statusProyek: 'JT',
            revenuePlan: revenuePlan || 0,
            batchId: currentBatchId,
            poName: getValue(record, keyMap, 'po_name', 'poname'),
            segmen: getValue(record, keyMap, 'segmen', 'segmen_n'),
            goLive: goLiveVal,
            populasiNonDrop: populasiNonDropVal,
            baDrop: getValue(record, keyMap, 'ba_drop', 'badrop') || null,
            statusTompsLastActivity: getValue(record, keyMap, 'status_tomps_last_activity', 'status_tomps', 'last_activity'),
            statusTompsNew: getValue(record, keyMap, 'status_tomps_new', 'status_tompsnew'),
            statusIHld: getValue(record, keyMap, 'status_i_hld', 'status_ihld', 'status_ihd'),
            tanggalMom: cleanDate(getValue(record, keyMap, 'tanggal_mom', 'tgl_mom', 'mom_date', 'tanggal')),
            usia: parseInt(getValue(record, keyMap, 'usia', 'age')) || null,
            rab: cleanNumber(getValue(record, keyMap, 'rab')) || null,
            region: getValue(record, keyMap, 'region', 'witel_lama') || null
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