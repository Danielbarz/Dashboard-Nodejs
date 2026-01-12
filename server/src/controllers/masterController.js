import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

// Get All PO Masters (Dari tabel list_po)
export const getPOMaster = async (req, res) => {
  try {
    const data = await prisma.list_po.findMany({
      orderBy: { po: 'asc' }
    })
    // Mapping agar sesuai dengan format frontend (namaPo, dll)
    const formattedData = data.map(item => ({
        id: item.id.toString(),
        nipnas: item.nipnas,
        namaPo: item.po, // Frontend minta 'namaPo', di DB kolomnya 'po'
        segment: item.segment,
        billCity: item.bill_city,
        witel: item.witel
    }))
    successResponse(res, formattedData, 'Data PO retrieved successfully')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to fetch PO Master', 500)
  }
}

// Get All Account Officers
export const getAccountOfficers = async (req, res) => {
  try {
    const data = await prisma.accountOfficer.findMany({
        orderBy: { name: 'asc' }
    })
    const formattedData = data.map(item => ({
        ...item,
        id: item.id.toString()
    }))
    successResponse(res, formattedData, 'AO retrieved successfully')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to fetch Account Officers', 500)
  }
}

// Get Unmapped Orders (Contoh mengambil dari sos_data yang poName-nya kosong)
export const getUnmappedOrders = async (req, res) => {
  try {
    // Logika: Cari di sos_data dimana poName kosong ATAU tidak valid
    const unmappedSos = await prisma.sosData.findMany({
      where: {
        OR: [
            { poName: null },
            { poName: '' },
            { poName: '-' }
        ]
      },
      take: 100, // Batasi agar tidak berat
      orderBy: { orderDate: 'desc' }
    })

    const formattedData = unmappedSos.map(item => ({
        id: item.id.toString(),
        orderId: item.orderId,
        customerName: item.standardName || item.customerName, // Sesuaikan kolom
        nipnas: item.nipnas,
        custCity: item.custCity,
        billCity: item.billCity,
        billWitel: item.billWitel,
        segment: item.segmen
    }))

    successResponse(res, formattedData, 'Unmapped orders retrieved')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to fetch unmapped orders', 500)
  }
}

// Tambahkan fungsi create/update/delete sesuai kebutuhan frontend...