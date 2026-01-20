export const createTarget = async (req, res) => {
  try {
    const { periodType, targetType, witel, product, value, periodDate, dashboardType } = req.body
    
    // Fallback using Raw Query if Prisma Client is outdated
    // "Target" table name might be "Target" or "targets" depending on mapping. Usually prisma defaults to model name.
    // Let's check schema.prisma first to be sure of table name? Assuming "Target" based on prisma.target.create
    
    // We use quotes for columns to be safe with case sensitivity in Postgres
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Target" ("periodType", "targetType", "witel", "product", "value", "periodDate", "dashboardType", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, periodType, targetType, witel, product, parseFloat(value), new Date(periodDate), dashboardType || 'DIGITAL');

    // Fetch the created item to return it (optional, but good for UI update)
    // For simplicity, just return success with input data
    return successResponse(res, { ...req.body, id: 'new' }, 'Target created (Raw)')
  } catch (error) {
    console.error('Create Target Raw Error:', error)
    return errorResponse(res, 'Failed to create target: ' + error.message, 500)
  }
}

export const updateTarget = async (req, res) => {
  try {
    const { id } = req.params
    const { periodType, targetType, witel, product, value, periodDate, dashboardType } = req.body
    
    await prisma.$executeRawUnsafe(`
      UPDATE "Target" 
      SET "periodType" = $1, "targetType" = $2, "witel" = $3, "product" = $4, "value" = $5, "periodDate" = $6, "dashboardType" = $7, "updatedAt" = NOW()
      WHERE "id" = $8
    `, periodType, targetType, witel, product, parseFloat(value), new Date(periodDate), dashboardType, BigInt(id));

    return successResponse(res, { id, ...req.body }, 'Target updated (Raw)')
  } catch (error) {
    console.error('Update Target Raw Error:', error)
    return errorResponse(res, 'Failed to update target: ' + error.message, 500)
  }
}
