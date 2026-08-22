// middleware/logger.middleware.js
// Purpose: logs every request that hits your server, with a timestamp.
// Useful for debugging - you can see exactly what the frontend called and when.
// This one applies to ALL routes (registered globally in app.js), not per-route.

function loggerMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = loggerMiddleware;

/*
  Example usage in app.js (applies to every single request):

  const loggerMiddleware = require('./middleware/logger.middleware');
  app.use(loggerMiddleware);
*/
