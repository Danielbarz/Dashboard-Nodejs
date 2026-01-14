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
    const { start_date, end_date, witel } = req.query;
    let whereClause = {};
    if (start_date && end_date)
      whereClause.orderCreatedDate = {
        gte: new Date(start_date),
        lte: new Date(end_date),
      };
    const data = await prisma.sosData.findMany({
      where: whereClause,
      select: {
        segmen: true,
        custCity: true,
        serviceWitel: true,
        orderCreatedDate: true,
        actionCd: true,
        liStatus: true,
        revenue: true,
        poName: true,
        nipnas: true,
      },
    });
    successResponse(
      res,
      { table1Data: [], table2Data: [], galaksiData: [] },
      "Report Datin Summary retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};
