import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { fixCoordinate } from '../utils/dashboardHelpers.js'

const RSO2_WITELS = ['JATIM TIMUR', 'JATIM BARAT', 'BALI', 'NUSA TENGGARA', 'SURAMADU'];

export const getHSIDashboard = async (req, res, next) => {
  try {
    const {
      start_date, end_date,
      global_witel, global_branch,
      search, page = 1, limit = 10
    } = req.query

    // 1. BASE SQL CONDITIONS
    let conditions = [`UPPER(witel) IN ('JATIM TIMUR', 'JATIM BARAT', 'BALI', 'NUSA TENGGARA', 'SURAMADU')`]
    
    if (global_witel && global_witel !== 'ALL' && global_witel !== '') {
      const wList = global_witel.split(',').map(w => `'${w.trim().toUpperCase()}'`).join(',')
      conditions.push(`UPPER(witel) IN (${wList})`)
    }
    if (global_branch && global_branch !== '') {
      const bList = global_branch.split(',').map(b => `'${b.trim().toUpperCase()}'`).join(',')
      conditions.push(`UPPER(witel_old) IN (${bList})`)
    }
    if (start_date && end_date) {
      conditions.push(`order_date >= '${start_date}'::date`)
      conditions.push(`order_date < ('${end_date}'::date + INTERVAL '1 day')`)
    }
    if (search) {
      conditions.push(`(order_id ILIKE '%${search}%' OR customer_name ILIKE '%${search}%' OR nomor ILIKE '%${search}%')`)
    }

    const whereSql = `WHERE ${conditions.join(' AND ')}`
    const dimension = (global_branch || (global_witel && global_witel !== 'ALL' && global_witel !== '')) ? 'witel_old' : 'witel'

    // 2. EXECUTE QUERIES
    const [
      chart1Raw, chart2Raw, chart3Raw, chart4Raw, chart5Raw, chart6Raw, trendRaw, mapRaw, tableDataRaw, countRes
    ] = await Promise.all([
      prisma.$queryRawUnsafe(`SELECT UPPER(${dimension}) as product, COUNT(*)::int as value FROM hsi_data ${whereSql} GROUP BY UPPER(${dimension})`),
      prisma.$queryRawUnsafe(`SELECT UPPER(kelompok_status) as product, COUNT(*)::int as value FROM hsi_data ${whereSql} GROUP BY UPPER(kelompok_status)`),
      prisma.$queryRawUnsafe(`SELECT UPPER(type_layanan) as sub_type, COUNT(*)::int as total_amount FROM hsi_data ${whereSql} GROUP BY UPPER(type_layanan) ORDER BY total_amount DESC LIMIT 10`),
      prisma.$queryRawUnsafe(`SELECT UPPER(${dimension}) as product, COUNT(*)::int as value FROM hsi_data ${whereSql} AND UPPER(kelompok_status) = 'PS' GROUP BY UPPER(${dimension})`),
      prisma.$queryRawUnsafe(`SELECT UPPER(${dimension}) as name, UPPER(suberrorcode) as key, COUNT(*)::int as count FROM hsi_data ${whereSql} AND UPPER(kelompok_status) = 'REJECT_FCC' GROUP BY UPPER(${dimension}), UPPER(suberrorcode)`),
      prisma.$queryRawUnsafe(`SELECT UPPER(${dimension}) as name, UPPER(suberrorcode) as key, COUNT(*)::int as count FROM hsi_data ${whereSql} AND UPPER(kelompok_status) = 'CANCEL' GROUP BY UPPER(${dimension}), UPPER(suberrorcode)`),
      prisma.$queryRawUnsafe(`SELECT order_date::date as date, UPPER(kelompok_status) as status, COUNT(*)::int as count FROM hsi_data ${whereSql} GROUP BY order_date::date, UPPER(kelompok_status) ORDER BY date ASC`),
      prisma.$queryRawUnsafe(`SELECT order_id, gps_latitude, gps_longitude, customer_name, witel, kelompok_status FROM hsi_data ${whereSql} AND gps_latitude IS NOT NULL LIMIT 1000`),
      prisma.$queryRawUnsafe(`SELECT order_id, order_date, customer_name, witel, sto, type_layanan, kelompok_status, status_resume FROM hsi_data ${whereSql} ORDER BY order_date DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`),
      prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as total FROM hsi_data ${whereSql}`)
    ]);

    const totalRecords = countRes[0]?.total || 0;
    
    const stats = { total: totalRecords, completed: 0, open: 0 };
    chart2Raw.forEach(item => {
      if (item.product === 'PS') stats.completed += item.value;
      else if (!['CANCEL', 'REJECT_FCC'].includes(item.product)) stats.open += item.value;
    });

    const trendMap = {}
    trendRaw.forEach(item => {
      const d = item.date.toISOString().split('T')[0]
      if (!trendMap[d]) trendMap[d] = { date: d, total: 0, ps: 0 }
      trendMap[d].total += item.count
      if (item.status === 'PS') trendMap[d].ps += item.count
    })

    const transformStacked = (data) => {
      const map = {}
      data.forEach(i => {
        const dim = i.name || 'Unknown'
        const err = i.key || 'NULL'
        if (!map[dim]) map[dim] = { name: dim }
        map[dim][err] = (map[dim][err] || 0) + i.count
      })
      return Object.values(map)
    }

    const branches = await prisma.$queryRawUnsafe(`SELECT UPPER(witel) as witel, UPPER(witel_old) as witel_old FROM hsi_data WHERE witel_old IS NOT NULL GROUP BY UPPER(witel), UPPER(witel_old)`)
    const branchMap = {}
    branches.forEach(b => {
      if (!branchMap[b.witel]) branchMap[b.witel] = []
      if (!branchMap[b.witel].includes(b.witel_old)) branchMap[b.witel].push(b.witel_old)
    })

    successResponse(res, {
      stats,
      chart1: chart1Raw, 
      chart2: chart2Raw, 
      chart3: chart3Raw, 
      chart4: chart4Raw,
      chart5Data: transformStacked(chart5Raw), 
      chart6Data: transformStacked(chart6Raw),
      chartTrend: Object.values(trendMap),
      mapData: mapRaw.map(m => ({
        id: m.order_id, 
        lat: fixCoordinate(m.gps_latitude, true), 
        lng: fixCoordinate(m.gps_longitude, false), 
        name: m.customer_name, 
        status_group: m.kelompok_status === 'PS' ? 'Completed' : 'Open',
        witel: m.witel // Added witel property
      })).filter(i => i.lat),
      branchMap,
      tableData: tableDataRaw.map(r => ({
        order_id: r.order_id,
        order_date: r.order_date,
        customer_name: r.customer_name,
        witel: r.witel,
        sto: r.sto,
        type_layanan: r.type_layanan,
        kelompok_status: r.kelompok_status,
        status_resume: r.status_resume
      })),
      pagination: { total: totalRecords, totalPages: Math.ceil(totalRecords / limit) }
    })
  } catch (error) { next(error) }
}

// 2. FLOW PROCESS HSI - FIXED LOGIC WITH REVOKE & COMPLY
export const getHSIFlowStats = async (req, res, next) => {
  try {
    const { startDate, endDate, witel, branch } = req.query
    let conditions = [`UPPER(witel) IN ('JATIM TIMUR', 'JATIM BARAT', 'BALI', 'NUSA TENGGARA', 'SURAMADU')`]
    if (witel) conditions.push(`UPPER(witel) IN (${witel.split(',').map(w => `'${w.trim().toUpperCase()}'`).join(',')})`)
    if (branch) conditions.push(`UPPER(witel_old) IN (${branch.split(',').map(b => `'${b.trim().toUpperCase()}'`).join(',')})`)
    if (startDate && endDate) {
      conditions.push(`order_date >= '${startDate}'::date`)
      conditions.push(`order_date < ('${endDate}'::date + INTERVAL '1 day')`)
    }
    const whereSql = `WHERE ${conditions.join(' AND ')}`
    
    // COMPREHENSIVE QUERY
    const result = await prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*) as re,
        SUM(CASE WHEN data_proses = 'OGP VERIFIKASI DAN VALID' THEN 1 ELSE 0 END) as ogp_verif,
        SUM(CASE WHEN data_proses = 'CANCEL QC1' THEN 1 ELSE 0 END) as cancel_qc1,
        SUM(CASE WHEN data_proses = 'CANCEL FCC' THEN 1 ELSE 0 END) as cancel_fcc,
        SUM(CASE WHEN kelompok_status = 'REJECT_FCC' THEN 1 ELSE 0 END) as reject_fcc,
        SUM(CASE WHEN data_proses = 'UNSC' THEN 1 ELSE 0 END) as unsc,
        SUM(CASE WHEN data_proses = 'OGP SURVEY' AND status_resume ILIKE '%INVALID SURVEY%' THEN 1 ELSE 0 END) as survey_manja,
        SUM(CASE WHEN data_proses = 'OGP SURVEY' AND status_message = 'MIE - SEND SURVEY' THEN 1 ELSE 0 END) as ogp_survey_count,
        SUM(CASE WHEN data_proses = 'REVOKE' THEN 1 ELSE 0 END) as revoke_count,
        
        -- VALID WO
        SUM(CASE 
            WHEN data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC') 
            AND NOT (data_proses = 'OGP SURVEY' AND status_resume ILIKE '%INVALID SURVEY%')
            AND NOT (data_proses = 'OGP SURVEY' AND status_message = 'MIE - SEND SURVEY')
            THEN 1 ELSE 0 
        END) as valid_wo,
        
        SUM(CASE WHEN data_proses = 'CANCEL' THEN 1 ELSE 0 END) as cancel_instalasi,
        SUM(CASE WHEN kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM') THEN 1 ELSE 0 END) as fallout,
        SUM(CASE WHEN data_proses = 'OGP PROVI' THEN 1 ELSE 0 END) as ogp_provi,
        SUM(CASE WHEN kelompok_status = 'PS' THEN 1 ELSE 0 END) as ps_count,
        
        -- REVOKE DRILLDOWN
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' THEN 1 ELSE 0 END) as followup_completed,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '100 | REVOKE COMPLETED' THEN 1 ELSE 0 END) as revoke_completed,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = 'REVOKE ORDER' THEN 1 ELSE 0 END) as revoke_order,
        
        -- FOLLOW UP DETAILS (Assuming 'data_ps_revoke' column exists or use mapped value)
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'PS' THEN 1 ELSE 0 END) as ps_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke IN ('PI', 'ACT_COM') THEN 1 ELSE 0 END) as ogp_provi_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke IN ('FO_WFM', 'FO_UIM', 'FO_ASAP', 'FO_OSM') THEN 1 ELSE 0 END) as fallout_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'CANCEL' THEN 1 ELSE 0 END) as cancel_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND (data_ps_revoke NOT IN ('PS', 'PI', 'ACT_COM', 'FO_WFM', 'FO_UIM', 'FO_ASAP', 'FO_OSM', 'CANCEL') OR data_ps_revoke IS NULL) THEN 1 ELSE 0 END) as lain_lain_revoke,

        -- COMPLY
        SUM(CASE WHEN UPPER(hasil) = 'COMPLY' THEN 1 ELSE 0 END) as comply_count,

        -- Denominators
        (COUNT(*) - SUM(CASE WHEN kelompok_status = 'REJECT_FCC' THEN 1 ELSE 0 END) - SUM(CASE WHEN data_proses = 'UNSC' THEN 1 ELSE 0 END) - SUM(CASE WHEN data_proses = 'REVOKE' THEN 1 ELSE 0 END)) as ps_re_denominator,
        SUM(CASE WHEN kelompok_status IN ('PI', 'FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM', 'ACT_COM', 'PS') THEN 1 ELSE 0 END) as ps_pi_denominator

      FROM hsi_data ${whereSql}
    `)
    
    const row = result[0] || {}
    const stats = {}
    
    // Parse BigInt
    for (const key in row) {
        stats[key] = Number(row[key] || 0)
    }
    
    stats.valid_re = stats.re - stats.cancel_qc1 - stats.cancel_fcc
    stats.valid_pi = stats.valid_wo - stats.cancel_instalasi - stats.fallout - stats.revoke_count
    
    stats.pi_re_percent = stats.re > 0 ? ((stats.valid_wo / stats.re) * 100).toFixed(2) : 0
    stats.ps_re_percent = stats.ps_re_denominator > 0 ? ((stats.ps_count / stats.ps_re_denominator) * 100).toFixed(2) : 0
    stats.ps_pi_percent = stats.ps_pi_denominator > 0 ? ((stats.ps_count / stats.ps_pi_denominator) * 100).toFixed(2) : 0
    stats.comply_percent = stats.re > 0 ? ((stats.comply_count / stats.re) * 100).toFixed(2) : 0

    successResponse(res, stats)
  } catch (error) { next(error) }
}

export const getHSIFlowDetail = async (req, res, next) => {
  try {
    const { startDate, endDate, witel, branch, detail_category, page = 1, limit = 10 } = req.query
    let conditions = [`UPPER(witel) IN ('JATIM TIMUR', 'JATIM BARAT', 'BALI', 'NUSA TENGGARA', 'SURAMADU')`]
    
    if (witel) conditions.push(`UPPER(witel) IN (${witel.split(',').map(w => `'${w.trim().toUpperCase()}'`).join(',')})`)
    if (branch) conditions.push(`UPPER(witel_old) IN (${branch.split(',').map(b => `'${b.trim().toUpperCase()}'`).join(',')})`)
    if (startDate && endDate) {
      conditions.push(`order_date >= '${startDate}'::date`)
      conditions.push(`order_date < ('${endDate}'::date + INTERVAL '1 day')`)
    }

    // --- CATEGORY FILTERS ---
    if (detail_category) {
        switch (detail_category) {
            case 'RE':
                // No extra filter
                break;
            case 'Valid RE':
                conditions.push(`data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID')`);
                break;
            case 'OGP Verif & Valid':
                conditions.push(`data_proses = 'OGP VERIFIKASI DAN VALID'`);
                break;
            case 'Cancel QC 1':
                conditions.push(`data_proses = 'CANCEL QC1'`);
                break;
            case 'Cancel FCC':
                conditions.push(`data_proses = 'CANCEL FCC'`);
                break;
            case 'Valid WO':
                conditions.push(`data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC')`);
                conditions.push(`NOT (data_proses = 'OGP SURVEY' AND status_resume ILIKE '%INVALID SURVEY%')`);
                conditions.push(`NOT (data_proses = 'OGP SURVEY' AND status_message = 'MIE - SEND SURVEY')`);
                break;
            case 'Cancel WO':
                conditions.push(`data_proses = 'OGP SURVEY' AND status_resume ILIKE '%INVALID SURVEY%'`);
                break;
            case 'UNSC':
                conditions.push(`data_proses = 'UNSC'`);
                break;
            case 'OGP SURVEY':
                conditions.push(`data_proses = 'OGP SURVEY' AND status_message = 'MIE - SEND SURVEY'`);
                break;
            case 'Valid PI':
                conditions.push(`data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC', 'CANCEL', 'FALLOUT', 'REVOKE', 'OGP SURVEY')`);
                conditions.push(`status_resume NOT ILIKE '%INVALID SURVEY%'`);
                break;
            case 'Cancel Instalasi':
                conditions.push(`data_proses = 'CANCEL'`);
                break;
            case 'Fallout':
                conditions.push(`kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM')`);
                break;
            case 'Revoke':
                conditions.push(`data_proses = 'REVOKE'`);
                break;
            case 'PS (COMPLETED)':
                conditions.push(`UPPER(kelompok_status) = 'PS'`);
                break;
            case 'OGP Provisioning':
                conditions.push(`data_proses = 'OGP PROVI'`);
                break;
            // Revoke Details
            case 'Total Revoke':
                conditions.push(`data_proses = 'REVOKE'`);
                break;
            case 'Follow Up Completed':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED'`);
                break;
            case 'Revoke Completed':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = '100 | REVOKE COMPLETED'`);
                break;
            case 'Revoke Order':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = 'REVOKE ORDER'`);
                break;
            case 'PS Revoke':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'PS'`);
                break;
            case 'OGP Provi Revoke':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke IN ('PI', 'ACT_COM')`);
                break;
            case 'Fallout Revoke':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke IN ('FO_WFM', 'FO_UIM', 'FO_ASAP', 'FO_OSM')`);
                break;
            case 'Cancel Revoke':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'CANCEL'`);
                break;
            case 'Lain-Lain Revoke':
                conditions.push(`data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND (data_ps_revoke NOT IN ('PS', 'PI', 'ACT_COM', 'FO_WFM', 'FO_UIM', 'FO_ASAP', 'FO_OSM', 'CANCEL') OR data_ps_revoke IS NULL)`);
                break;
        }
    }

    const whereSql = `WHERE ${conditions.join(' AND ')}`
    
    const data = await prisma.$queryRawUnsafe(`SELECT * FROM hsi_data ${whereSql} ORDER BY order_date DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`)
    const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as total FROM hsi_data ${whereSql}`)
    successResponse(res, { table: data, pagination: { total: count[0].total, totalPages: Math.ceil(count[0].total / limit) } })
  } catch (error) { next(error) }
}