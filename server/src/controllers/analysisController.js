import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { listDigitalProducts, getDigitalProductStats, exportDigitalProductsExcel } from '../services/analysisService.js'

export const getDigitalProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, witel, branch, status, start_date, end_date } = req.query
    const result = await listDigitalProducts({
      page: Number(page),
      limit: Number(limit),
      search,
      witel,
      branch,
      status,
      startDate: start_date,
      endDate: end_date
    })

    return successResponse(res, result.data, 'Digital products fetched', 200)
  } catch (err) {
    next(err)
  }
}

export const getDigitalProductStatsHandler = async (req, res, next) => {
  try {
    const { witel, branch, status } = req.query
    const stats = await getDigitalProductStats({ witel, branch, status })
    return successResponse(res, stats, 'Stats fetched', 200)
  } catch (err) {
    next(err)
  }
}

export const exportDigitalProducts = async (req, res, next) => {
  try {
    const { search, witel, branch, status, start_date, end_date } = req.query
    const buffer = await exportDigitalProductsExcel({ 
      search, 
      witel, 
      branch, 
      status,
      startDate: start_date,
      endDate: end_date 
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="digital_products.xlsx"')
    res.status(200).send(buffer)
  } catch (err) {
    next(err)
  }
}

export const getJtProgressStats = async (req, res) => {
  try {
    const { witel, po_name, start_date, end_date } = req.query

    // 1. FILTERING (Step 3 Optional Filter)
    const whereClause = {}

    // Filter Witel (Case Insensitive logic handled by Prisma usually, or precise match)
    if (witel) {
      whereClause.witelBaru = { contains: witel }
    }

    // Filter PO Name
    if (po_name) {
      whereClause.poName = po_name
    }

    // Filter Tanggal (Opsional, jika dashboard butuh range waktu)
    if (start_date && end_date) {
      whereClause.tanggalGolive = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    // 2. GROUPING QUERY (Step 1 Grouping)
    // Kita group berdasarkan 'statusTompsNew' (status order) DAN 'goLive'
    // agar kita punya data mentah yang cukup untuk memutuskan kategori.
    const rawStats = await prisma.reportTambahan.groupBy({
      by: ['statusTompsNew', 'goLive'],
      _count: {
        id: true
      },
      where: whereClause
    })

    // 3. CATEGORIZATION LOGIC (Step 2 Categorization)
    let countGoLive = 0
    let countDrop = 0
    let countBelumGoLive = 0

    // Definisi Keyword Status (Case Insensitive)
    const KEYWORDS_GOLIVE = ['COMPLETED', 'PS', 'CLOSE', 'LIVE', 'GO LIVE']
    const KEYWORDS_DROP = ['CANCEL', 'DROP', 'TERMINATED']

    rawStats.forEach((group) => {
      const statusRaw = group.statusTompsNew ? group.statusTompsNew.toUpperCase() : ''
      const isGoLiveFlag = group.goLive === 'Y' // Cek kolom go_live explicit
      const count = group._count.id

      // LOGIKA PENENTUAN KATEGORI:

      // A. Cek Go Live
      // Kriteria: Kolom goLive = 'Y' ATAU status mengandung kata 'COMPLETED'/'PS'/'CLOSE'
      const isStatusComplete = KEYWORDS_GOLIVE.some(k => statusRaw.includes(k))

      if (isGoLiveFlag || isStatusComplete) {
        countGoLive += count
      }
      // B. Cek Drop
      // Kriteria: Status mengandung kata 'CANCEL'/'DROP'
      else if (KEYWORDS_DROP.some(k => statusRaw.includes(k))) {
        countDrop += count
      }
      // C. Sisanya -> Belum Go Live (On Progress)
      else {
        countBelumGoLive += count
      }
    })

    // 4. RESPONSE FORMATTING (Sesuai Spec JSON)
    const responseData = {
      labels: ["Go Live", "Belum Go Live", "Drop"],
      datasets: [
        {
          label: 'Jumlah Project',
          data: [countGoLive, countBelumGoLive, countDrop],
          backgroundColor: ["#10B981", "#F59E0B", "#EF4444"], // Hijau, Kuning, Merah
          hoverOffset: 4
        }
      ],
      // Data mentah untuk debug/tabel ringkasan kecil
      summary: {
        total: countGoLive + countBelumGoLive + countDrop,
        details: {
          go_live: countGoLive,
          on_progress: countBelumGoLive,
          drop: countDrop
        }
      }
    }

    return successResponse(res, responseData, 'JT Progress stats retrieved successfully')

  } catch (error) {
    console.error('Error Get JT Stats:', error)
    return errorResponse(res, 'Internal Server Error', 500)
  }
}
