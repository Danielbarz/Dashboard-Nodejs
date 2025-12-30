import { successResponse, errorResponse } from '../utils/response.js'
import { listDigitalProducts, getDigitalProductStats, exportDigitalProductsExcel } from '../services/analysisService.js'

export const getDigitalProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, witel, branch, status } = req.query
    const result = await listDigitalProducts({
      page: Number(page),
      limit: Number(limit),
      search,
      witel,
      branch,
      status
    })

    return successResponse(res, result.data, 'Digital products fetched', 200)
  } catch (err) {
    next(err)
  }
}

export const getDigitalProductStatsHandler = async (req, res, next) => {
  try {
    const { witel, branch, status } = req.query
    const stats = await getDigitalProductStats({ witel, branch, status })
    return successResponse(res, stats, 'Stats fetched', 200)
  } catch (err) {
    next(err)
  }
}

export const exportDigitalProducts = async (req, res, next) => {
  try {
    const { search, witel, branch, status } = req.query
    const buffer = await exportDigitalProductsExcel({ search, witel, branch, status })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="digital_products.xlsx"')
    res.status(200).send(buffer)
  } catch (err) {
    next(err)
  }
}
