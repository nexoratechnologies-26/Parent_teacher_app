const User = require('./auth.model');

/**
 * AuthRepository
 * All direct MongoDB interactions for the auth module live here.
 * The service layer never touches mongoose/User directly.
 */
class AuthRepository {
  /**
   * Persist a new user document.
   * @param {Object} data – plain object with user fields
   * @returns {Promise<User>}
   */
  async createUser(data) {
    const user = new User(data);
    return user.save();
  }

  /**
   * Find a user by email address.
   * @param {string}  email
   * @param {boolean} includePrivate – also select password & refreshToken
   * @returns {Promise<User|null>}
   */
  async findByEmail(email, includePrivate = false) {
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (includePrivate) {
      query.select('+password +refreshToken');
    }
    return query.exec();
  }

  /**
   * Find a user by their MongoDB _id.
   * @param {string|ObjectId} id
   * @param {boolean}         includePrivate
   * @returns {Promise<User|null>}
   */
  async findById(id, includePrivate = false) {
    const query = User.findById(id);
    if (includePrivate) {
      query.select('+refreshToken +passwordResetToken +passwordResetExpires');
    }
    return query.exec();
  }

  /**
   * Find a user whose hashed password-reset token matches and has not expired.
   * @param {string} hashedToken – SHA-256 hash of the raw reset token
   * @returns {Promise<User|null>}
   */
  async findByResetToken(hashedToken) {
    return User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })
      .select('+password +passwordResetToken +passwordResetExpires +refreshToken')
      .exec();
  }

  /**
   * Find a user by their stored refresh token (used for token rotation).
   * @param {string} token – raw refresh token value
   * @returns {Promise<User|null>}
   */
  async findByRefreshToken(token) {
    return User.findOne({ refreshToken: token })
      .select('+refreshToken')
      .exec();
  }

  /**
   * Generic field update for a user by _id.
   * Runs mongoose validators; returns the updated document.
   * @param {string|ObjectId} id
   * @param {Object}          data
   * @returns {Promise<User|null>}
   */
  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Overwrite the stored refresh token (pass null to clear on logout).
   * @param {string|ObjectId} id
   * @param {string|null}     token
   * @returns {Promise<User|null>}
   */
  async updateRefreshToken(id, token) {
    return User.findByIdAndUpdate(
      id,
      { refreshToken: token },
      { new: true }
    ).exec();
  }

  /**
   * Check whether an email is already registered without fetching the full doc.
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email) {
    const result = await User.exists({ email: email.toLowerCase().trim() });
    return !!result;
  }
}

module.exports = new AuthRepository();
