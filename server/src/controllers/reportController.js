import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";
import PO_MAPPING from "../utils/poMapping.js";

// --- CONSTANTS & HELPERS ---
const RSO2_WITELS = ["JATIM BARAT", "JATIM TIMUR", "SURAMADU", "BALI", "NUSA TENGGARA"];

const WITEL_HIERARCHY = {
  BALI: ["BALI", "DENPASAR", "SINGARAJA", "GIANYAR", "TABANAN", "KLUNGKUNG", "BANGLI", "KARANGASEM", "JEMBRANA", "BADUNG"],
  "JATIM BARAT": ["JATIM BARAT", "KEDIRI", "MADIUN", "MALANG", "BATU", "BLITAR", "BOJONEGORO", "TUBAN", "LAMONGAN", "TULUNGAGUNG", "NGANJUK", "PONOROGO", "TRENGGALEK"],
  "JATIM TIMUR": ["JATIM TIMUR", "JEMBER", "PASURUAN", "SIDOARJO", "PROBOLINGGO", "LUMAJANG", "BONDOWOSO", "SITUBONDO", "BANYUWANGI", "MOJOKERTO", "JOMBANG"],
  "NUSA TENGGARA": ["NUSA TENGGARA", "NTT", "NTB", "KUPANG", "MATARAM", "SUMBAWA", "BIMA", "MAUMERE", "ENDE", "LOMBOK"],
  SURAMADU: ["SURAMADU", "SURABAYA", "MADURA", "PAMEKASAN", "SUMENEP", "BANGKALAN", "SAMPANG", "GRESIK"],
};

const cleanWitelName = (w) => (w || "").toUpperCase().replace("WITEL ", "").trim();

const findParent = (w) => {
  const wClean = cleanWitelName(w);
  if (WITEL_HIERARCHY[wClean]) return wClean;
  for (const [p, children] of Object.entries(WITEL_HIERARCHY)) {
    if (children.includes(wClean) || children.some((c) => wClean.includes(c))) return p;
  }
  return wClean;
};

// --- DATIN HELPERS (Robust Mapping) ---
const getWitelKey = (row) => {
  const w = (row.witelBaru || row.custWitel || row.serviceWitel || row.custCity || "").toUpperCase();
  if (w.includes('BALI') || w.includes('DENPASAR')) return 'BALI';
  if (w.includes('BARAT') || w.includes('MALANG') || w.includes('MADIUN') || w.includes('KEDIRI')) return 'JATIM BARAT';
  if (w.includes('TIMUR') || w.includes('JEMBER') || w.includes('SIDOARJO')) return 'JATIM TIMUR';
  if (w.includes('NUSA') || w.includes('NTB') || w.includes('NTT') || w.includes('KUPANG')) return 'NUSA TENGGARA';
  if (w.includes('SURAMADU') || w.includes('SURABAYA') || w.includes('MADURA')) return 'SURAMADU';
  return 'OTHER';
};

const getCategory = (segmen) => {
  const s = (segmen || '').toUpperCase();
  if (['BUMN', 'SOE', 'STATE-OWNED'].some(k => s.includes(k))) return 'SOE';
  if (['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE'].some(k => s.includes(k))) return 'SME';
  if (['GOV', 'LEGS', 'DGS', 'DPS', 'ENTERPRISE'].some(k => s.includes(k))) return 'GOV';
  return 'PRIVATE';
};

// --- CONTROLLERS ---

export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    let dateFilter = start_date && end_date ? { tanggalMom: { gte: new Date(start_date), lte: new Date(end_date) } } : {};
    
    const rows = await prisma.spmkMom.findMany({
      where: { ...dateFilter, populasiNonDrop: 'Y' }
    });

    const summary = {};
    rows.forEach(r => {
      const w = cleanWitelName(r.witelBaru || r.witelLama || 'Unknown');
      if (!summary[w]) summary[w] = { witel: w, jumlahLop: 0, revAll: 0, golive_jml: 0, golive_rev: 0 };
      summary[w].jumlahLop++;
      summary[w].revAll += Number(r.revenuePlan || 0);
      if (r.goLive === 'Y') {
        summary[w].golive_jml++;
        summary[w].golive_rev += Number(r.revenuePlan || 0);
      }
    });

    successResponse(res, { tableData: Object.values(summary), rawProjectRows: rows.slice(0, 100) });
  } catch (error) { next(error); }
};

export const getReportDatinDetails = async (req, res, next) => {
  try {
    const { start_date, end_date, witel, segment, kategori, search, page = 1, limit = 10 } = req.query;
    let where = {};
    if (start_date && end_date && start_date !== 'undefined') {
      where.orderCreatedDate = { gte: new Date(start_date), lte: new Date(new Date(end_date).setHours(23, 59, 59, 999)) };
    }
    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { standardName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [dataRaw, total] = await Promise.all([
      prisma.sosData.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { orderCreatedDate: "desc" } }),
      prisma.sosData.count({ where }),
    ]);

    const data = dataRaw.map(r => ({
      ...r, orderDate: r.orderCreatedDate, name: r.standardName, status: r.liStatus, produk: r.liProductName
    }));

    successResponse(res, { data, pagination: { page: Number(page), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (error) { next(error); }
};

export const getReportDatinSummary = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    let whereClause = {};
    if (start_date && end_date && start_date !== 'undefined') {
      whereClause.orderCreatedDate = { gte: new Date(start_date), lte: new Date(new Date(end_date).setHours(23, 59, 59, 999)) };
    }

    const data = await prisma.sosData.findMany({ where: whereClause });
    const categories = ['SME', 'GOV', 'PRIVATE', 'SOE'];
    const majorWitels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'];
    const table1Map = {}; const table2Map = {}; const galaksiMap = {};

    categories.forEach(cat => {
      table1Map[cat] = { category: cat, witels: {} };
      table2Map[cat] = { category: cat, witels: {} };
      majorWitels.forEach(w => {
        table1Map[cat].witels[w] = { ao_3bln: 0, est_ao_3bln: 0, total_3bln: 0, est_3bln: 0, ao_3bln2: 0, est_ao_3bln2: 0, total_3bln2: 0, est_3bln2: 0, grand_total: 0 };
        table2Map[cat].witels[w] = { provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 };
      });
    });

    const now = new Date();
    data.forEach(row => {
      const wKey = getWitelKey(row);
      if (wKey === 'OTHER') return;
      const cat = getCategory(row.segmen);
      const orderDate = row.orderCreatedDate || now;
      const isLT3 = Math.ceil(Math.abs(now - orderDate) / (1000 * 60 * 60 * 24 * 30)) <= 3;
      const rev = parseFloat(row.revenue || 0);

      const t1 = table1Map[cat].witels[wKey];
      if (isLT3) { t1.ao_3bln++; t1.est_ao_3bln += rev; t1.total_3bln++; t1.est_3bln += rev; }
      else { t1.ao_3bln2++; t1.est_ao_3bln2 += rev; t1.total_3bln2++; t1.est_3bln2 += rev; }
      t1.grand_total++;

      const t2 = table2Map[cat].witels[wKey];
      if (isLT3) { t2.total_3bln++; } else { t2.total_3bln2++; }
      t2.grand_total++;
    });

    const table1Data = []; const table2Data = []; let id = 1;
    categories.forEach(cat => {
      const h1 = { id: id++, category: cat, isCategoryHeader: true, ao_3bln: 0, est_ao_3bln: 0, total_3bln: 0, est_3bln: 0, ao_3bln2: 0, est_ao_3bln2: 0, total_3bln2: 0, est_3bln2: 0, grand_total: 0 };
      const h2 = { id: id++, witel: cat, isCategoryHeader: true, provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0, provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0, grand_total: 0 };
      const r1 = []; const r2 = [];
      majorWitels.forEach(w => {
        const d1 = table1Map[cat].witels[w]; const d2 = table2Map[cat].witels[w];
        h1.ao_3bln += d1.ao_3bln; h1.est_ao_3bln += d1.est_ao_3bln; h1.total_3bln += d1.total_3bln; h1.est_3bln += d1.est_3bln; h1.grand_total += d1.grand_total;
        r1.push({ id: id++, witel: w, ...d1, est_ao_3bln: (d1.est_ao_3bln/1e6).toFixed(1), est_3bln: (d1.est_3bln/1e6).toFixed(1) });
        r2.push({ id: id++, witel: w, ...d2 });
      });
      table1Data.push({ ...h1, est_ao_3bln: (h1.est_ao_3bln/1e6).toFixed(1), est_3bln: (h1.est_3bln/1e6).toFixed(1) }, ...r1);
      table2Data.push(h2, ...r2);
    });

    successResponse(res, { table1Data, table2Data, galaksiData: [] });
  } catch (error) { next(error); }
};

export const getReportAnalysis = async (req, res, next) => {
  try {
    const data = await prisma.digitalProduct.findMany({ take: 100 });
    successResponse(res, { legs: [], sme: [], rawData: data });
  } catch (error) { next(error); }
};

export const getKPIPOData = async (req, res, next) => {
  try {
    const aos = await prisma.accountOfficer.findMany();
    successResponse(res, aos.map(a => ({ nama_po: a.name, witel: a.displayWitel, total: 0, ach_ytd: 0 })));
  } catch (error) { next(error); }
};

export const getReportDatin = async (req, res, next) => { successResponse(res, { tableData: [] }); };
export const getReportDetails = async (req, res, next) => { successResponse(res, []); };
