import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import XLSX from 'xlsx'
import csv from 'csv-parser'

const unlinkAsync = promisify(fs.unlink)
const mkdirAsync = promisify(fs.mkdir)

// Helper function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

// Helper function to parse XLSX/XLS file
const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json(worksheet)
}

// Merge multiple CSV/XLSX files
export const mergeFiles = async (req, res, next) => {
  const uploadedFiles = []
  console.log('[MergeFiles] Started merging process...')

  try {
    const files = req.files

    if (!files || files.length === 0) {
      console.error('[MergeFiles] No files uploaded')
      return errorResponse(res, 'No files uploaded', 400)
    }

    console.log(`[MergeFiles] Received ${files.length} files`)

    if (files.length < 2) {
      return errorResponse(res, 'At least 2 files are required to merge', 400)
    }

    // Validate file types
    const allowedExtensions = ['.csv', '.xlsx', '.xls']
    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase()
      if (!allowedExtensions.includes(ext)) {
        console.error(`[MergeFiles] Invalid extension: ${ext} for file ${file.originalname}`)
        // Clean up
        for (const f of files) if (fs.existsSync(f.path)) await unlinkAsync(f.path)
        return errorResponse(res, `Invalid file type: ${file.originalname}`, 400)
      }
    }

    // Parse all files
    const allData = []
    let headers = null

    for (const file of files) {
      uploadedFiles.push(file.path)
      const ext = path.extname(file.originalname).toLowerCase()
      console.log(`[MergeFiles] Parsing file: ${file.originalname} (${ext})`)

      let fileData = []
      try {
        if (ext === '.csv') {
          fileData = await parseCSV(file.path)
        } else {
          fileData = parseExcel(file.path)
        }
      } catch (parseError) {
        console.error(`[MergeFiles] Error parsing ${file.originalname}:`, parseError)
        throw new Error(`Failed to parse ${file.originalname}: ${parseError.message}`)
      }

      console.log(`[MergeFiles] ${file.originalname} has ${fileData.length} rows`)

      if (fileData.length === 0) {
        console.warn(`[MergeFiles] File ${file.originalname} is empty`)
        continue
      }

      // Check headers consistency
      const fileHeaders = Object.keys(fileData[0])
      if (!headers) {
        headers = fileHeaders
        console.log('[MergeFiles] Base headers set:', headers)
      } else {
        if (headers.length !== fileHeaders.length) {
          console.warn(`[MergeFiles] Header length mismatch in ${file.originalname}`)
        }
      }

      allData.push(...fileData)
    }

    if (allData.length === 0) {
      throw new Error('No data found in uploaded files')
    }

    // Create merged file
    const mergedDir = path.join(process.cwd(), 'uploads', 'merged')
    if (!fs.existsSync(mergedDir)) {
      console.log('[MergeFiles] Creating directory:', mergedDir)
      await mkdirAsync(mergedDir, { recursive: true })
    }

    const timestamp = new Date().getTime()
    const mergedFileName = `merged_${timestamp}.xlsx`
    const mergedFilePath = path.join(mergedDir, mergedFileName)

    console.log(`[MergeFiles] Creating merged file at: ${mergedFilePath}`)

    const worksheet = XLSX.utils.json_to_sheet(allData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Merged Data')

    XLSX.writeFile(workbook, mergedFilePath)
    console.log('[MergeFiles] Merged file written successfully')

    // Clean up uploaded files
    for (const filePath of uploadedFiles) {
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath)
      }
    }

    successResponse(res, {
      fileName: mergedFileName,
      filePath: path.relative(process.cwd(), mergedFilePath),
      filesCount: files.length,
      totalRows: allData.length,
      createdAt: new Date().toISOString()
    }, 'Files merged successfully', 201)

  } catch (error) {
    console.error('[MergeFiles] Fatal error:', error)
    // Clean up uploaded files on error
    for (const filePath of uploadedFiles) {
      try {
        if (fs.existsSync(filePath)) await unlinkAsync(filePath)
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError)
      }
    }
    errorResponse(res, error.message || 'Failed to merge files', 500)
  }
}

// Download merged file
export const downloadMergedFile = async (req, res, next) => {
  try {
    const { filePath } = req.query

    if (!filePath) {
      return errorResponse(res, 'File path is required', 400)
    }

    const fullPath = path.join(process.cwd(), filePath)

    const mergedDir = path.join(process.cwd(), 'uploads', 'merged')
    if (!fullPath.startsWith(mergedDir)) {
      return errorResponse(res, 'Invalid file path', 400)
    }

    if (!fs.existsSync(fullPath)) {
      return errorResponse(res, 'File not found', 404)
    }

    const fileName = path.basename(fullPath)
    res.download(fullPath, fileName, (err) => {
      if (err && !res.headersSent) {
        console.error('Error downloading file:', err)
        errorResponse(res, 'Failed to download file', 500)
      }
    })

  } catch (error) {
    console.error('Error downloading merged file:', error)
    errorResponse(res, 'Failed to download file', 500)
  }
}