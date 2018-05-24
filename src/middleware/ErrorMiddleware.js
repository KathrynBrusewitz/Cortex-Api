// Log error message in the server console
// If err has no specified error code, set to Internal Server Error (500)

module.exports = function(err, req, res, next) {
  if (err.stack) {
    console.log(err.stack);
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
