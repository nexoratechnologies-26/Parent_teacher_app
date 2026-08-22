// middleware/auth.middleware.js
// Purpose: run BEFORE any protected route. Checks that the request has a
// valid login token. If yes, it attaches the user's info to req.user so
// every controller after this can know "who is making this request".
//
// How the frontend sends the token: in the request header, like:
//   Authorization: Bearer <token>

const { verifyToken } = require('../utils/generateToken');
const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // No header, or wrong format -> reject immediately
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'No token provided');
  }

  // "Bearer eyJhbGciOi..." -> we only want the part after "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token); // throws if invalid/expired
    req.user = decoded; // e.g. { id: '...', role: 'TEACHER', email: '...' }
    next(); // move on to the next middleware/controller
  } catch (err) {
    return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token');
  }
}

module.exports = authMiddleware;

/*
  Example usage in a routes file:

  const authMiddleware = require('../../middleware/auth.middleware');
  router.get('/profile', authMiddleware, studentController.getProfile);
*/
