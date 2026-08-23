// middleware/validation.middleware.js
// Purpose: catches bad input data (e.g. missing email, invalid date) BEFORE
// it reaches your controllers. Works together with express-validator rules
// that other modules define, e.g. auth.validator.js, student.validator.js.

const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors.array());
  }

  next();
}

module.exports = validationMiddleware;

/*
  Example usage - this is how another teammate's auth.validator.js
  would pair with your middleware:

  const { body } = require('express-validator');
  const validationMiddleware = require('../../middleware/validation.middleware');

  const registerValidationRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
  ];

  router.post('/register', registerValidationRules, validationMiddleware, authController.register);
*/
