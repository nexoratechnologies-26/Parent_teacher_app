/**
 * auth.routes.js
 * Defines all authentication endpoints.
 *
 * Base path (mounted in app.js): /api/v1/auth
 *
 * Public routes (no token required):
 *   POST /register
 *   POST /login
 *   POST /refresh-token
 *   POST /forgot-password
 *   POST /reset-password
 *
 * Protected routes (Bearer token required):
 *   GET  /verify-token
 *   POST /logout
 */

const express    = require('express');
const router     = express.Router();
const authController = require('./auth.controller');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateRefreshToken,
} = require('./auth.validation');
const { authenticateJWT } = require('../../config/jwt');

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/auth/register
 * @desc    Create a new user account (PARENT | TEACHER | ADMIN)
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate credentials and receive token pair
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Exchange a valid refresh token for a new access + refresh token pair
 * @access  Public (token in body)
 */
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request a password-reset token (emailed in production)
 * @access  Public
 */
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Set a new password using the reset token
 * @access  Public (token in body)
 */
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// ─── Protected ────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/auth/verify-token
 * @desc    Validate an access token and return user info
 * @access  Private — requires valid Bearer token
 */
router.get('/verify-token', authenticateJWT, authController.verifyToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Invalidate the current session's refresh token
 * @access  Private — requires valid Bearer token
 */
router.post('/logout', authenticateJWT, authController.logout);

module.exports = router;
