// middleware/error.middleware.js
// Purpose: the LAST middleware registered in app.js. If any controller
// throws an error (or calls next(err)), it lands here instead of crashing
// the whole server or leaking a raw stack trace to the frontend.

const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

// Note the 4 parameters (err, req, res, next) - Express uses this exact
// signature to recognize this as an error-handling middleware.
function errorMiddleware(err, req, res, next) {
  console.error(err.stack); // full details in your terminal, for debugging

  const statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  // frontend only ever sees the clean message, never the raw stack trace
  return errorResponse(res, statusCode, message);
}

module.exports = errorMiddleware;

/*
  Example usage in app.js (MUST be registered LAST, after all routes):

  const errorMiddleware = require('./middleware/error.middleware');
  app.use(errorMiddleware);
*/
