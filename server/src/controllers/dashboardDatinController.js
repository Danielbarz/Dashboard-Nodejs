import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'

// ====== DATIN: MAPPINGS (PRESERVED) ======
const REGION_MAPPING = {
  'BALI': ['BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG'],
  'JATIM BARAT': ['JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],
  'JATIM TIMUR': ['JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO', 'INNER - JATIM TIMUR'],
  'NUSA TENGGARA': ['NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA', 'INNER - NUSA TENGGARA'],
  'SURAMADU': ['SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES']
}

const generateRegionCase = (column) => {
  let sql = '(CASE '
  Object.entries(REGION_MAPPING).forEach(([region, cities]) => {
    const list = cities.map(c => `'${c}'`).join(',')
    sql += `WHEN COALESCE(TRIM(UPPER(${column})), '') IN (${list}) THEN '${region}' `
  })
  sql += "ELSE 'OTHER' END)"
  return sql
}

const WITEL_COL_SOURCE = "COALESCE(TRIM(UPPER(witel_baru)), TRIM(UPPER(bill_witel)))"
const WITEL_EXPR = generateRegionCase(WITEL_COL_SOURCE)
const RAW_BRANCH = "COALESCE(TRIM(UPPER(bill_city)), 'UNKNOWN')"
const WITEL_ORDER = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'NUSA TENGGARA']
const STATUS_COL = "COALESCE(UPPER(kategori), 'UNKNOWN')"
const SEGMENT_EXPR = "COALESCE(TRIM(UPPER(segmen)), TRIM(UPPER(segmen_baru)), 'UNKNOWN')"
const CATEGORY_EXPR = "COALESCE(TRIM(UPPER(kategori)), TRIM(UPPER(kategori_baru)), 'UNKNOWN')"

export const getSOSDatinDashboard = async (req, res, next) => {
  try {
    const { start_date, end_date, witels, segments, categories } = req.query
    const witelList = witels ? witels.split(',').filter(Boolean) : []
    const isSingleWitel = witelList.length === 1

    let conditions = ["order_created_date >= '2000-01-01'"]
    const params = []
    let pIdx = 1

    if (start_date && end_date) {
      conditions.push(`order_created_date BETWEEN $${pIdx} AND $${pIdx + 1}`)
      params.push(new Date(start_date), new Date(new Date(end_date).setHours(23, 59, 59, 999))); pIdx += 2
    }
    if (witels) {
      const arr = witels.split(',').filter(Boolean).map(w => w.trim().toUpperCase())
      if (arr.length > 0) { conditions.push(`${WITEL_EXPR} IN (${arr.map(() => `$${pIdx++}`).join(',')})`); params.push(...arr); }
    }
    if (segments) {
      const arr = segments.split(',').filter(Boolean).map(s => s.trim().toUpperCase())
      if (arr.length > 0) { conditions.push(`${SEGMENT_EXPR} IN (${arr.map(() => `$${pIdx++}`).join(',')})`); params.push(...arr); }
    }
    if (categories) {
      const arr = categories.split(',').filter(Boolean).map(c => c.trim().toUpperCase())
      if (arr.length > 0) { conditions.push(`${CATEGORY_EXPR} IN (${arr.map(() => `$${pIdx++}`).join(',')})`); params.push(...arr); }
    }

    const whereSql = `WHERE ${conditions.join(' AND ')}`
    const GROUP_COL = isSingleWitel ? RAW_BRANCH : WITEL_EXPR
    const ORDER_CLAUSE = isSingleWitel ? `${GROUP_COL} ASC` : `CASE ${WITEL_ORDER.map((w, idx) => `WHEN ${WITEL_EXPR} = '${w}' THEN ${idx + 1}`).join(' ')} ELSE 99 END`

    const [kpiData, orderByStatus, revenueByStatusAge, statusPerWitel, revenueTrend, revenuePerWitel, orderPerWitel, revenuePerProduct, targetData] = await Promise.all([
      prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as total_order, SUM(CASE WHEN ${STATUS_COL} = 'READY TO BILL' THEN COALESCE(revenue,0) ELSE 0 END) as realized_revenue, SUM(CASE WHEN ${STATUS_COL} != 'READY TO BILL' THEN COALESCE(revenue,0) ELSE 0 END) as pipeline_revenue FROM sos_data ${whereSql}`, ...params),
      prisma.$queryRawUnsafe(`SELECT ${STATUS_COL} as name, COUNT(*)::int as value FROM sos_data ${whereSql} GROUP BY 1 ORDER BY value DESC`, ...params),
      prisma.$queryRawUnsafe(`SELECT ${STATUS_COL} as name, SUM(CASE WHEN kategori_umur = '< 3 BLN' THEN COALESCE(revenue,0) ELSE 0 END) as revenue_lt_3, SUM(CASE WHEN kategori_umur = '> 3 BLN' THEN COALESCE(revenue,0) ELSE 0 END) as revenue_gt_3 FROM sos_data ${whereSql} GROUP BY 1`, ...params),
      prisma.$queryRawUnsafe(`SELECT ${GROUP_COL} as witel, ${STATUS_COL} as status, COUNT(*)::int as count FROM sos_data ${whereSql} GROUP BY 1, 2 ORDER BY ${ORDER_CLAUSE}`, ...params),
      prisma.$queryRawUnsafe(`SELECT TO_CHAR(order_created_date, 'YYYY-MM') as month, ${STATUS_COL} as status, SUM(COALESCE(revenue,0)) as revenue FROM sos_data ${whereSql} GROUP BY month, ${STATUS_COL} ORDER BY month ASC`, ...params),
      prisma.$queryRawUnsafe(`SELECT ${GROUP_COL} as witel, ${STATUS_COL} as status, SUM(COALESCE(revenue,0)) as revenue FROM sos_data ${whereSql} GROUP BY 1, 2 ORDER BY ${ORDER_CLAUSE}`, ...params),
      prisma.$queryRawUnsafe(`SELECT ${isSingleWitel ? "COALESCE(li_product_name, 'UNKNOWN')" : WITEL_EXPR} as name, COUNT(*)::int as value FROM sos_data ${whereSql} GROUP BY 1 ORDER BY value DESC`, ...params),
      prisma.$queryRawUnsafe(`SELECT li_product_name as name, SUM(COALESCE(revenue,0)) as value FROM sos_data ${whereSql} AND li_product_name IS NOT NULL GROUP BY 1 ORDER BY value DESC LIMIT 10`, ...params),
      // SAFE TARGET FETCH - FIXED: Added dashboardType filter
      prisma.target.findMany({ 
        where: { 
          periodDate: { gte: new Date('2020-01-01') },
          dashboardType: 'DATIN'
        } 
      }).catch(() => []) 
    ])

    const transform = (data, groupKey, stackKey, valueKey, defaults = []) => {
      const grouped = {}; defaults.forEach(g => { grouped[g] = { name: g } })
      data.forEach(row => {
        const g = row[groupKey]; if (!g || g === 'OTHER') return
        if (!grouped[g]) grouped[g] = { name: g }
        grouped[g][row[stackKey]] = Number(row[valueKey] || 0)
      })
      return defaults.length > 0 ? defaults.map(g => grouped[g] || { name: g }) : Object.values(grouped)
    }

    // Target Logic
    const calculateMonthlyTarget = (target, monthStr) => {
       const tDate = dayjs(target.periodDate); const tYear = tDate.year(); const tMonthStr = tDate.format('YYYY-MM');
       const [qYear, qMonth] = monthStr.split('-').map(Number);
       if (target.periodType === 'TAHUNAN') { if (tYear === qYear) return Number(target.value) / 12 }
       else if (target.periodType === 'KUARTAL') { const tQ = Math.floor((tDate.month() + 3) / 3); const qQ = Math.floor((qMonth + 2) / 3); if (tYear === qYear && tQ === qQ) return Number(target.value) / 3 }
       else { if (tMonthStr === monthStr) return Number(target.value) }
       return 0
    }

    const sumTargets = (filters) => {
        const targetTypeFilter = filters.targetType || 'REVENUE'
        const months = []; let curr = dayjs(start_date || '2020-01-01'); const end = dayjs(end_date || new Date());
        if (filters.month) months.push(filters.month);
        else { while (curr.isBefore(end) || curr.isSame(end, 'month')) { months.push(curr.format('YYYY-MM')); curr = curr.add(1, 'month'); } }
        let total = 0;
        months.forEach(m => { total += targetData.reduce((sum, t) => {
            if (t.targetType !== targetTypeFilter) return sum
            if (filters.witel && t.witel !== 'ALL' && t.witel !== filters.witel) return sum
            return sum + calculateMonthlyTarget(t, m)
        }, 0) });
        return total > 0 ? total : null
    }

    const section2 = {
        orderByStatus: orderByStatus.map(r => ({ name: r.name, value: Number(r.value) })),
        revenueByStatus: revenueByStatusAge.map(r => ({ name: r.name, '< 3 Bulan': Number(r.revenue_lt_3 || 0), '> 3 Bulan': Number(r.revenue_gt_3 || 0) })),
        statusPerWitel: transform(statusPerWitel, 'witel', 'status', 'count', isSingleWitel ? [] : WITEL_ORDER)
    }

    const section3 = {
        revenueTrend: transform(revenueTrend, 'month', 'status', 'revenue').sort((a,b) => a.name.localeCompare(b.name)),
        revenuePerWitel: transform(revenuePerWitel, 'witel', 'status', 'revenue', isSingleWitel ? [] : WITEL_ORDER),
        orderPerWitel: orderPerWitel.map(r => ({ name: r.name, value: Number(r.value) })),
        revenuePerProduct: revenuePerProduct.map(r => ({ name: r.name, value: Number(r.value) }))
    }

    // Attach Targets
    section3.revenueTrend.forEach(i => i.target = sumTargets({ month: i.name, targetType: 'REVENUE' }))
    section3.revenuePerWitel.forEach(i => i.target = sumTargets({ witel: i.name, targetType: 'REVENUE' }))
    section3.orderPerWitel.forEach(i => i.target = sumTargets({ witel: i.name, targetType: 'ORDER' }))

    const kpiRevT = sumTargets({ targetType: 'REVENUE' }) || 0
    const kpiOrdT = sumTargets({ targetType: 'ORDER' }) || 0

    // IMPORTANT: Matching structure for the Frontend you pasted
    successResponse(res, {
      kpi: { 
        realizedRevenue: Number(kpiData[0]?.realized_revenue || 0),
        pipelineRevenue: Number(kpiData[0]?.pipeline_revenue || 0),
        totalOrder: Number(kpiData[0]?.total_order || 0),
        revTarget: kpiRevT, revAchievement: kpiRevT > 0 ? ((Number(kpiData[0]?.realized_revenue || 0)/kpiRevT)*100).toFixed(1) : 0,
        orderTarget: kpiOrdT, orderAchievement: kpiOrdT > 0 ? ((Number(kpiData[0]?.total_order || 0)/kpiOrdT)*100).toFixed(1) : 0
      },
      section2,
      section3
    })
  } catch (error) { next(error) }
}

export const getSOSDatinFilters = async (req, res, next) => {
  try {
    const [segments, categories] = await Promise.all([
      prisma.sosData.findMany({ distinct: ['segmen'], select: { segmen: true } }),
      prisma.sosData.findMany({ distinct: ['kategori'], select: { kategori: true } })
    ])
    successResponse(res, { witels: WITEL_ORDER, segments: segments.map(i => i.segmen).filter(Boolean).sort(), categories: categories.map(i => i.kategori).filter(Boolean).sort() })
  } catch (error) { next(error) }
}

export const getReportDatin = async (req, res, next) => {
  try {
    const { start_date, end_date, witel } = req.query
    let conditions = ["order_created_date >= '2000-01-01'"]
    const params = []
    let pIdx = 1
    if (start_date && end_date) { conditions.push(`order_created_date BETWEEN $${pIdx} AND $${pIdx + 1}`); params.push(new Date(start_date), new Date(end_date)); pIdx += 2; }
    const tableDataRaw = await prisma.$queryRawUnsafe(`SELECT ${WITEL_EXPR} as witel, COUNT(*)::int as jumlah_order, SUM(COALESCE(revenue, 0)) as total_revenue, SUM(CASE WHEN UPPER(kategori) = 'READY TO BILL' THEN COALESCE(revenue, 0) ELSE 0 END) as realized_revenue, SUM(CASE WHEN UPPER(kategori) != 'READY TO BILL' THEN COALESCE(revenue, 0) ELSE 0 END) as pipeline_revenue FROM sos_data WHERE ${conditions.join(' AND ')} GROUP BY 1 ORDER BY total_revenue DESC`, ...params)
    successResponse(res, { tableData: tableDataRaw.map(r => ({ witel: r.witel, branch: r.witel, totalAmount: Number(r.total_revenue || 0), jumlahProject: r.jumlah_order, selesai: Math.round(Number(r.realized_revenue || 0)), progress: Math.round(Number(r.pipeline_revenue || 0)) })), posisiGalaksi: [] })
  } catch (error) { next(error) }
}

export const exportReportDatin = async (req, res, next) => { successResponse(res, { message: 'Ready' }) }
