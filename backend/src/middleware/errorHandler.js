const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`)

  if (err.code === '23505') {
    console.error(err.detail);
    return res.status(409).json({
      success: false,
      message: 'Already exists',
    })
  }

  if (err.code === '23514') {
    console.error(err.detail);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
    })
  }

  if (err.code === '23503') {
    console.error(err.detail);
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
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