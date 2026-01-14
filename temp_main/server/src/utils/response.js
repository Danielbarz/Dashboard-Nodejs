// Safely serialize BigInt to string to avoid "Do not know how to serialize a BigInt"
const serialize = (payload) => JSON.parse(
  JSON.stringify(payload, (_, value) => (typeof value === 'bigint' ? value.toString() : value))
)

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json(
    serialize({
      success: true,
      message,
      data
    })
  )
}

export const errorResponse = (res, message = 'Error', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message
  }

  if (errors) {
    response.errors = errors
  }

  return res.status(statusCode).json(serialize(response))
}

export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json(
    serialize({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit)
      }
    })
  )
}
