import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";
import PO_MAPPING from "../utils/poMapping.js";

// --- CONSTANTS ---
const WITEL_ORDER = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'NUSA TENGGARA'];

// --- HELPERS (Gaya Oryza Rey) ---
const normalizedDatinCTE = (start_date, end_date) => `
  WITH normalized_data AS (
    SELECT
      *,
      CASE
        WHEN COALESCE(UPPER(witel_baru), UPPER(cust_witel)) IN ('BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG') THEN 'BALI'
        WHEN COALESCE(UPPER(witel_baru), UPPER(cust_witel)) IN ('JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG') THEN 'JATIM BARAT'
        WHEN COALESCE(UPPER(witel_baru), UPPER(cust_witel)) IN ('JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO') THEN 'JATIM TIMUR'
        WHEN COALESCE(UPPER(witel_baru), UPPER(cust_witel)) IN ('NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA') THEN 'NUSA TENGGARA'
        WHEN COALESCE(UPPER(witel_baru), UPPER(cust_witel)) IN ('SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES') THEN 'SURAMADU'
        ELSE 'OTHER' 
      END as region_norm,
      CASE
        WHEN COALESCE(UPPER(segmen), UPPER(segmen_baru)) IN ('BUMN', 'SOE', 'STATE-OWNED') THEN 'SOE'
        WHEN COALESCE(UPPER(segmen), UPPER(segmen_baru)) IN ('GOV', 'LEGS', 'DGS', 'DPS', 'ENTERPRISE') THEN 'GOV'
        WHEN COALESCE(UPPER(segmen), UPPER(segmen_baru)) IN ('SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE') THEN 'SME'
        ELSE 'PRIVATE'
      END as category_norm,
      CASE
        WHEN UPPER(li_status) IN ('PROVIDE ORDER', 'PROVIDE', 'READY TO BILL', 'PROV. COMPLETE', 'COMPLETED', 'CLOSED', 'LIVE') THEN 'READY TO BILL'
        WHEN UPPER(li_status) IN ('IN PROCESS', 'INPROGRESS') THEN 'IN PROCESS'
        ELSE 'PROVIDE ORDER'
      END as status_group,
      CASE
        WHEN UPPER(action_cd) IN ('A', 'NEW', 'INSTALL') THEN 'AO'
        WHEN UPPER(action_cd) IN ('D', 'TERM', 'DELETE') THEN 'DO'
        WHEN UPPER(action_cd) IN ('M', 'MODIFY', 'UPDATE', 'CHANGE') THEN 'MO'
        WHEN UPPER(action_cd) = 'S' THEN 'SO'
        WHEN UPPER(action_cd) = 'R' THEN 'RO'
        ELSE 'OTHER'
      END as order_type
    FROM sos_data
    WHERE 1=1
    ${start_date && end_date ? `AND order_created_date >= '${start_date}'::date AND order_created_date <= '${end_date}'::date` : ""}
  )
`;

export const getReportDatinSummary = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const cte = normalizedDatinCTE(start_date, end_date);

    const dataRaw = await prisma.$queryRawUnsafe(`
      ${cte}
      SELECT 
        region_norm as witel, 
        category_norm as category, 
        order_type, 
        status_group, 
        kategori_umur,
        COUNT(*)::int as count,
        SUM(COALESCE(revenue, 0)) as revenue,
        COALESCE(po_name, 'UNMAPPED') as po
      FROM normalized_data
      WHERE region_norm != 'OTHER'
      GROUP BY region_norm, category_norm, order_type, status_group, kategori_umur, po_name
    `);

    const table1Map = {}; const table2Map = {}; const galaksiMap = {};
    const categories = ['SME', 'GOV', 'PRIVATE', 'SOE'];

    categories.forEach(cat => {
      table1Map[cat] = {}; table2Map[cat] = {};
      WITEL_ORDER.forEach(w => {
        table1Map[cat][w] = { ao_3bln: 0, est_ao_3bln: 0, do_3bln: 0, est_do_3bln: 0, mo_3bln: 0, est_mo_3bln: 0, total_3bln: 0, est_3bln: 0, ao_3bln2: 0, est_ao_3bln2: 0, do_3bln2: 0, est_do_3bln2: 0, mo_3bln2: 0, est_mo_3bln2: 0, total_3bln2: 0, est_3bln2: 0, grand_total: 0 };
        table2Map[cat][w] = { provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 };
      });
    });

    dataRaw.forEach(row => {
      const isLT3 = row.kategori_umur === '< 3 BLN';
      const t1 = table1Map[row.category]?.[row.witel];
      const t2 = table2Map[row.category]?.[row.witel];

      if (t1) {
        if (isLT3) {
          if (row.order_type === 'AO') { t1.ao_3bln += row.count; t1.est_ao_3bln += Number(row.revenue); }
          else if (row.order_type === 'DO') { t1.do_3bln += row.count; t1.est_do_3bln += Number(row.revenue); }
          else if (row.order_type === 'MO') { t1.mo_3bln += row.count; t1.est_mo_3bln += Number(row.revenue); }
          t1.total_3bln += row.count; t1.est_3bln += Number(row.revenue);
        } else {
          if (row.order_type === 'AO') { t1.ao_3bln2 += row.count; t1.est_ao_3bln2 += Number(row.revenue); }
          else if (row.order_type === 'DO') { t1.do_3bln2 += row.count; t1.est_do_3bln2 += Number(row.revenue); }
          else if (row.order_type === 'MO') { t1.mo_3bln2 += row.count; t1.est_mo_3bln2 += Number(row.revenue); }
          t1.total_3bln2 += row.count; t1.est_3bln2 += Number(row.revenue);
        }
        t1.grand_total += row.count;
      }

      if (t2) {
        if (isLT3) {
          if (row.status_group === 'PROVIDE ORDER') t2.provide_order += row.count;
          else if (row.status_group === 'IN PROCESS') t2.in_process += row.count;
          else t2.ready_bill += row.count;
          t2.total_3bln += row.count;
        } else {
          if (row.status_group === 'PROVIDE ORDER') t2.provide_order2 += row.count;
          else if (row.status_group === 'IN PROCESS') t2.in_process2 += row.count;
          else t2.ready_bill2 += row.count;
          t2.total_3bln2 += row.count;
        }
        t2.grand_total += row.count;
      }

      const po = row.po.toUpperCase();
      if (!galaksiMap[po]) galaksiMap[po] = { po, ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, total_3bln: 0, ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, total_3bln2: 0 };
      const g = galaksiMap[po];
      if (isLT3) {
        if (row.order_type === 'AO') g.ao_3bln += row.count; else if (row.order_type === 'DO') g.do_3bln += row.count;
        g.total_3bln += row.count;
      } else {
        if (row.order_type === 'AO') g.ao_3bln2 += row.count; else if (row.order_type === 'DO') g.do_3bln2 += row.count;
        g.total_3bln2 += row.count;
      }
    });

    const table1Data = []; const table2Data = []; let id = 1;
    categories.forEach(cat => {
      const h1 = { id: id++, category: cat, isCategoryHeader: true, ao_3bln: 0, est_ao_3bln: 0, total_3bln: 0, est_3bln: 0, ao_3bln2: 0, est_ao_3bln2: 0, total_3bln2: 0, est_3bln2: 0, grand_total: 0 };
      const h2 = { id: id++, witel: cat, isCategoryHeader: true, provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 };
      const r1 = []; const r2 = [];
      WITEL_ORDER.forEach(w => {
        const d1 = table1Map[cat][w]; const d2 = table2Map[cat][w];
        h1.ao_3bln += d1.ao_3bln; h1.est_ao_3bln += d1.est_ao_3bln; h1.total_3bln += d1.total_3bln; h1.est_3bln += d1.est_3bln; h1.grand_total += d1.grand_total;
        h2.provide_order += d2.provide_order; h2.in_process += d2.in_process; h2.ready_bill += d2.ready_bill; h2.total_3bln += d2.total_3bln; h2.grand_total += d2.grand_total;
        r1.push({ id: id++, witel: w, ...d1, est_ao_3bln: (d1.est_ao_3bln/1e6).toFixed(1), est_do_3bln: (d1.est_do_3bln/1e6).toFixed(1), est_mo_3bln: (d1.est_mo_3bln/1e6).toFixed(1), est_3bln: (d1.est_3bln/1e6).toFixed(1) });
        r2.push({ id: id++, witel: w, ...d2 });
      });
      table1Data.push({ ...h1, est_ao_3bln: (h1.est_ao_3bln/1e6).toFixed(1), est_3bln: (h1.est_3bln/1e6).toFixed(1) }, ...r1);
      table2Data.push(h2, ...r2);
    });

    successResponse(res, { table1Data, table2Data, galaksiData: Object.values(galaksiMap) });
  } catch (error) { next(error); }
};

export const getReportDatinDetails = async (req, res, next) => {
  try {
    const { start_date, end_date, witel, segment, kategori, search, page = 1, limit = 10 } = req.query;
    const cte = normalizedDatinCTE(start_date, end_date);
    
    const dataRaw = await prisma.$queryRawUnsafe(`
      ${cte}
      SELECT * FROM normalized_data
      WHERE region_norm != 'OTHER'
      ${witel ? `AND region_norm = '${witel}'` : ""}
      ${segment ? `AND category_norm = '${segment}'` : ""}
      ${search ? `AND (order_id ILIKE '%${search}%' OR standard_name ILIKE '%${search}%')` : ""}
      ORDER BY order_created_date DESC
      LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `);

    const countRes = await prisma.$queryRawUnsafe(`${cte} SELECT COUNT(*)::int as total FROM normalized_data WHERE region_norm != 'OTHER'`);
    const total = countRes[0]?.total || 0;

    const data = dataRaw.map(r => ({
      ...r, orderId: r.order_id, orderDate: r.order_created_date, name: r.standard_name, status: r.li_status, produk: r.li_product_name, subSegmen: r.sub_segmen, kategoriUmur: r.kategori_umur, umurOrder: r.umur_order, billWitel: r.bill_witel, custWitel: r.cust_witel, serviceWitel: r.service_witel, milestone: r.li_milestone, biayaPasang: r.biaya_pasang, hargaBulanan: r.hrg_bulanan, lamaKontrak: r.lama_kontrak_hari, billCity: r.bill_city, tipeOrder: r.action_cd, witelBaru: r.witel_baru
    }));

    successResponse(res, { data, pagination: { page: Number(page), total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};
