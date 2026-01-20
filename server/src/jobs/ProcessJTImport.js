import prisma from '../lib/prisma.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream, unlinkSync } from 'fs'
import { Redis } from 'ioredis'
import config from '../config/index.js'
import dayjs from 'dayjs'

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
})

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

const parseDate = (val) => {
  if (!val) return null
  if (val instanceof Date) return val
  if (typeof val === 'number') {
    // Excel serial date
    return dayjs('1899-12-30').add(val, 'day').toDate()
  }
  const parsed = dayjs(val)
  return parsed.isValid() ? parsed.toDate() : null
}

const deriveFlags = (statusTompsNew, statusProyek) => {
  const st = (statusTompsNew || '').toUpperCase()
  const sp = (statusProyek || '').toUpperCase()
  const goLive = st.includes('GO LIVE') || sp.includes('GO LIVE') ? 'Y' : 'N'
  const isDrop = st.includes('DROP') || st.includes('BATAL') || sp.includes('BATAL') || sp.includes('CANCEL')
  const populasiNonDrop = isDrop ? 'N' : 'Y'
  return { goLive, populasiNonDrop }
}

export class ProcessJTImport {
  constructor(job) {
    this.job = job
    this.progressKey = `import:progress:${job.id}`
  }

  async handle() {
    const { filePath, fileName, batchId } = this.job.data
    try {
      await this.updateProgress(5, 'Parsing file...')
      console.log(`\n📥 Starting JT import: ${fileName}`)

      const rawRecords = await this.parseFile(filePath, fileName)
      if (!rawRecords || rawRecords.length === 0) throw new Error('File is empty or invalid')

      // --- DEDUPLICATION (Remove Exact Duplicates) ---
      const uniqueSet = new Set()
      const records = rawRecords.filter(record => {
          const sig = JSON.stringify(record) // Simple deduplication for exact rows
          if(uniqueSet.has(sig)) return false
          uniqueSet.add(sig)
          return true
      })
      const duplicatesRemoved = rawRecords.length - records.length
      console.log(`✅ File parsed: ${rawRecords.length} rows found. Deduplicated to ${records.length} (Removed ${duplicatesRemoved})\n`)

      await this.updateProgress(15, `Found ${records.length} unique rows, clearing table...`)

      // OVERLAY STRATEGY FOR JT: REPLACE ALL (Safe default for non-unique tables)
      await prisma.spmkMom.deleteMany({})

      const chunkSize = 100
      let successCount = 0
      let failedCount = 0
      const errors = []
      let batchNum = 1

      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize)
        console.log(`📦 Batch ${batchNum}: Processing ${chunk.length} JT rows`)

        const result = await this.processChunk(chunk, batchId)
        successCount += result.success
        failedCount += result.failed
        errors.push(...result.errors)

        if (failedCount > 0) {
          console.log(`⚠️  Batch ${batchNum}: ${result.failed} rows failed`)
        }

        const progress = 15 + Math.floor((i / records.length) * 80)
        await this.updateProgress(progress, `Processed ${Math.min(i + chunk.length, records.length)}/${records.length} rows`)

        batchNum++
      }

      console.log(`\n📤 Flushing remaining buffers...`)
      try { if (filePath) unlinkSync(filePath) } catch(e) {}
      await this.updateProgress(100, 'JT import completed')

      console.log(`✅ Import complete: ${successCount} success, ${failedCount} failed\n`)

      return {
        success: true,
        totalRows: rawRecords.length,
        uniqueRows: records.length,
        duplicatesRemoved,
        successRows: successCount,
        failedRows: failedCount,
        batchId,
        errors: errors.slice(0, 10)
      }
    } catch (error) {
      console.error(`❌ Import error: ${error.message}\n`)
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
    }
    if (ext === 'csv') {
      return new Promise((resolve, reject) => {
        const results = []
        createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err))
      })
    }
    throw new Error('Unsupported file type')
  }

  async processChunk(chunk, batchId) {
    let success = 0
    let failed = 0
    const errors = []

    for (const record of chunk) {
      try {
        const keyMap = buildKeyMap(record)

        const tanggalMom = parseDate(getValue(record, keyMap, 'tanggalmom', 'tanggal_mom', 'tgl_mom', 'tanggal mom'))
        const usia = tanggalMom ? dayjs().diff(dayjs(tanggalMom), 'day') : null
        const statusTompsNew = getValue(record, keyMap, 'statustompsnew', 'status_tomps_new', 'status tomps new') || ''
        const statusProyek = getValue(record, keyMap, 'statusproyek', 'status_proyek', 'status proyek') || ''
        const { goLive, populasiNonDrop } = deriveFlags(statusTompsNew, statusProyek)

        const usiaFromFile = getValue(record, keyMap, 'usia')
        const goliveFromFile = getValue(record, keyMap, 'golive', 'go live')
        const populasiFromFile = getValue(record, keyMap, 'populasinondrop', 'populasi_non_drop', 'populasi non drop', 'populasi')

        const data = {
          batchId,
          bulan: getValue(record, keyMap, 'bulan'),
          tahun: parseInt(getValue(record, keyMap, 'tahun')) || null,
          region: getValue(record, keyMap, 'region'),
          witelLama: getValue(record, keyMap, 'witellama', 'witel_lama', 'witel lama'),
          witelBaru: getValue(record, keyMap, 'witelbaru', 'witel_baru', 'witel baru'),
          idIHld: getValue(record, keyMap, 'idihld', 'id_i_hld', 'id ihld'),
          noNdeSpmk: getValue(record, keyMap, 'nondespmk', 'no_nde_spmk', 'no nde spmk'),
          uraianKegiatan: getValue(record, keyMap, 'uraiankegiatan', 'uraian_kegiatan', 'uraian kegiatan'),
          segmen: getValue(record, keyMap, 'segmen'),
          poName: getValue(record, keyMap, 'po', 'poname', 'po_name'),
          tanggalGolive: parseDate(getValue(record, keyMap, 'tanggalgoliveddmmyyyy', 'tanggalgolive', 'tanggal_golive', 'tanggal golive')),
          konfirmasiPo: getValue(record, keyMap, 'konfirmasipo', 'konfirmasipodesember', 'konfirmasi_po', 'konfirmasi po'),
          tanggalCb: parseDate(getValue(record, keyMap, 'tanggalcb', 'tanggal_cb', 'tanggal cb')),
          jenisKegiatan: getValue(record, keyMap, 'jeniskegiatan', 'jenis_kegiatan', 'jenis kegiatan'),
          revenuePlan: cleanNumber(getValue(record, keyMap, 'revenueplan', 'revenue_plan', 'revenue plan')),
          statusProyek,
          goLive: goliveFromFile || goLive,
          keteranganToc: getValue(record, keyMap, 'keterangantoc', 'keterangan_toc', 'keterangan toc'),
          perihalNdeSpmk: getValue(record, keyMap, 'perihalndesmk', 'perihal_nde_spmk', 'perihal nde spmk'),
          mom: getValue(record, keyMap, 'mom'),
          baDrop: getValue(record, keyMap, 'badrop', 'ba_drop', 'ba drop'),
          populasiNonDrop: populasiFromFile || populasiNonDrop,
          tanggalMom,
          usia: usiaFromFile ? parseInt(usiaFromFile) : usia,
          rab: cleanNumber(getValue(record, keyMap, 'rab')),
          totalPort: getValue(record, keyMap, 'totalport', 'total_port', 'total port'),
          templateDurasi: getValue(record, keyMap, 'templatedurasi', 'template_durasi', 'template durasi'),
          toc: getValue(record, keyMap, 'toc'),
          umurPekerjaan: getValue(record, keyMap, 'umurpekerjaan', 'umur_pekerjaan', 'umur pekerjaan'),
          kategoriUmurPekerjaan: getValue(record, keyMap, 'kategoriumumrpekerjaan', 'kategori_umur_pekerjaan', 'kategori umur pekerjaan'),
          statusTompsLastActivity: getValue(record, keyMap, 'statustompslastactivity', 'status_tomps_last_activity', 'status tomps last activity'),
          statusTompsNew,
          statusIHld: getValue(record, keyMap, 'statusihld', 'status_i_hld', 'status i hld', 'status ihld'),
          namaOdpGoLive: getValue(record, keyMap, 'namaodpgolive', 'nama_odp_go_live', 'nama odp go live'),
          bak: getValue(record, keyMap, 'bak'),
          keteranganPelimpahan: getValue(record, keyMap, 'keteranganpelimpahan', 'keterangan_pelimpahan', 'keterangan pelimpahan'),
          mitraLokal: getValue(record, keyMap, 'mitralokal', 'mitra_lokal', 'mitra lokal')
        }

        await prisma.spmkMom.create({ data })
        success += 1
      } catch (err) {
        failed += 1
        errors.push(err.message)
      }
    }

    return { success, failed, errors }
  }

  async updateProgress(percent, message) {
    await redis.set(this.progressKey, JSON.stringify({ progress, message }), 'EX', 60 * 60)
  }
}