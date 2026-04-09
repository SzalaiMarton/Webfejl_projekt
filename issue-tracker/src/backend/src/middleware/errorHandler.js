export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.message.includes('required') || err.message.includes('Invalid')) {
    return res.status(400).json({
      error: err.message,
      status: 400
    });
  }

  if (err.message.includes('not found')) {
    return res.status(404).json({
      error: err.message,
      status: 404
    });
  }

  console.log(err.message)

  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    status: 500
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
