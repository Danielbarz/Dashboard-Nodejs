import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import ExcelJS from 'exceljs'

dayjs.extend(utc)
dayjs.extend(timezone)

// Canonical mapping seperti di Dashboard Nanda, tapi fallback ke nilai asli agar data report & dashboard tetap satu sumber
const mapProduct = (raw) => {
  const original = (raw || '').trim()
  const val = original.toUpperCase()
  if (val.includes('NETMONK')) return 'Netmonk'
  if (val.includes('OCA')) return 'OCA'
  if (val.includes('ANTARES')) return 'Antares'
  if (val.includes('PIJAR')) return 'Pijar'
  return original || null
}

const mapSubType = (raw) => {
  const original = (raw || '').trim()
  const val = original.toUpperCase()
  if (['NEW INSTALL', 'ADD SERVICE', 'NEW SALES', 'AO'].includes(val)) return 'AO'
  if (['MODIFICATION', 'MODIFY', 'MO'].includes(val)) return 'MO'
  if (['SUSPEND', 'SO'].includes(val)) return 'SO'
  if (['DISCONNECT', 'DO'].includes(val)) return 'DO'
  if (['RESUME', 'RO'].includes(val)) return 'RO'
  return original || null
}

const MASTER_WITEL_LIST = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

const normalizeColumn = (column) => {
  if (!column) return null
  return column.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

const isBundleProduct = (product) => {
  if (!product) return false
  return product.includes('-') || product.includes('\n')
}

const formatPct = (numerator, denominator) => {
  if (!denominator || denominator === 0) return '0.0%'
  return `${((numerator / denominator) * 100).toFixed(1)}%`
}

// Helpers for witel hierarchy (JT)
const WITEL_SEGMENTS = {
  'WITEL BALI': ['WITEL DENPASAR', 'WITEL SINGARAJA'],
  'WITEL JATIM BARAT': ['WITEL KEDIRI', 'WITEL MADIUN', 'WITEL MALANG'],
  'WITEL JATIM TIMUR': ['WITEL JEMBER', 'WITEL PASURUAN', 'WITEL SIDOARJO'],
  'WITEL NUSA TENGGARA': ['WITEL NTT', 'WITEL NTB'],
  'WITEL SURAMADU': ['WITEL SURABAYA UTARA', 'WITEL SURABAYA SELATAN', 'WITEL MADURA']
}

const getParentWitel = (child) => {
  for (const [parent, children] of Object.entries(WITEL_SEGMENTS)) {
    if (children.includes(child)) return parent
  }
  return null
}

// JT aggregation helpers
const emptyJtRow = (witel) => ({
  witel,
  jml_lop_exc_drop: 0,
  rev_all_lop: 0,
  initial: 0,
  survey_drm: 0,
  perizinan_mos: 0,
  instalasi: 0,
  fi_ogp_live: 0,
  golive_jml_lop: 0,
  golive_rev_lop: 0,
  drop: 0,
  percent_close: 0,
  isParent: false,
  parentWitel: getParentWitel(witel) || witel
})

const accumulateJtRow = (target, source) => {
  ;['jml_lop_exc_drop', 'rev_all_lop', 'initial', 'survey_drm', 'perizinan_mos', 'instalasi', 'fi_ogp_live', 'golive_jml_lop', 'golive_rev_lop', 'drop'].forEach((key) => {
    target[key] += Number(source[key] || 0)
  })
}

const finalizeJtRow = (row) => {
  const denom = row.jml_lop_exc_drop || 0
  row.percent_close = denom > 0 ? (row.golive_jml_lop / denom) * 100 : 0
  return row
}

// ===================== SOS / DATIN HELPERS =====================
const MASTER_SEGMENT_LIST = ['1. SME', '2. GOV', '3. PRIVATE', '4. SOE']

const buildSosAggregate = (rows, viewMode) => {
  const dataBySegment = {}
  const initRow = () => ({
    provide_order_lt_3bln: 0,
    est_bc_provide_order_lt_3bln: 0,
    in_process_lt_3bln: 0,
    est_bc_in_process_lt_3bln: 0,
    ready_to_bill_lt_3bln: 0,
    est_bc_ready_to_bill_lt_3bln: 0,
    provide_order_gt_3bln: 0,
    est_bc_provide_order_gt_3bln: 0,
    in_process_gt_3bln: 0,
    est_bc_in_process_gt_3bln: 0,
    ready_to_bill_gt_3bln: 0,
    est_bc_ready_to_bill_gt_3bln: 0
  })

  MASTER_SEGMENT_LIST.forEach((segment) => {
    dataBySegment[segment] = { witelRows: {}, total: initRow() }
    MASTER_WITEL_LIST.forEach((w) => {
      dataBySegment[segment].witelRows[w] = initRow()
    })
  })

  const bump = (target, key, inc) => {
    target[key] = (target[key] || 0) + inc
  }

  rows
    .filter((row) => row.tipeGrup === viewMode)
    .filter((row) => MASTER_SEGMENT_LIST.includes(row.segmenBaru || ''))
    .filter((row) => MASTER_WITEL_LIST.includes(row.witelBaru || ''))
    .forEach((row) => {
      const segment = row.segmenBaru
      const witel = row.witelBaru
      const targetRow = dataBySegment[segment].witelRows[witel]
      const totalRow = dataBySegment[segment].total
      const ageKey = (row.kategoriUmur || '').trim().toUpperCase()
      const status = (row.kategori || '').trim().toUpperCase()
      const estBc = Number(row.scalling2 || 0)

      const isLt3 = ageKey.includes('< 3')
      const prefix = isLt3 ? 'lt_3bln' : 'gt_3bln'

      if (['PROVIDE ORDER', '1. PROVIDE ORDER'].includes(status)) {
        bump(targetRow, `provide_order_${prefix}`, 1)
        bump(totalRow, `provide_order_${prefix}`, 1)
        bump(targetRow, `est_bc_provide_order_${prefix}`, estBc)
        bump(totalRow, `est_bc_provide_order_${prefix}`, estBc)
      } else if (['IN PROCESS', 'PROV. COMPLETE', '2. IN PROCESS'].includes(status)) {
        bump(targetRow, `in_process_${prefix}`, 1)
        bump(totalRow, `in_process_${prefix}`, 1)
        bump(targetRow, `est_bc_in_process_${prefix}`, estBc)
        bump(totalRow, `est_bc_in_process_${prefix}`, estBc)
      } else if (['READY TO BILL', '3. READY TO BILL'].includes(status)) {
        bump(targetRow, `ready_to_bill_${prefix}`, 1)
        bump(totalRow, `ready_to_bill_${prefix}`, 1)
        bump(targetRow, `est_bc_ready_to_bill_${prefix}`, estBc)
        bump(totalRow, `est_bc_ready_to_bill_${prefix}`, estBc)
      }
    })

  const finalizeRow = (row) => {
    row.total_lt_3bln = (row.provide_order_lt_3bln || 0) + (row.in_process_lt_3bln || 0) + (row.ready_to_bill_lt_3bln || 0)
    row.total_gt_3bln = (row.provide_order_gt_3bln || 0) + (row.in_process_gt_3bln || 0) + (row.ready_to_bill_gt_3bln || 0)
    row.grand_total_order = row.total_lt_3bln + row.total_gt_3bln
    return row
  }

  const result = []
  const grand = finalizeRow(initRow())
  MASTER_SEGMENT_LIST.forEach((segment) => {
    const display = segment.replace(/^\d+\.\s*/, '').toUpperCase()
    const segTotal = finalizeRow({ witel: display, isCategoryHeader: true, ...dataBySegment[segment].total })
    result.push(segTotal)
    MASTER_WITEL_LIST.forEach((witel) => {
      const row = finalizeRow({ witel, ...dataBySegment[segment].witelRows[witel] })
      result.push(row)
      Object.keys(initRow()).forEach((k) => {
        grand[k] = (grand[k] || 0) + (row[k] || 0)
      })
    })
  })
  result.push({ witel: 'GRAND TOTAL', isCategoryHeader: true, ...finalizeRow(grand) })
  return result
}

const buildGalaksiData = (rows) => {
  const cleanSubtype = (sub) => (sub || '').trim().toUpperCase()
  const bucketByPo = new Map()
  const ensure = (po) => {
    if (!bucketByPo.has(po)) {
      bucketByPo.set(po, {
        po,
        ao_3bln: 0,
        so_3bln: 0,
        do_3bln: 0,
        mo_3bln: 0,
        ro_3bln: 0,
        ao_3bln2: 0,
        so_3bln2: 0,
        do_3bln2: 0,
        mo_3bln2: 0,
        ro_3bln2: 0
      })
    }
    return bucketByPo.get(po)
  }

  rows
    .filter((row) => (row.liStatus || '').toUpperCase() === 'IN PROGRESS')
    .forEach((row) => {
      const po = row.poName || '(Blank)'
      const target = ensure(po)
      const age = (row.kategoriUmur || '').toUpperCase().includes('< 3') ? '' : '2'
      const sub = cleanSubtype(row.orderSubtype)
      const keyMap = {
        'NEW INSTALL': 'ao',
        'SUSPEND': 'so',
        'DISCONNECT': 'do',
        'RESUME': 'ro'
      }
      const mapKeys = ['MODIFY PRICE', 'MODIFY', 'MODIFY BA', 'RENEWAL AGREEMENT', 'MODIFY TERMIN']
      let baseKey = keyMap[sub]
      if (!baseKey && mapKeys.includes(sub)) baseKey = 'mo'
      if (!baseKey) return
      const field = `${baseKey}_3bln${age}`
      target[field] = (target[field] || 0) + 1
    })

  return Array.from(bucketByPo.values()).map((row) => {
    const total_3bln = (row.ao_3bln || 0) + (row.so_3bln || 0) + (row.do_3bln || 0) + (row.mo_3bln || 0) + (row.ro_3bln || 0)
    const total_3bln2 = (row.ao_3bln2 || 0) + (row.so_3bln2 || 0) + (row.do_3bln2 || 0) + (row.mo_3bln2 || 0) + (row.ro_3bln2 || 0)
    return {
      ...row,
      total_3bln,
      total_3bln2,
      achievement: formatPct(total_3bln2, total_3bln + total_3bln2)
    }
  })
}

const parseRange = (start, end) => {
  const now = dayjs().tz('Asia/Jakarta')
  const startDate = start ? dayjs(start).tz('Asia/Jakarta') : now.startOf('month')
  const endDate = end ? dayjs(end).tz('Asia/Jakarta') : now
  return {
    start: startDate.format('YYYY-MM-DD'),
    end: endDate.format('YYYY-MM-DD'),
    startDate: startDate.toDate(),
    endDate: endDate.endOf('day').toDate()
  }
}

const initHsiRow = (witel, witelOld) => ({
  witel,
  witel_old: witelOld,
  pre_pi: 0,
  registered: 0,
  inprogress_sc: 0,
  qc1: 0,
  fcc: 0,
  cancel_by_fcc: 0,
  survey_new_manja: 0,
  unsc: 0,
  pi_under_1_hari: 0,
  pi_1_3_hari: 0,
  pi_over_3_hari: 0,
  total_pi: 0,
  fo_wfm_kndl_plgn: 0,
  fo_wfm_kndl_teknis: 0,
  fo_wfm_kndl_sys: 0,
  fo_wfm_others: 0,
  fo_uim: 0,
  fo_asp: 0,
  fo_osm: 0,
  total_fallout: 0,
  act_comp: 0,
  jml_comp_ps: 0,
  cancel_kndl_plgn: 0,
  cancel_kndl_teknis: 0,
  cancel_kndl_sys: 0,
  cancel_others: 0,
  total_cancel: 0,
  revoke: 0,
  pi_re_percent: 0,
  ps_re_percent: 0,
  ps_pi_percent: 0,
  row_type: 'sub'
})

const calcHsiPercents = (item) => {
  const num_pire = item.total_pi + item.total_fallout + item.act_comp + item.jml_comp_ps + item.total_cancel
  item.pi_re_percent = item.registered > 0 ? Number(((num_pire / item.registered) * 100).toFixed(2)) : 0

  const denom_psre = item.registered - item.cancel_by_fcc - item.unsc - item.revoke
  item.ps_re_percent = denom_psre > 0 ? Number(((item.jml_comp_ps / denom_psre) * 100).toFixed(2)) : 0

  const denom_pspi = item.total_pi + item.total_fallout + item.act_comp + item.jml_comp_ps
  item.ps_pi_percent = denom_pspi > 0 ? Number(((item.jml_comp_ps / denom_pspi) * 100).toFixed(2)) : 0
  return item
}

// ===================== DATA BUILDERS (reusable for API + export) =====================
const computeReportAnalysisData = async (query) => {
  const { start_date, end_date } = query
  const { start, end, startDate, endDate } = parseRange(start_date, end_date)

  const officers = await prisma.accountOfficer.findMany({
    select: {
      id: true,
      name: true,
      displayWitel: true,
      filterWitelLama: true,
      specialFilterColumn: true,
      specialFilterValue: true
    }
  })

  if (!officers.length) return { tableData: [], filters: { start_date: start, end_date: end } }

  const officerWitels = officers.map((o) => o.filterWitelLama).filter(Boolean)

  const rangeDocs = await prisma.documentData.findMany({
    where: {
      witelLama: { in: officerWitels },
      orderCreatedDate: { gte: startDate, lte: endDate },
      product: { not: null }
    }
  })

  const currentYear = dayjs(end).year()
  const q3Docs = await prisma.documentData.findMany({
    where: {
      witelLama: { in: officerWitels },
      orderCreatedDate: {
        gte: new Date(`${currentYear}-07-01T00:00:00Z`),
        lte: new Date(`${currentYear}-09-30T23:59:59Z`)
      },
      product: { not: null }
    }
  })

  const bundleOrderIdsRange = [...new Set(rangeDocs.filter((d) => isBundleProduct(d.product)).map((d) => d.orderId))]
  const bundleOrderIdsQ3 = [...new Set(q3Docs.filter((d) => isBundleProduct(d.product)).map((d) => d.orderId))]

  const bundleProductsRange = bundleOrderIdsRange.length
    ? await prisma.orderProduct.findMany({
        where: { orderId: { in: bundleOrderIdsRange } },
        select: { orderId: true, productName: true, statusWfm: true, channel: true }
      })
    : []

  const bundleProductsQ3 = bundleOrderIdsQ3.length
    ? await prisma.orderProduct.findMany({
        where: { orderId: { in: bundleOrderIdsQ3 } },
        select: { orderId: true, productName: true, statusWfm: true, channel: true }
      })
    : []

  const tableData = officers.map((officer) => {
    const { filterWitelLama, specialFilterColumn, specialFilterValue } = officer

    const matchesSpecial = (row) => {
      if (!specialFilterColumn || specialFilterValue === null || typeof specialFilterValue === 'undefined') return true
      const key = normalizeColumn(specialFilterColumn)
      return row[specialFilterColumn] === specialFilterValue || row[key] === specialFilterValue
    }

    const rangeSingles = rangeDocs.filter(
      (doc) => doc.witelLama === filterWitelLama && !isBundleProduct(doc.product) && matchesSpecial(doc)
    )
    const rangeBundleOrderIds = new Set(
      rangeDocs
        .filter((doc) => doc.witelLama === filterWitelLama && isBundleProduct(doc.product) && matchesSpecial(doc))
        .map((doc) => doc.orderId)
    )
    const rangeBundles = bundleProductsRange.filter((item) => rangeBundleOrderIds.has(item.orderId))

    const q3Singles = q3Docs.filter(
      (doc) => doc.witelLama === filterWitelLama && !isBundleProduct(doc.product) && matchesSpecial(doc)
    )
    const q3BundleOrderIds = new Set(
      q3Docs
        .filter((doc) => doc.witelLama === filterWitelLama && isBundleProduct(doc.product) && matchesSpecial(doc))
        .map((doc) => doc.orderId)
    )
    const q3Bundles = bundleProductsQ3.filter((item) => q3BundleOrderIds.has(item.orderId))

    const acc = {
      done_ncx: 0,
      done_scone: 0,
      ogp_ncx: 0,
      ogp_scone: 0,
      done_ncx_q3: 0,
      done_scone_q3: 0,
      ogp_ncx_q3: 0,
      ogp_scone_q3: 0
    }

    const applyCounters = (item, target, statusField = 'statusWfm', channelField = 'channel') => {
      const status = (item[statusField] || '').toLowerCase()
      const channel = (item[channelField] || '').toLowerCase()
      if (status === 'done close bima') {
        if (channel === 'sc-one') target.done_scone += 0.5
        else target.done_ncx += 0.5
      } else if (status === 'in progress') {
        if (channel === 'sc-one') target.ogp_scone += 0.5
        else target.ogp_ncx += 0.5
      }
    }

    const applyCountersQ3 = (item, target, statusField = 'statusWfm', channelField = 'channel') => {
      const status = (item[statusField] || '').toLowerCase()
      const channel = (item[channelField] || '').toLowerCase()
      if (status === 'done close bima') {
        if (channel === 'sc-one') target.done_scone_q3 += 0.5
        else target.done_ncx_q3 += 0.5
      } else if (status === 'in progress') {
        if (channel === 'sc-one') target.ogp_scone_q3 += 0.5
        else target.ogp_ncx_q3 += 0.5
      }
    }

    rangeSingles.forEach((doc) => applyCounters(doc, acc))
    rangeBundles.forEach((item) => applyCounters(item, acc, 'statusWfm', 'channel'))

    q3Singles.forEach((doc) => applyCountersQ3(doc, acc))
    q3Bundles.forEach((item) => applyCountersQ3(item, acc, 'statusWfm', 'channel'))

    const totalRange = acc.done_ncx + acc.done_scone + acc.ogp_ncx + acc.ogp_scone
    const totalQ3 = acc.done_ncx_q3 + acc.done_scone_q3 + acc.ogp_ncx_q3 + acc.ogp_scone_q3

    return {
      id: officer.id,
      nama_po: officer.name,
      witel: officer.displayWitel || officer.filterWitelLama || 'Unknown',
      done_ncx: acc.done_ncx,
      done_scone: acc.done_scone,
      ogp_ncx: acc.ogp_ncx,
      ogp_scone: acc.ogp_scone,
      total: totalRange,
      ach_range: formatPct(acc.done_ncx + acc.done_scone, totalRange),
      ach_q3: formatPct(acc.done_ncx_q3 + acc.done_scone_q3, totalQ3)
    }
  })

  return { tableData, filters: { start_date: start, end_date: end } }
}

const computeReportDatinData = async (query) => {
  const { start_date, end_date } = query
  const { startDate, endDate } = parseRange(start_date, end_date)

  const whereClause = {}
  if (start_date && end_date) {
    whereClause.liBilldate = { gte: startDate, lte: endDate }
  }

  const sosRows = await prisma.sosData.findMany({
    where: whereClause,
    select: {
      segmenBaru: true,
      witelBaru: true,
      kategoriUmur: true,
      kategori: true,
      scalling2: true,
      tipeGrup: true,
      liStatus: true,
      orderSubtype: true,
      poName: true
    }
  })

  return {
    reportDataAomo: buildSosAggregate(sosRows, 'AOMO'),
    reportDataSodoro: buildSosAggregate(sosRows, 'SODORO'),
    galaksiData: buildGalaksiData(sosRows)
  }
}

const computeReportTambahanData = async (query) => {
  const { start_date, end_date } = query
  const { startDate, endDate } = parseRange(start_date, end_date)
  const parentList = Object.keys(WITEL_SEGMENTS)
  const childList = Object.values(WITEL_SEGMENTS).flat()
  const whereClause = { witelBaru: { in: parentList }, witelLama: { in: childList } }
  if (start_date && end_date) whereClause.tanggalMom = { gte: startDate, lte: endDate }

  const rows = await prisma.spmkMom.findMany({
    where: whereClause,
    select: {
      witelLama: true,
      witelBaru: true,
      statusTompsNew: true,
      goLive: true,
      populasiNonDrop: true,
      revenuePlan: true,
      statusProyek: true,
      bak: true,
      statusTompsLastActivity: true,
      tanggalMom: true,
      poName: true,
      keteranganToc: true,
      uraianKegiatan: true,
      idIHld: true
    }
  })

  // reuse logic from getReportTambahan
  const childMap = new Map()
  childList.forEach((c) => childMap.set(c, finalizeJtRow(emptyJtRow(c))))
  rows.forEach((row) => {
    const target = childMap.get(row.witelLama)
    if (!target) return
    const status = (row.statusTompsNew || '').toUpperCase()
    const baseFilter = row.goLive === 'N' && row.populasiNonDrop === 'Y'
    if (baseFilter) {
      if (status.includes('INITIAL')) target.initial += 1
      else if (status.includes('SURVEY')) target.survey_drm += 1
      else if (status.includes('PERIZINAN') || status.includes('MOS')) target.perizinan_mos += 1
      else if (status.includes('INSTALASI')) target.instalasi += 1
      else if (status.includes('FI') || status.includes('OGP')) target.fi_ogp_live += 1
    }
    if (row.populasiNonDrop === 'N') target.drop += 1
    if (row.goLive === 'Y' && row.populasiNonDrop === 'Y') {
      target.golive_jml_lop += 1
      target.golive_rev_lop += Number(row.revenuePlan || 0)
    }
    target.rev_all_lop += Number(row.revenuePlan || 0)
  })

  const tableData = []
  const grand = finalizeJtRow(emptyJtRow('GRAND TOTAL'))
  Object.entries(WITEL_SEGMENTS).forEach(([parent, children]) => {
    const parentRow = finalizeJtRow(emptyJtRow(parent))
    parentRow.isParent = true
    parentRow.parentWitel = parent
    children.forEach((child) => {
      const row = childMap.get(child)
      if (!row) return
      row.jml_lop_exc_drop = row.initial + row.survey_drm + row.perizinan_mos + row.instalasi + row.fi_ogp_live + row.golive_jml_lop
      finalizeJtRow(row)
      accumulateJtRow(parentRow, row)
      tableData.push(row)
    })
    parentRow.jml_lop_exc_drop = parentRow.initial + parentRow.survey_drm + parentRow.perizinan_mos + parentRow.instalasi + parentRow.fi_ogp_live + parentRow.golive_jml_lop
    finalizeJtRow(parentRow)
    tableData.unshift(parentRow)
    accumulateJtRow(grand, parentRow)
  })
  grand.isParent = true
  grand.parentWitel = 'GRAND TOTAL'
  grand.jml_lop_exc_drop = grand.initial + grand.survey_drm + grand.perizinan_mos + grand.instalasi + grand.fi_ogp_live + grand.golive_jml_lop
  finalizeJtRow(grand)
  tableData.push(grand)

  // TOC data
  const tocMap = new Map()
  childList.forEach((c) => tocMap.set(c, { witel: c, dalam_toc: 0, lewat_toc: 0, jumlah_lop_progress: 0, persen_dalam_toc: '0,00%', isParent: false, parentWitel: getParentWitel(c) }))
  rows
    .filter((r) => r.goLive === 'N' && r.populasiNonDrop === 'Y')
    .forEach((row) => {
      const target = tocMap.get(row.witelLama)
      if (!target) return
      const toc = (row.keteranganToc || row.statusProyek || '').toUpperCase()
      if (toc.includes('DALAM TOC')) target.dalam_toc += 1
      else if (toc.includes('LEWAT TOC')) target.lewat_toc += 1
    })
  const tocData = []
  const tocGrand = { witel: 'TOTAL', dalam_toc: 0, lewat_toc: 0, jumlah_lop_progress: 0, persen_dalam_toc: '0,00%', isParent: true }
  Object.entries(WITEL_SEGMENTS).forEach(([parent, children]) => {
    const parentRow = { witel: parent, isParent: true, dalam_toc: 0, lewat_toc: 0, jumlah_lop_progress: 0, persen_dalam_toc: '0,00%' }
    children.forEach((child) => {
      const row = tocMap.get(child)
      row.jumlah_lop_progress = row.dalam_toc + row.lewat_toc
      row.persen_dalam_toc = row.jumlah_lop_progress > 0 ? `${((row.dalam_toc / row.jumlah_lop_progress) * 100).toFixed(2)}%` : '0,00%'
      tocData.push(row)
      parentRow.dalam_toc += row.dalam_toc
      parentRow.lewat_toc += row.lewat_toc
      parentRow.jumlah_lop_progress += row.jumlah_lop_progress
    })
    parentRow.persen_dalam_toc = parentRow.jumlah_lop_progress > 0 ? `${((parentRow.dalam_toc / parentRow.jumlah_lop_progress) * 100).toFixed(2)}%` : '0,00%'
    tocData.unshift(parentRow)
    tocGrand.dalam_toc += parentRow.dalam_toc
    tocGrand.lewat_toc += parentRow.lewat_toc
    tocGrand.jumlah_lop_progress += parentRow.jumlah_lop_progress
  })
  tocGrand.persen_dalam_toc = tocGrand.jumlah_lop_progress > 0 ? `${((tocGrand.dalam_toc / tocGrand.jumlah_lop_progress) * 100).toFixed(2)}%` : '0,00%'
  tocData.push(tocGrand)

  // Top3
  const excludedWitel = ['WITEL SEMARANG JATENG UTARA', 'WITEL SOLO JATENG TIMUR', 'WITEL YOGYA JATENG SELATAN']
  const eligibleTop3 = rows.filter((r) =>
    r.goLive === 'N' &&
    r.populasiNonDrop === 'Y' &&
    !excludedWitel.includes(r.witelBaru || '') &&
    !(r.statusProyek || '').toUpperCase().match(/SELESAI|DIBATALKAN|GO LIVE/) &&
    !(r.statusTompsNew || '').toUpperCase().includes('DROP') &&
    !(r.statusTompsNew || '').toUpperCase().includes('GO LIVE') &&
    (!r.bak || r.bak === '-') &&
    ((r.statusTompsLastActivity || '').toUpperCase() !== 'CLOSE - 100%' || !r.statusTompsLastActivity)
  )

  const now = dayjs()
  const top3ByWitelMap = new Map()
  eligibleTop3.forEach((row) => {
    const key = row.witelBaru || 'Unknown'
    if (!top3ByWitelMap.has(key)) top3ByWitelMap.set(key, [])
    top3ByWitelMap.get(key).push(row)
  })
  const top3ByWitel = {}
  top3ByWitelMap.forEach((list, key) => {
    top3ByWitel[key] = list
      .map((r) => ({ ...r, umur_project: r.tanggalMom ? now.diff(dayjs(r.tanggalMom), 'day') : 0 }))
      .sort((a, b) => b.umur_project - a.umur_project)
      .slice(0, 3)
      .map((r) => ({
        witel_baru: r.witelBaru,
        uraian_kegiatan: r.uraianKegiatan,
        ihld: r.idIHld,
        tgl_mom: r.tanggalMom,
        revenue: r.revenuePlan,
        status_tomps: r.statusTompsNew,
        umur_project: r.umur_project
      }))
  })

  const top3ByPOMap = new Map()
  eligibleTop3.forEach((row) => {
    const key = (row.poName && row.poName.trim()) || 'Belum Terdefinisi'
    if (!top3ByPOMap.has(key)) top3ByPOMap.set(key, [])
    top3ByPOMap.get(key).push(row)
  })
  const top3ByPO = {}
  top3ByPOMap.forEach((list, key) => {
    top3ByPO[key] = list
      .map((r) => ({ ...r, umur_project: r.tanggalMom ? now.diff(dayjs(r.tanggalMom), 'day') : 0 }))
      .sort((a, b) => b.umur_project - a.umur_project)
      .slice(0, 3)
      .map((r) => ({
        po_name: key,
        uraian_kegiatan: r.uraianKegiatan,
        ihld: r.idIHld,
        tgl_mom: r.tanggalMom,
        revenue: r.revenuePlan,
        status_tomps: r.statusTompsNew,
        umur_project: r.umur_project
      }))
  })

  return { tableData, projectData: tocData, top3ByWitel, top3ByPO }
}

const computeReportHsiData = async (query) => {
  const { start_date, end_date } = query
  const { startDate, endDate } = parseRange(start_date, end_date)
  const whereClause = {}
  if (start_date && end_date) whereClause.orderDate = { gte: startDate, lte: endDate }
  const rows = await prisma.hsiData.findMany({ where: whereClause })

  const grouped = new Map()
  rows.forEach((row) => {
    const key = row.witel || 'Unknown'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(row)
  })

  const reportData = []
  const totalsAccumulator = initHsiRow('GRAND TOTAL', null)
  grouped.forEach((items, witel) => {
    const parent = initHsiRow(witel, null)
    parent.row_type = 'main'
    items.forEach((item) => {
      const child = initHsiRow(item.witel, item.witelOld)
      const pushField = (cond, field) => { if (cond) child[field] += 1 }
      child.registered += 1
      pushField(item.kelompokStatus === 'PRE PI', 'pre_pi')
      pushField(item.kelompokStatus === 'INPROGRESS_SC', 'inprogress_sc')
      pushField(item.kelompokStatus === 'QC1', 'qc1')
      pushField(item.kelompokStatus === 'FCC', 'fcc')
      pushField(item.kelompokStatus === 'REJECT_FCC', 'cancel_by_fcc')
      pushField(item.kelompokStatus === 'SURVEY_NEW_MANJA', 'survey_new_manja')
      pushField(item.kelompokStatus === 'UNSC', 'unsc')
      if (item.kelompokStatus === 'PI') {
        const hours = item.lastUpdatedDate ? dayjs().diff(dayjs(item.lastUpdatedDate), 'hour') : 0
        if (hours < 24) child.pi_under_1_hari += 1
        else if (hours <= 72) child.pi_1_3_hari += 1
        else child.pi_over_3_hari += 1
        child.total_pi += 1
      }
      if (item.kelompokStatus === 'FO_WFM') {
        const kendala = (item.kelompokKendala || '').toLowerCase()
        if (kendala === 'kendala pelanggan') child.fo_wfm_kndl_plgn += 1
        else if (kendala === 'kendala teknik') child.fo_wfm_kndl_teknis += 1
        else if (kendala === 'kendala lainnya') child.fo_wfm_kndl_sys += 1
        else child.fo_wfm_others += 1
      }
      if (item.kelompokStatus === 'FO_UIM') child.fo_uim += 1
      if (item.kelompokStatus === 'FO_ASAP') child.fo_asp += 1
      if (item.kelompokStatus === 'FO_OSM') child.fo_osm += 1
      child.total_fallout = child.fo_wfm_kndl_plgn + child.fo_wfm_kndl_teknis + child.fo_wfm_kndl_sys + child.fo_wfm_others + child.fo_uim + child.fo_asp + child.fo_osm
      pushField(item.kelompokStatus === 'ACT_COM', 'act_comp')
      pushField(item.kelompokStatus === 'PS', 'jml_comp_ps')
      if (item.kelompokStatus === 'CANCEL') {
        const kendala = (item.kelompokKendala || '').toLowerCase()
        if (kendala === 'kendala pelanggan') child.cancel_kndl_plgn += 1
        else if (kendala === 'kendala teknik') child.cancel_kndl_teknis += 1
        else if (kendala === 'kendala lainnya') child.cancel_kndl_sys += 1
        else child.cancel_others += 1
        child.total_cancel += 1
      }
      pushField(item.kelompokStatus === 'REVOKE', 'revoke')
      calcHsiPercents(child)
      Object.keys(child).forEach((k) => { if (typeof child[k] === 'number') parent[k] += child[k] })
      reportData.push(child)
    })
    calcHsiPercents(parent)
    reportData.unshift(parent)
    Object.keys(parent).forEach((k) => { if (typeof parent[k] === 'number') totalsAccumulator[k] += parent[k] })
  })
  calcHsiPercents(totalsAccumulator)
  return { reportData, totals: totalsAccumulator }
}

// ===================== EXPORT HELPERS =====================
const addSheetFromObjects = (workbook, sheetName, rows) => {
  const sheet = workbook.addWorksheet(sheetName)
  if (!rows || rows.length === 0) return sheet
  const headers = Object.keys(rows[0] || {})
  sheet.columns = headers.map((key) => ({ header: key, key }))
  rows.forEach((row) => sheet.addRow(row))
  return sheet
}

const sendWorkbook = async (res, workbook, filename) => {
  const buffer = await workbook.xlsx.writeBuffer()
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(buffer)
}

// ===================== EXPORT ENDPOINTS =====================
export const exportReportAnalysis = async (req, res, next) => {
  try {
    const { tableData } = await computeReportAnalysisData(req.query)
    const workbook = new ExcelJS.Workbook()
    addSheetFromObjects(workbook, 'Analysis', tableData)
    await sendWorkbook(res, workbook, 'report-analysis.xlsx')
  } catch (error) {
    next(error)
  }
}

export const exportReportDatin = async (req, res, next) => {
  try {
    const { reportDataAomo, reportDataSodoro, galaksiData } = await computeReportDatinData(req.query)
    const workbook = new ExcelJS.Workbook()
    addSheetFromObjects(workbook, 'AOMO', reportDataAomo)
    addSheetFromObjects(workbook, 'SODORO', reportDataSodoro)
    addSheetFromObjects(workbook, 'GALAKSI', galaksiData)
    await sendWorkbook(res, workbook, 'report-datin.xlsx')
  } catch (error) {
    next(error)
  }
}

export const exportReportTambahan = async (req, res, next) => {
  try {
    const { tableData, projectData, top3ByWitel, top3ByPO } = await computeReportTambahanData(req.query)
    const workbook = new ExcelJS.Workbook()
    addSheetFromObjects(workbook, 'JT', tableData)
    addSheetFromObjects(workbook, 'TOC', projectData)

    const flattenTop3Witel = Object.entries(top3ByWitel || {}).flatMap(([witel, list]) =>
      (list || []).map((item) => ({ witel_baru: witel, ...item }))
    )
    const flattenTop3PO = Object.entries(top3ByPO || {}).flatMap(([po, list]) =>
      (list || []).map((item) => ({ po_name: po, ...item }))
    )
    addSheetFromObjects(workbook, 'Top3 Witel', flattenTop3Witel)
    addSheetFromObjects(workbook, 'Top3 PO', flattenTop3PO)

    await sendWorkbook(res, workbook, 'report-tambahan.xlsx')
  } catch (error) {
    next(error)
  }
}

export const exportReportHSI = async (req, res, next) => {
  try {
    const { reportData, totals } = await computeReportHsiData(req.query)
    const workbook = new ExcelJS.Workbook()
    const rows = [...reportData, { ...totals, witel: 'GRAND TOTAL' }]
    addSheetFromObjects(workbook, 'HSI', rows)
    await sendWorkbook(res, workbook, 'report-hsi.xlsx')
  } catch (error) {
    next(error)
  }
}

const NULL_BRANCH_LABEL = 'Non-Telda (NCX)'

// Ambil min/max tanggal sebagai default
const getDateBounds = async () => {
  const bounds = await prisma.digitalProduct.aggregate({
    _min: { createdAt: true },
    _max: { createdAt: true }
  })
  const min = bounds._min.createdAt ? dayjs(bounds._min.createdAt).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  const max = bounds._max.createdAt ? dayjs(bounds._max.createdAt).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  return { min, max }
}

// Ambil baris digital, lalu mapping & filter di sisi aplikasi supaya bentuk data kecil/bersih
const fetchFilteredRows = async (query) => {
  const { min: defaultStart, max: defaultEnd } = await getDateBounds()

  const startDate = query.startDate || defaultStart
  const endDate = query.endDate || defaultEnd

  const prismaWhere = {
    createdAt: {
      gte: new Date(`${startDate}T00:00:00Z`),
      lte: new Date(`${endDate}T23:59:59Z`)
    }
  }

  if (query.witel) prismaWhere.witel = query.witel
  if (query.branch) prismaWhere.branch = query.branch

  // Ambil semua kolom yang dibutuhkan saja
  const rows = await prisma.digitalProduct.findMany({
    where: prismaWhere,
    select: {
      id: true,
      orderNumber: true,
      productName: true,
      witel: true,
      branch: true,
      revenue: true,
      amount: true,
      status: true,
      subType: true,
      createdAt: true
    }
  })

  const selectedProducts = Array.isArray(query.products) ? query.products : query.product ? [query.product] : null
  const selectedSubTypes = Array.isArray(query.subTypes) ? query.subTypes : query.subType ? [query.subType] : null
  const search = (query.search || '').trim().toLowerCase()

  // Map + filter
  return rows
    .map((row) => {
      const product = mapProduct(row.productName)
      const subType = mapSubType(row.subType)
      const branch = row.branch && row.branch.trim() !== '' ? row.branch : NULL_BRANCH_LABEL
      return {
        ...row,
        product,
        subType,
        branch,
        witel: row.witel || 'Unknown',
        revenue: Number(row.revenue || 0),
        amount: Number(row.amount || 0) || 1 // fallback 1 jika amount kosong
      }
    })
    .filter((row) => row.product) // drop data tanpa product terpetakan
    .filter((row) => !selectedProducts || selectedProducts.includes(row.product))
    .filter((row) => !selectedSubTypes || (row.subType && selectedSubTypes.includes(row.subType)))
    .filter((row) => {
      if (!search) return true
      return (
        (row.orderNumber || '').toLowerCase().includes(search) ||
        (row.productName || '').toLowerCase().includes(search) ||
        (row.witel || '').toLowerCase().includes(search)
      )
    })
}

// Utility untuk ambil top-N secara aman
const takeTop = (arr, n, iteratee) => {
  const getter = iteratee || ((x) => x)
  return [...arr]
    .map((item) => ({ item, score: getter(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.item)
}

// Get all digital data for dashboard (raw list) - jarang dipakai
export const getDashboardData = async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req.query)
    successResponse(res, rows, 'Dashboard data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get revenue by witel from digital_products
export const getRevenueByWitel = async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req.query)

    const grouped = new Map()
    rows.forEach((row) => {
      const key = row.witel
      if (!grouped.has(key)) grouped.set(key, { name: key })
      const bucket = grouped.get(key)
      bucket[row.product] = (bucket[row.product] || 0) + row.revenue
    })

    const result = takeTop(Array.from(grouped.values()), 10, (item) => {
      return Object.entries(item)
        .filter(([k]) => k !== 'name')
        .reduce((sum, [, v]) => sum + v, 0)
    })

    successResponse(res, result, 'Revenue by witel retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get amount by witel from digital_products (uses amount sum)
export const getAmountByWitel = async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req.query)

    const grouped = new Map()
    rows.forEach((row) => {
      const key = row.witel
      if (!grouped.has(key)) grouped.set(key, { name: key })
      const bucket = grouped.get(key)
      bucket[row.product] = (bucket[row.product] || 0) + row.amount
    })

    const result = takeTop(Array.from(grouped.values()), 10, (item) => {
      return Object.entries(item)
        .filter(([k]) => k !== 'name')
        .reduce((sum, [, v]) => sum + v, 0)
    })

    successResponse(res, result, 'Amount by witel retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get KPI data from digital_products
export const getKPIData = async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req.query)
    const totalOrders = rows.length
    const completedOrders = rows.filter((r) => {
      const status = (r.status || '').toLowerCase()
      return ['completed', 'done', 'activated', 'live', 'closed', 'ps'].some((s) => status.includes(s))
    }).length

    successResponse(res, {
      totalOrder: totalOrders,
      completed: completedOrders,
      openProgress: Math.max(totalOrders - completedOrders, 0),
      completionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(2) : 0
    }, 'KPI data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get total order by regional (digital_products)
export const getTotalOrderByRegional = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query
    const { startDate, endDate } = parseRange(start_date, end_date)

    const whereClause = {}
    if (start_date && end_date) {
      whereClause.liBilldate = {
        gte: startDate,
        lte: endDate
      }
    }

    const sosRows = await prisma.sosData.findMany({
      where: whereClause,
      select: {
        segmenBaru: true,
        witelBaru: true,
        kategoriUmur: true,
        kategori: true,
        scalling2: true,
        tipeGrup: true,
        liStatus: true,
        orderSubtype: true,
        poName: true
      }
    })

    const reportDataAomo = buildSosAggregate(sosRows, 'AOMO')
    const reportDataSodoro = buildSosAggregate(sosRows, 'SODORO')
    const galaksiData = buildGalaksiData(sosRows)

    return successResponse(
      res,
      {
        reportDataAomo,
        reportDataSodoro,
        galaksiData
      },
      'Report Datin data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Distribusi order yang sudah PS per channel/branch
export const getSebaranDataPS = async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req.query)

    const grouped = rows.reduce((acc, row) => {
      const status = (row.status || '').toLowerCase()
      const isPsStatus = ['ps', 'completed', 'done', 'live', 'activated', 'closed'].some((flag) =>
        status.includes(flag)
      )
      if (!isPsStatus) return acc

      const channel = row.branch || NULL_BRANCH_LABEL
      acc[channel] = (acc[channel] || 0) + 1
      return acc
    }, {})

    const result = Object.entries(grouped).map(([name, value]) => ({ name, value }))
    successResponse(res, result, 'Sebaran data PS retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get cancel by FCC (digital_products)
export const getCancelByFCC = async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req.query)
    const grouped = rows.reduce((acc, row) => {
      const key = row.subType || 'Unmapped'
      if (!acc[key]) acc[key] = { name: key, value: 0 }
      acc[key].value += 1
      return acc
    }, {})

    const result = takeTop(Object.values(grouped), 8, (r) => r.value)
    successResponse(res, result, 'Cancel by FCC retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get filter options (unique values for dropdowns)
export const getFilterOptions = async (req, res, next) => {
  try {
    // Hardcoded regions as per requirement
    const regions = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

    const products = await prisma.sosData.findMany({
      distinct: ['liProductName'],
      select: { liProductName: true }
    })

    const segments = await prisma.sosData.findMany({
      distinct: ['segmen'],
      select: { segmen: true }
    })

    const statuses = await prisma.sosData.findMany({
      distinct: ['liStatus'],
      select: { liStatus: true }
    })

    successResponse(
      res,
      {
        filters: {
          witels: witels.filter(w => w.billWitel).map(w => w.billWitel),
          products: products.filter(p => p.liProductName).map(p => p.liProductName),
          segments: segments.filter(s => s.segmen).map(s => s.segmen)
        },
        stats: {
          totalWitels: witels.filter(w => w.billWitel).length,
          totalProducts: products.filter(p => p.liProductName).length,
          totalSegments: segments.filter(s => s.segmen).length
        }
      },
      'Filter options retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report Tambahan (JT/Jaringan Tambahan) - from SPMK MOM data
export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = { statusProyek: 'JT' }

    if (start_date && end_date) {
      whereClause.createdAt = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const tableData = await prisma.spmkMom.groupBy({
      by: ['witelBaru'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        revenuePlan: true
      }
    })

    const formattedTableData = tableData.map(row => ({
      witel: row.witelBaru || 'Unknown',
      jumlahLop: row._count.id,
      revAll: parseFloat(row._sum.revenuePlan || 0),
      initial: 0,
      survey: 0,
      perizinan: 0,
      instalasi: 0,
      piOgp: 0,
      golive: row.goLive === 'Y' ? row._count.id : 0,
      drop: 0
    }))

    // Get project data (belum GO LIVE)
    const projectData = await prisma.spmkMom.findMany({
      where: {
        ...whereClause,
        goLive: 'N'
      },
      select: {
        witelBaru: true,
        region: true,
        revenuePlan: true,
        usia: true
      }
    })

    successResponse(
      res,
      {
        tableData: formattedTableData,
        projectData
      },
      'Report Tambahan data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report Datin - from SPMK MOM data  
export const getReportDatin = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = { statusProyek: { contains: 'DATIN' } }

    if (start_date && end_date) {
      whereClause.createdAt = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const tableData = await prisma.spmkMom.groupBy({
      by: ['witelBaru', 'region'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        revenuePlan: true,
        rab: true
      }
    })

    const formattedTableData = tableData.map(row => ({
      witel: row.witelBaru || 'Unknown',
      branch: row.region || 'Unknown',
      totalAmount: parseFloat(row._sum.revenuePlan || 0),
      jumlahProject: row._count.id,
      selesai: 0,
      progress: row._count.id
    }))

    successResponse(
      res,
      {
        tableData: formattedTableData,
        posisiGalaksi: []
      },
      'Report Datin data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report Analysis - from SOS data segmentation
export const getReportAnalysis = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = {}

    if (start_date && end_date) {
      whereClause.orderCreatedDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    // Get SME data
    const smeData = await prisma.sosData.count({
      where: {
        ...whereClause,
        segmen: { contains: 'SME' }
      }
    })

    const smeBillAmount = await prisma.sosData.aggregate({
      where: {
        ...whereClause,
        segmen: { contains: 'SME' }
      },
      _sum: {
        revenue: true
      }
    })

    // Get Government data
    const govData = await prisma.sosData.count({
      where: {
        ...whereClause,
        segmen: { contains: 'GOV' }
      }
    })

    const govBillAmount = await prisma.sosData.aggregate({
      where: {
        ...whereClause,
        segmen: { contains: 'GOV' }
      },
      _sum: {
        revenue: true
      }
    })

    // Get Private data
    const privateData = await prisma.sosData.count({
      where: {
        ...whereClause,
        segmen: { notIn: ['SME', 'GOVERNMENT', 'GOV', 'SOE'] }
      }
    })

    const privateBillAmount = await prisma.sosData.aggregate({
      where: {
        ...whereClause,
        segmen: { notIn: ['SME', 'GOVERNMENT', 'GOV', 'SOE'] }
      },
      _sum: {
        revenue: true
      }
    })

    const tableData = [
      {
        kategori: 'SME',
        jumlah: smeData,
        totalRevenue: parseFloat(smeBillAmount._sum.revenue || 0)
      },
      {
        kategori: 'GOVERNMENT',
        jumlah: govData,
        totalRevenue: parseFloat(govBillAmount._sum.revenue || 0)
      },
      {
        kategori: 'PRIVATE',
        jumlah: privateData,
        totalRevenue: parseFloat(privateBillAmount._sum.revenue || 0)
      }
    ]

    successResponse(
      res,
      { tableData },
      'Report Analysis data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report HSI - from HSI data table
export const getReportHSI = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = {}

    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const tableData = await prisma.hsiData.groupBy({
      by: ['witel'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        upload: true
      }
    })

    const formattedTableData = tableData.map(row => ({
      witel: row.witel || 'Unknown',
      totalHsi: row._count.id,
      jumlahProject: row._count.id,
      selesai: 0,
      progress: row._count.id,
      avgRevenue: 0
    }))

    successResponse(
      res,
      { tableData: formattedTableData },
      'Report HSI data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}
