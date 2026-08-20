/**
 * auth.service.js
 * Business logic layer for authentication.
 *
 * Token strategy:
 *   - Access token  : short-lived (15 min) — sent in every API request
 *   - Refresh token : long-lived  (7 days)  — stored in DB, rotated on every use
 *
 * Password reset strategy:
 *   - Generate a cryptographically random token (raw)
 *   - Store its SHA-256 hash in DB with a 10-minute expiry
 *   - Return the raw token to the caller (in production, email it; never log it)
 */

const crypto  = require('crypto');
const jwt     = require('jsonwebtoken');
const env     = require('../../config/environment');
const authRepository = require('./auth.repository');

// ─── Token Configuration ──────────────────────────────────────────────────────
const ACCESS_TOKEN_EXPIRY  = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const RESET_TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// ─── Private Helpers ─────────────────────────────────────────────────────────

/**
 * Create a signed JWT with the given payload.
 * @param {Object} payload
 * @param {string} expiresIn
 * @returns {string}
 */
const _signJwt = (payload, expiresIn) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

/**
 * Build a standard { accessToken, refreshToken } pair from a user document.
 * @param {import('./auth.model')} user
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const _generateTokenPair = (user) => {
  const payload = {
    userId : user._id.toString(),
    role   : user.role,
    email  : user.email,
    name   : user.name,
  };
  return {
    accessToken  : _signJwt(payload, ACCESS_TOKEN_EXPIRY),
    refreshToken : _signJwt(payload, REFRESH_TOKEN_EXPIRY),
  };
};

/**
 * Build a tagged application error with an HTTP status code.
 * @param {string} message
 * @param {number} statusCode
 * @returns {Error}
 */
const _appError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── Service Class ────────────────────────────────────────────────────────────

class AuthService {
  /**
   * Register a new user account.
   * Throws 409 if the email is already in use.
   *
   * @param {{ name, email, password, role, phone? }} data
   * @returns {Promise<{ user, accessToken, refreshToken }>}
   */
  async register(data) {
    const { name, email, password, role, phone } = data;

    const emailTaken = await authRepository.existsByEmail(email);
    if (emailTaken) {
      throw _appError('An account with this email address already exists', 409);
    }

    // Password is hashed inside the model's pre-save hook
    const user = await authRepository.createUser({ name, email, password, role, phone });

    const { accessToken, refreshToken } = _generateTokenPair(user);

    // Persist the refresh token so we can validate it on future refresh requests
    await authRepository.updateRefreshToken(user._id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  /**
   * Authenticate a user and issue a new token pair.
   * Always throws the same 401 error for both "user not found" and "wrong password"
   * to prevent user-enumeration attacks.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ user, accessToken, refreshToken }>}
   */
  async login(email, password) {
    // Request password explicitly (select: false on model)
    const user = await authRepository.findByEmail(email, true);

    if (!user) {
      throw _appError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw _appError('Your account has been deactivated. Please contact the administrator.', 403);
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      throw _appError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = _generateTokenPair(user);

    // Overwrite previous refresh token (single-session model)
    await authRepository.updateRefreshToken(user._id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  /**
   * Issue a new token pair using a valid refresh token.
   * Implements token rotation: the old refresh token is invalidated on every call.
   *
   * @param {string} refreshToken – raw refresh token from the client
   * @returns {Promise<{ user, accessToken, refreshToken }>}
   */
  async refreshAccessToken(refreshToken) {
    // Step 1: Cryptographic verification (catches expired / tampered tokens)
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_SECRET);
    } catch (_err) {
      throw _appError('Refresh token is invalid or has expired. Please log in again.', 401);
    }

    // Step 2: DB validation — ensure token hasn't already been rotated / logged out
    const user = await authRepository.findByRefreshToken(refreshToken);
    if (!user) {
      // Possible token reuse attack — caller should log out everywhere
      throw _appError('Refresh token is no longer valid. Please log in again.', 401);
    }

    // Step 3: Rotate — generate a new pair and persist
    const tokens = _generateTokenPair(user);
    await authRepository.updateRefreshToken(user._id, tokens.refreshToken);

    return { user, ...tokens };
  }

  /**
   * Initiate a password-reset flow.
   * Always returns a success-like message regardless of whether the email exists
   * to prevent user enumeration.
   *
   * @param {string} email
   * @returns {Promise<{ message, resetToken?, expiresIn? }>}
   *   resetToken is returned here for development convenience.
   *   In production, remove it and send it via email instead.
   */
  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      // Do NOT reveal that the email doesn't exist
      return {
        message: 'If that email address is registered, a reset link has been sent.',
      };
    }

    // Generate a random 64-character hex token
    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await authRepository.updateById(user._id, {
      passwordResetToken   : hashedToken,
      passwordResetExpires : new Date(Date.now() + RESET_TOKEN_EXPIRY_MS),
    });

    // ⚠️  In production: send `rawToken` via email and remove it from the response.
    return {
      message    : 'Password reset token generated successfully.',
      resetToken : rawToken,       // TODO: Replace with email delivery in production
      expiresIn  : '10 minutes',
    };
  }

  /**
   * Complete a password reset using the raw reset token.
   * Invalidates all active sessions (clears refreshToken) after reset.
   *
   * @param {string} rawToken   – token received from forgotPassword
   * @param {string} newPassword
   * @returns {Promise<{ message }>}
   */
  async resetPassword(rawToken, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await authRepository.findByResetToken(hashedToken);

    if (!user) {
      throw _appError('Password reset token is invalid or has expired.', 400);
    }

    // Assign new password — the pre-save hook will hash it
    user.password            = newPassword;
    user.passwordResetToken  = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken        = undefined; // Force re-login on all devices

    await user.save();

    return { message: 'Your password has been reset successfully. Please log in again.' };
  }

  /**
   * Verify an access token and return the associated user.
   * Used by the GET /verify-token endpoint (typically called by other services).
   *
   * @param {string} token – raw Bearer token (without "Bearer " prefix)
   * @returns {Promise<{ valid: true, user, decoded }>}
   */
  async verifyToken(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Access token has expired'
        : 'Access token is invalid';
      throw _appError(message, 401);
    }

    const userId = decoded.userId || decoded.id || decoded._id;
    const user = await authRepository.findById(userId);

    if (!user) {
      throw _appError('The user associated with this token no longer exists.', 401);
    }
    if (!user.isActive) {
      throw _appError('This account has been deactivated.', 403);
    }

    return { valid: true, user, decoded };
  }

  /**
   * Log out a user by clearing their stored refresh token.
   *
   * @param {string|ObjectId} userId
   * @returns {Promise<{ message }>}
   */
  async logout(userId) {
    await authRepository.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully.' };
  }
}

module.exports = new AuthService();
