/**
 * Error Handler Middleware
 * Központosított hiba feldolgozás
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // Validációs hiba
  if (err.message.includes('required') || err.message.includes('Invalid')) {
    return res.status(400).json({
      error: err.message,
      status: 400
    });
  }

  // Not found hiba
  if (err.message.includes('not found')) {
    return res.status(404).json({
      error: err.message,
      status: 404
    });
  }

  // Alapértelmezett szerver hiba
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    status: 500
  });
}

/**
 * Async handler wrapper - automata error catching
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
