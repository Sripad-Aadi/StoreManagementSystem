const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`)

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Already exists',
      detail: err.detail
    })
  }

  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      detail: err.detail
    })
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
      detail: err.detail
    })
  }

  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    })
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}

export default errorHandler