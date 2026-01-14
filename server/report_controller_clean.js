// REPORT HSI (MIGRATED FROM LARAVEL)
// ==========================================

// Helper: Fetch HSI Data (Shared by View and Export)
const fetchHSIReportData = async (start_date, end_date) => {
    const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA']

    // Base conditions
    const conditions = [`UPPER(witel) IN (${RSO2_WITELS.map(w => `'${w.toUpperCase()}'`).join(',')})`]
    
    // Filter by Date
    if (start_date && end_date) {
      conditions.push(`order_date >= '${start_date}'::date`)
      conditions.push(`order_date < ('${end_date}'::date + INTERVAL '1 day')`)
    }

    const whereSql = `WHERE ${conditions.join(' AND ')}`

    const query = `
      SELECT
        witel,
        witel_old,
        
        -- 1. PRE PI
        SUM(CASE WHEN kelompok_status = 'PRE PI' THEN 1 ELSE 0 END) as pre_pi,
        
        -- 2. REGISTERED (RE)
        COUNT(*) as registered,
        
        -- 3. INPROGRESS SC
        SUM(CASE WHEN kelompok_status = 'INPROGRESS_SC' THEN 1 ELSE 0 END) as inprogress_sc,
        
        -- 4. QC1
        SUM(CASE WHEN kelompok_status = 'QC1' THEN 1 ELSE 0 END) as qc1,
        
        -- 5. FCC
        SUM(CASE WHEN kelompok_status = 'FCC' THEN 1 ELSE 0 END) as fcc,
        
        -- 6. CANCEL BY FCC
        SUM(CASE WHEN kelompok_status = 'REJECT_FCC' THEN 1 ELSE 0 END) as cancel_by_fcc,
        
        -- 7. SURVEY NEW MANJA
        SUM(CASE WHEN kelompok_status = 'SURVEY_NEW_MANJA' THEN 1 ELSE 0 END) as survey_new_manja,
        
        -- 8. UN-SC
        SUM(CASE WHEN kelompok_status = 'UNSC' THEN 1 ELSE 0 END) as un_sc,
        
        -- PI AGING (Based on last_updated_date)
        SUM(CASE WHEN kelompok_status = 'PI' AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) < 24 THEN 1 ELSE 0 END) as pi_under_1_hari,
        SUM(CASE WHEN kelompok_status = 'PI' AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) >= 24 AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) <= 72 THEN 1 ELSE 0 END) as pi_1_3_hari,
        SUM(CASE WHEN kelompok_status = 'PI' AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) > 72 THEN 1 ELSE 0 END) as pi_over_3_hari,
        SUM(CASE WHEN kelompok_status = 'PI' THEN 1 ELSE 0 END) as total_pi,

        -- FALLOUT WFM
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as fo_wfm_kndl_plgn,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as fo_wfm_kndl_teknis,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as fo_wfm_kndl_sys,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as fo_wfm_others,
        
        -- OTHER FALLOUTS
        SUM(CASE WHEN kelompok_status = 'FO_UIM' THEN 1 ELSE 0 END) as fo_uim,
        SUM(CASE WHEN kelompok_status = 'FO_ASAP' THEN 1 ELSE 0 END) as fo_asp,
        SUM(CASE WHEN kelompok_status = 'FO_OSM' THEN 1 ELSE 0 END) as fo_osm,
        
        -- TOTAL FALLOUT
        SUM(CASE WHEN kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM') THEN 1 ELSE 0 END) as total_fallout,

        -- COMPLETION
        SUM(CASE WHEN kelompok_status = 'ACT_COM' THEN 1 ELSE 0 END) as act_comp,
        SUM(CASE WHEN kelompok_status = 'PS' THEN 1 ELSE 0 END) as jml_comp_ps,

        -- CANCEL DETAILS
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as cancel_kndl_plgn,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as cancel_kndl_teknis,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as cancel_kndl_sys,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as cancel_others,
        SUM(CASE WHEN kelompok_status = 'CANCEL' THEN 1 ELSE 0 END) as total_cancel,

        -- REVOKE
        SUM(CASE WHEN kelompok_status = 'REVOKE' THEN 1 ELSE 0 END) as revoke

      FROM hsi_data
      ${whereSql}
      GROUP BY witel, witel_old
      ORDER BY witel, witel_old
    `

    const rawData = await prisma.$queryRawUnsafe(query)

    // --- Process Logic in JS ---
    const numericFields = [
      'pre_pi', 'registered', 'inprogress_sc', 'qc1', 'fcc', 'cancel_by_fcc', 'survey_new_manja', 'un_sc',
      'pi_under_1_hari', 'pi_1_3_hari', 'pi_over_3_hari', 'total_pi',
      'fo_wfm_kndl_plgn', 'fo_wfm_kndl_teknis', 'fo_wfm_kndl_sys', 'fo_wfm_others',
      'fo_uim', 'fo_asp', 'fo_osm', 'total_fallout',
      'act_comp', 'jml_comp_ps',
      'cancel_kndl_plgn', 'cancel_kndl_teknis', 'cancel_kndl_sys', 'cancel_others', 'total_cancel',
      'revoke'
    ]

    const calculatePercentages = (item) => {
        const val = (k) => Number(item[k] || 0)
        const num_pire = val('total_pi') + val('total_fallout') + val('act_comp') + val('jml_comp_ps') + val('total_cancel');
        item.pi_re_percent = val('registered') > 0 ? ((num_pire / val('registered')) * 100).toFixed(2) : 0;

        const denom_psre = val('registered') - val('cancel_by_fcc') - val('un_sc') - val('revoke');
        item.ps_re_percent = denom_psre > 0 ? ((val('jml_comp_ps') / denom_psre) * 100).toFixed(2) : 0;

        const denom_pspi = val('total_pi') + val('total_fallout') + val('act_comp') + val('jml_comp_ps');
        item.ps_pi_percent = denom_pspi > 0 ? ((val('jml_comp_ps') / denom_pspi) * 100).toFixed(2) : 0;
    };

    const grouped = {}
    rawData.forEach(row => {
      const witel = row.witel
      if (!grouped[witel]) {
        grouped[witel] = {
          witel_display: witel,
          witel: witel,
          row_type: 'main',
          children: []
        }
        numericFields.forEach(f => grouped[witel][f] = 0)
      }

      const cleanRow = {}
      for (const [k, v] of Object.entries(row)) cleanRow[k] = typeof v === 'bigint' ? Number(v) : v
      
      cleanRow.witel_display = cleanRow.witel_old || '(Blank)'
      cleanRow.row_type = 'sub'
      calculatePercentages(cleanRow)
      grouped[witel].children.push(cleanRow)

      numericFields.forEach(f => grouped[witel][f] += (cleanRow[f] || 0))
    })

    const finalReportData = []
    const grandTotal = { witel_display: 'GRAND TOTAL', row_type: 'total' }
    numericFields.forEach(f => grandTotal[f] = 0)

    Object.values(grouped).forEach(parent => {
      calculatePercentages(parent)
      finalReportData.push(parent)
      numericFields.forEach(f => grandTotal[f] += parent[f])
      parent.children.forEach(child => finalReportData.push(child))
      delete parent.children
    })

    calculatePercentages(grandTotal)

    return { tableData: finalReportData, totals: grandTotal }
}

// Get Report HSI - from HSI data table
export const getReportHSI = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query
    const data = await fetchHSIReportData(start_date, end_date)
    successResponse(res, data, 'Report HSI data retrieved successfully')
  } catch (error) {
    next(error)
  }
}
