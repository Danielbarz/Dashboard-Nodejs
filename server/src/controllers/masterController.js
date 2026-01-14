// server/src/controllers/masterController.js
import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

// --- ACCOUNT OFFICERS ---
export const getAccountOfficers = async (req, res) => {
  try {
    const data = await prisma.accountOfficer.findMany({
      orderBy: { name: 'asc' }
    })
    // Konversi BigInt ke string agar JSON aman
    const formatted = data.map(item => ({
      ...item,
      id: item.id.toString()
    }))
    return successResponse(res, formatted, 'Account Officers retrieved')
  } catch (error) {
    console.error('Get AO Error:', error)
    return errorResponse(res, 'Failed to fetch Account Officers', 500)
  }
}

export const createAccountOfficer = async (req, res) => {
  try {
    const { name, displayWitel, filterWitelLama, specialFilterColumn, specialFilterValue } = req.body
    await prisma.accountOfficer.create({
      data: {
        name,
        displayWitel,
        filterWitelLama,
        specialFilterColumn,
        specialFilterValue
      }
    })
    return successResponse(res, null, 'Account Officer created')
  } catch (error) {
    return errorResponse(res, 'Failed to create AO', 500)
  }
}

export const deleteAccountOfficer = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.accountOfficer.delete({ where: { id: BigInt(id) } })
    return successResponse(res, null, 'Account Officer deleted')
  } catch (error) {
    return errorResponse(res, 'Failed to delete AO', 500)
  }
}

// --- MASTER PO (list_po) ---
export const getPOMaster = async (req, res) => {
  try {
    const data = await prisma.list_po.findMany({
      orderBy: { po: 'asc' }
    })
    const formatted = data.map(item => ({
      id: item.id.toString(),
      nipnas: item.nipnas,
      namaPo: item.po, // Mapping kolom 'po' di DB ke 'namaPo' di Frontend
      segment: item.segment,
      billCity: item.bill_city,
      witel: item.witel
    }))
    return successResponse(res, formatted, 'PO Master retrieved')
  } catch (error) {
    console.error('Get PO Error:', error)
    return errorResponse(res, 'Failed to fetch PO Master', 500)
  }
}

export const createPOMaster = async (req, res) => {
  try {
    const { nipnas, namaPo, segment, witel } = req.body
    await prisma.list_po.create({
      data: {
        nipnas,
        po: namaPo,
        segment,
        witel
      }
    })
    return successResponse(res, null, 'PO created')
  } catch (error) {
    return errorResponse(res, 'Failed to create PO', 500)
  }
}

export const deletePOMaster = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.list_po.delete({ where: { id: BigInt(id) } })
    return successResponse(res, null, 'PO deleted')
  } catch (error) {
    return errorResponse(res, 'Failed to delete PO', 500)
  }
}

// --- UNMAPPED ORDERS & MAPPING ---
export const getUnmappedOrders = async (req, res) => {
  try {
    // Ambil data SOS yang belum punya PO Name valid
    const data = await prisma.sosData.findMany({
      where: {
        OR: [{ poName: null }, { poName: '' }, { poName: '-' }]
      },
      take: 50, // Limit agar tidak berat
      orderBy: { orderDate: 'desc' }
    })

    const formatted = data.map(item => ({
      id: item.id.toString(),
      orderId: item.orderId,
      nipnas: item.nipnas,
      customerName: item.standardName || item.customerName,
      custCity: item.custCity,
      billCity: item.billCity,
      servCity: item.servCity,
      billWitel: item.billWitel
    }))
    return successResponse(res, formatted, 'Unmapped orders retrieved')
  } catch (error) {
    return errorResponse(res, 'Failed to fetch unmapped orders', 500)
  }
}

export const updateMapping = async (req, res) => {
  try {
    const { id } = req.params
    const { poName, billCity, billWitel, segment } = req.body

    await prisma.sosData.update({
      where: { id: BigInt(id) },
      data: { poName, billCity, billWitel, segmen: segment }
    })
    return successResponse(res, null, 'Mapping updated')
  } catch (error) {
    return errorResponse(res, 'Failed to update mapping', 500)
  }
}

export const autoMapping = async (req, res) => {
  // Implementasi logika automapping sederhana (placeholder)
  // Anda bisa menambahkan logika kompleks di sini nanti
  return successResponse(res, null, 'Auto mapping logic triggered')
}