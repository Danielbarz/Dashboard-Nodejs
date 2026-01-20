import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const getReportHSI = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const allowedWitels = [
      "JATIM TIMUR",
      "JATIM BARAT",
      "SURAMADU",
      "BALI",
      "NUSA TENGGARA",
    ];
    // Use UPPER to be safe, though DB seems uppercase
    const witelIncludeFilter = `UPPER(witel) IN (${allowedWitels
      .map((w) => `'${w}'`)
      .join(",")})`;
      
    let dateFilter = "";
    if (start_date && end_date) {
      const start = new Date(start_date);
      const end = new Date(end_date);
      // Ensure ISO string is used for DATE type comparison
      dateFilter = `AND "order_date" >= '${
        start.toISOString().split("T")[0]
      }'::date AND "order_date" <= '${end.toISOString().split("T")[0]}'::date`;
    }

    // Raw SQL to aggregate data by Witel and Branch (witel_old)
    const rawData = await prisma.$queryRawUnsafe(
      `SELECT 
        witel, 
        witel_old, 
        SUM(CASE WHEN kelompok_status = 'PRE PI' THEN 1 ELSE 0 END) as pre_pi, 
        COUNT(*) as registered, 
        SUM(CASE WHEN kelompok_status = 'INPROGRESS_SC' THEN 1 ELSE 0 END) as inprogress_sc, 
        SUM(CASE WHEN kelompok_status = 'QC1' THEN 1 ELSE 0 END) as qc1, 
        SUM(CASE WHEN kelompok_status = 'FCC' THEN 1 ELSE 0 END) as fcc, 
        SUM(CASE WHEN kelompok_status = 'REJECT_FCC' THEN 1 ELSE 0 END) as cancel_by_fcc, 
        SUM(CASE WHEN kelompok_status = 'SURVEY_NEW_MANJA' THEN 1 ELSE 0 END) as survey_new_manja, 
        SUM(CASE WHEN kelompok_status = 'UNSC' THEN 1 ELSE 0 END) as unsc, 
        SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 < 24 THEN 1 ELSE 0 END) as pi_under_1_hari, 
        SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 >= 24 AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 <= 72 THEN 1 ELSE 0 END) as pi_1_3_hari, 
        SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 > 72 THEN 1 ELSE 0 END) as pi_over_3_hari, 
        SUM(CASE WHEN kelompok_status = 'PI' THEN 1 ELSE 0 END) as total_pi, 
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as fo_wfm_kndl_plgn, 
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as fo_wfm_kndl_teknis, 
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as fo_wfm_kndl_sys, 
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as fo_wfm_others, 
        SUM(CASE WHEN kelompok_status = 'FO_UIM' THEN 1 ELSE 0 END) as fo_uim, 
        SUM(CASE WHEN kelompok_status = 'FO_ASAP' THEN 1 ELSE 0 END) as fo_asp, 
        SUM(CASE WHEN kelompok_status = 'FO_OSM' THEN 1 ELSE 0 END) as fo_osm, 
        SUM(CASE WHEN kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM') THEN 1 ELSE 0 END) as total_fallout, 
        SUM(CASE WHEN kelompok_status = 'ACT_COM' THEN 1 ELSE 0 END) as act_comp, 
        SUM(CASE WHEN kelompok_status = 'PS' THEN 1 ELSE 0 END) as jml_comp_ps, 
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as cancel_kndl_plgn, 
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as cancel_kndl_teknis, 
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as cancel_kndl_sys, 
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as cancel_others, 
        SUM(CASE WHEN kelompok_status = 'CANCEL' THEN 1 ELSE 0 END) as total_cancel, 
        SUM(CASE WHEN kelompok_status = 'REVOKE' THEN 1 ELSE 0 END) as revoke 
      FROM hsi_data 
      WHERE ${witelIncludeFilter} ${dateFilter} 
      GROUP BY witel, witel_old 
      HAVING witel_old IS NOT NULL AND witel_old != '' 
      ORDER BY witel, witel_old`
    );

    const calc = (i) => {
      const n_re =
        Number(i.total_pi) +
        Number(i.total_fallout) +
        Number(i.act_comp) +
        Number(i.jml_comp_ps) +
        Number(i.total_cancel);
      i.pi_re_percent =
        i.registered > 0 ? ((n_re / i.registered) * 100).toFixed(2) : "0.00";
      const d_re =
        Number(i.registered) -
        Number(i.cancel_by_fcc) -
        Number(i.unsc) -
        Number(i.revoke);
      i.ps_re_percent =
        d_re > 0 ? ((Number(i.jml_comp_ps) / d_re) * 100).toFixed(2) : "0.00";
      const d_pi =
        Number(i.total_pi) +
        Number(i.total_fallout) +
        Number(i.act_comp) +
        Number(i.jml_comp_ps);
      i.ps_pi_percent =
        d_pi > 0 ? ((Number(i.jml_comp_ps) / d_pi) * 100).toFixed(2) : "0.00";
    };

    const grouped = {};
    rawData.forEach((r) => {
      if (!grouped[r.witel]) grouped[r.witel] = [];
      grouped[r.witel].push(r);
    });

    const finalData = [];
    const order = [
      "BALI",
      "JATIM BARAT",
      "JATIM TIMUR",
      "NUSA TENGGARA",
      "SURAMADU",
    ];
    const fields = [
      "pre_pi",
      "registered",
      "inprogress_sc",
      "qc1",
      "fcc",
      "cancel_by_fcc",
      "survey_new_manja",
      "unsc",
      "pi_under_1_hari",
      "pi_1_3_hari",
      "pi_over_3_hari",
      "total_pi",
      "fo_wfm_kndl_plgn",
      "fo_wfm_kndl_teknis",
      "fo_wfm_kndl_sys",
      "fo_wfm_others",
      "fo_uim",
      "fo_asp",
      "fo_osm",
      "total_fallout",
      "act_comp",
      "jml_comp_ps",
      "cancel_kndl_plgn",
      "cancel_kndl_teknis",
      "cancel_kndl_sys",
      "cancel_others",
      "total_cancel",
      "revoke",
    ];

    order.forEach((w) => {
      const c = grouped[w];
      if (!c) return;
      const p = { witel_display: w, row_type: "main" };
      fields.forEach((f) => {
        p[f] = c.reduce((s, x) => s + Number(x[f] || 0), 0);
      });
      calc(p);
      finalData.push(p);
      
      c.sort((a, b) =>
        (a.witel_old || "").localeCompare(b.witel_old || "")
      ).forEach((x) => {
        x.witel_display = x.witel_old || "(Blank)";
        x.row_type = "sub";
        fields.forEach((f) => {
          x[f] = Number(x[f] || 0);
        });
        calc(x);
        finalData.push(x);
      });
    });

    const totals = { witel: "GRAND TOTAL" };
    fields.forEach((f) => {
      totals[f] = rawData.reduce((s, r) => s + Number(r[f] || 0), 0);
    });
    calc(totals);

    successResponse(
      res,
      { tableData: finalData, totals },
      "Report HSI data retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getHSIDateRange = async (req, res, next) => {
  try {
    const allowedWitels = [
      "JATIM TIMUR",
      "JATIM BARAT",
      "SURAMADU",
      "BALI",
      "NUSA TENGGARA",
    ];
    const wFilter = `UPPER(witel) IN (${allowedWitels
      .map((w) => `'${w}'`)
      .join(",")})`;
    const result = await prisma.$queryRawUnsafe(
      `SELECT MIN(order_date) as min_date, MAX(order_date) as max_date FROM hsi_data WHERE ${wFilter} AND order_date IS NOT NULL`
    );
    successResponse(
      res,
      {
        min_date: result[0]?.min_date || new Date("2000-01-01"),
        max_date: result[0]?.max_date || new Date(),
      },
      "HSI date range retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};
