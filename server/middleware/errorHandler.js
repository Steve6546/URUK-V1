// Centralized error handler to avoid leaking stack traces in production
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  return res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
