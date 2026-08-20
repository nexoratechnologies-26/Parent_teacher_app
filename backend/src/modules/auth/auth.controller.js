/**
 * auth.controller.js
 * HTTP adapter layer — translates Express req/res into service calls.
 *
 * Rules:
 *  - No business logic here; everything delegates to authService.
 *  - Service errors carry a `statusCode` property; fall back to 500 if absent.
 *  - Every response follows the project-wide { success, message, data } shape.
 */

const authService = require('./auth.service');

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Map a service error (or any Error) to an HTTP status + error code string.
 * @param {Error} error
 * @returns {{ status: number, code: string }}
 */
const resolveError = (error) => {
  const status = error.statusCode || 500;
  const codeMap = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    500: 'SERVER_ERROR',
  };
  return { status, code: codeMap[status] || 'SERVER_ERROR' };
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 * Body: { name, email, password, role, phone? }
 */
const register = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    return res.status(201).json({
      success : true,
      message : 'Account created successfully.',
      data    : { user, accessToken, refreshToken },
    });
  } catch (error) {
    const { status, code } = resolveError(error);
    return res.status(status).json({
      success : false,
      message : error.message,
      error   : code,
    });
  }
};

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);
    return res.status(200).json({
      success : true,
      message : 'Login successful.',
      data    : { user, accessToken, refreshToken },
    });
  } catch (error) {
    const { status, code } = resolveError(error);
    return res.status(status).json({
      success : false,
      message : error.message,
      error   : code,
    });
  }
};

/**
 * POST /api/v1/auth/refresh-token
 * Body: { refreshToken }
 *
 * Issues a new access + refresh token pair (rotation).
 * The old refresh token is immediately invalidated.
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    const { user, accessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(token);
    return res.status(200).json({
      success : true,
      message : 'Token refreshed successfully.',
      data    : { user, accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    const { status, code } = resolveError(error);
    return res.status(status).json({
      success : false,
      message : error.message,
      error   : code,
    });
  }
};

/**
 * POST /api/v1/auth/forgot-password
 * Body: { email }
 *
 * Generates a password-reset token.
 * ⚠️  Production: send the token via email; remove it from the response.
 */
const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return res.status(200).json({
      success : true,
      message : result.message,
      data    : {
        ...(result.resetToken && { resetToken: result.resetToken }),
        ...(result.expiresIn  && { expiresIn : result.expiresIn  }),
      },
    });
  } catch (error) {
    const { status, code } = resolveError(error);
    return res.status(status).json({
      success : false,
      message : error.message,
      error   : code,
    });
  }
};

/**
 * POST /api/v1/auth/reset-password
 * Body: { token, password }
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    return res.status(200).json({
      success : true,
      message : result.message,
      data    : null,
    });
  } catch (error) {
    const { status, code } = resolveError(error);
    return res.status(status).json({
      success : false,
      message : error.message,
      error   : code,
    });
  }
};

/**
 * GET /api/v1/auth/verify-token
 * Header: Authorization: Bearer <accessToken>
 *
 * The authenticateJWT middleware already validates the token and populates
 * req.user. Here we also fetch the full user record from the DB.
 */
const verifyToken = async (req, res) => {
  try {
    // Extract raw token from the Authorization header
    const rawToken = req.headers.authorization.split(' ')[1];
    const { valid, user, decoded } = await authService.verifyToken(rawToken);
    return res.status(200).json({
      success : true,
      message : 'Token is valid.',
      data    : { valid, user, tokenMeta: { role: decoded.role, expiresAt: decoded.exp } },
    });
  } catch (error) {
    const { status, code } = resolveError(error);
    return res.status(status).json({
      success : false,
      message : error.message,
      error   : code,
    });
  }
};

/**
 * POST /api/v1/auth/logout
 * Header: Authorization: Bearer <accessToken>
 *
 * Clears the stored refresh token, invalidating the session.
 */
const logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user.userId);
    return res.status(200).json({
      success : true,
      message : result.message,
      data    : null,
    });
  } catch (error) {
    const { status, code } = resolveError(error);
    return res.status(status).json({
      success : false,
      message : error.message,
      error   : code,
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyToken,
  logout,
};
