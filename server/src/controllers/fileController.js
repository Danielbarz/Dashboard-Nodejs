import sql from '../config/database.js'
import { successResponse, errorResponse } from '../utils/response.js'
import XLSX from 'xlsx'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { unlink } from 'fs/promises'
import path from 'path'

// Ensure destination table exists for a given type (lightweight staging tables)
async function ensureTypeTable(type) {
  if (type === 'digital_product') return
  const tableMap = {
    sos: 'sos_records',
    jt: 'jt_records',
    datin: 'datin_records',
    hsi: 'hsi_records'
  }
  const table = tableMap[type]
  if (!table) return
  await sql`
    CREATE TABLE IF NOT EXISTS ${sql(table)} (
      id BIGSERIAL PRIMARY KEY,
      file_name TEXT,
      source_type TEXT,
      witel TEXT,
      branch TEXT,
      status TEXT,
      revenue NUMERIC(15,2),
      amount NUMERIC(15,2),
      raw JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
}

function pickCaseInsensitive(obj, key) {
  const found = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase())
  return found ? obj[found] : undefined
}

// Upload Excel/CSV file
export const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const activeRole = req.user.currentRoleAs || req.user.current_role_as || userRole
    const type = (req.query.type || 'digital_product').toString().toLowerCase()

    // Only admin and super_admin can upload files (based on ACTIVE role)
    if (!['admin', 'super_admin'].includes(activeRole)) {
      return errorResponse(res, 'You do not have permission to upload files', 403)
    }

    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400)
    }

    const file = req.file
    const fileName = file.originalname
    const filePath = file.path

    // Check file type
    const ext = path.extname(fileName).toLowerCase()
    if (!['.xlsx', '.xls', '.csv'].includes(ext)) {
      await unlink(filePath)
      return errorResponse(res, 'Only Excel (.xlsx, .xls) and CSV files are allowed', 400)
    }

    let data = []

    try {
      if (ext === '.csv') {
        // Parse CSV
        data = await new Promise((resolve, reject) => {
          const results = []
          createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject)
        })
      } else {
        // Parse Excel
        const workbook = XLSX.readFile(filePath)
        const sheetName = workbook.SheetNames[0]
        data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
      }

      if (data.length === 0) {
        await unlink(filePath)
        return errorResponse(res, 'File is empty', 400)
      }

      // Ensure destination table if needed
      await ensureTypeTable(type)

      // Import data to database
      let successCount = 0
      let failedCount = 0
      const errors = []

      for (const row of data) {
        try {
          const now = new Date()

          if (type === 'digital_product') {
            const {
              order_number,
              product_name,
              witel,
              branch,
              revenue,
              amount,
              status,
              sub_type,
              custom_target,
              completed_at
            } = row

            // Validate required fields
            if (!order_number || !product_name || !witel || !branch || !revenue || !amount || !status) {
              failedCount++
              errors.push(`Row ${data.indexOf(row) + 1}: Missing required fields`)
              continue
            }

            await sql`
              INSERT INTO digital_products 
              (order_number, product_name, witel, branch, revenue, amount, status, sub_type, custom_target, completed_at, created_at, updated_at)
              VALUES (${order_number}, ${product_name}, ${witel}, ${branch}, ${parseFloat(revenue)}, ${parseFloat(amount)}, ${status}, ${sub_type || null}, ${custom_target ? parseFloat(custom_target) : null}, ${completed_at || null}, ${now}, ${now})
              ON CONFLICT (order_number) DO UPDATE SET
              product_name = ${product_name},
              witel = ${witel},
              branch = ${branch},
              revenue = ${parseFloat(revenue)},
              amount = ${parseFloat(amount)},
              status = ${status},
              sub_type = ${sub_type || null},
              custom_target = ${custom_target ? parseFloat(custom_target) : null},
              completed_at = ${completed_at || null},
              updated_at = ${now}
            `
          } else {
            // Generic ingest into {type}_records
            const tableMap = { sos: 'sos_records', jt: 'jt_records', datin: 'datin_records', hsi: 'hsi_records' }
            const table = tableMap[type]
            if (!table) {
              throw new Error(`Unsupported upload type: ${type}`)
            }

            const witel = pickCaseInsensitive(row, 'witel') || null
            const branch = pickCaseInsensitive(row, 'branch') || null
            const status = pickCaseInsensitive(row, 'status') || null
            const revenue = pickCaseInsensitive(row, 'revenue')
            const amount = pickCaseInsensitive(row, 'amount')

            await sql`
              INSERT INTO ${sql(table)} (file_name, source_type, witel, branch, status, revenue, amount, raw, created_at, updated_at)
              VALUES (${fileName}, ${type}, ${witel}, ${branch}, ${status}, ${revenue != null ? Number(revenue) : null}, ${amount != null ? Number(amount) : null}, ${sql.json(row)}, ${now}, ${now})
            `
          }
          successCount++
        } catch (err) {
          failedCount++
          errors.push(`Row ${data.indexOf(row) + 1}: ${err.message}`)
        }
      }

      // Log import
      const now = new Date()
      await sql`
        INSERT INTO import_logs 
        (file_name, total_rows, success_rows, failed_rows, status, error_log, user_id, created_at, updated_at)
        VALUES (${fileName}, ${data.length}, ${successCount}, ${failedCount}, 'completed', ${errors.join('\n')}, ${userId}, ${now}, ${now})
      `

      // Clean up uploaded file
      await unlink(filePath)

      successResponse(res, {
        totalRows: data.length,
        successRows: successCount,
        failedRows: failedCount,
        errors: errors.length > 0 ? errors : null
      }, 'File uploaded and processed successfully')
    } catch (parseError) {
      await unlink(filePath)
      next(parseError)
    }
  } catch (error) {
    next(error)
  }
}

// Get import logs
export const getImportLogs = async (req, res, next) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    // Only admin and super_admin can view import logs
    if (!['admin', 'super_admin'].includes(userRole)) {
      return errorResponse(res, 'You do not have permission to view import logs', 403)
    }

    const logs = await sql`
      SELECT * FROM import_logs 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `

    successResponse(res, logs, 'Import logs retrieved successfully')
  } catch (error) {
    next(error)
  }
}
