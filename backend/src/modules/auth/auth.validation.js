/**
 * auth.validation.js
 * Pure Express middleware for request body validation.
 * No external libraries — keeps the dependency surface small.
 *
 * Each exported function validates a specific route's payload
 * and either calls next() or sends a 422 VALIDATION_ERROR response.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()\u0020]{7,20}$/;
const VALID_ROLES = ['PARENT', 'TEACHER', 'ADMIN'];

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Send a standardised 422 validation error response.
 * @param {import('express').Response} res
 * @param {string} message – human-readable description
 * @param {string} [field]  – name of the offending field
 */
const validationError = (res, message, field = undefined) => {
  return res.status(422).json({
    success: false,
    message,
    error: 'VALIDATION_ERROR',
    ...(field && { field }),
  });
};

// ─── Validators ───────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 * Required: name, email, password, role
 * Optional: phone
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return validationError(res, 'Name must be at least 2 characters long', 'name');
  }
  if (name.trim().length > 100) {
    return validationError(res, 'Name cannot exceed 100 characters', 'name');
  }
  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    return validationError(res, 'A valid email address is required', 'email');
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return validationError(res, 'Password must be at least 8 characters long', 'password');
  }
  if (password.length > 128) {
    return validationError(res, 'Password cannot exceed 128 characters', 'password');
  }
  if (!role || !VALID_ROLES.includes(role)) {
    return validationError(
      res,
      `Role must be one of: ${VALID_ROLES.join(', ')}`,
      'role'
    );
  }
  if (phone !== undefined && phone !== null && phone !== '') {
    if (!PHONE_REGEX.test(String(phone).trim())) {
      return validationError(res, 'Phone number format is invalid', 'phone');
    }
  }

  // Sanitise in-place so downstream handlers receive clean values
  req.body.name  = name.trim();
  req.body.email = String(email).trim().toLowerCase();
  if (phone) req.body.phone = String(phone).trim();

  return next();
};

/**
 * POST /api/v1/auth/login
 * Required: email, password
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    return validationError(res, 'A valid email address is required', 'email');
  }
  if (!password || String(password).trim().length === 0) {
    return validationError(res, 'Password is required', 'password');
  }

  req.body.email = String(email).trim().toLowerCase();

  return next();
};

/**
 * POST /api/v1/auth/forgot-password
 * Required: email
 */
const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    return validationError(res, 'A valid email address is required', 'email');
  }

  req.body.email = String(email).trim().toLowerCase();

  return next();
};

/**
 * POST /api/v1/auth/reset-password
 * Required: token, password
 */
const validateResetPassword = (req, res, next) => {
  const { token, password } = req.body;

  if (!token || String(token).trim().length === 0) {
    return validationError(res, 'Reset token is required', 'token');
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return validationError(res, 'New password must be at least 8 characters long', 'password');
  }
  if (password.length > 128) {
    return validationError(res, 'Password cannot exceed 128 characters', 'password');
  }

  req.body.token = String(token).trim();

  return next();
};

/**
 * POST /api/v1/auth/refresh-token
 * Required: refreshToken in body
 */
const validateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken || String(refreshToken).trim().length === 0) {
    return validationError(res, 'Refresh token is required', 'refreshToken');
  }

  req.body.refreshToken = String(refreshToken).trim();

  return next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateRefreshToken,
};
