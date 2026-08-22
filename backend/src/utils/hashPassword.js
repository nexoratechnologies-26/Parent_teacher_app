// utils/hashPassword.js
// Purpose: turn a plain-text password into a scrambled hash before saving it
// to the database, and later check a login attempt against that hash.
// We NEVER store the actual password anywhere - only the hash.

const bcrypt = require('bcryptjs');

/**
 * Hash a plain password (call this when a user registers)
 * @param {string} plainPassword - the password the user typed
 * @returns {Promise<string>} - the hashed password to save in the DB
 */
async function hashPassword(plainPassword) {
  const saltRounds = 10; // higher = more secure but slower. 10 is a good default.
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

/**
 * Compare a login attempt against the stored hash (call this when a user logs in)
 * @param {string} plainPassword - password typed during login
 * @param {string} hashedPassword - the hash stored in the users table
 * @returns {Promise<boolean>} - true if they match
 */
async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

module.exports = { hashPassword, comparePassword };
