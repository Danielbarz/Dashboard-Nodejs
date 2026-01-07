import prisma from '../lib/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDigitalDashboardData = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      witels,      // string[]
      products,    // string[]: 'Netmonk', 'OCA', 'Antares', 'Pijar'
      subTypes,    // string[]: 'AO', 'MO', 'SO', 'DO', 'RO'
      branches     // string[]
    } = req.query;

    // --- 1. Filter Logic Helpers ---

    // Parameter index tracker for Postgres ($1, $2, ...)
    let paramIdx = 1;
    const getParamPlaceholder = () => `$${paramIdx++}`;

    // Build WHERE conditions
    const conditions = [];
    const params = [];

    // Date Filter (Mandatory)
    if (startDate && endDate) {
      conditions.push(`d."order_date" >= ${getParamPlaceholder()} AND d."order_date" <= ${getParamPlaceholder()}`);

      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      params.push(start, end);
    }

    // Product Filter (Mapped to LIKE)
    const targetProducts = products ? (Array.isArray(products) ? products : [products]) : ['Netmonk', 'OCA', 'Antares', 'Pijar'];

    const productLikes = [];
    if (targetProducts.includes('Netmonk')) productLikes.push(`d."product" ILIKE '%NETMONK%'`);
    if (targetProducts.includes('OCA')) productLikes.push(`d."product" ILIKE '%OCA%'`);
    if (targetProducts.includes('Antares')) productLikes.push(`d."product" ILIKE '%ANTARES%'`);
    if (targetProducts.includes('Pijar')) productLikes.push(`d."product" ILIKE '%PIJAR%'`);

    if (productLikes.length > 0) {
      conditions.push(`(${productLikes.join(' OR ')})`);
    } else {
      conditions.push('1=0');
    }

    // Witel Filter
    // Existing:
    // if (witels) {
    //   const witelList = Array.isArray(witels) ? witels : [witels];
    //   if (witelList.length > 0) {
    //     conditions.push(`d."nama_witel" IN (${witelList.map(() => getParamPlaceholder()).join(',')})`);
    //     params.push(...witelList);
    //   }
    // }

    // --- UPDATED WITEL LOGIC (Strict Grouping for Charts) ---
    // Rule:
    // Only allow specific witels and map them to their parent Regional Group.
    // 1. JATIM BARAT: JATIM BARAT, KEDIRI, MADIUN, MALANG
    // 2. JATIM TIMUR: JATIM TIMUR, JEMBER, PASURUAN, SIDOARJO
    // 3. NUSA TENGGARA: NUSA TENGGARA, NTB, NTT
    // 4. SURAMADU: SURAMADU
    // 5. BALI: BALI

    // Always enforce filter to this universe of witels
    const validRawWitels = [
        'JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG',
        'JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO',
        'NUSA TENGGARA', 'NTB', 'NTT',
        'SURAMADU',
        'BALI'
    ];

    conditions.push(`d."nama_witel" IN (${validRawWitels.map(w => `'${w}'`).join(',')})`);

    // If User selects specific Witel (e.g. 'JATIM BARAT'), we must filter by ALL its constituents.
    if (witels) {
      const selectedWitels = Array.isArray(witels) ? witels : [witels];
      // Resolve each selected "Group Name" to its raw components
      const resolvedRawWitels = [];

      selectedWitels.forEach(groupName => {
        if (groupName === 'JATIM BARAT') resolvedRawWitels.push('JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG');
        else if (groupName === 'JATIM TIMUR') resolvedRawWitels.push('JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO');
        else if (groupName === 'NUSA TENGGARA') resolvedRawWitels.push('NUSA TENGGARA', 'NTB', 'NTT');
        else if (groupName === 'SURAMADU') resolvedRawWitels.push('SURAMADU');
        else if (groupName === 'BALI') resolvedRawWitels.push('BALI');
      });

      if (resolvedRawWitels.length > 0) {
        // Use parameter placeholders for user selection
        conditions.push(`d."nama_witel" IN (${resolvedRawWitels.map(() => getParamPlaceholder()).join(',')})`);
        params.push(...resolvedRawWitels);
      }
    }

    // SubType Filter
    const subTypeMap = {
      'AO': ['New Install', 'ADD SERVICE', 'NEW SALES'],
      'MO': ['MODIFICATION', 'Modify'],
      'SO': ['Suspend'],
      'DO': ['Disconnect'],
      'RO': ['Resume']
    };

    if (subTypes) {
      const selectedCodes = Array.isArray(subTypes) ? subTypes : [subTypes];
      const dbSubTypes = [];
      selectedCodes.forEach(code => {
        if (subTypeMap[code]) dbSubTypes.push(...subTypeMap[code]);
        else dbSubTypes.push(code);
      });

      if (dbSubTypes.length > 0) {
        conditions.push(`d."order_sub_type" IN (${dbSubTypes.map(() => getParamPlaceholder()).join(',')})`);
        params.push(...dbSubTypes);
      }
    }

    // Branch Filter
    if (branches) {
      const branchList = Array.isArray(branches) ? branches : [branches];
      const branchConditions = [];
      const hasNCX = branchList.includes('Non-Telda (NCX)');
      const realBranches = branchList.filter(b => b !== 'Non-Telda (NCX)');

      if (realBranches.length > 0) {
        branchConditions.push(`d."telda" IN (${realBranches.map(() => getParamPlaceholder()).join(',')})`);
        params.push(...realBranches);
      }

      if (hasNCX) {
        branchConditions.push(`(d."telda" IS NULL OR d."telda" = '')`);
      }

      if (branchConditions.length > 0) {
        conditions.push(`(${branchConditions.join(' OR ')})`);
      }
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // --- 2. SQL Fragments ---

    // Standardized Product Column
    const productCaseSql = `
      CASE
        WHEN d."product" ILIKE '%NETMONK%' THEN 'Netmonk'
        WHEN d."product" ILIKE '%OCA%' THEN 'OCA'
        WHEN d."product" ILIKE '%ANTARES%' THEN 'Antares'
        WHEN d."product" ILIKE '%PIJAR%' THEN 'Pijar'
        ELSE NULL
      END
    `;

    // Standardized SubType Column
    // (Used for display in table, not necessarily for grouping in all charts)
    const subTypeCaseSql = `
      CASE
        WHEN d."order_sub_type" IN ('New Install', 'ADD SERVICE', 'NEW SALES') THEN 'AO'
        WHEN d."order_sub_type" IN ('MODIFICATION', 'Modify') THEN 'MO'
        WHEN d."order_sub_type" = 'Suspend' THEN 'SO'
        WHEN d."order_sub_type" = 'Disconnect' THEN 'DO'
        WHEN d."order_sub_type" = 'Resume' THEN 'RO'
        ELSE d."order_sub_type"
      END
    `;

    // Standardized Branch
    const branchSql = `COALESCE(NULLIF(d."telda", ''), 'Non-Telda (NCX)')`;

    // Channel
    const channelSql = `COALESCE(NULLIF(d."channel", ''), 'Unmapped')`;

    // Logic for Grouping Witel vs Branch
    // If only 1 witel is selected, group by Branch (Telda).
    // Else, group by Witel (Mapped).
    const selectedWitels = witels ? (Array.isArray(witels) ? witels : [witels]) : [];
    const isSingleWitel = selectedWitels.length === 1;

    // Define Mapped Witel Logic
    const witelMappedSql = `
      CASE
        WHEN d."nama_witel" IN ('KEDIRI', 'MADIUN', 'MALANG', 'JATIM BARAT') THEN 'JATIM BARAT'
        WHEN d."nama_witel" IN ('JEMBER', 'PASURUAN', 'SIDOARJO', 'JATIM TIMUR') THEN 'JATIM TIMUR'
        WHEN d."nama_witel" IN ('NTB', 'NTT', 'NUSA TENGGARA') THEN 'NUSA TENGGARA'
        WHEN d."nama_witel" IN ('SURAMADU') THEN 'SURAMADU'
        WHEN d."nama_witel" IN ('BALI') THEN 'BALI'
        ELSE 'OTHER'
      END
    `;

    // Group Column for Charts 1 & 2
    const groupColSql = isSingleWitel ? branchSql : witelMappedSql;
    const groupColAlias = 'group_name';

    // --- 3. Execute Queries Parallelly ---

    // Chart 1: Revenue by Witel/Branch (Stacked by Product)
    // Filter: net_price > 0
    const queryRevenue = prisma.$queryRawUnsafe(`
      SELECT
        ${groupColSql} as "${groupColAlias}",
        ${productCaseSql} as "product_category",
        SUM(d."net_price") as "total_revenue"
      FROM "document_data" d
      ${whereSql} AND d."net_price" > 0
      GROUP BY ${groupColSql}, ${productCaseSql}
      ORDER BY "product_category", "total_revenue" DESC
    `, ...params);

    // Chart 2: Amount by Witel/Branch (Stacked by Product)
    const queryAmount = prisma.$queryRawUnsafe(`
      SELECT
        ${groupColSql} as "${groupColAlias}",
        ${productCaseSql} as "product_category",
        COUNT(d.id) as "total_order"
      FROM "document_data" d
      ${whereSql}
      GROUP BY ${groupColSql}, ${productCaseSql}
      ORDER BY "product_category", "total_order" DESC
    `, ...params);

    // Chart 3: Product by Segment
    // Filter: Show Unknown if segment is null
    const querySegment = prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(NULLIF(d."segment", ''), 'Unknown') as "segment",
        ${productCaseSql} as "product_category",
        COUNT(d.id) as "total_order"
      FROM "document_data" d
      ${whereSql}
      GROUP BY COALESCE(NULLIF(d."segment", ''), 'Unknown'), ${productCaseSql}
      ORDER BY total_order DESC
    `, ...params);

    // Chart 4: Product by Channel
    const queryChannel = prisma.$queryRawUnsafe(`
      SELECT
        ${channelSql} as "channel_group",
        ${productCaseSql} as "product_category",
        COUNT(d.id) as "total_order"
      FROM "document_data" d
      ${whereSql}
      GROUP BY ${channelSql}, ${productCaseSql}
      ORDER BY total_order DESC
    `, ...params);

    // Chart 5: Product Share (Pie)
    const queryShare = prisma.$queryRawUnsafe(`
      SELECT
        ${productCaseSql} as "product_category",
        COUNT(d.id) as "total_order"
      FROM "document_data" d
      ${whereSql}
      GROUP BY ${productCaseSql}
      ORDER BY total_order DESC
    `, ...params);

    // Table Data (Preview)
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // Add Search Filter if exists
    let tableConditions = [...conditions];
    const tableParams = [...params];

    if (search) {
      const searchLike = `%${search}%`;
      const p1 = getParamPlaceholder();
      const p2 = getParamPlaceholder();
      const p3 = getParamPlaceholder();
      const p4 = getParamPlaceholder();

      tableConditions.push(`(
        d."order_id" ILIKE ${p1} OR
        d."customer_name" ILIKE ${p2} OR
        d."product" ILIKE ${p3} OR
        d."status_wfm" ILIKE ${p4}
      )`);
      tableParams.push(searchLike, searchLike, searchLike, searchLike);
    }

    const tableWhereSql = tableConditions.length > 0 ? `WHERE ${tableConditions.join(' AND ')}` : '';

    const queryTable = prisma.$queryRawUnsafe(`
      SELECT
        d."order_id",
        d."customer_name",
        ${productCaseSql} as "product_category",
        ${subTypeCaseSql} as "subtype_category",
        d."net_price",
        d."segment",
        d."nama_witel",
        ${branchSql} as "branch_group",
        d."status_wfm",
        d."order_date",
        d."channel"
      FROM "document_data" d
      ${tableWhereSql}
      ORDER BY d."order_date" DESC
      LIMIT ${limit} OFFSET ${offset}
    `, ...tableParams);

    const queryTotalCount = prisma.$queryRawUnsafe(`
      SELECT COUNT(d.id) as "total"
      FROM "document_data" d
      ${tableWhereSql}
    `, ...tableParams);

    // Run all
    const [
      revenueData,
      amountData,
      segmentData,
      channelData,
      shareData,
      tableRows,
      totalCountResult
    ] = await Promise.all([
      queryRevenue,
      queryAmount,
      querySegment,
      queryChannel,
      queryShare,
      queryTable,
      queryTotalCount
    ]);

    // Format BIGINT/DECIMAL to proper types for JSON
    const formatBigInt = (obj) => JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    const totalRows = Number(totalCountResult[0]?.total || 0);

    return successResponse(res, {
      charts: {
        revenueByWitel: revenueData,
        amountByWitel: amountData,
        productBySegment: segmentData,
        productByChannel: channelData,
        productShare: shareData,
        isSingleWitel
      },
      table: {
        rows: formatBigInt(tableRows),
        pagination: {
          page,
          limit,
          total: totalRows,
          totalPages: Math.ceil(totalRows / limit)
        }
      }
    }, 'Digital Product Dashboard Data');

  } catch (error) {
    console.error('Error in getDigitalDashboardData:', error);
    return errorResponse(res, error.message);
  }
};

export const getDigitalFilterOptions = async (req, res) => {
  try {
    const { witel } = req.query;

    // Fixed Witel List as per Requirement
    const witels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'];

    // Branches (Telda)
    // If witel provided, filter by it (using resolved raw witels)
    let branchSql = `
      SELECT DISTINCT COALESCE(NULLIF("telda", ''), 'Non-Telda (NCX)') as "branch"
      FROM "document_data"
    `;
    const params = [];

    // Filter by allowed universe first
    // Not strictly necessary for branches list if we trust the cross-filter,
    // but good consistency to only show branches from the relevant regions.
    // However, for simplicity, we just apply the user selection logic.

    if (witel) {
      const witelList = Array.isArray(witel) ? witel : [witel];

      // Resolve "Group" to Raw Witels
      const resolvedRawWitels = [];
      witelList.forEach(groupName => {
        if (groupName === 'JATIM BARAT') resolvedRawWitels.push('JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG');
        else if (groupName === 'JATIM TIMUR') resolvedRawWitels.push('JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO');
        else if (groupName === 'NUSA TENGGARA') resolvedRawWitels.push('NUSA TENGGARA', 'NTB', 'NTT');
        else if (groupName === 'SURAMADU') resolvedRawWitels.push('SURAMADU');
        else if (groupName === 'BALI') resolvedRawWitels.push('BALI');
      });

      if (resolvedRawWitels.length > 0) {
        branchSql += ` WHERE "nama_witel" IN (${resolvedRawWitels.map((_, i) => `$${i+1}`).join(',')})`;
        params.push(...resolvedRawWitels);
      }
    } else {
        // If no witel selected, restrict branches to the 5 regions universe
        const validUniverse = [
            'JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG',
            'JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO',
            'NUSA TENGGARA', 'NTB', 'NTT',
            'SURAMADU',
            'BALI'
        ];
        branchSql += ` WHERE "nama_witel" IN (${validUniverse.map(w => `'${w}'`).join(',')})`;
    }

    branchSql += ` ORDER BY "branch"`;

    const branchesRaw = await prisma.$queryRawUnsafe(branchSql, ...params);
    const branches = branchesRaw.map(r => r.branch);

    return successResponse(res, {
      witels,
      branches
    }, 'Filter options retrieved');

  } catch (error) {
    console.error('Error in getDigitalFilterOptions:', error);
    return errorResponse(res, error.message);
  }
};
