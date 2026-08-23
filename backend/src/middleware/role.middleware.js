// middleware/role.middleware.js
// Purpose: run AFTER auth.middleware.js. Checks whether the logged-in user's
// role is allowed to access this route. e.g. only TEACHER can mark attendance,
// only ADMIN can manage teachers.

const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Usage: roleMiddleware('TEACHER') or roleMiddleware('TEACHER', 'ADMIN')
 * Returns a middleware function that checks req.user.role against the
 * roles you pass in.
 */
function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    // This should never happen if auth.middleware.js ran first, but check anyway
    if (!req.user || !req.user.role) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        HTTP_STATUS.FORBIDDEN,
        'You do not have permission to perform this action'
      );
    }

    next();
  };
}

module.exports = roleMiddleware;

/*
  Example usage in a routes file (note: auth.middleware runs FIRST):

  const authMiddleware = require('../../middleware/auth.middleware');
  const roleMiddleware = require('../../middleware/role.middleware');
  const { ROLES } = require('../../utils/constants');

  router.post(
    '/attendance',
    authMiddleware,
    roleMiddleware(ROLES.TEACHER),
    attendanceController.markAttendance
  );
*/
