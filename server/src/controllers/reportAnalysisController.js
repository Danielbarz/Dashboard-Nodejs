import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

// --- HELPERS (Clean Logic as per User Request) ---
const normalizedDigitalCTE = (start_date, end_date) => `
  WITH normalized_data AS (
    SELECT
      *,
      -- 1. Region Mapping (Keep existing mapping as it works)
      CASE
        WHEN UPPER(witel) LIKE '%BALI%' OR UPPER(witel) LIKE '%DENPASAR%' THEN 'BALI'
        WHEN UPPER(witel) LIKE '%BARAT%' OR UPPER(witel) LIKE '%MALANG%' OR UPPER(witel) LIKE '%KEDIRI%' OR UPPER(witel) LIKE '%MADIUN%' THEN 'JATIM BARAT'
        WHEN UPPER(witel) LIKE '%TIMUR%' OR UPPER(witel) LIKE '%JEMBER%' OR UPPER(witel) LIKE '%SIDOARJO%' OR UPPER(witel) LIKE '%PASURUAN%' THEN 'JATIM TIMUR'
        WHEN UPPER(witel) LIKE '%NUSA%' OR UPPER(witel) LIKE '%NTB%' OR UPPER(witel) LIKE '%NTT%' OR UPPER(witel) LIKE '%KUPANG%' THEN 'NUSA TENGGARA'
        WHEN UPPER(witel) LIKE '%SURAMADU%' OR UPPER(witel) LIKE '%SURABAYA%' OR UPPER(witel) LIKE '%MADURA%' OR UPPER(witel) LIKE '%GRESIK%' THEN 'SURAMADU'
        ELSE 'OTHER' 
      END as region_norm,
      
      -- 2. Product Mapping (N, O, AE, PS)
      CASE
        WHEN product ILIKE '%Netmonk%' THEN 'Netmonk'
        WHEN product ILIKE '%OCA%' OR product ILIKE '%Omni%' THEN 'OCA'
        WHEN product ILIKE '%Pijar%' THEN 'Pijar'
        WHEN product ILIKE '%Antares%' OR product ILIKE '%IOT%' OR product ILIKE '%CCTV%' THEN 'Antares'
        ELSE 'OTHER'
      END as product_norm,

      -- 3. Status Logic (Based on order_status_n)
      CASE
        WHEN order_status_n ILIKE '%Complete%' OR order_status_n ILIKE '%Completed%' OR order_status ILIKE '%complete%' THEN 'DONE'
        WHEN order_status_n ILIKE '%In Progress%' OR order_status_n ILIKE '%On Process%' OR order_status_n ILIKE '%onprocess%' OR order_status ILIKE '%Progress%' THEN 'OGP'
        ELSE 'IGNORE' 
      END as status_group,

      -- 4. Segment Logic (SME = RBS, LEGS = DGS/DPS/DSS)
      CASE
        WHEN segmen ILIKE 'RBS' OR segmen ILIKE 'SME' THEN 'SME'
        WHEN segmen ILIKE 'DGS' OR segmen ILIKE 'DPS' OR segmen ILIKE 'DSS' OR segmen ILIKE 'LEGS' OR segmen ILIKE 'GOV' OR segmen ILIKE 'ENT%' OR segmen ILIKE 'REG' THEN 'LEGS'
        ELSE 'OTHER'
      END as segment_group,

      CASE
        WHEN channel ILIKE '%NCX%' THEN 'NCX'
        WHEN channel ILIKE '%SC-ONE%' OR channel ILIKE '%SCONE%' THEN 'SCONE'
        ELSE 'OTHER'
      END as system_type,

      COALESCE(net_price, 0) as revenue_clean

    FROM digital_products
    WHERE 1=1
    -- SC exclusion removed to allow valid single SC orders (e.g. Jatim Timur case)
    ${start_date && end_date && start_date !== 'undefined' ? `AND order_date >= '${start_date}'::date AND order_date < ('${end_date}'::date + INTERVAL '1 day')` : ""}
  )
`;

export const getReportAnalysis = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const cte = normalizedDigitalCTE(start_date, end_date);

    // Fetch Targets
    const targetWhere = { dashboardType: 'DIGITAL', targetType: 'ORDER' };
    if (start_date && end_date && start_date !== 'undefined' && end_date !== 'undefined') {
        targetWhere.periodDate = { gte: new Date(start_date), lte: new Date(end_date) };
    }
    const targets = await prisma.target.findMany({ where: targetWhere });

    const getSegmentSummary = async (keywords) => {
      const sql = `
        ${cte}
        SELECT region_norm as witel, product_norm, status_group, COUNT(DISTINCT REGEXP_REPLACE(order_id, '^SC', ''))::int as count, SUM(revenue_clean) as total_rev
        FROM normalized_data
        WHERE (${keywords.map(k => `COALESCE(segmen, '') ILIKE '%${k}%'`).join(' OR ')})
        GROUP BY 1, 2, 3
      `;
      const rows = await prisma.$queryRawUnsafe(sql);
      const regions = ["BALI", "JATIM BARAT", "JATIM TIMUR", "NUSA TENGGARA", "SURAMADU"];
      const map = {};
      
      let totalOGP = 0;
      let totalClosed = 0;

      regions.forEach(r => {
        map[r] = { 
            nama_witel: r, 
            in_progress_n: 0, in_progress_o: 0, in_progress_ae: 0, in_progress_ps: 0, 
            prov_comp_n_realisasi: 0, prov_comp_n_target: 0, prov_comp_n_percentage: 0,
            prov_comp_o_realisasi: 0, prov_comp_o_target: 0, prov_comp_o_percentage: 0,
            prov_comp_ae_realisasi: 0, prov_comp_ae_target: 0, prov_comp_ae_percentage: 0,
            prov_comp_ps_realisasi: 0, prov_comp_ps_target: 0, prov_comp_ps_percentage: 0,
            revenue_n_ach: 0, revenue_o_ach: 0, revenue_ae_ach: 0, revenue_ps_ach: 0, 
            revenue_n_target: 0, revenue_o_target: 0, revenue_ae_target: 0, revenue_ps_target: 0 
        };
      });

      // Map Targets
      targets.forEach(t => {
        let tWitel = t.witel ? t.witel.toUpperCase() : 'OTHER';
        if (!map[tWitel]) return;

        let pCode = '';
        const pName = (t.product || '').toLowerCase();
        if (pName.includes('netmonk')) pCode = 'n';
        else if (pName.includes('oca')) pCode = 'o';
        else if (pName.includes('antares') || pName.includes('iot')) pCode = 'ae';
        else if (pName.includes('pijar')) pCode = 'ps';

        if (pCode) {
            map[tWitel][`prov_comp_${pCode}_target`] += Number(t.value);
        }
      });

      rows.forEach(row => {
        const r = row.witel === 'OTHER' ? 'BALI' : row.witel;
        if (!map[r]) return;
        
        const isDone = row.status_group === 'DONE';
        const p = row.product_norm;
        const pCode = p === 'Netmonk' ? 'n' : p === 'OCA' ? 'o' : p === 'Antares' ? 'ae' : 'ps';

        if (isDone) totalClosed += row.count;
        else totalOGP += row.count;

        if (pCode !== 'OTHER') {
          if (isDone) { 
            map[r][`prov_comp_${pCode}_realisasi`] += row.count; 
            map[r][`revenue_${pCode}_ach`] += Number(row.total_rev) / 1e6; 
          }
          else { 
            map[r][`in_progress_${pCode}`] += row.count; 
          }
        }
      });

      // Calculate Percentages
      Object.values(map).forEach(item => {
        ['n', 'o', 'ae', 'ps'].forEach(p => {
            const target = item[`prov_comp_${p}_target`];
            const real = item[`prov_comp_${p}_realisasi`];
            item[`prov_comp_${p}_percentage`] = target > 0 ? (real / target) * 100 : 0;
        });
      });

      return {
        data: Object.values(map),
        summary: {
          total: totalOGP + totalClosed,
          ogp: totalOGP,
          closed: totalClosed
        }
      };
    };

    const [legs, sme] = await Promise.all([
      getSegmentSummary(["LEGS", "DGS", "DPS", "DSS", "GOV", "ENTERPRISE", "REG"]),
      getSegmentSummary(["RBS", "SME"])
    ]);

    successResponse(res, { 
      legs: legs.data, 
      sme: sme.data, 
      detailsLegs: legs.summary, 
      detailsSme: sme.summary 
    });
  } catch (error) { next(error); }
};

export const getReportDetails = async (req, res, next) => {
  try {
    const { start_date, end_date, segment, witel } = req.query;
    const cte = normalizedDigitalCTE(start_date, end_date);
    
    let filter = `WHERE 1=1`;
    if (segment && segment !== 'ALL') {
        const segs = segment.split(',').map(s => `'${s}'`).join(',');
        filter += ` AND segment_group IN (${segs})`;
    }
    if (witel && witel !== 'ALL') {
        const wits = witel.split(',').map(w => `'${w.toUpperCase()}'`).join(',');
        filter += ` AND region_norm IN (${wits})`;
    }

    const sql = `${cte} SELECT * FROM normalized_data ${filter} ORDER BY order_date DESC LIMIT 2000`;
    const rows = await prisma.$queryRawUnsafe(sql);
    
    const formatted = rows.map(r => ({
        batchId: r.batch_id,
        orderId: r.order_id,
        segmen: r.segmen,
        channel: r.channel,
        product: r.product || '-',
        layanan: r.layanan,
        custName: r.cust_name,
        orderStatus: r.order_status,
        orderSubtype: r.order_subtype,
        milestone: r.milestone,
        week: r.week,
        orderDate: r.order_date || r.created_at,
        netPrice: Number(r.net_price || 0),
        witel: r.region_norm !== 'OTHER' ? r.region_norm : r.witel,
        telda: r.telda
    }));
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