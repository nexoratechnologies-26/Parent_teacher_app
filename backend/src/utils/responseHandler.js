// utils/responseHandler.js
// Purpose: every API response in the whole app should look the same shape,
// so the frontend team always knows what to expect. Instead of everyone
// writing res.json({...}) differently, everyone calls these two functions.

/**
 * Send a success response
 * @param {object} res - express response object
 * @param {number} statusCode - e.g. 200 (OK), 201 (Created)
 * @param {string} message - human readable message
 * @param {*} data - the actual payload (object, array, or null)
 */
function successResponse(res, statusCode = 200, message = 'Success', data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send an error response
 * @param {object} res - express response object
 * @param {number} statusCode - e.g. 400 (Bad Request), 401 (Unauthorized), 404, 500
 * @param {string} message - human readable error message
 * @param {*} errors - optional extra detail (e.g. validation error array)
 */
function errorResponse(res, statusCode = 500, message = 'Something went wrong', errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { successResponse, errorResponse };

/*
  Example usage in a controller:

  const { successResponse, errorResponse } = require('../../utils/responseHandler');

  async function login(req, res) {
    try {
      // ...login logic...
      return successResponse(res, 200, 'Login successful', { token, user });
    } catch (err) {
      return errorResponse(res, 500, 'Login failed', err.message);
    }
  }
*/
