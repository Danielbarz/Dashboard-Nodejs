import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

const cleanWitelName = (w) => (w || "").toUpperCase().replace("WITEL ", "").trim();

const WITEL_HIERARCHY = {
  BALI: ["BALI", "DENPASAR", "SINGARAJA", "GIANYAR", "TABANAN", "KLUNGKUNG", "BANGLI", "KARANGASEM", "JEMBRANA", "BADUNG"],
  "JATIM BARAT": ["JATIM BARAT", "KEDIRI", "MADIUN", "MALANG", "BATU", "BLITAR", "BOJONEGORO", "TUBAN", "LAMONGAN", "TULUNGAGUNG", "NGANJUK", "PONOROGO", "TRENGGALEK"],
  "JATIM TIMUR": ["JATIM TIMUR", "JEMBER", "PASURUAN", "SIDOARJO", "PROBOLINGGO", "LUMAJANG", "BONDOWOSO", "SITUBONDO", "BANYUWANGI", "MOJOKERTO", "JOMBANG"],
  "NUSA TENGGARA": ["NUSA TENGGARA", "NTT", "NTB", "KUPANG", "MATARAM", "SUMBAWA", "BIMA", "MAUMERE", "ENDE", "LOMBOK"],
  SURAMADU: ["SURAMADU", "SURABAYA", "MADURA", "PAMEKASAN", "SUMENEP", "BANGKALAN", "SAMPANG", "GRESIK"],
};

const findParent = (w) => {
  const wClean = cleanWitelName(w);
  if (WITEL_HIERARCHY[wClean]) return wClean;
  for (const [p, children] of Object.entries(WITEL_HIERARCHY)) {
    if (children.includes(wClean) || children.some((c) => wClean.includes(c))) return p;
  }
  return wClean;
};

export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    let dateFilter = "";
    const queryParams = [];
    if (start_date && end_date) {
      dateFilter = "WHERE tanggal_mom BETWEEN $1 AND $2";
      queryParams.push(new Date(start_date), new Date(end_date));
    }

    const rows = await prisma.$queryRawUnsafe(
      `SELECT
        TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) AS witel,
        TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
        SUM(CASE WHEN populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS jumlah_lop,
        SUM(COALESCE(revenue_plan,0)) AS rev_all,
        SUM(CASE WHEN (status_i_hld ILIKE '%GO LIVE%' OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS golive_jml,
        SUM(CASE WHEN (status_i_hld ILIKE '%GO LIVE%' OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN COALESCE(revenue_plan,0) ELSE 0 END) AS golive_rev,
        SUM(CASE WHEN populasi_non_drop = 'N' THEN 1 ELSE 0 END)::int AS drop_cnt,
        SUM(CASE WHEN status_i_hld ILIKE '%Initial%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_initial,
        SUM(CASE WHEN status_i_hld ILIKE '%Survey%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_survey,
        SUM(CASE WHEN status_i_hld ILIKE '%Perizinan%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_perizinan,
        SUM(CASE WHEN status_i_hld ILIKE '%Instalasi%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_instalasi,
        SUM(CASE WHEN status_i_hld ILIKE '%FI%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_fi
      FROM spmk_mom
      ${dateFilter}
      GROUP BY witel_baru, witel_lama`,
      ...queryParams
    );

    const parents = new Map();
    const tableData = [];
    rows.forEach((row) => {
      const witelNorm = row.witel;
      const parentKey = row.parent_witel || findParent(witelNorm);
      const r = {
        isParent: false, parentWitel: parentKey, witel: witelNorm, jumlahLop: Number(row.jumlah_lop), revAll: Number(row.rev_all),
        initial: Number(row.cnt_initial), survey: Number(row.cnt_survey), perizinan: Number(row.cnt_perizinan),
        instalasi: Number(row.cnt_instalasi), piOgp: Number(row.cnt_fi), golive_jml: Number(row.golive_jml),
        golive_rev: Number(row.golive_rev), drop: Number(row.drop_cnt),
      };
      r.persen_close = r.jumlahLop > 0 ? ((r.golive_jml / r.jumlahLop) * 100).toFixed(2) : "0.00";
      tableData.push(r);
      if (!parents.has(parentKey)) {
        parents.set(parentKey, {
          isParent: true, parentWitel: parentKey, witel: parentKey, jumlahLop: 0, revAll: 0,
          initial: 0, survey: 0, perizinan: 0, instalasi: 0, piOgp: 0, golive_jml: 0, golive_rev: 0, drop: 0,
        });
      }
      const p = parents.get(parentKey);
      p.jumlahLop += r.jumlahLop; p.revAll += r.revAll; p.golive_jml += r.golive_jml; p.golive_rev += r.golive_rev;
      p.drop += r.drop; p.initial += r.initial; p.survey += r.survey; p.perizinan += r.perizinan;
      p.instalasi += r.instalasi; p.piOgp += r.piOgp;
    });

    const finalTable = [];
    parents.forEach((p, key) => {
      p.persen_close = p.jumlahLop > 0 ? ((p.golive_jml / p.jumlahLop) * 100).toFixed(2) : "0.00";
      finalTable.push(p);
      finalTable.push(...tableData.filter((r) => r.parentWitel === key));
    });

    const rawActiveProjects = await prisma.spmkMom.findMany({
      where: { goLive: "N", populasiNonDrop: "Y" },
      orderBy: { usia: "desc" },
      take: 100
    });

    successResponse(res, { tableData: finalTable, rawProjectRows: rawActiveProjects });
  } catch (error) { next(error); }
};
