export const getDigitalProductDashboard = async (req, res, next) => {
  try {
    const { start_date, end_date, witel, branch, product } = req.query

    const witelList = witel ? witel.split(',').filter(Boolean) : []
    const isSingleWitel = witelList.length === 1

    // --- 1. FILTERS & NORMALIZATION ---
    let dateFilter = ''
    const params = []
    let pIdx = 1

    if (start_date && end_date) {
      dateFilter = `AND order_date >= $${pIdx}::date AND order_date <= $${pIdx + 1}::date`
      params.push(start_date, end_date)
      pIdx += 2
    }

    const normalizedDataCTE = `
      WITH normalized_data AS (
        SELECT
          *,
          CASE
            WHEN witel IN ('BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG') THEN 'BALI'
            WHEN witel IN ('JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG') THEN 'JATIM BARAT'
            WHEN witel IN ('JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO') THEN 'JATIM TIMUR'
            WHEN witel IN ('NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA') THEN 'NUSA TENGGARA'
            WHEN witel IN ('SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES') THEN 'SURAMADU'
            ELSE 'OTHER' 
          END as region_norm,
          CASE
            WHEN product_name ILIKE '%Netmonk%' THEN 'Netmonk'
            WHEN product_name ILIKE '%OCA%' THEN 'OCA'
            WHEN product_name ILIKE '%Pijar%' THEN 'Pijar'
            WHEN product_name ILIKE '%Antares%' OR product_name ILIKE '%IOT%' OR product_name ILIKE '%CCTV%' THEN 'Antares'
            ELSE 'OTHER'
          END as product_norm,
          CASE
            WHEN status ILIKE '%complete%' OR status ILIKE '%completed%' OR status ILIKE '%ps%' THEN 'COMPLETED'
            ELSE 'IN PROGRESS'
          END as status_group,
          CASE
            WHEN telda IS NOT NULL AND telda != '' THEN UPPER(telda)
            ELSE UPPER(branch)
          END as branch_norm
        FROM digital_products
        WHERE 1=1
        ${dateFilter}
      )
    `

    let filterCondition = `WHERE region_norm != 'OTHER' AND product_norm != 'OTHER'`

    if (witel && witel !== 'ALL') {
      const witelArr = witel.split(',').filter(w => w)
      if (witelArr.length > 0) {
        const placeholders = witelArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND region_norm IN (${placeholders})`
        params.push(...witelArr)
      }
    }

    if (branch) {
      const branchArr = branch.split(',').filter(b => b)
      if (branchArr.length > 0) {
        const placeholders = branchArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND branch_norm IN (${placeholders})`
        params.push(...branchArr.map(b => b.toUpperCase()))
      }
    }

    if (product) {
      const productArr = product.split(',').filter(p => p)
      if (productArr.length > 0) {
        const placeholders = productArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND product_norm IN (${placeholders})`
        params.push(...productArr)
      }
    }

    const WITEL_ORDER = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'NUSA TENGGARA']
    
    // Revenue Logic
    const REVENUE_COL = "COALESCE(NULLIF(net_price, 0), NULLIF(revenue, 0), (substring(product_name from 'Total \\\\(Sebelum PPN\\\\)\\\\s*:\\\\s*([0-9]+)')::numeric), 0)"

    // Dynamic Grouping
    const GROUP_COL = isSingleWitel ? 'branch_norm' : 'region_norm'
    const ORDER_CLAUSE = isSingleWitel ? 'branch_norm ASC' : `CASE 
          ${WITEL_ORDER.map((w, idx) => `WHEN region_norm = '${w}' THEN ${idx + 1}`).join(' ')}
          ELSE 99 END`

    // --- 2. EXECUTE QUERIES ---
    const [
      kpiData,
      orderByStatus,
      revenueByWitel,
      orderByWitel,
      revenueByProductTrend,
      productShare,
      orderTrend,
      targetData
    ] = await Promise.all([
      // 1. KPIs
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT
          COUNT(*)::int as total_order,
          SUM(CASE WHEN status_group = 'COMPLETED' THEN 1 ELSE 0 END)::int as completed_count,
          SUM(CASE WHEN status_group = 'COMPLETED' THEN ${REVENUE_COL} ELSE 0 END) as total_revenue,
          SUM(CASE WHEN status_group = 'IN PROGRESS' THEN ${REVENUE_COL} ELSE 0 END) as pipeline_revenue
        FROM normalized_data
        ${filterCondition}
      `, ...params),

      // Chart 1: Order by Status (Donut)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT status_group as name, COUNT(*)::int as value
        FROM normalized_data
        ${filterCondition}
        GROUP BY status_group
      `, ...params),

      // Chart 2: Revenue by Witel (Dynamic Group)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT ${GROUP_COL} as witel, product_norm as product, SUM(${REVENUE_COL}) as revenue
        FROM normalized_data
        ${filterCondition}
        GROUP BY ${GROUP_COL}, product_norm
        ORDER BY ${ORDER_CLAUSE}
      `, ...params),

      // Chart 3: Order by Witel (Dynamic Group)
      isSingleWitel ? prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT ${GROUP_COL} as witel, COUNT(*)::int as count
        FROM normalized_data
        ${filterCondition}
        GROUP BY ${GROUP_COL}
        ORDER BY ${ORDER_CLAUSE}
      `, ...params) : prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT ${GROUP_COL} as witel, status_group as status, COUNT(*)::int as count
        FROM normalized_data
        ${filterCondition}
        GROUP BY ${GROUP_COL}, status_group
        ORDER BY ${ORDER_CLAUSE}
      `, ...params),

      // Chart 4: Revenue Trend (Multi-Line by Product)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT TO_CHAR(order_date, 'YYYY-MM') as month, product_norm as product, SUM(${REVENUE_COL}) as revenue
        FROM normalized_data
        ${filterCondition}
        GROUP BY month, product_norm
        ORDER BY month ASC
      `, ...params),

      // Chart 5: Product Share (Donut - Revenue)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT product_norm as name, SUM(${REVENUE_COL}) as value
        FROM normalized_data
        ${filterCondition}
        GROUP BY product_norm
        ORDER BY value DESC
      `, ...params),

      // Chart 6: Order Trend (Multi-Line by Product)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT TO_CHAR(order_date, 'YYYY-MM') as month, product_norm as product, COUNT(*)::int as count
        FROM normalized_data
        ${filterCondition}
        GROUP BY month, product_norm
        ORDER BY month ASC
      `, ...params),

      // 7. TARGETS
      prisma.target.findMany({
        where: {
          periodDate: {
            gte: new Date(start_date || '2020-01-01'),
            lte: new Date(end_date || new Date())
          },
          // Filter target berdasarkan witel dan produk jika ada
          ...(witel && witel !== 'ALL' ? { witel: { in: witel.split(',') } } : {}),
          ...(product && product !== 'ALL' ? { product: { in: product.split(',') } } : {})
        }
      })
    ])

    // --- 3. DATA TRANSFORMATION ---

    // Calculate Aggregate Targets
    const totalRevTarget = targetData
      .filter(t => t.targetType === 'REVENUE')
      .reduce((sum, t) => sum + Number(t.value), 0)
    
    const totalOrderTarget = targetData
      .filter(t => t.targetType === 'ORDER')
      .reduce((sum, t) => sum + Number(t.value), 0)

    const totalOrder = Number(kpiData[0]?.total_order || 0)
    const completedCount = Number(kpiData[0]?.completed_count || 0)
    const totalRevenue = Number(kpiData[0]?.total_revenue || 0)

    const kpi = {
      totalRevenue: totalRevenue,
      revTarget: totalRevTarget,
      revAchievement: totalRevTarget > 0 ? ((totalRevenue / totalRevTarget) * 100).toFixed(1) : 0,
      
      pipelineRevenue: Number(kpiData[0]?.pipeline_revenue || 0),
      
      totalOrder: totalOrder,
      orderTarget: totalOrderTarget,
      orderAchievement: totalOrderTarget > 0 ? ((totalOrder / totalOrderTarget) * 100).toFixed(1) : 0,
      
      completionRate: totalOrder > 0 ? ((completedCount / totalOrder) * 100).toFixed(1) : 0
    }

    const transformToStacked = (data, groupKey, stackKey, valueKey, defaultGroups = []) => {
      const grouped = {}
      defaultGroups.forEach(g => { grouped[g] = { name: g } })

      data.forEach(row => {
        const group = row[groupKey]
        if (!group) return
        if (!grouped[group]) grouped[group] = { name: group }
        grouped[group][row[stackKey]] = Number(row[valueKey] || 0)
      })
      
      if (defaultGroups.length > 0) return defaultGroups.map(g => grouped[g] || { name: g })
      return Object.values(grouped)
    }

    // Transform Witel Charts with Target Support
    const revenueByWitelTransformed = transformToStacked(revenueByWitel, 'witel', 'product', 'revenue', isSingleWitel ? [] : WITEL_ORDER)
    revenueByWitelTransformed.forEach(item => {
      item.target = targetData
        .filter(t => t.targetType === 'REVENUE' && (t.witel === 'ALL' || t.witel === item.name))
        .reduce((sum, t) => sum + Number(t.value), 0)
    })

    const orderByWitelTransformed = isSingleWitel 
      ? orderByWitel.map(r => ({ name: r.witel, value: Number(r.count) }))
      : transformToStacked(orderByWitel, 'witel', 'status', 'count', WITEL_ORDER)
    
    if (!isSingleWitel) {
      orderByWitelTransformed.forEach(item => {
        item.target = targetData
          .filter(t => t.targetType === 'ORDER' && (t.witel === 'ALL' || t.witel === item.name))
          .reduce((sum, t) => sum + Number(t.value), 0)
      })
    }

    // Trend charts with Target Support
    const revenueTrendTransformed = transformToStacked(revenueByProductTrend, 'month', 'product', 'revenue')
    revenueTrendTransformed.forEach(item => {
      // Sum all revenue targets for this month
      item.target = targetData
        .filter(t => t.targetType === 'REVENUE' && new Date(t.periodDate).toISOString().startsWith(item.name))
        .reduce((sum, t) => sum + Number(t.value), 0)
    })

    const orderTrendTransformed = transformToStacked(orderTrend, 'month', 'product', 'count')
    orderTrendTransformed.forEach(item => {
      item.target = targetData
        .filter(t => t.targetType === 'ORDER' && new Date(t.periodDate).toISOString().startsWith(item.name))
        .reduce((sum, t) => sum + Number(t.value), 0)
    })

    const charts = {
      orderByStatus: orderByStatus.map(r => ({ name: r.name, value: Number(r.value) })),
      revenueByWitel: revenueByWitelTransformed,
      orderByWitel: orderByWitelTransformed,
      revenueTrend: revenueTrendTransformed,
      productShare: productShare.map(r => ({ name: r.name, value: Number(r.value) })),
      orderTrend: orderTrendTransformed
    }

    successResponse(res, { kpi, charts }, 'Digital Product dashboard data retrieved')

  } catch (error) {
    console.error('Error in getDigitalProductDashboard:', error)
    next(error)
  }
}
