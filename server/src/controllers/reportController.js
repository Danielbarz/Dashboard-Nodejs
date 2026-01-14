import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";
import PO_MAPPING from "../utils/poMapping.js";

// --- CONSTANTS & HELPERS FOR JARINGAN TAMBAHAN (JT) ---
const RSO2_WITELS = [
  "JATIM BARAT",
  "JATIM TIMUR",
  "SURAMADU",
  "BALI",
  "NUSA TENGGARA",
];

const WITEL_HIERARCHY = {
  BALI: [
    "BALI",
    "DENPASAR",
    "SINGARAJA",
    "GIANYAR",
    "TABANAN",
    "KLUNGKUNG",
    "BANGLI",
    "KARANGASEM",
    "JEMBRANA",
    "BADUNG",
  ],
  "JATIM BARAT": [
    "JATIM BARAT",
    "KEDIRI",
    "MADIUN",
    "MALANG",
    "MOJOKERTO",
    "TULUNGAGUNG",
    "BLITAR",
    "JOMBANG",
    "NGANJUK",
    "PONOROGO",
    "TRENGGALEK",
    "PACITAN",
    "NGAWI",
    "MAGETAN",
    "BOJONEGORO",
    "TUBAN",
    "LAMONGAN",
    "BATU",
  ],
  "JATIM TIMUR": [
    "JATIM TIMUR",
    "JEMBER",
    "PASURUAN",
    "SIDOARJO",
    "PROBOLINGGO",
    "LUMAJANG",
    "BONDOWOSO",
    "SITUBONDO",
    "BANYUWANGI",
  ],
  "NUSA TENGGARA": [
    "NUSA TENGGARA",
    "NTT",
    "NTB",
    "KUPANG",
    "MATARAM",
    "SUMBAWA",
    "BIMA",
    "MAUMERE",
    "ENDE",
    "FLORES",
    "LOMBOK",
  ],
  SURAMADU: [
    "SURAMADU",
    "SURABAYA UTARA",
    "SURABAYA SELATAN",
    "MADURA",
    "PAMEKASAN",
    "SUMENEP",
    "BANGKALAN",
    "SAMPANG",
    "GRESIK",
    "SIDOARJO",
  ],
};

const cleanWitelName = (w) =>
  (w || "").toUpperCase().replace("WITEL ", "").trim();

const findParent = (w) => {
  const wClean = cleanWitelName(w);
  if (WITEL_HIERARCHY[wClean]) return wClean;

  for (const [p, children] of Object.entries(WITEL_HIERARCHY)) {
    if (children.includes(wClean)) return p;
    if (children.some((c) => wClean.includes(c))) return p;
  }
  return wClean;
};

// --- CONTROLLERS ---

export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = "";
    const queryParams = [];
    if (start_date && end_date) {
      dateFilter = "WHERE tanggal_mom BETWEEN $1 AND $2";
      queryParams.push(new Date(start_date));
      queryParams.push(new Date(end_date));
    }

    const accountOfficers = await prisma.accountOfficer.findMany({
      orderBy: { name: "asc" },
    });
    const sortedAOs = [...accountOfficers].sort((a, b) => {
      if (!!a.specialFilterColumn && !b.specialFilterColumn) return -1;
      if (!a.specialFilterColumn && !!b.specialFilterColumn) return 1;
      return 0;
    });

    const findAO = (cleanWitel, parentWitel, segment) => {
      const witelNorm = (cleanWitel || "").toUpperCase();
      const parentNorm = (parentWitel || "").toUpperCase();
      const segmentNorm = (segment || "").toUpperCase();
      for (const ao of sortedAOs) {
        const wFilters = (ao.filterWitelLama || "")
          .toUpperCase()
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        const witelMatch = wFilters.some(
          (f) => witelNorm.includes(f) || parentNorm.includes(f)
        );
        if (!witelMatch) continue;
        if (ao.specialFilterColumn && ao.specialFilterValue) {
          const col = ao.specialFilterColumn.toLowerCase();
          const val = ao.specialFilterValue.toUpperCase();
          if (
            (col === "segment" || col === "segmen") &&
            segmentNorm.includes(val)
          )
            return ao;
        } else return ao;
      }
      return null;
    };

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
      GROUP BY witel_baru, witel_lama
      ORDER BY witel_baru, witel_lama`,
      ...queryParams
    );

    const parents = new Map();
    const tableData = [];
    rows.forEach((row) => {
      const witelNorm = row.witel;
      const parentKey = row.parent_witel || findParent(witelNorm);
      const r = {
        isParent: false,
        parentWitel: parentKey,
        witel: witelNorm,
        jumlahLop: Number(row.jumlah_lop),
        revAll: Number(row.rev_all),
        initial: Number(row.cnt_initial),
        survey: Number(row.cnt_survey),
        perizinan: Number(row.cnt_perizinan),
        instalasi: Number(row.cnt_instalasi),
        piOgp: Number(row.cnt_fi),
        golive_jml: Number(row.golive_jml),
        golive_rev: Number(row.golive_rev),
        drop: Number(row.drop_cnt),
      };
      r.persen_close =
        r.jumlahLop > 0
          ? ((r.golive_jml / r.jumlahLop) * 100).toFixed(2)
          : "0.00";
      tableData.push(r);
      if (!parents.has(parentKey)) {
        parents.set(parentKey, {
          isParent: true,
          parentWitel: parentKey,
          witel: parentKey,
          jumlahLop: 0,
          revAll: 0,
          initial: 0,
          survey: 0,
          perizinan: 0,
          instalasi: 0,
          piOgp: 0,
          golive_jml: 0,
          golive_rev: 0,
          drop: 0,
        });
      }
      const p = parents.get(parentKey);
      p.jumlahLop += r.jumlahLop;
      p.revAll += r.revAll;
      p.golive_jml += r.golive_jml;
      p.golive_rev += r.golive_rev;
      p.drop += r.drop;
      p.initial += r.initial;
      p.survey += r.survey;
      p.perizinan += r.perizinan;
      p.instalasi += r.instalasi;
      p.piOgp += r.piOgp;
    });

    const finalTable = [];
    parents.forEach((p, key) => {
      p.persen_close =
        p.jumlahLop > 0
          ? ((p.golive_jml / p.jumlahLop) * 100).toFixed(2)
          : "0.00";
      finalTable.push(p);
      finalTable.push(...tableData.filter((r) => r.parentWitel === key));
    });

    const projectRowsSql = await prisma.$queryRawUnsafe(
      `SELECT TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) AS witel, TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%DALAM%' THEN 1 ELSE 0 END)::int AS dalam_toc,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%LEWAT%' THEN 1 ELSE 0 END)::int AS lewat_toc,
        SUM(CASE WHEN go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS lop_progress
      FROM spmk_mom ${
        dateFilter
          ? `${dateFilter} AND go_live = 'N' AND populasi_non_drop = 'Y'`
          : "WHERE go_live = 'N' AND populasi_non_drop = 'Y'"
      }
      GROUP BY witel_baru, witel_lama`,
      ...queryParams
    );

    const parentProjects = new Map();
    const projectData = [];
    projectRowsSql.forEach((row) => {
      const witelNorm = row.witel;
      const parentKey = row.parent_witel || findParent(witelNorm);
      const d = {
        isParent: false,
        parentWitel: parentKey,
        witel: witelNorm,
        dalam_toc: Number(row.dalam_toc),
        lewat_toc: Number(row.lewat_toc),
        jumlah_lop_progress: Number(row.lop_progress),
      };
      d.persen_dalam_toc =
        d.dalam_toc + d.lewat_toc > 0
          ? ((d.dalam_toc / (d.dalam_toc + d.lewat_toc)) * 100).toFixed(2)
          : "0.00";
      projectData.push(d);
      if (!parentProjects.has(parentKey))
        parentProjects.set(parentKey, {
          isParent: true,
          parentWitel: parentKey,
          witel: parentKey,
          dalam_toc: 0,
          lewat_toc: 0,
          jumlah_lop_progress: 0,
        });
      const p = parentProjects.get(parentKey);
      p.dalam_toc += d.dalam_toc;
      p.lewat_toc += d.lewat_toc;
      p.jumlah_lop_progress += d.jumlah_lop_progress;
    });

    const finalProjects = [];
    parentProjects.forEach((p, key) => {
      p.persen_dalam_toc =
        p.dalam_toc + p.lewat_toc > 0
          ? ((p.dalam_toc / (p.dalam_toc + p.lewat_toc)) * 100).toFixed(2)
          : "0.00";
      finalProjects.push(p);
      finalProjects.push(...projectData.filter((r) => r.parentWitel === key));
    });

    const top3WitelRaw = await prisma.$queryRawUnsafe(
      `WITH Ranked AS (SELECT TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) as witel_norm, id_i_hld, tanggal_mom, revenue_plan, status_tomps_new, usia, uraian_kegiatan, ROW_NUMBER() OVER (PARTITION BY TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) ORDER BY usia DESC) as rn FROM spmk_mom WHERE go_live = 'N' AND populasi_non_drop = 'Y') SELECT * FROM Ranked WHERE rn <= 3 ORDER BY witel_norm, rn`
    );
    const rawActiveProjects = await prisma.spmkMom.findMany({
      where: { goLive: "N", populasiNonDrop: "Y" },
      select: {
        witelLama: true,
        witelBaru: true,
        segmen: true,
        poName: true,
        idIHld: true,
        tanggalMom: true,
        revenuePlan: true,
        statusTompsNew: true,
        usia: true,
        uraianKegiatan: true,
      },
      orderBy: { usia: "desc" },
    });
    const poGroups = {};
    rawActiveProjects.forEach((proj) => {
      const rawWitel = cleanWitelName(proj.witelLama || proj.witelBaru);
      const parent = findParent(rawWitel);
      const ao = findAO(rawWitel, parent, proj.segmen);
      const aoName = ao ? ao.name : proj.poName || "UNMAPPED PO";
      if (!poGroups[aoName]) poGroups[aoName] = [];
      if (poGroups[aoName].length < 3)
        poGroups[aoName].push({
          po_name: aoName,
          witel_norm: rawWitel,
          id_i_hld: proj.idIHld,
          tanggal_mom: proj.tanggalMom,
          revenue_plan: Number(proj.revenuePlan || 0),
          status_tomps_new: proj.statusTompsNew,
          usia: proj.usia,
          uraian_kegiatan: proj.uraianKegiatan,
        });
    });
    const top3PoMapped = [];
    Object.keys(poGroups)
      .sort()
      .forEach((key) =>
        poGroups[key].forEach((item, idx) =>
          top3PoMapped.push({ ...item, rn: idx + 1 })
        )
      );

    const rawRevenueData = await prisma.$queryRawUnsafe(
      `SELECT TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) as witel, segmen, po_name, SUM(COALESCE(revenue_plan,0)) as total_revenue, COUNT(*)::int as project_count FROM spmk_mom ${
        dateFilter
          ? `${dateFilter} AND populasi_non_drop = 'Y'`
          : "WHERE populasi_non_drop = 'Y'"
      } GROUP BY witel_lama, witel_baru, segmen, po_name`,
      ...queryParams
    );
    const revenueMap = {};
    rawRevenueData.forEach((row) => {
      const witelClean = row.witel;
      const parent = findParent(witelClean);
      const ao = findAO(witelClean, parent, row.segmen);
      const aoName = ao ? ao.name : row.po_name || "UNMAPPED PO";
      if (!revenueMap[aoName])
        revenueMap[aoName] = {
          poName: aoName,
          totalRevenue: 0,
          projectCount: 0,
        };
      revenueMap[aoName].totalRevenue += Number(row.total_revenue);
      revenueMap[aoName].projectCount += Number(row.project_count);
    });
    const topMitraRevenue = Object.values(revenueMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    const bucketUsiaRaw = await prisma.$queryRawUnsafe(
      `SELECT CASE WHEN usia < 30 THEN '< 30 Hari' WHEN usia BETWEEN 30 AND 60 THEN '30 - 60 Hari' WHEN usia BETWEEN 61 AND 90 THEN '61 - 90 Hari' ELSE '> 90 Hari' END as range, COUNT(*)::int as count FROM spmk_mom WHERE go_live = 'N' AND populasi_non_drop = 'Y' GROUP BY range ORDER BY range`
    );
    const trendRaw = await prisma.$queryRawUnsafe(
      `SELECT TO_CHAR(tanggal_mom, 'YYYY-MM') as month, COUNT(*)::int as total_order, SUM(CASE WHEN go_live = 'Y' THEN 1 ELSE 0 END)::int as total_golive FROM spmk_mom ${
        dateFilter
          ? `${dateFilter} AND populasi_non_drop = 'Y'`
          : "WHERE populasi_non_drop = 'Y'"
      } GROUP BY month ORDER BY month`,
      ...queryParams
    );

    const formatRawWitel = (rows) =>
      rows.map((r) => ({
        ...r,
        region: findParent(r.witel_norm || r.witel || ""),
        revenue_plan: Number(r.revenue_plan || 0),
        usia: Number(r.usia || 0),
        rn: Number(r.rn),
      }));
    const rawProjects = await prisma.spmkMom.findMany({
      where: {
        ...(start_date &&
          end_date && {
            tanggalMom: { gte: new Date(start_date), lte: new Date(end_date) },
          }),
      },
      orderBy: { usia: "desc" },
      take: 500,
    });

    return successResponse(
      res,
      {
        tableData: finalTable,
        projectData: finalProjects,
        topUsiaByWitel: formatRawWitel(top3WitelRaw),
        topUsiaByPo: top3PoMapped,
        bucketUsiaData: bucketUsiaRaw,
        trendGolive: trendRaw,
        topMitraRevenue,
        rawProjectRows: rawProjects,
      },
      "Report Tambahan data retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getReportDatin = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    let whereClause = { statusProyek: { contains: "DATIN" } };
    if (start_date && end_date) {
      whereClause.createdAt = {
        gte: new Date(start_date),
        lte: new Date(end_date),
      };
    }
    const tableData = await prisma.spmkMom.groupBy({
      by: ["witelBaru", "region"],
      where: whereClause,
      _count: { id: true },
      _sum: { revenuePlan: true, rab: true },
    });
    const formattedTableData = tableData.map((row) => ({
      witel: row.witelBaru || "Unknown",
      branch: row.region || "Unknown",
      totalAmount: parseFloat(row._sum.revenuePlan || 0),
      jumlahProject: row._count.id,
      selesai: 0,
      progress: row._count.id,
    }));
    successResponse(
      res,
      { tableData: formattedTableData, posisiGalaksi: [] },
      "Report Datin data retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getReportAnalysis = async (req, res, next) => {
  try {
    const { start_date, end_date, witel } = req.query;
    let whereClause = {};
    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date),
      };
    }
    const regionMapping = {
      BALI: [
        "BALI",
        "DENPASAR",
        "GIANYAR",
        "JEMBRANA",
        "JIMBARAN",
        "KLUNGKUNG",
        "Non-Telda (NCX)",
        "SANUR",
        "SINGARAJA",
        "TABANAN",
        "UBUNG",
      ],
      "JATIM BARAT": [
        "JATIM BARAT",
        "MALANG",
        "BATU",
        "BLITAR",
        "BOJONEGORO",
        "KEDIRI",
        "KEPANJEN",
        "MADIUN",
        "NGANJUK",
        "NGAWI",
        "PONOROGO",
        "TRENGGALEK",
        "TUBAN",
        "TULUNGAGUNG",
      ],
      "JATIM TIMUR": [
        "JATIM TIMUR",
        "SIDOARJO",
        "BANYUWANGI",
        "BONDOWOSO",
        "INNER - JATIM TIMUR",
        "JEMBER",
        "JOMBANG",
        "LUMAJANG",
        "MOJOKERTO",
        "Non-Telda (NCX)",
        "PASURUAN",
        "PROBOLINGGO",
        "SITUBONDO",
      ],
      "NUSA TENGGARA": [
        "NUSA TENGGARA",
        "NTB",
        "NTT",
        "ATAMBUA",
        "BIMA",
        "ENDE",
        "INNER - NUSA TENGGARA",
        "KUPANG",
        "LABOAN BAJO",
        "LOMBOK BARAT TENGAH",
        "LOMBOK TIMUR UTARA",
        "MAUMERE",
        "Non-Telda (NCX)",
        "SUMBAWA",
        "WAIKABUBAK",
        "WAINGAPU",
      ],
      SURAMADU: [
        "SURAMADU",
        "BANGKALAN",
        "GRESIK",
        "KENJERAN",
        "KETINTANG",
        "LAMONGAN",
        "MANYAR",
        "Non-Telda (NCX)",
        "PAMEKASAN",
        "TANDES",
      ],
    };
    let selectedRegion = null;
    let targetRows = [
      "BALI",
      "JATIM BARAT",
      "JATIM TIMUR",
      "NUSA TENGGARA",
      "SURAMADU",
    ];
    if (witel) {
      const wArr = witel
        .split(",")
        .map((w) => w.trim())
        .filter((w) => w);
      if (wArr.length === 1 && regionMapping[wArr[0]]) {
        selectedRegion = wArr[0];
        targetRows = regionMapping[selectedRegion];
      } else if (wArr.length > 0) {
        targetRows = targetRows.filter((r) => wArr.includes(r));
      }
    }
    const getSegmentData = async (segmentKeywords) => {
      const keywords = Array.isArray(segmentKeywords)
        ? segmentKeywords
        : [segmentKeywords];
      const data = await prisma.digitalProduct.findMany({
        where: {
          ...whereClause,
          OR: keywords.map((k) => ({
            segment: { contains: k, mode: "insensitive" },
          })),
        },
        select: { witel: true, productName: true, status: true, revenue: true },
      });
      const witelMap = {};
      targetRows.forEach((w) => {
        witelMap[w] = {
          nama_witel: w,
          in_progress_n: 0,
          in_progress_o: 0,
          in_progress_ae: 0,
          in_progress_ps: 0,
          prov_comp_n_realisasi: 0,
          prov_comp_o_realisasi: 0,
          prov_comp_ae_realisasi: 0,
          prov_comp_ps_realisasi: 0,
          revenue_n_ach: 0,
          revenue_n_target: 0,
          revenue_o_ach: 0,
          revenue_o_target: 0,
          revenue_ae_ach: 0,
          revenue_ae_target: 0,
          revenue_ps_ach: 0,
          revenue_ps_target: 0,
        };
      });
      let totalOgp = 0;
      let totalClosed = 0;
      data.forEach((row) => {
        let rawW = (row.witel || "").toUpperCase();
        let mappedName = null;
        if (selectedRegion) {
          const found = regionMapping[selectedRegion].find((b) =>
            rawW.includes(b)
          );
          if (found) mappedName = found;
        } else {
          for (const [reg, branches] of Object.entries(regionMapping)) {
            if (branches.some((b) => rawW.includes(b))) {
              mappedName = reg;
              break;
            }
          }
        }
        if (!mappedName && !selectedRegion) {
          if (rawW.includes("BALI")) mappedName = "BALI";
          else if (rawW.includes("BARAT")) mappedName = "JATIM BARAT";
          else if (rawW.includes("TIMUR")) mappedName = "JATIM TIMUR";
          else if (rawW.includes("NUSA")) mappedName = "NUSA TENGGARA";
          else if (rawW.includes("SURAMADU")) mappedName = "SURAMADU";
        }
        if (!mappedName || !witelMap[mappedName]) return;
        let pCode = "";
        const pN = (row.productName || "").toLowerCase();
        if (pN.includes("netmonk")) pCode = "n";
        else if (pN.includes("oca")) pCode = "o";
        else if (
          pN.includes("antares") ||
          pN.includes("camera") ||
          pN.includes("cctv") ||
          pN.includes("iot")
        )
          pCode = "ae";
        else if (pN.includes("pijar")) pCode = "ps";
        if (!pCode) return;
        const stat = (row.status || "").toLowerCase();
        const isDone = [
          "completed",
          "activated",
          "live",
          "done",
          "closed",
        ].some((s) => stat.includes(s));
        if (!isDone) {
          witelMap[mappedName][`in_progress_${pCode}`]++;
          totalOgp++;
        } else {
          witelMap[mappedName][`prov_comp_${pCode}_realisasi`]++;
          witelMap[mappedName][`revenue_${pCode}_ach`] +=
            parseFloat(row.revenue || 0) / 1000000;
          totalClosed++;
        }
      });
      return {
        data: Object.values(witelMap),
        details: {
          total: totalOgp + totalClosed,
          ogp: totalOgp,
          closed: totalClosed,
        },
      };
    };
    const legs = await getSegmentData([
      "LEGS",
      "DGS",
      "DPS",
      "GOV",
      "ENTERPRISE",
      "REG",
    ]);
    const sme = await getSegmentData([
      "SME",
      "DSS",
      "RBS",
      "RETAIL",
      "UMKM",
      "FINANCIAL",
      "LOGISTIC",
      "TOURISM",
      "MANUFACTURE",
    ]);
    successResponse(
      res,
      {
        legs: legs.data,
        sme: sme.data,
        detailsLegs: legs.details,
        detailsSme: sme.details,
      },
      "Report Analysis data retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

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
    const witelIncludeFilter = `UPPER(witel) IN (${allowedWitels
      .map((w) => `'${w}'`)
      .join(",")})`;
    let dateFilter = "";
    if (start_date && end_date) {
      const start = new Date(start_date);
      const end = new Date(end_date);
      dateFilter = `AND "order_date" >= '${
        start.toISOString().split("T")[0]
      }'::date AND "order_date" <= '${end.toISOString().split("T")[0]}'::date`;
    }
    const rawData = await prisma.$queryRawUnsafe(
      `SELECT witel, witel_old, SUM(CASE WHEN kelompok_status = 'PRE PI' THEN 1 ELSE 0 END) as pre_pi, COUNT(*) as registered, SUM(CASE WHEN kelompok_status = 'INPROGRESS_SC' THEN 1 ELSE 0 END) as inprogress_sc, SUM(CASE WHEN kelompok_status = 'QC1' THEN 1 ELSE 0 END) as qc1, SUM(CASE WHEN kelompok_status = 'FCC' THEN 1 ELSE 0 END) as fcc, SUM(CASE WHEN kelompok_status = 'REJECT_FCC' THEN 1 ELSE 0 END) as cancel_by_fcc, SUM(CASE WHEN kelompok_status = 'SURVEY_NEW_MANJA' THEN 1 ELSE 0 END) as survey_new_manja, SUM(CASE WHEN kelompok_status = 'UNSC' THEN 1 ELSE 0 END) as unsc, SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 < 24 THEN 1 ELSE 0 END) as pi_under_1_hari, SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 >= 24 AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 <= 72 THEN 1 ELSE 0 END) as pi_1_3_hari, SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 > 72 THEN 1 ELSE 0 END) as pi_over_3_hari, SUM(CASE WHEN kelompok_status = 'PI' THEN 1 ELSE 0 END) as total_pi, SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as fo_wfm_kndl_plgn, SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as fo_wfm_kndl_teknis, SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as fo_wfm_kndl_sys, SUM(CASE WHEN kelompok_status = 'FO_WFM' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as fo_wfm_others, SUM(CASE WHEN kelompok_status = 'FO_UIM' THEN 1 ELSE 0 END) as fo_uim, SUM(CASE WHEN kelompok_status = 'FO_ASAP' THEN 1 ELSE 0 END) as fo_asp, SUM(CASE WHEN kelompok_status = 'FO_OSM' THEN 1 ELSE 0 END) as fo_osm, SUM(CASE WHEN kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM') THEN 1 ELSE 0 END) as total_fallout, SUM(CASE WHEN kelompok_status = 'ACT_COM' THEN 1 ELSE 0 END) as act_comp, SUM(CASE WHEN kelompok_status = 'PS' THEN 1 ELSE 0 END) as jml_comp_ps, SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as cancel_kndl_plgn, SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as cancel_kndl_teknis, SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as cancel_kndl_sys, SUM(CASE WHEN kelompok_status = 'CANCEL' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as cancel_others, SUM(CASE WHEN kelompok_status = 'CANCEL' THEN 1 ELSE 0 END) as total_cancel, SUM(CASE WHEN kelompok_status = 'REVOKE' THEN 1 ELSE 0 END) as revoke FROM hsi_data WHERE ${witelIncludeFilter} ${dateFilter} GROUP BY witel, witel_old HAVING witel_old IS NOT NULL AND witel_old != '' ORDER BY witel, witel_old`
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
      { reportData: finalData, totals },
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

export const getReportDetails = async (req, res, next) => {
  try {
    const { start_date, end_date, segment, witel, status } = req.query;
    let where = {};
    if (start_date && end_date)
      where.orderDate = { gte: new Date(start_date), lte: new Date(end_date) };
    if (segment) {
      const sArr = segment
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const exp = [];
      sArr.forEach((s) => {
        if (s.toUpperCase() === "SME")
          exp.push(
            "SME",
            "DSS",
            "RBS",
            "RETAIL",
            "UMKM",
            "FINANCIAL",
            "LOGISTIC",
            "TOURISM",
            "MANUFACTURE"
          );
        else if (s.toUpperCase() === "LEGS")
          exp.push("LEGS", "DGS", "DPS", "GOV", "ENTERPRISE", "REG");
        else exp.push(s);
      });
      where.OR = exp.map((s) => ({
        segment: { contains: s, mode: "insensitive" },
      }));
    }
    if (witel) {
      const mapping = {
        BALI: ["DENPASAR", "SINGARAJA", "GIANYAR"],
        "JATIM BARAT": ["KEDIRI", "MADIUN", "MALANG"],
        "JATIM TIMUR": ["JEMBER", "PASURUAN", "SIDOARJO"],
        "NUSA TENGGARA": ["NTT", "NTB"],
        SURAMADU: ["MADURA", "BANGKALAN", "GRESIK"],
      };
      let targets = [];
      witel.split(",").forEach((w) => {
        const trim = w.trim();
        if (mapping[trim]) targets = [...targets, ...mapping[trim]];
        else targets.push(trim);
      });
      if (targets.length > 0) where.witel = { in: targets };
    }
    const data = await prisma.digitalProduct.findMany({
      where: {
        AND: [
          where,
          {
            OR: [
              { productName: { contains: "netmonk", mode: "insensitive" } },
              { productName: { contains: "oca", mode: "insensitive" } },
              { productName: { contains: "antares", mode: "insensitive" } },
              { productName: { contains: "pijar", mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: { orderDate: "desc" },
    });
    const formatted = data.map((row) => ({
      order_id: row.orderNumber,
      product_name: row.productName,
      witel: row.witel,
      customer_name: row.customerName,
      milestone: row.milestone,
      order_created_date: row.orderDate,
      segment: row.segment,
      order_status: row.status,
      net_price: parseFloat(row.revenue || 0),
    }));
    successResponse(res, formatted, "Report details retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getKPIPOData = async (req, res, next) => {
  try {
    const { start_date, end_date, witel } = req.query;
    const aos = await prisma.accountOfficer.findMany({
      orderBy: { name: "asc" },
    });
    let where = {};
    if (start_date && end_date)
      where.orderDate = { gte: new Date(start_date), lte: new Date(end_date) };
    const digital = await prisma.digitalProduct.findMany({
      where: {
        AND: [
          where,
          {
            OR: [
              { productName: { contains: "netmonk", mode: "insensitive" } },
              { productName: { contains: "oca", mode: "insensitive" } },
              { productName: { contains: "antares", mode: "insensitive" } },
              { productName: { contains: "pijar", mode: "insensitive" } },
            ],
          },
        ],
      },
    });
    const result = aos.map((ao) => {
      const relevant = digital.filter((row) => {
        const filters = (ao.filterWitelLama || "")
          .toLowerCase()
          .split(",")
          .map((s) => s.trim());
        const rowW = (row.witel || "").toLowerCase();
        const wMatch = filters.some((f) => rowW.includes(f));
        let sMatch = true;
        if (ao.specialFilterColumn && ao.specialFilterValue) {
          const rowVal = (
            row[
              ao.specialFilterColumn === "segment"
                ? "segment"
                : ao.specialFilterColumn
            ] || ""
          ).toLowerCase();
          sMatch = rowVal.includes(ao.specialFilterValue.toLowerCase());
        }
        return wMatch && sMatch;
      });
      let d_ncx = 0;
      let d_scone = 0;
      let o_ncx = 0;
      let o_scone = 0;
      relevant.forEach((row) => {
        const isNcx = row.witel && row.witel.toUpperCase().includes("NCX");
        const isDone = [
          "completed",
          "activated",
          "live",
          "closed",
          "done",
        ].some((s) => (row.status || "").toLowerCase().includes(s));
        if (isDone) {
          if (isNcx) d_ncx++;
          else d_scone++;
        } else {
          if (isNcx) o_ncx++;
          else o_scone++;
        }
      });
      const total = d_ncx + d_scone + o_ncx + o_scone;
      return {
        nama_po: ao.name,
        witel: ao.displayWitel,
        done_ncx: d_ncx,
        done_scone: d_scone,
        ogp_ncx: o_ncx,
        ogp_scone: o_scone,
        total,
        ach_ytd: total > 0 ? (((d_ncx + d_scone) / total) * 100).toFixed(1) : 0,
      };
    });
    successResponse(res, result, "KPI PO data retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getReportDatinDetails = async (req, res, next) => {
  try {
    const {
      start_date,
      end_date,
      witel,
      segment,
      kategori,
      search,
      page = 1,
      limit = 10,
    } = req.query;
    let where = {};
    if (start_date && end_date)
      where.orderCreatedDate = {
        gte: new Date(start_date),
        lte: new Date(end_date),
      };
    if (witel && !witel.includes("Pilih"))
      where.custWitel = { contains: witel, mode: "insensitive" };
    if (segment && !segment.includes("Pilih"))
      where.segmen = { contains: segment, mode: "insensitive" };
    if (kategori && !kategori.includes("Pilih"))
      where.kategori = { contains: kategori, mode: "insensitive" };
    if (search)
      where.OR = [
        { orderId: { contains: search, mode: "insensitive" } },
        { standardName: { contains: search, mode: "insensitive" } },
      ];
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const [data, total] = await Promise.all([
      prisma.sosData.findMany({
        where,
        skip,
        take,
        orderBy: { orderCreatedDate: "desc" },
      }),
      prisma.sosData.count({ where }),
    ]);
    successResponse(
      res,
      {
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Report Datin Details retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getReportDatinSummary = async (req, res, next) => {
  try {
    const { start_date, end_date, witel: witelFilter } = req.query

    let whereClause = {}

    if (start_date && end_date) {
      const parseDate = (dateStr) => {
        if (!dateStr) return null
        const parts = dateStr.split('-') // Expecting YYYY-MM-DD from frontend
        if (parts.length === 3) {
           return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`)
        }
        return new Date(dateStr)
      }

      const startDateObj = parseDate(start_date)
      const endDateObj = parseDate(end_date)

      if (startDateObj && !isNaN(startDateObj) && endDateObj && !isNaN(endDateObj)) {
        endDateObj.setHours(23, 59, 59, 999)
        whereClause.orderCreatedDate = {
          gte: startDateObj,
          lte: endDateObj
        }
      }
    }

    // Mapping Constants
    const witelMappings = {
      'BALI': ['DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG'],
      'JATIM BARAT': ['KEDIRI', 'MADIUN', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEPANJEN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],
      'JATIM TIMUR': ['JEMBER', 'PASURUAN', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PROBOLINGGO', 'SITUBONDO'],
      'NUSA TENGGARA': ['NTT', 'NTB', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA'],
      'SURAMADU': ['SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES']
    }

    const data = await prisma.sosData.findMany({
      where: whereClause,
      select: {
        segmen: true,
        custWitel: true,
        custCity: true,
        serviceWitel: true,
        orderCreatedDate: true,
        actionCd: true,
        liStatus: true,
        revenue: true,
        poName: true,
        nipnas: true
      }
    })

    // Helper Functions
    const getCategory = (segmen) => {
      const s = (segmen || '').toUpperCase()
      // SOE check first to catch "State-Owned Enterprise" before it matches "Enterprise" in GOV
      if (['BUMN', 'SOE', 'STATE-OWNED'].some(k => s.includes(k))) return 'SOE'
      if (['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE', 'REGIONAL', 'REG'].some(k => s.includes(k))) return 'SME'
      if (['GOV', 'LEGS', 'DGS', 'DPS', 'ENTERPRISE'].some(k => s.includes(k))) return 'GOV'
      return 'PRIVATE'
    }

    // Determine Grouping Strategy
    let targetWitels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
    let isBranchMode = false

    if (witelFilter) {
      const selected = witelFilter.split(',').filter(w => w.trim() !== '')

      // Case 1: Single Region Selected -> Drilldown to Branches
      if (selected.length === 1 && witelMappings[selected[0]]) {
        targetWitels = witelMappings[selected[0]]
        isBranchMode = true
      }
      // Case 2: Multiple Regions Selected -> Filter the list of Major Witels
      else if (selected.length > 0) {
        // Filter targetWitels to only keep the selected ones
        // Note: Use the original list as source of truth for valid regions
        const originalRegions = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
        const validSelections = selected.filter(s => originalRegions.includes(s))

        if (validSelections.length > 0) {
          targetWitels = validSelections
        }
      }
    }

    const getWitelKey = (witelStr) => {
      const w = (witelStr || '').toUpperCase()

      // If filtering by specific witel (e.g. BALI), we map to the exact branch (e.g. DENPASAR)
      if (isBranchMode) {
        // Find which branch it matches in the selected list
        const match = targetWitels.find(k => w.includes(k))
        return match || 'OTHER'
      }

      // Default: Map to Major Witel (Frontend witelList: BALI, JATIM BARAT, JATIM TIMUR, NUSA TENGGARA, SURAMADU)
      if (['BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG'].some(k => w.includes(k))) return 'BALI'
      if (['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEPANJEN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'].some(k => w.includes(k))) return 'JATIM BARAT'
      if (['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PROBOLINGGO', 'SITUBONDO'].some(k => w.includes(k))) return 'JATIM TIMUR'
      if (['NUSA TENGGARA', 'NTT', 'NTB', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA'].some(k => w.includes(k))) return 'NUSA TENGGARA'
      if (['SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES'].some(k => w.includes(k))) return 'SURAMADU'

      // Fallback: Check if the string itself contains the major region names
      if (w.includes('BALI')) return 'BALI'
      if (w.includes('BARAT')) return 'JATIM BARAT'
      if (w.includes('TIMUR')) return 'JATIM TIMUR'
      if (w.includes('NUSA') || w.includes('NTB') || w.includes('NTT')) return 'NUSA TENGGARA'
      if (w.includes('SURAMADU') || w.includes('MADURA') || w.includes('SURABAYA')) return 'SURAMADU'

      return 'OTHER'
    }

    const getOrderType = (actionCd) => {
      const a = (actionCd || '').toUpperCase()
      if (a.startsWith('A') || a.startsWith('NEW') || a.startsWith('INST')) return 'AO' // Add -> AO
      if (a.startsWith('S')) return 'SO' // Suspend -> SO
      if (a.startsWith('D') || a.startsWith('TERM')) return 'DO' // Delete -> DO
      if (a.startsWith('M') || a.startsWith('U') || a.startsWith('CH')) return 'MO' // Modify/Move/Update/Change -> MO
      if (a.startsWith('R')) return 'RO' // Resume -> RO
      return 'OTHER'
    }

    // Helper to normalize PO name - just uppercase, nothing else
    const normalizePOName = (poName) => {
      if (!poName) return null
      const trimmed = (poName || '').trim()
      return trimmed.length > 0 ? trimmed.toUpperCase() : null
    }

    const getStatusGroup = (status) => {
      const s = (status || '').toUpperCase()
      if (s.includes('PROVIDE')) return 'PROVIDE_ORDER'
      if (s.includes('BILL') || s.includes('COMPLETED') || s.includes('CLOSED') || s.includes('LIVE')) return 'READY_BILL'
      return 'IN_PROCESS'
    }

    // Initialize Data Structures
    const categories = ['SME', 'GOV', 'PRIVATE', 'SOE']

    // Table 1 Structure
    const table1Map = {}
    categories.forEach(cat => {
      table1Map[cat] = {
        category: cat,
        witels: {}
      }
      targetWitels.forEach(w => {
        table1Map[cat].witels[w] = {
          ao_3bln: 0, est_ao_3bln: 0,
          so_3bln: 0, est_so_3bln: 0,
          do_3bln: 0, est_do_3bln: 0,
          mo_3bln: 0, est_mo_3bln: 0,
          ro_3bln: 0, est_ro_3bln: 0,
          total_3bln: 0, est_3bln: 0,

          ao_3bln2: 0, est_ao_3bln2: 0,
          so_3bln2: 0, est_so_3bln2: 0,
          do_3bln2: 0, est_do_3bln2: 0,
          mo_3bln2: 0, est_mo_3bln2: 0,
          ro_3bln2: 0, est_ro_3bln2: 0,
          total_3bln2: 0, est_3bln2: 0,

          grand_total: 0
        }
      })
    })

    // Table 2 Structure
    const table2Map = {}
    categories.forEach(cat => {
      table2Map[cat] = {
        category: cat,
        witels: {}
      }
      targetWitels.forEach(w => {
        table2Map[cat].witels[w] = {
          provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0,
          provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0,
          grand_total: 0
        }
      })
    })

    // Galaksi Structure
    const galaksiMap = {}

    // Process Data
    const now = new Date()

    data.forEach(row => {
      const category = getCategory(row.segmen)

      // Process Galaksi FIRST (before witel validation skip)
      const orderDate = row.orderCreatedDate ? new Date(row.orderCreatedDate) : now
      const diffTime = Math.abs(now - orderDate)
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
      const isLessThan3Months = diffMonths <= 3
      const orderType = getOrderType(row.actionCd)

      // Update Galaksi - process this BEFORE witel validation
      let poKey = row.poName

      // If poName is not available, try to map from NIPNAS
      if (!poKey && row.nipnas) {
         const mappedName = PO_MAPPING[row.nipnas]
         if (mappedName) {
            poKey = mappedName
         }
      }

      // Only process if we have a valid PO name
      if (poKey) {
        const poName = normalizePOName(poKey)

        if (poName) {
          if (!galaksiMap[poName]) {
            galaksiMap[poName] = {
               po: poName,
               ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, total_3bln: 0,
               ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, total_3bln2: 0
            }
          }

          const g = galaksiMap[poName]
          if (isLessThan3Months) {
            if (orderType === 'AO') g.ao_3bln++
            else if (orderType === 'SO') g.so_3bln++
            else if (orderType === 'DO') g.do_3bln++
            else if (orderType === 'MO') g.mo_3bln++
            else if (orderType === 'RO') g.ro_3bln++

            g.total_3bln++
          } else {
            if (orderType === 'AO') g.ao_3bln2++
            else if (orderType === 'SO') g.so_3bln2++
            else if (orderType === 'DO') g.do_3bln2++
            else if (orderType === 'MO') g.mo_3bln2++
            else if (orderType === 'RO') g.ro_3bln2++

            g.total_3bln2++
          }
        }
      }

      // ============ NOW do witel validation for tables 1 & 2 ============
      // Try to resolve Witel/Branch from most specific source (City) to least specific (Region)
      // Check City first (often contains granular branch data like 'Denpasar', 'Malang')
      let witel = getWitelKey(row.custCity)

      if (row.custCity && (row.custCity.includes('MADIUN') || row.custCity.includes('KEDIRI'))) {
          // console.log(`DEBUG: City=${row.custCity}, ResolvedWitel=${witel}, isBranchMode=${isBranchMode}`)
      }

      // If City didn't yield a valid branch (returned OTHER) or just returned the generic Region name
      // Try the Witel columns
      const isGeneric = (w) => ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'].includes(w)

      if (witel === 'OTHER') {
         witel = getWitelKey(row.serviceWitel || row.custWitel)
      } else if (isBranchMode && isGeneric(witel)) {
         // If City returned a generic name (unlikely but possible), see if Witel col has something different?
         // Actually usually if City is generic, Witel is also generic.
         // But let's check just in case Witel has a specific override (unlikely).
         const alt = getWitelKey(row.serviceWitel || row.custWitel)
         if (alt !== 'OTHER' && !isGeneric(alt)) {
             witel = alt
         }
      }

      if (witel === 'OTHER') return // Skip unknown witels for table processing

      const orderDate2 = row.orderCreatedDate ? new Date(row.orderCreatedDate) : now
      const diffTime2 = Math.abs(now - orderDate2)
      const diffMonths2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24 * 30))
      const isLessThan3Months2 = diffMonths2 <= 3
      const orderType2 = getOrderType(row.actionCd)

      const status = getStatusGroup(row.liStatus)
      const revenue = parseFloat(row.revenue || 0)

      // Update Table 1
      const t1 = table1Map[category].witels[witel]
      if (t1) {
        if (isLessThan3Months2) {
          if (orderType2 === 'AO') {
            t1.ao_3bln++; t1.est_ao_3bln += revenue;
            t1.est_3bln += revenue; t1.total_3bln++;
          }
          else if (orderType2 === 'DO') {
            t1.do_3bln++; t1.est_do_3bln += revenue;
            t1.est_3bln += revenue; t1.total_3bln++;
          }
          else if (orderType2 === 'MO') {
            t1.mo_3bln++; t1.est_mo_3bln += revenue;
            t1.est_3bln += revenue; t1.total_3bln++;
          }
          else if (orderType2 === 'SO') { t1.so_3bln++; t1.est_so_3bln += revenue; }
          else if (orderType2 === 'RO') { t1.ro_3bln++; t1.est_ro_3bln += revenue; }

          // Grand Total should match visible total for consistency
          if (['AO', 'DO', 'MO'].includes(orderType2)) {
             t1.grand_total++
          }
        } else {
          if (orderType2 === 'AO') {
            t1.ao_3bln2++; t1.est_ao_3bln2 += revenue;
            t1.est_3bln2 += revenue; t1.total_3bln2++;
          }
          else if (orderType2 === 'DO') {
            t1.do_3bln2++; t1.est_do_3bln2 += revenue;
            t1.est_3bln2 += revenue; t1.total_3bln2++;
          }
          else if (orderType2 === 'MO') {
            t1.mo_3bln2++; t1.est_mo_3bln2 += revenue;
            t1.est_3bln2 += revenue; t1.total_3bln2++;
          }
          else if (orderType2 === 'SO') { t1.so_3bln2++; t1.est_so_3bln2 += revenue; }
          else if (orderType2 === 'RO') { t1.ro_3bln2++; t1.est_ro_3bln2 += revenue; }

          if (['AO', 'DO', 'MO'].includes(orderType2)) {
             t1.grand_total++
          }
        }
      }

      // Update Table 2
      const t2 = table2Map[category].witels[witel]
      if (t2) {
        if (isLessThan3Months2) {
          if (status === 'PROVIDE_ORDER') t2.provide_order++
          else if (status === 'IN_PROCESS') t2.in_process++
          else if (status === 'READY_BILL') t2.ready_bill++

          t2.total_3bln++
        } else {
          if (status === 'PROVIDE_ORDER') t2.provide_order2++
          else if (status === 'IN_PROCESS') t2.in_process2++
          else if (status === 'READY_BILL') t2.ready_bill2++

          t2.total_3bln2++
        }
        t2.grand_total++
      }
    })

    // Format Output for Frontend
    const table1Data = []
    const table2Data = []
    let idCounter = 1

    categories.forEach(cat => {
      // Header Row for Category
      const catHeader1 = {
        id: idCounter++,
        category: cat,
        witel: '',
        ao_3bln: 0, est_ao_3bln: 0, so_3bln: 0, est_so_3bln: 0, do_3bln: 0, est_do_3bln: 0, mo_3bln: 0, est_mo_3bln: 0, ro_3bln: 0, est_ro_3bln: 0, est_3bln: 0, total_3bln: 0,
        ao_3bln2: 0, est_ao_3bln2: 0, so_3bln2: 0, est_so_3bln2: 0, do_3bln2: 0, est_do_3bln2: 0, mo_3bln2: 0, est_mo_3bln2: 0, ro_3bln2: 0, est_ro_3bln2: 0, est_3bln2: 0, total_3bln2: 0,
        grand_total: 0,
        isCategoryHeader: true
      }

      const catHeader2 = {
        id: idCounter++,
        witel: cat, // In Table 2, category is shown in witel column for header
        provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0,
        provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0,
        grand_total: 0,
        isCategoryHeader: true
      }

      const witelRows1 = []
      const witelRows2 = []

      targetWitels.forEach(w => {
        const d1 = table1Map[cat].witels[w]
        const d2 = table2Map[cat].witels[w]

        // Add to Category Header Totals
        catHeader1.ao_3bln += d1.ao_3bln; catHeader1.est_ao_3bln += d1.est_ao_3bln;
        catHeader1.so_3bln += d1.so_3bln; catHeader1.est_so_3bln += d1.est_so_3bln;
        catHeader1.do_3bln += d1.do_3bln; catHeader1.est_do_3bln += d1.est_do_3bln;
        catHeader1.mo_3bln += d1.mo_3bln; catHeader1.est_mo_3bln += d1.est_mo_3bln;
        catHeader1.ro_3bln += d1.ro_3bln; catHeader1.est_ro_3bln += d1.est_ro_3bln;
        catHeader1.est_3bln += d1.est_3bln; catHeader1.total_3bln += d1.total_3bln;

        catHeader1.ao_3bln2 += d1.ao_3bln2; catHeader1.est_ao_3bln2 += d1.est_ao_3bln2;
        catHeader1.so_3bln2 += d1.so_3bln2; catHeader1.est_so_3bln2 += d1.est_so_3bln2;
        catHeader1.do_3bln2 += d1.do_3bln2; catHeader1.est_do_3bln2 += d1.est_do_3bln2;
        catHeader1.mo_3bln2 += d1.mo_3bln2; catHeader1.est_mo_3bln2 += d1.est_mo_3bln2;
        catHeader1.ro_3bln2 += d1.ro_3bln2; catHeader1.est_ro_3bln2 += d1.est_ro_3bln2;
        catHeader1.est_3bln2 += d1.est_3bln2; catHeader1.total_3bln2 += d1.total_3bln2;

        catHeader1.grand_total += d1.grand_total;

        catHeader2.provide_order += d2.provide_order; catHeader2.in_process += d2.in_process; catHeader2.ready_bill += d2.ready_bill; catHeader2.total_3bln += d2.total_3bln;
        catHeader2.provide_order2 += d2.provide_order2; catHeader2.in_process2 += d2.in_process2; catHeader2.ready_bill2 += d2.ready_bill2; catHeader2.total_3bln2 += d2.total_3bln2;
        catHeader2.grand_total += d2.grand_total;

        witelRows1.push({
          id: idCounter++,
          category: '',
          witel: w,
          ...d1,
          est_ao_3bln: (d1.est_ao_3bln / 1000000).toFixed(2),
          est_do_3bln: (d1.est_do_3bln / 1000000).toFixed(2),
          est_mo_3bln: (d1.est_mo_3bln / 1000000).toFixed(2),
          est_3bln: (d1.est_3bln / 1000000).toFixed(2),

          est_ao_3bln2: (d1.est_ao_3bln2 / 1000000).toFixed(2),
          est_do_3bln2: (d1.est_do_3bln2 / 1000000).toFixed(2),
          est_mo_3bln2: (d1.est_mo_3bln2 / 1000000).toFixed(2),
          est_3bln2: (d1.est_3bln2 / 1000000).toFixed(2),
          isCategoryHeader: false
        })

        witelRows2.push({
          id: idCounter++,
          witel: w,
          ...d2
        })
      })

      // Format Header Money
      catHeader1.est_ao_3bln = (catHeader1.est_ao_3bln / 1000000).toFixed(2)
      catHeader1.est_do_3bln = (catHeader1.est_do_3bln / 1000000).toFixed(2)
      catHeader1.est_mo_3bln = (catHeader1.est_mo_3bln / 1000000).toFixed(2)
      catHeader1.est_3bln = (catHeader1.est_3bln / 1000000).toFixed(2)

      catHeader1.est_ao_3bln2 = (catHeader1.est_ao_3bln2 / 1000000).toFixed(2)
      catHeader1.est_do_3bln2 = (catHeader1.est_do_3bln2 / 1000000).toFixed(2)
      catHeader1.est_mo_3bln2 = (catHeader1.est_mo_3bln2 / 1000000).toFixed(2)
      catHeader1.est_3bln2 = (catHeader1.est_3bln2 / 1000000).toFixed(2)

      table1Data.push(catHeader1, ...witelRows1)
      table2Data.push(catHeader2, ...witelRows2)
    })

    const galaksiData = Object.values(galaksiMap).map((item, index) => ({
      ...item,
      id: index + 1,
      achievement: '0%' // Placeholder
    })).sort((a, b) => a.po.localeCompare(b.po))

    successResponse(res, {
      table1Data,
      table2Data,
      galaksiData
    }, 'Report Datin Summary retrieved successfully')

  } catch (error) {
    next(error)
  }
}
