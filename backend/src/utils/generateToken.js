// utils/generateToken.js
// Purpose: create a JWT (JSON Web Token) when a user logs in successfully,
// and verify that token on every future request to prove "this is really them".

const jwt = require('jsonwebtoken');
require('dotenv').config(); // loads JWT_SECRET from your .env file

/**
 * Create a signed token for a logged-in user.
 * @param {object} payload - data to embed in the token, e.g. { id, role, email }
 *   Keep this small - don't put the password or huge objects in here.
 * @returns {string} - the JWT string to send back to the frontend
 */
function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'; // token auto-expires after this

  if (!secret) {
    throw new Error('JWT_SECRET is missing from your .env file');
  }

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify a token sent by the client and decode its payload.
 * Throws an error automatically if the token is invalid or expired -
 * auth.middleware.js will catch that error.
 * @param {string} token
 * @returns {object} - the original payload, e.g. { id, role, email }
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };
