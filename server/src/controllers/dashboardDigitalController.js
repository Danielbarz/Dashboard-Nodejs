import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'

// ====== DIGITAL PRODUCT DASHBOARD ======

const normalizedDigitalCTE = (start_date, end_date) => `
  WITH normalized_data AS (
    SELECT
      *,
      CASE
        WHEN UPPER(witel) IN ('BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG') THEN 'BALI'
        WHEN UPPER(witel) IN ('JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG') THEN 'JATIM BARAT'
        WHEN UPPER(witel) IN ('JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO') THEN 'JATIM TIMUR'
        WHEN UPPER(witel) IN ('NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA') THEN 'NUSA TENGGARA'
        WHEN UPPER(witel) IN ('SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES') THEN 'SURAMADU'
        ELSE 'OTHER' 
      END as region_norm,
      CASE
        WHEN product ILIKE '%Netmonk%' THEN 'Netmonk'
        WHEN product ILIKE '%OCA%' OR product ILIKE '%Omni%' THEN 'OCA'
        WHEN product ILIKE '%Pijar%' THEN 'Pijar'
        WHEN product ILIKE '%Antares%' OR product ILIKE '%IOT%' OR product ILIKE '%CCTV%' THEN 'Antares'
        ELSE 'OTHER'
      END as product_norm,
      CASE
        WHEN order_status ILIKE '%complete%' OR order_status ILIKE '%completed%' OR order_status ILIKE '%ps%' OR order_status_n ILIKE '%Complete%' THEN 'COMPLETED'
        WHEN order_status ILIKE '%cancel%' OR order_status ILIKE '%drop%' THEN 'IGNORE'
        ELSE 'IN PROGRESS'
      END as status_group,
      CASE WHEN telda IS NOT NULL AND telda != '' THEN UPPER(telda) ELSE UPPER(witel) END as branch_norm
    FROM digital_products
    WHERE 1=1
    AND COALESCE(order_id, '') NOT ILIKE 'SC%'
    ${start_date && end_date ? `AND order_date >= '${start_date}'::date AND order_date < ('${end_date}'::date + INTERVAL '1 day')` : ""}
  )
`;

export const getDigitalProductDashboard = async (req, res, next) => {
  try {
    const { start_date, end_date, witel, branch, product } = req.query
    const witelList = witel ? witel.split(',').filter(Boolean) : []
    const isSingleWitel = witelList.length === 1
    const WITEL_ORDER = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'NUSA TENGGARA']
    // Simplified Revenue: Use net_price as the cleaned source of truth
    const REVENUE_COL = "COALESCE(net_price, 0)"
    const GROUP_COL = isSingleWitel ? 'branch_norm' : 'region_norm'
    const ORDER_CLAUSE = isSingleWitel ? 'branch_norm ASC' : `CASE ${WITEL_ORDER.map((w, idx) => `WHEN region_norm = '${w}' THEN ${idx + 1}`).join(' ')} ELSE 99 END`

    const cte = normalizedDigitalCTE(start_date, end_date)
    let filter = `WHERE region_norm != 'OTHER' AND product_norm != 'OTHER'`
    if (witel && witel !== 'ALL') filter += ` AND region_norm IN (${witel.split(',').map(w => `'${w.toUpperCase()}'`).join(',')})`
    if (product && product !== 'ALL') filter += ` AND product_norm IN (${product.split(',').map(p => `'${p}'`).join(',')})`

    const [kpiData, orderByStatus, revenueByWitel, orderByWitel, revenueTrend, productShare, orderTrend, targetData] = await Promise.all([
      prisma.$queryRawUnsafe(`${cte} SELECT COUNT(*)::int as total_order, SUM(CASE WHEN status_group = 'COMPLETED' THEN 1 ELSE 0 END)::int as completed_count, SUM(CASE WHEN status_group = 'COMPLETED' THEN ${REVENUE_COL} ELSE 0 END) as total_revenue, SUM(CASE WHEN status_group = 'IN PROGRESS' THEN ${REVENUE_COL} ELSE 0 END) as pipeline_revenue FROM normalized_data ${filter}`),
      prisma.$queryRawUnsafe(`${cte} SELECT status_group as name, COUNT(*)::int as value FROM normalized_data ${filter} GROUP BY 1`),
      prisma.$queryRawUnsafe(`${cte} SELECT ${GROUP_COL} as witel, product_norm as product, SUM(${REVENUE_COL}) as revenue FROM normalized_data ${filter} GROUP BY 1, 2 ORDER BY ${ORDER_CLAUSE}`),
      prisma.$queryRawUnsafe(`${cte} SELECT ${GROUP_COL} as witel, status_group as status, COUNT(*)::int as count FROM normalized_data ${filter} GROUP BY 1, 2 ORDER BY ${ORDER_CLAUSE}`),
      prisma.$queryRawUnsafe(`${cte} SELECT TO_CHAR(order_date, 'YYYY-MM') as month, product_norm as product, SUM(${REVENUE_COL}) as revenue FROM normalized_data ${filter} GROUP BY 1, 2 ORDER BY 1 ASC`),
      prisma.$queryRawUnsafe(`${cte} SELECT product_norm as name, SUM(${REVENUE_COL}) as value FROM normalized_data ${filter} GROUP BY 1 ORDER BY 2 DESC`),
      prisma.$queryRawUnsafe(`${cte} SELECT TO_CHAR(order_date, 'YYYY-MM') as month, product_norm as product, COUNT(*)::int as count FROM normalized_data ${filter} GROUP BY 1, 2 ORDER BY 1 ASC`),
      prisma.target.findMany({ 
        where: { 
          periodDate: { gte: new Date(start_date || '2024-01-01'), lte: new Date(end_date || new Date()) },
          dashboardType: 'DIGITAL'
        } 
      })
    ])

    const transform = (data, groupKey, stackKey, valueKey, defaults = []) => {
      const grouped = {}; defaults.forEach(g => grouped[g] = { name: g })
      data.forEach(row => {
        if (!grouped[row[groupKey]]) grouped[row[groupKey]] = { name: row[groupKey] }
        grouped[row[groupKey]][row[stackKey]] = Number(row[valueKey] || 0)
      })
      return defaults.length > 0 ? defaults.map(g => grouped[g] || { name: g }) : Object.values(grouped)
    }

    const charts = {
      orderByStatus: orderByStatus.map(r => ({ name: r.name, value: Number(r.value) })),
      revenueByWitel: transform(revenueByWitel, 'witel', 'product', 'revenue', isSingleWitel ? [] : WITEL_ORDER),
      orderByWitel: transform(orderByWitel, 'witel', 'status', 'count', isSingleWitel ? [] : WITEL_ORDER),
      revenueTrend: transform(revenueTrend, 'month', 'product', 'revenue'),
      productShare: productShare.map(r => ({ name: r.name, value: Number(r.value) })),
      orderTrend: transform(orderTrend, 'month', 'product', 'count')
    }

    // Helper: Target Calculation (FIXED)
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
        const months = []; let curr = dayjs(start_date || '2024-01-01'); const end = dayjs(end_date || new Date());
        if (filters.month) months.push(filters.month);
        else { while (curr.isBefore(end) || curr.isSame(end, 'month')) { months.push(curr.format('YYYY-MM')); curr = curr.add(1, 'month'); } }
        let total = 0;
        months.forEach(m => { 
          total += targetData.reduce((sum, t) => {
            if (t.targetType !== targetTypeFilter) return sum
            if (filters.witel && t.witel !== 'ALL' && t.witel !== filters.witel) return sum
            if (filters.product && t.product !== 'ALL' && t.product !== filters.product) return sum
            return sum + calculateMonthlyTarget(t, m)
          }, 0) 
        }); return total > 0 ? total : null
    }

    charts.revenueTrend.forEach(i => i.target = sumTargets({ month: i.name, targetType: 'REVENUE' }))
    charts.revenueByWitel.forEach(i => i.target = sumTargets({ witel: i.name, targetType: 'REVENUE' }))
    charts.orderTrend.forEach(i => i.target = sumTargets({ month: i.name, targetType: 'ORDER' }))
    charts.orderByWitel.forEach(i => i.target = sumTargets({ witel: i.name, targetType: 'ORDER' }))

    const kpiRevT = sumTargets({ targetType: 'REVENUE' }) || 0
    const kpiOrdT = sumTargets({ targetType: 'ORDER' }) || 0

    const totalOrder = Number(kpiData[0]?.total_order || 0)
    const completedCount = Number(kpiData[0]?.completed_count || 0)

    successResponse(res, {
      kpi: { 
        totalRevenue: Number(kpiData[0]?.total_revenue || 0), 
        pipelineRevenue: Number(kpiData[0]?.pipeline_revenue || 0), 
        totalOrder: totalOrder, 
        revTarget: kpiRevT, 
        revAchievement: kpiRevT > 0 ? ((Number(kpiData[0]?.total_revenue || 0) / kpiRevT) * 100).toFixed(1) : 0, 
        orderTarget: kpiOrdT, 
        orderAchievement: kpiOrdT > 0 ? ((totalOrder / kpiOrdT) * 100).toFixed(1) : 0,
        completionRate: totalOrder > 0 ? ((completedCount / totalOrder) * 100).toFixed(1) : 0
      },
      charts
    })
  } catch (error) { next(error) }
}

export const getDigitalProductFilters = async (req, res, next) => {
try {
  const branchMap = {
    'BALI': [
      'BALI',
      'DENPASAR',
      'GIANYAR',
      'JEMBRANA',
      'JIMBARAN',
      'KLUNGKUNG',
      'Non-Telda (NCX)',
      'SANUR',
      'SINGARAJA',
      'TABANAN',
      'UBUNG',
      'BADUNG',
      'BULELENG'
    ],
    'JATIM BARAT': [
      'JATIM BARAT',
      'MALANG',
      'BATU',
      'BLITAR',
      'BOJONEGORO',
      'KEDIRI',
      'KEPANJEN',
      'MADIUN',
      'NGANJUK',
      'NGAWI',
      'Non-Telda (NCX)',
      'PONOROGO',
      'TRENGGALEK',
      'TUBAN',
      'TULUNGAGUNG'
    ],
    'JATIM TIMUR': [
      'JATIM TIMUR',
      'SIDOARJO',
      'BANYUWANGI',
      'BONDOWOSO',
      'INNER - JATIM TIMUR',
      'JEMBER',
      'JOMBANG',
      'LUMAJANG',
      'MOJOKERTO',
      'Non-Telda (NCX)',
      'PASURUAN',
      'PROBOLINGGO',
      'SITUBONDO'
    ],
    'NUSA TENGGARA': [
      'NUSA TENGGARA',
      'NTB',
      'NTT',
      'ATAMBUA',
      'BIMA',
      'ENDE',
      'INNER - NUSA TENGGARA',
      'KUPANG',
      'LABOAN BAJO',
      'LOMBOK BARAT TENGAH',
      'LOMBOK TIMUR UTARA',
      'MAUMERE',
      'Non-Telda (NCX)',
      'SUMBAWA',
      'WAIKABUBAK',
      'WAINGAPU',
      'MATARAM',
      'SUMBA'
    ],
    'SURAMADU': [
      'SURAMADU',
      'BANGKALAN',
      'GRESIK',
      'KENJERAN',
      'KETINTANG',
      'LAMONGAN',
      'MANYAR',
      'Non-Telda (NCX)',
      'PAMEKASAN',
      'TANDES'
    ]
  }

  successResponse(res, {
    products: ['Antares', 'Netmonk', 'OCA', 'Pijar'],
    witels: ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'],
    branchMap
  })
} catch (error) {
  next(error)
}}

export const getKPIData = async (req, res, next) => successResponse(res, {})
export const getRevenueByWitel = async (req, res, next) => successResponse(res, [])
export const getAmountByWitel = async (req, res, next) => successResponse(res, [])
export const getReportAnalysis = async (req, res, next) => successResponse(res, [])
export const exportReportAnalysis = async (req, res, next) => successResponse(res, {})
export const getTotalOrderByRegional = async (req, res, next) => successResponse(res, [])
export const getSebaranDataPS = async (req, res, next) => successResponse(res, [])
export const getCancelByFCC = async (req, res, next) => successResponse(res, [])
export const getFilterOptions = async (req, res, next) => successResponse(res, {}) 
export const getDashboardData = async (req, res, next) => successResponse(res, {})
