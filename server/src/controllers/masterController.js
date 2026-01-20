import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

// --- ACCOUNT OFFICERS (Filter for JT) ---
export const getAccountOfficers = async (req, res) => {
  try {
    const data = await prisma.accountOfficer.findMany({
      orderBy: { name: 'asc' }
    })
    const formatted = data.map(item => ({
      ...item,
      id: item.id.toString()
    }))
    successResponse(res, formatted, 'Account Officers retrieved successfully')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to fetch Account Officers', 500)
  }
}

export const createAccountOfficer = async (req, res) => {
  try {
    const { name, filterWitelLama, specialFilterColumn, specialFilterValue } = req.body
    await prisma.accountOfficer.create({
      data: {
        name,
        filterWitelLama,
        specialFilterColumn,
        specialFilterValue
      }
    })
    successResponse(res, null, 'Account Officer created')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to create AO', 500)
  }
}

export const deleteAccountOfficer = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.accountOfficer.delete({ where: { id: BigInt(id) } })
    successResponse(res, null, 'Account Officer deleted')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to delete AO', 500)
  }
}

// --- MASTER PO (list_po table) ---
export const getPOMaster = async (req, res) => {
  try {
    const data = await prisma.$queryRawUnsafe('SELECT * FROM list_po ORDER BY po ASC')
    const formatted = data.map(item => ({
      id: item.id.toString(),
      nipnas: item.nipnas,
      namaPo: item.po, 
      segment: item.segment,
      billCity: item.bill_city,
      witel: item.witel
    }))
    successResponse(res, formatted, 'PO Master retrieved successfully')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to fetch PO Master', 500)
  }
}

export const createPOMaster = async (req, res) => {
  try {
    const { nipnas, namaPo, segment, witel } = req.body
    await prisma.$executeRawUnsafe(
      'INSERT INTO list_po (nipnas, po, segment, witel, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
      nipnas, namaPo, segment, witel
    )
    successResponse(res, null, 'PO Master created')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to create PO: ' + error.message, 500)
  }
}

export const deletePOMaster = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.$executeRawUnsafe('DELETE FROM list_po WHERE id = $1', BigInt(id))
    successResponse(res, null, 'PO Master deleted')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to delete PO: ' + error.message, 500)
  }
}

// --- UNMAPPED ORDERS & MAPPING (SOS DATA) ---
export const getUnmappedOrders = async (req, res) => {
  try {
    const region3Witels = [
      'BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU',
      'MALANG', 'SIDOARJO'
    ]
    const witelList = region3Witels.map(w => `'${w}'`).join(',')

    const data = await prisma.$queryRawUnsafe(`
      SELECT id, order_id, standard_name, nipnas, cust_city, bill_city, bill_witel, segmen 
      FROM sos_data 
      WHERE (po_name IS NULL OR po_name = '' OR po_name = '-')
      AND UPPER(bill_witel) IN (${witelList})
      ORDER BY order_created_date DESC
      LIMIT 50
    `)

    const formatted = data.map(item => ({
        id: item.id.toString(),
        orderId: item.order_id,
        customerName: item.standard_name || 'Unknown Customer',
        nipnas: item.nipnas,
        custCity: item.cust_city,
        billCity: item.bill_city,
        billWitel: item.bill_witel,
        segment: item.segmen
    }))
    successResponse(res, formatted, 'Unmapped orders retrieved')
  } catch (error) {
    console.error('Get Unmapped Error:', error)
    errorResponse(res, 'Failed to fetch unmapped orders: ' + error.message, 500)
  }
}

export const updateMapping = async (req, res) => {
  try {
    const { id } = req.params
    const { poName } = req.body

    // Use Raw Query because Prisma Client might be out of sync
    await prisma.$executeRawUnsafe(`
      UPDATE sos_data 
      SET po_name = $1, updated_at = NOW() 
      WHERE id = $2
    `, poName, BigInt(id))

    successResponse(res, null, 'Order mapped successfully (Raw)')
  } catch (error) {
    console.error('Update Mapping Error:', error)
    errorResponse(res, 'Failed to update mapping: ' + error.message, 500)
  }
}

export const autoMapping = async (req, res) => {
  try {
    const region3Witels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU', 'MALANG', 'SIDOARJO']
    const witelList = region3Witels.map(w => `'${w}'`).join(',')

    // 1. UPDATE MATCHING POs by NIPNAS (Priority 1)
    const updateNipnas = await prisma.$executeRawUnsafe(`
      UPDATE sos_data
      SET po_name = list_po.po, updated_at = NOW()
      FROM list_po
      WHERE sos_data.nipnas = list_po.nipnas
      AND (sos_data.po_name IS NULL OR sos_data.po_name = '' OR sos_data.po_name = '-' OR sos_data.po_name = 'PO_TIDAK_TERDEFINISI')
      AND UPPER(sos_data.bill_witel) IN (${witelList})
      AND list_po.po IS NOT NULL
    `);

    // 2. UPDATE BY AO WITEL MAPPING (Priority 2 - Fallback)
    // Fetch AOs with filters
    const accountOfficers = await prisma.accountOfficer.findMany();
    let updateAoCount = 0;

    for (const ao of accountOfficers) {
      if (!ao.filterWitelLama) continue;
      
      const filters = ao.filterWitelLama.split(',').map(f => f.trim().toUpperCase()).filter(f => f);
      if (filters.length === 0) continue;

      // Construct SQL condition for this AO (e.g. bill_witel LIKE '%MADIUN%' OR bill_witel LIKE '%KEDIRI%')
      const likeConditions = filters.map(f => `UPPER(bill_witel) LIKE '%${f}%'`).join(' OR ');
      
      // Optional: Special Filter (e.g. Segment)
      let specialCondition = "";
      if (ao.specialFilterColumn && ao.specialFilterValue) {
          // Map column names if needed, assume 'segment' maps to 'segmen' column
          const colName = ao.specialFilterColumn.toString().toLowerCase() === 'segment' ? 'segmen' : ao.specialFilterColumn;
          // Validasi nama kolom agar tidak SQL Injection (whitelist sederhana)
          if(['segmen', 'kategori', 'bill_city'].includes(colName.toLowerCase())) {
             specialCondition = `AND UPPER(${colName}) = '${ao.specialFilterValue.toUpperCase()}'`;
          }
      }

      const sql = `
        UPDATE sos_data
        SET po_name = '${ao.name}', updated_at = NOW()
        WHERE (po_name IS NULL OR po_name = '' OR po_name = '-' OR po_name = 'PO_TIDAK_TERDEFINISI')
        AND UPPER(bill_witel) IN (${witelList})
        AND (${likeConditions})
        ${specialCondition}
      `;
      
      const result = await prisma.$executeRawUnsafe(sql);
      
      updateAoCount += Number(result);
    }

    // 3. MARK REMAINING AS UNDEFINED
    const cleanupResult = await prisma.$executeRawUnsafe(`
      UPDATE sos_data
      SET po_name = 'PO_TIDAK_TERDEFINISI', updated_at = NOW()
      WHERE (po_name IS NULL OR po_name = '' OR po_name = '-')
      AND UPPER(bill_witel) IN (${witelList})
    `);

    successResponse(res, {
      byNipnas: Number(updateNipnas),
      byRegion: updateAoCount,
      markedUndefined: Number(cleanupResult)
    }, 'Auto mapping completed successfully')
  } catch (error) {
    console.error('AutoMapping Error:', error)
    errorResponse(res, 'Failed to perform auto mapping: ' + error.message, 500)
  }
}

export const getTargets = async (req, res) => {
  try {
    const data = await prisma.target.findMany({
      orderBy: { periodDate: 'desc' }
    })
    const formatted = data.map(item => ({
      ...item,
      id: item.id.toString(),
      value: parseFloat(item.value)
    }))
    return successResponse(res, formatted, 'Targets retrieved successfully')
  } catch (error) {
    console.error(error)
    return errorResponse(res, 'Failed to fetch targets', 500)
  }
}

export const getTargetById = async (req, res) => {
  try {
    const { id } = req.params
    const item = await prisma.target.findUnique({
      where: { id: BigInt(id) }
    })
    if (!item) return errorResponse(res, 'Target not found', 404)
    
    return successResponse(res, {
      ...item,
      id: item.id.toString(),
      value: parseFloat(item.value)
    }, 'Target retrieved')
  } catch (error) {
    return errorResponse(res, 'Failed to fetch target', 500)
  }
}

// === UPDATED: Create Target using RAW SQL (Fixed Syntax) ===
export const createTarget = async (req, res) => {
  try {
    const { periodType, targetType, witel, product, value, periodDate, dashboardType } = req.body
    
    // Basic Validation
    if (!value || isNaN(parseFloat(value))) return errorResponse(res, 'Nilai target harus angka', 400);
    if (!periodDate) return errorResponse(res, 'Tanggal periode harus diisi', 400);

    const sql = `
      INSERT INTO targets (segment, metric_type, nama_witel, product_name, target_value, period, dashboard_type, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `
    
    await prisma.$executeRawUnsafe(sql, periodType, targetType, witel, product, parseFloat(value), new Date(periodDate), dashboardType || 'DIGITAL');

    return successResponse(res, { ...req.body, id: 'new' }, 'Target created')
  } catch (error) {
    console.error('Create Target Raw Error:', error)
    return errorResponse(res, 'Failed to create target: ' + error.message, 500)
  }
}

// === UPDATED: Update Target using RAW SQL (Fixed Syntax) ===
export const updateTarget = async (req, res) => {
  try {
    const { id } = req.params
    const { periodType, targetType, witel, product, value, periodDate, dashboardType } = req.body
    
    const sql = `
      UPDATE targets 
      SET segment = $1, metric_type = $2, nama_witel = $3, product_name = $4, target_value = $5, period = $6, dashboard_type = $7, updated_at = NOW()
      WHERE id = $8
    `

    await prisma.$executeRawUnsafe(sql, periodType, targetType, witel, product, parseFloat(value), new Date(periodDate), dashboardType, BigInt(id));

    return successResponse(res, { ...req.body, id }, 'Target updated')
  } catch (error) {
    console.error('Update Target Raw Error:', error)
    return errorResponse(res, 'Failed to update target: ' + error.message, 500)
  }
}

export const deleteTarget = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.target.delete({ where: { id: BigInt(id) } })
    return successResponse(res, null, 'Target deleted')
  } catch (error) {
    return errorResponse(res, 'Failed to delete target', 500)
  }
}
