import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

// --- HELPERS (Gaya Oryza Rey - Stable Version) ---
const normalizedDigitalCTE = (start_date, end_date) => `
  WITH normalized_data AS (
    SELECT
      *,
      CASE
        WHEN UPPER(witel) LIKE '%BALI%' OR UPPER(witel) LIKE '%DENPASAR%' THEN 'BALI'
        WHEN UPPER(witel) LIKE '%BARAT%' OR UPPER(witel) LIKE '%MALANG%' OR UPPER(witel) LIKE '%KEDIRI%' OR UPPER(witel) LIKE '%MADIUN%' THEN 'JATIM BARAT'
        WHEN UPPER(witel) LIKE '%TIMUR%' OR UPPER(witel) LIKE '%JEMBER%' OR UPPER(witel) LIKE '%SIDOARJO%' OR UPPER(witel) LIKE '%PASURUAN%' THEN 'JATIM TIMUR'
        WHEN UPPER(witel) LIKE '%NUSA%' OR UPPER(witel) LIKE '%NTB%' OR UPPER(witel) LIKE '%NTT%' OR UPPER(witel) LIKE '%KUPANG%' THEN 'NUSA TENGGARA'
        WHEN UPPER(witel) LIKE '%SURAMADU%' OR UPPER(witel) LIKE '%SURABAYA%' OR UPPER(witel) LIKE '%MADURA%' OR UPPER(witel) LIKE '%GRESIK%' THEN 'SURAMADU'
        ELSE 'OTHER' 
      END as region_norm,
      CASE
        WHEN product_name ILIKE '%Netmonk%' THEN 'Netmonk'
        WHEN product_name ILIKE '%OCA%' THEN 'OCA'
        WHEN product_name ILIKE '%Pijar%' THEN 'Pijar'
        WHEN product_name ILIKE '%Antares%' OR product_name ILIKE '%IOT%' OR product_name ILIKE '%CCTV%' THEN 'Antares'
        WHEN product_name ILIKE '%HSIE%' OR product_name ILIKE '%High Speed Internet%' THEN 'HSI Digital'
        ELSE 'OTHER'
      END as product_norm,
      CASE
        WHEN status ILIKE '%complete%' OR status ILIKE '%completed%' OR status ILIKE '%ps%' THEN 'DONE'
        ELSE 'OGP'
      END as status_group,
      CASE WHEN UPPER(witel) LIKE '%NCX%' THEN 'NCX' ELSE 'SCONE' END as system_type,
      COALESCE(NULLIF(net_price, 0), NULLIF(revenue, 0), 0) as revenue_clean
    FROM digital_products
    WHERE 1=1
    ${start_date && end_date && start_date !== 'undefined' ? `AND order_date >= '${start_date}'::date AND order_date <= '${end_date}'::date` : ""}
  )
`;

export const getReportAnalysis = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const cte = normalizedDigitalCTE(start_date, end_date);

    const getSegmentSummary = async (keywords) => {
      const sql = `
        ${cte}
        SELECT region_norm as witel, product_norm, status_group, COUNT(*)::int as count, SUM(revenue_clean) as total_rev
        FROM normalized_data
        WHERE (${keywords.map(k => `COALESCE(segment, '') ILIKE '%${k}%'`).join(' OR ')})
        GROUP BY 1, 2, 3
      `;
      const rows = await prisma.$queryRawUnsafe(sql);
      const regions = ["BALI", "JATIM BARAT", "JATIM TIMUR", "NUSA TENGGARA", "SURAMADU"];
      const map = {};
      regions.forEach(r => {
        map[r] = { nama_witel: r, in_progress_n: 0, in_progress_o: 0, in_progress_ae: 0, in_progress_ps: 0, prov_comp_n_realisasi: 0, prov_comp_o_realisasi: 0, prov_comp_ae_realisasi: 0, prov_comp_ps_realisasi: 0, revenue_n_ach: 0, revenue_o_ach: 0, revenue_ae_ach: 0, revenue_ps_ach: 0, revenue_n_target: 0, revenue_o_target: 0, revenue_ae_target: 0, revenue_ps_target: 0 };
      });

      rows.forEach(row => {
        const r = row.witel === 'OTHER' ? 'BALI' : row.witel; // Fallback
        if (!map[r]) return;
        const p = row.product_norm;
        const isDone = row.status_group === 'DONE';
        const pCode = p === 'Netmonk' ? 'n' : p === 'OCA' ? 'o' : p === 'Antares' ? 'ae' : 'ps';
        if (pCode !== 'OTHER') {
          if (isDone) { map[r][`prov_comp_${pCode}_realisasi`] += row.count; map[r][`revenue_${pCode}_ach`] += Number(row.total_rev) / 1e6; }
          else { map[r][`in_progress_${pCode}`] += row.count; }
        }
      });
      return Object.values(map);
    };

    const [legs, sme] = await Promise.all([
      getSegmentSummary(["LEGS", "DGS", "DPS", "GOV", "ENTERPRISE", "REG"]),
      getSegmentSummary(["SME", "DSS", "RBS", "RETAIL", "UMKM", "FINANCIAL", "LOGISTIC", "TOURISM", "MANUFACTURE"])
    ]);

    successResponse(res, { legs: legs.data || legs, sme: sme.data || sme, detailsLegs: {}, detailsSme: {} });
  } catch (error) { next(error); }
};

export const getReportDetails = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const cte = normalizedDigitalCTE(start_date, end_date);
    const rows = await prisma.$queryRawUnsafe(`${cte} SELECT * FROM normalized_data ORDER BY order_date DESC LIMIT 200`);
    
    const formatted = rows.map(r => {
      let cleanProd = r.product_name || '-';
      if (cleanProd.length > 60) {
         const match = cleanProd.match(/(High Speed Internet|HSI|Netmonk|OCA|Antares|Pijar|CCTV|Package|Paket)[^\[\]|~]*/i);
         cleanProd = match ? match[0].trim() : cleanProd.substring(0, 60);
      }
      return {
        order_id: r.order_number, segment: r.segment, channel: r.channel, product_name: cleanProd, layanan: r.layanan, customer_name: r.customer_name,
        order_status: r.status, order_subtype: r.sub_type, milestone: r.milestone, week: r.week, order_created_date: r.order_date, net_price: Number(r.revenue_clean), witel: r.region_norm !== 'OTHER' ? r.region_norm : r.witel, branch: r.branch
      };
    });
    successResponse(res, formatted);
  } catch (error) { next(error); }
};

export const getKPIPOData = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const cte = normalizedDigitalCTE(start_date, end_date);
    const [aos, digital] = await Promise.all([
      prisma.accountOfficer.findMany({ orderBy: { name: 'asc' } }),
      prisma.$queryRawUnsafe(`${cte} SELECT region_norm, status_group, system_type, witel FROM normalized_data`)
    ]);

    const result = aos.map(ao => {
      const filters = (ao.filterWitelLama || "").toUpperCase().split(",").map(s => s.trim()).filter(Boolean);
      const relevant = digital.filter(row => filters.some(f => (row.witel || "").toUpperCase().includes(f)));
      const done_ncx = relevant.filter(r => r.status_group === 'DONE' && r.system_type === 'NCX').length;
      const done_scone = relevant.filter(r => r.status_group === 'DONE' && r.system_type === 'SCONE').length;
      const ogp_ncx = relevant.filter(r => r.status_group === 'OGP' && r.system_type === 'NCX').length;
      const ogp_scone = relevant.filter(r => r.status_group === 'OGP' && r.system_type === 'SCONE').length;
      return { nama_po: ao.name, witel: ao.displayWitel, done_ncx, done_scone, ogp_ncx, ogp_scone, total: relevant.length, ach_ytd: relevant.length > 0 ? (((done_ncx+done_scone)/relevant.length)*100).toFixed(1) : 0, ach_q3: 0 };
    });
    successResponse(res, result);
  } catch (error) { next(error); }
};